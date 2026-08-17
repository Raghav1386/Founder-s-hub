/**
 * founderController.js (src/controllers/founderController.js)
 * 
 * Purpose:
 * Orchestrates the full Founder Profile Analysis & Government Scheme Matching Pipeline:
 * 1. Accepts onboarding form JSON
 * 2. Runs ChatGroq AI chain to extract structured Founder Profile JSON & searchText
 * 3. Embeds searchText using Jina Embeddings API
 * 4. Queries Qdrant vector DB for top 15 scheme chunks and deduplicates MongoDB documents
 * 5. Compares schemes concurrently (concurrency: 3) using ChatGroq LLM reasoning
 * 6. Sorts schemes by eligibilityScore (highest first)
 * 7. Saves complete analysis to MongoDB founderProfiles collection
 * 8. Returns founderProfile and matchedSchemes
 */

import FounderProfile from '../models/FounderProfile.js';
import Document from '../models/Document.js';
import { analyzeFounderProfile } from '../ai/founderProfileChain.js';
import { embedFounderSearchText } from '../ai/embedFounder.js';
import { searchRelevantSchemes } from '../ai/searchSchemes.js';
import { compareAllSchemes } from '../ai/compareScheme.js';

/**
 * POST /api/founder/analyze
 * Full Retrieval & AI Eligibility Pipeline endpoint
 */
export async function analyzeFounder(req, res) {
  try {
    const body = req.body || {};

    // Normalize input field names to support all frontend/backend naming conventions
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

    console.log(`\n======================================================`);
    console.log(`🚀 [PIPELINE START] Processing Founder Analysis for: "${startupName}"`);
    console.log(`======================================================`);

    // Step 1: Run ChatGroq LLM chain to create Founder Profile JSON & searchText
    console.log(`[PIPELINE Step 1/5] Analyzing onboarding data with ChatGroq LLM...`);
    const aiChainOutput = await analyzeFounderProfile(onboarding);
    const { searchText, ...structuredProfile } = aiChainOutput;

    const finalSearchText =
      searchText ||
      `${startupName} operating in ${onboarding.state}. ${onboarding.stage} stage. ${onboarding.dpiit} DPIIT status. Seeking ${supportNeeded.join(', ')}.`;

    // Step 2: Generate Vector Embedding for searchText using Jina Embeddings API
    console.log(`[PIPELINE Step 2/5] Generating Jina embedding vector for searchText...`);
    const vectorEmbedding = await embedFounderSearchText(finalSearchText);

    // Step 3: Search Qdrant DB for top 15 chunks & retrieve deduplicated Mongo scheme documents
    console.log(`[PIPELINE Step 3/5] Querying Qdrant for top 15 scheme chunks...`);
    const retrievedSchemes = await searchRelevantSchemes(vectorEmbedding, 15);

    let matchedSchemes = [];

    // Step 4: Evaluate Eligibility for Each Scheme Sequentially (1 at a time for 100% accuracy & zero rate limits)
    if (retrievedSchemes.length > 0) {
      console.log(`[PIPELINE Step 4/5] Evaluating scheme eligibility with ChatGroq (Sequential 1-by-1)...`);
      matchedSchemes = await compareAllSchemes(
        { onboarding, founderProfile: structuredProfile },
        retrievedSchemes,
        1 // Concurrency limit 1 for 100% reliable evaluation with zero rate limits
      );
    } else {
      console.warn(`[WARN] No relevant scheme documents retrieved from vector search.`);
    }

    // Filter out explicit non-schemes or 0-score ineligible items (keep all eligible and potentially eligible matched schemes)
    const validMatchedSchemes = matchedSchemes.filter(
      (scheme) => (scheme.eligibilityScore || 0) > 0 && scheme.eligibilityStatus !== 'Ineligible'
    );

    console.log(`[PIPELINE Step 5/5] Saving founder profile & ${validMatchedSchemes.length} matched schemes to MongoDB...`);
    const newProfileDoc = new FounderProfile({
      onboarding,
      founderProfile: structuredProfile,
      searchText: finalSearchText,
      matchedSchemes: validMatchedSchemes
    });

    const savedDoc = await newProfileDoc.save();
    console.log(`✅ [PIPELINE COMPLETE] Saved profile document ID: ${savedDoc._id}\n`);

    // Step 6: Return Response Payload
    return res.status(200).json({
      success: true,
      message: 'Founder profile analyzed and schemes matched successfully.',
      data: {
        profileId: savedDoc._id,
        founderProfile: structuredProfile,
        matchedSchemes: validMatchedSchemes
      }
    });

  } catch (error) {
    console.error(`❌ [PIPELINE ERROR] Founder Analysis Controller Failure:`, error);
    return res.status(500).json({
      success: false,
      error: 'Failed to analyze founder profile and evaluate scheme eligibility.',
      details: error.message
    });
  }
}

import mongoose from 'mongoose';

/**
 * GET /api/founder/scheme/:id
 * Fetches full details for a specific scheme document by ID
 */
export async function getSchemeById(req, res) {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        error: 'Scheme document not found.'
      });
    }
    const document = await Document.findById(id).exec();
    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Scheme document not found.'
      });
    }
    return res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error(`❌ Error fetching scheme details for ID ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch scheme document details.',
      details: error.message
    });
  }
}

export default { analyzeFounder, getSchemeById };
