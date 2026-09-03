/**
 * authRoutes.js (src/routes/authRoutes.js)
 * 
 * Purpose:
 * Express router mapping /api/auth endpoints for user synchronization and history.
 */

import express from 'express';
import { syncFirebaseUser, getMe, getUserHistory } from '../controllers/authController.js';
import { verifyFirebaseToken } from '../middlewares/firebaseAuthMiddleware.js';

const router = express.Router();

/**
 * POST /api/auth/sync
 * Syncs user details & startup name from Firebase Token to MongoDB User record
 */
router.post('/sync', verifyFirebaseToken, syncFirebaseUser);

/**
 * GET /api/auth/me
 * Fetches current authenticated user profile
 */
router.get('/me', verifyFirebaseToken, getMe);

/**
 * GET /api/auth/history
 * Fetches saved evaluation history for current authenticated founder
 */
router.get('/history', verifyFirebaseToken, getUserHistory);

export default router;
