import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import Idea from '../models/Idea.js';
import { isDevelopment } from '../config/env.js';
import { logAuthEvent } from '../middleware/requestLogger.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '30d';

const isSecureCookie = () => process.env.NODE_ENV === 'production';
const sameSiteCookiePolicy = () => (isSecureCookie() ? 'none' : 'lax');

// ── Cookie options ──────────────────────────────────────────
function accessCookieOpts() {
  return {
    httpOnly: true,
    secure: isSecureCookie(),
    sameSite: sameSiteCookiePolicy(),
    maxAge: 15 * 60 * 1000, // 15 min
    path: '/',
  };
}

function refreshCookieOpts() {
  return {
    httpOnly: true,
    secure: isSecureCookie(),
    sameSite: sameSiteCookiePolicy(),
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/api/auth', // only sent to auth routes
  };
}

// ── Token helpers ───────────────────────────────────────────
function generateAccessToken(userId, tokenVersion) {
  return jwt.sign({ userId, v: tokenVersion }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

function generateRefreshToken(userId, tokenVersion) {
  return jwt.sign({ userId, v: tokenVersion, type: 'refresh' }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Helper to sanitize user object for client response
function formatUserPayload(user) {
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    picture: user.picture,
    role: user.role,
    plan: user.plan,
    credits: user.credits || { aiRequestsUsed: 0, uploadCountUsed: 0, uploadStorageUsed: 0 },
    limits: user.limits || { aiRequestsLimit: 10, uploadLimit: 5, storageLimitMB: 5, activeIdeasLimit: 5 },
    subscription: user.subscription || { status: 'active', startedAt: new Date(), expiresAt: null },
  };
}

// ── Set auth cookies on response ────────────────────────────
async function setAuthCookies(res, user) {
  const accessToken = generateAccessToken(user._id, user.tokenVersion);
  const refreshToken = generateRefreshToken(user._id, user.tokenVersion);

  // Persist refresh token hash server-side
  user.refreshTokenHash = hashToken(refreshToken);
  await user.save();

  res.cookie('access_token', accessToken, accessCookieOpts());
  res.cookie('refresh_token', refreshToken, refreshCookieOpts());
}

// ── Migrate unowned ideas ───────────────────────────────────
async function migrateUnownedIdeas(userId) {
  try {
    const unownedCount = await Idea.countDocuments({
      $or: [{ user: { $exists: false } }, { user: null }],
    });

    if (unownedCount > 0) {
      console.log(`Migrating ${unownedCount} sandbox ideas to user ${userId}`);
      await Idea.updateMany(
        { $or: [{ user: { $exists: false } }, { user: null }] },
        { $set: { user: userId } }
      );
    }
  } catch (err) {
    console.error('Failed to migrate unowned ideas:', err);
  }
}

// ═════════════════════════════════════════════════════════════
//  GOOGLE LOGIN
// ═════════════════════════════════════════════════════════════
export async function googleLogin(req, res) {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, error: 'Google ID token is required.' });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return res.status(500).json({
        success: false,
        error: 'Google Client ID is not configured on the server.',
      });
    }

    const googleClient = new OAuth2Client(clientId);
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ success: false, error: 'Invalid ID token payload.' });
    }

    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        googleId,
        email,
        name,
        picture,
        role: 'user',
        plan: 'free',
      });
    } else {
      user.googleId = googleId;
      user.name = name || user.name;
      user.picture = picture || user.picture;
      user.lastLoginAt = new Date();
    }

    await migrateUnownedIdeas(user._id);
    await setAuthCookies(res, user);

    logAuthEvent('LOGIN_GOOGLE', {
      email: user.email,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.json({
      success: true,
      user: formatUserPayload(user),
    });
  } catch (err) {
    console.error('Google Auth verification error:', err);
    res.status(400).json({ success: false, error: 'Authentication failed.' });
  }
}

