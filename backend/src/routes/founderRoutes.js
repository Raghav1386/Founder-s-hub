/**
 * founderRoutes.js
 * 
 * Purpose:
 * Express router mapping /api/founder endpoints to founderController methods.
 */

import express from 'express';
import { analyzeFounder, getSchemeById } from '../controllers/founderController.js';

const router = express.Router();

/**
 * POST /api/founder/analyze
 * Accepts onboarding JSON, runs Groq LLM analysis, saves to MongoDB, returns FounderProfile.
 */
router.post('/analyze', analyzeFounder);

/**
 * GET /api/founder/scheme/:id
 * Fetches full details for a specific scheme document by ID
 */
router.get('/scheme/:id', getSchemeById);

export default router;
