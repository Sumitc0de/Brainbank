import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isDevelopment } from '../config/env.js';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function authMiddleware(req, res, next) {
  try {
    // ── 1. Read token from HTTP-only cookie (primary) or Authorization header (fallback) ──
    let token = req.cookies?.access_token;

    // Fallback to Bearer token for API clients / mobile
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required.',
        code: 'NO_TOKEN',
      });
    }

    // ── 2. Development-only mock bypass ──
    if (isDevelopment() && token === 'mock-dev-token') {
      let mockUser = await User.findOne({ email: 'developer@founderos.local' });
      if (!mockUser) {
        mockUser = await User.create({
          email: 'developer@founderos.local',
          name: 'Developer User',
          picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
          googleId: 'mock-dev-id',
          role: 'user',
        });
      }
      req.user = mockUser;
      req.userId = mockUser._id;
      return next();
    }

    // ── 3. Verify JWT ──
    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not configured.');
      return res.status(500).json({
        success: false,
        error: 'Server authentication configuration error.',
        code: 'CONFIG_ERROR',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Session expired. Please refresh.',
          code: 'TOKEN_EXPIRED',
        });
      }
      return res.status(401).json({
        success: false,
        error: 'Invalid authentication token.',
        code: 'INVALID_TOKEN',
      });
    }

    // ── 4. Load user ──
    const user = await User.findById(decoded.userId).select('-refreshTokenHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found.',
        code: 'USER_NOT_FOUND',
      });
    }

    // ── 5. Check token version ──
    if (decoded.v !== undefined && decoded.v !== user.tokenVersion) {
      return res.status(401).json({
        success: false,
        error: 'Session invalidated. Please log in again.',
        code: 'TOKEN_VERSION_MISMATCH',
      });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed.',
      code: 'AUTH_ERROR',
    });
  }
}
