import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Idea from '../models/Idea.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-bypass-secret';


// Helper to migrate unowned ideas to the logged-in user
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

// Generate JWT token
function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

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
        error: 'Google Client ID is not configured on the server. Please restart the backend server so it can load the new .env settings.',
      });
    }

    // Initialize the Google OAuth client dynamically
    const googleClient = new OAuth2Client(clientId);

    // Verify token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ success: false, error: 'Invalid ID token payload.' });
    }

    const { sub: googleId, email, name, picture } = payload;

    // Find or create the user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        googleId,
        email,
        name,
        picture,
      });
    } else {
      // Update details if they changed
      user.googleId = googleId;
      user.name = name || user.name;
      user.picture = picture || user.picture;
      user.lastLoginAt = new Date();
      await user.save();
    }

    // Adopt any anonymous sandbox ideas in the database
    await migrateUnownedIdeas(user._id);

    // Issue local JWT token
    const appToken = generateToken(user._id);

    res.json({
      success: true,
      token: appToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    });
  } catch (err) {
    console.error('Google Auth verification error:', err);
    res.status(400).json({ success: false, error: `Authentication failed: ${err.message}` });
  }
}

export async function mockLogin(req, res) {
  try {
    // Get or create standard local developer user
    let mockUser = await User.findOne({ email: 'developer@founderos.local' });

    if (!mockUser) {
      mockUser = await User.create({
        email: 'developer@founderos.local',
        name: 'Developer User',
        picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
        googleId: 'mock-dev-id',
      });
    } else {
      mockUser.lastLoginAt = new Date();
      await mockUser.save();
    }

    // Adopt any anonymous sandbox ideas in the database
    await migrateUnownedIdeas(mockUser._id);

    // Issue standard local JWT token
    const appToken = generateToken(mockUser._id);

    res.json({
      success: true,
      token: appToken,
      user: {
        id: mockUser._id,
        email: mockUser.email,
        name: mockUser.name,
        picture: mockUser.picture,
      },
    });
  } catch (err) {
    console.error('Mock Auth login error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}
