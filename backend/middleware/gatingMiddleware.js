import User from '../models/User.js';
import Idea from '../models/Idea.js';

/**
 * Middleware: Check active ideas limit
 * Prevents creation of ideas that exceed active limits
 */
export async function checkActiveIdeasLimit(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ success: false, error: 'User context not found.' });
    }

    const currentActiveIdeas = await Idea.countDocuments({ user: req.userId });
    const limit = user.limits?.activeIdeasLimit || 5;

    if (currentActiveIdeas >= limit) {
      return res.status(403).json({
        success: false,
        error: `Active ideas limit reached (${currentActiveIdeas}/${limit}). Upgrade your plan to capture more start-ups!`,
        code: 'LIMIT_ACTIVE_IDEAS_EXCEEDED',
      });
    }

    next();
  } catch (err) {
    console.error('Active ideas limit check failed:', err);
    res.status(500).json({ success: false, error: 'Failed to verify active idea limits.' });
  }
}

/**
 * Middleware: Check daily AI request limit
 * Automatically resets count if it's a new day
 */
export async function checkAiLimit(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ success: false, error: 'User context not found.' });
    }

    // Daily reset check
    const now = new Date();
    const lastReset = new Date(user.aiResetDate || Date.now());
    const isNewDay = now.toDateString() !== lastReset.toDateString();

    if (isNewDay) {
      user.credits.aiRequestsUsed = 0;
      user.aiResetDate = now;
      await user.save();
    }

    const used = user.credits?.aiRequestsUsed || 0;
    const limit = user.limits?.aiRequestsLimit || 10;

    if (used >= limit) {
      return res.status(403).json({
        success: false,
        error: `Daily AI request limit reached (${used}/${limit}). Upgrade to Pro or Ultra for additional daily syntheses.`,
        code: 'LIMIT_AI_EXCEEDED',
      });
    }

    next();
  } catch (err) {
    console.error('AI quota limit check failed:', err);
    res.status(500).json({ success: false, error: 'Failed to verify daily AI limits.' });
  }
}

/**
 * Middleware: Check file upload count and storage capacity limits
 */
export async function checkUploadLimit(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ success: false, error: 'User context not found.' });
    }

    const countUsed = user.credits?.uploadCountUsed || 0;
    const countLimit = user.limits?.uploadLimit || 5;

    if (countUsed >= countLimit) {
      return res.status(403).json({
        success: false,
        error: 'Upgrade to Pro to unlock more uploads.',
        code: 'LIMIT_UPLOAD_COUNT_EXCEEDED',
      });
    }

    // Storage capacity check
    const storageUsed = user.credits?.uploadStorageUsed || 0; // in bytes
    const storageLimitBytes = (user.limits?.storageLimitMB || 5) * 1024 * 1024;

    if (storageUsed >= storageLimitBytes) {
      return res.status(403).json({
        success: false,
        error: `Cloud storage limit exceeded. Used ${(storageUsed / (1024 * 1024)).toFixed(2)}MB of ${(storageLimitBytes / (1024 * 1024)).toFixed(0)}MB. Upgrade your plan to free up space.`,
        code: 'LIMIT_STORAGE_EXCEEDED',
      });
    }

    next();
  } catch (err) {
    console.error('Upload quota limit check failed:', err);
    res.status(500).json({ success: false, error: 'Failed to verify file upload limits.' });
  }
}
