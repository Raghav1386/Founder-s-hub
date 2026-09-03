/**
 * founderRoutes.js
 * 
 * Purpose:
 * Express router mapping /api/founder endpoints to founderController methods.
 */

import express from 'express';
import { analyzeFounder, getSchemeById } from '../controllers/founderController.js';
import { answerSchemeQa } from '../controllers/schemeQaController.js';
import { verifyFirebaseToken } from '../middlewares/firebaseAuthMiddleware.js';

const router = express.Router();

/**
 * POST /api/founder/analyze
 * Accepts onboarding JSON, runs Groq LLM analysis, saves to MongoDB, returns FounderProfile.
 * Requires authenticated founder account.
 */
router.post('/analyze', verifyFirebaseToken, analyzeFounder);

/**
 * GET /api/founder/scheme/:id
 * Fetches full details for a specific scheme document by ID
 */
router.get('/scheme/:id', getSchemeById);

/**
 * POST /api/founder/scheme/:id/qa
 * Grounded AI Q&A Assistant endpoint for specific scheme or cloud credit document
 */
router.post('/scheme/:id/qa', answerSchemeQa);

export default router;
