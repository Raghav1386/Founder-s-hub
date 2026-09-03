/**
 * authController.js (src/controllers/authController.js)
 * 
 * Purpose:
 * Controller handling user profile synchronization and saved founder evaluation history.
 */

import User from '../models/User.js';
import FounderProfile from '../models/FounderProfile.js';

/**
 * POST /api/auth/sync
 * Synchronizes Firebase User data & startup profile details with MongoDB User record
 */
export async function syncFirebaseUser(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not authenticated.' });
    }

    const { name, avatar, startupName } = req.body || {};

    if (name) user.name = name.trim();
    if (avatar) user.avatar = avatar.trim();
    if (startupName) user.startupName = startupName.trim();

    await user.save();

    console.log(`✅ [AUTH SYNC] Synchronized MongoDB User: ${user.email} (${user.startupName || 'No Startup'})`);

    return res.status(200).json({
      success: true,
      message: 'User synchronized successfully.',
      data: user
    });

  } catch (error) {
    console.error('❌ [AUTH ERROR] Failed to sync user:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to synchronize user data.',
      details: error.message
    });
  }
}

/**
 * GET /api/auth/me
 * Returns current authenticated user profile from MongoDB
 */
export async function getMe(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not authenticated.' });
    }

    return res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch user profile.'
    });
  }
}

/**
 * GET /api/auth/history
 * Returns all saved startup evaluations for the authenticated founder
 */
export async function getUserHistory(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not authenticated.' });
    }

    // Fetch all evaluations created by this user
    const history = await FounderProfile.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    console.log(`📋 [AUTH HISTORY] Fetched ${history.length} evaluation(s) for user: ${user.email}`);

    return res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });

  } catch (error) {
    console.error('❌ [AUTH ERROR] Failed to fetch user history:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve saved evaluation history.',
      details: error.message
    });
  }
}

export default {
  syncFirebaseUser,
  getMe,
  getUserHistory
};