// ═════════════════════════════════════════════════════════════
//  DEVELOPER MOCK LOGIN (development only)
// ═════════════════════════════════════════════════════════════
export async function mockLogin(req, res) {
  if (!isDevelopment()) {
    return res.status(404).json({ success: false, error: 'Not found.' });
  }

  try {
    let mockUser = await User.findOne({ email: 'developer@founderos.local' });
    if (!mockUser) {
      mockUser = await User.create({
        email: 'developer@founderos.local',
        name: 'Developer User',
        picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
        googleId: 'mock-dev-id',
        role: 'user',
        plan: 'free',
      });
    } else {
      mockUser.lastLoginAt = new Date();
    }

    await migrateUnownedIdeas(mockUser._id);
    await setAuthCookies(res, mockUser);

    logAuthEvent('LOGIN_MOCK', {
      email: mockUser.email,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.json({
      success: true,
      user: formatUserPayload(mockUser),
    });
  } catch (err) {
    console.error('Mock Auth login error:', err);
    res.status(500).json({ success: false, error: 'Developer login failed.' });
  }
}

// ═════════════════════════════════════════════════════════════
//  REFRESH TOKEN
// ═════════════════════════════════════════════════════════════
export async function refreshToken(req, res) {
  try {
    const token = req.cookies?.refresh_token;
    if (!token) {
      return res.status(401).json({ success: false, error: 'No refresh token.', code: 'NO_REFRESH_TOKEN' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_REFRESH_SECRET);
    } catch (err) {
      res.clearCookie('access_token', accessCookieOpts());
      res.clearCookie('refresh_token', refreshCookieOpts());
      const code = err.name === 'TokenExpiredError' ? 'REFRESH_TOKEN_EXPIRED' : 'INVALID_REFRESH_TOKEN';
      return res.status(401).json({ success: false, error: 'Invalid refresh token.', code });
    }

    if (decoded.type !== 'refresh') {
      return res.status(401).json({ success: false, error: 'Invalid token type.', code: 'INVALID_TOKEN_TYPE' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found.', code: 'USER_NOT_FOUND' });
    }

    if (decoded.v !== user.tokenVersion) {
      res.clearCookie('access_token', accessCookieOpts());
      res.clearCookie('refresh_token', refreshCookieOpts());
      return res.status(401).json({ success: false, error: 'Session invalidated.', code: 'TOKEN_VERSION_MISMATCH' });
    }

    if (user.refreshTokenHash !== hashToken(token)) {
      res.clearCookie('access_token', accessCookieOpts());
      res.clearCookie('refresh_token', refreshCookieOpts());
      return res.status(401).json({ success: false, error: 'Refresh token revoked.', code: 'TOKEN_REVOKED' });
    }

    await setAuthCookies(res, user);

    logAuthEvent('TOKEN_REFRESH', {
      email: user.email,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.json({
      success: true,
      user: formatUserPayload(user),
    });
  } catch (err) {
    console.error('Token refresh error:', err);
    res.status(500).json({ success: false, error: 'Token refresh failed.' });
  }
}

// ═════════════════════════════════════════════════════════════
//  LOGOUT
// ═════════════════════════════════════════════════════════════
export async function logout(req, res) {
  try {
    const token = req.cookies?.refresh_token;
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId);
        if (user) {
          user.refreshTokenHash = null;
          await user.save();

          logAuthEvent('LOGOUT', {
            email: user.email,
            ip: req.ip,
            userAgent: req.get('user-agent'),
          });
        }
      } catch {
        // Token already invalid
      }
    }

    res.clearCookie('access_token', accessCookieOpts());
    res.clearCookie('refresh_token', refreshCookieOpts());
    res.json({ success: true, message: 'Logged out.' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ success: false, error: 'Logout failed.' });
  }
}

// ═════════════════════════════════════════════════════════════
//  GET CURRENT USER (from cookie)
// ═════════════════════════════════════════════════════════════
export async function getMe(req, res) {
  try {
    const token = req.cookies?.access_token;
    if (!token) {
      return res.status(401).json({ success: false, error: 'Not authenticated.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(401).json({ success: false, error: 'Invalid session.' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found.' });
    }

    if (decoded.v !== user.tokenVersion) {
      return res.status(401).json({ success: false, error: 'Session invalidated.' });
    }

    res.json({
      success: true,
      user: formatUserPayload(user),
    });
  } catch (err) {
    console.error('GetMe error:', err);
    res.status(500).json({ success: false, error: 'Failed to get user.' });
  }
}

// ═════════════════════════════════════════════════════════════
//  DEVELOPER SWITCH PLAN (development only)
// ═════════════════════════════════════════════════════════════
export async function devSetPlan(req, res) {
  if (!isDevelopment()) {
    return res.status(404).json({ success: false, error: 'Not found.' });
  }

  try {
    const { plan } = req.body;
    if (!['free', 'pro', 'ultra'].includes(plan)) {
      return res.status(400).json({ success: false, error: 'Invalid plan name.' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    user.plan = plan;
    // pre-save hook updates limits dynamically
    await user.save();

    logAuthEvent('DEV_SET_PLAN', {
      email: user.email,
      plan: plan,
      ip: req.ip,
    });

    res.json({
      success: true,
      user: formatUserPayload(user),
    });
  } catch (err) {
    console.error('Dev set plan failed:', err);
    res.status(500).json({ success: false, error: 'Failed to set developer plan.' });
  }
}
