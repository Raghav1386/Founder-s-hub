/**
 * founderController.js
 * 
 * Purpose:
 * Controller for handling founder onboarding analysis request.
 * Normalizes request body, triggers LangChain Groq AI analysis,
 * saves profile & searchText to MongoDB, and returns saved document.
 */

import FounderProfile from '../models/FounderProfile.js';
import { analyzeFounderProfile } from '../ai/founderProfileChain.js';

/**
 * POST /api/founder/analyze
 * Accepts onboarding form JSON, runs AI analysis, saves to MongoDB, returns result.
 */
export async function analyzeFounder(req, res) {
  try {
    const body = req.body || {};

    // Normalize field names to support both frontend & backend conventions
    const startupName = body.startupName?.trim();
    const state = (body.state || body.stateUt)?.trim();
    const incorporated = (body.incorporated || body.isIncorporated)?.trim();
    const dpiit = (body.dpiit || body.dpiitRecognition)?.trim();
    const stage = (body.stage || body.startupStage)?.trim();
    const teamSize = body.teamSize?.toString().trim();
    const supportNeeded = Array.isArray(body.supportNeeded)
      ? body.supportNeeded
      : typeof body.supportNeeded === 'string'
      ? [body.supportNeeded]
      : [];
    const fundingRequired = (body.fundingRequired || body.fundingRequirement || '')?.trim();
    const description = body.description?.trim();

    // Input Validation
    if (!startupName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: startupName is required.'
      });
    }

    if (!description) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: description is required.'
      });
    }

    // Canonical Onboarding Object
    const onboarding = {
      startupName,
      state: state || 'Unspecified',
      incorporated: incorporated || 'Not yet',
      dpiit: dpiit || "Don't Know",
      stage: stage || 'Idea',
      teamSize: teamSize || '1',
      supportNeeded,
      fundingRequired,
      description
    };

    console.log(`[INFO] Analyzing founder profile for: "${startupName}"...`);

    // Step 1: Run AI Analysis Chain via LangChain ChatGroq
    const aiOutput = await analyzeFounderProfile(onboarding);

    // Separate searchText from structured profile object
    const { searchText, ...structuredProfile } = aiOutput;

    // Fallback search text if empty
    const finalSearchText =
      searchText ||
      `${startupName} operating in ${onboarding.state}. ${onboarding.stage} stage. ${onboarding.dpiit} DPIIT status. Seeking ${supportNeeded.join(', ')}.`;

    // Step 2: Save to MongoDB (founderProfiles collection)
    const newProfileDoc = new FounderProfile({
      onboarding,
      founderProfile: structuredProfile,
      searchText: finalSearchText
    });

    const savedDoc = await newProfileDoc.save();

    console.log(`[SUCCESS] Founder profile saved to MongoDB with ID: ${savedDoc._id}`);

    // Step 3: Return Response
    return res.status(201).json({
      success: true,
      message: 'Founder profile analyzed and saved successfully.',
      data: savedDoc
    });
  } catch (error) {
    console.error('[ERROR] Founder Analysis Controller Failure:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to analyze founder profile',
      details: error.message
    });
  }
}

export default { analyzeFounder };
