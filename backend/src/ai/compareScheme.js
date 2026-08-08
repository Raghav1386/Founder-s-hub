/**
 * compareScheme.js (src/ai/compareScheme.js)
 * 
 * Purpose:
 * Evaluates startup founder profiles against individual government schemes using ChatGroq
 * with LCEL and Zod structured output. Compares schemes concurrently (3-5 at a time)
 * and ranks them by eligibility score.
 */

import { ChatGroq } from '@langchain/groq';
import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// Zod Schema for Scheme Eligibility Comparison Output
export const schemeComparisonZodSchema = z.object({
  eligibilityScore: z
    .number()
    .min(0)
    .max(100)
    .describe('Eligibility score from 0 to 100 assessing founder match with scheme prerequisites.'),
  eligibilityStatus: z
    .string()
    .describe('Status category: "Highly Eligible", "Potentially Eligible", "Conditional", or "Ineligible".'),
  reasoning: z
    .string()
    .describe('2-3 sentence clear explanation of why the founder qualifies or fails the scheme criteria.'),
  benefitsRelevant: z
    .array(z.string())
    .describe('List of specific financial, tax, grant, or mentoring benefits relevant to this founder.'),
  missingRequirements: z
    .array(z.string())
    .describe('List of missing prerequisites, documents, or criteria the founder must satisfy.'),
  nextSteps: z
    .array(z.string())
    .describe('2-4 concrete, actionable steps for the founder to apply for this scheme.')
});

const COMPARISON_SYSTEM_PROMPT = `You are a Government Scheme Eligibility Assessor & Startup Policy Expert.
Your task is to objectively evaluate if a startup founder qualifies for a specific government scheme, subsidy, grant, or benefit.

FOUNDER PROFILE JSON:
{founderProfileJson}

FOUNDER ONBOARDING DETAILS:
- Location (State/UT): {state}
- Incorporation Structure: {incorporated}
- DPIIT Recognition: {dpiit}
- Startup Stage: {stage}
- Team Size: {teamSize}
- Funding Needed: {fundingRequired}

GOVERNMENT SCHEME DETAILS:
- Scheme Title: {schemeTitle}
- Portal Source: {schemeSource}
- Scheme Structured Metadata: {schemeStructuredJson}
- Additional Scheme Context / Policy Excerpts:
{schemeContext}

INSTRUCTIONS:
1. Determine if this document represents an actual actionable Government Scheme, Grant, Seed Fund, Subsidy, Tax Exemption, or Procurement Benefit for startups.
2. Compare the founder's stage, location, incorporation, DPIIT status, sector, and support needs against the scheme eligibility rules.
3. If this document is a generic portal notice or non-scheme utility page, set eligibilityScore to 30 or lower.
4. If this is a valid government scheme that matches the founder's profile, calculate an accurate eligibilityScore between 60 and 100 based on prerequisite alignment.
5. Provide actionable next steps, relevant benefits, and specific missing requirements.
`;

const promptTemplate = PromptTemplate.fromTemplate(COMPARISON_SYSTEM_PROMPT);

/**
 * Creates LCEL chain for single scheme comparison using ChatGroq.
 */
function createComparisonChain() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GROQ_API_KEY environment variable.');
  }

  const groqModel = new ChatGroq({
    apiKey: apiKey,
    model: 'llama-3.1-8b-instant',
    modelName: 'llama-3.1-8b-instant',
    temperature: 0.1
  });

  const structuredLlm = groqModel.withStructuredOutput(schemeComparisonZodSchema, {
    name: 'scheme_eligibility_comparison'
  });

  return promptTemplate.pipe(structuredLlm);
}

/**
 * Compares ONE founder profile against ONE government scheme.
 * 
 * @param {Object} founderProfile - Structured founder profile + onboarding data.
 * @param {Object} scheme - Scheme document record (title, url, source, markdown, structured).
 * @returns {Promise<Object>} Formatted comparison result.
 */
export async function compareSingleScheme(founderProfile, scheme) {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const chain = createComparisonChain();

      const onboarding = founderProfile.onboarding || {};
      const profileObj = founderProfile.founderProfile || founderProfile;

      // Prepare scheme context (use structured JSON first, append markdown excerpt if helpful)
      const schemeStructuredJson = scheme.structured
        ? JSON.stringify(scheme.structured, null, 2)
        : 'Not structured';

      // Limit markdown length to avoid bloating prompt tokens
      const markdownContext = scheme.markdown
        ? scheme.markdown.slice(0, 1000)
        : 'No additional markdown text provided.';

      const inputPayload = {
        founderProfileJson: JSON.stringify(profileObj, null, 2),
        state: onboarding.state || 'Unspecified',
        incorporated: onboarding.incorporated || 'Not yet',
        dpiit: onboarding.dpiit || "Don't Know",
        stage: onboarding.stage || 'Idea',
        teamSize: onboarding.teamSize || '1',
        fundingRequired: onboarding.fundingRequired || 'None',
        schemeTitle: scheme.title || 'Untitled Scheme',
        schemeSource: scheme.source || 'Government Portal',
        schemeStructuredJson,
        schemeContext: markdownContext
      };

      console.log(`[INFO] [compareScheme] Comparing founder profile against scheme: "${scheme.title}"...`);

      const result = await chain.invoke(inputPayload);

      return {
        documentId: scheme.documentId,
        title: scheme.title,
        url: scheme.url,
        source: scheme.source,
        eligibilityScore: typeof result.eligibilityScore === 'number' ? result.eligibilityScore : 50,
        eligibilityStatus: result.eligibilityStatus || 'Potentially Eligible',
        reasoning: result.reasoning || 'Profile partially matches scheme guidelines.',
        benefitsRelevant: Array.isArray(result.benefitsRelevant) ? result.benefitsRelevant : [],
        missingRequirements: Array.isArray(result.missingRequirements) ? result.missingRequirements : [],
        nextSteps: Array.isArray(result.nextSteps) ? result.nextSteps : []
      };
    } catch (error) {
      const isRateLimit = error.message && (error.message.includes('429') || error.message.includes('rate limit'));
      
      if (isRateLimit && attempt < maxRetries) {
        // Dynamically parse exact wait duration requested by Groq (e.g. "Please try again in 14.5s")
        let waitMs = 5000;
        const match = error.message.match(/try again in ([\d\.]+)s/i);
        if (match && match[1]) {
          waitMs = Math.ceil(parseFloat(match[1]) * 1000) + 1200;
        }

        console.warn(`[WARN] [compareScheme] Groq rate limit hit for "${scheme.title}". Waiting ${Math.round(waitMs / 1000)}s before attempt ${attempt + 1}/${maxRetries}...`);
        await new Promise((resolve) => setTimeout(resolve, waitMs));
        continue;
      }

      console.error(`[ERROR] [compareScheme] Failed to compare scheme "${scheme.title}":`, error.message);

      // Fallback response for failed individual scheme comparison
      return {
        documentId: scheme.documentId,
        title: scheme.title,
        url: scheme.url,
        source: scheme.source,
        eligibilityScore: 35,
        eligibilityStatus: 'Conditional',
        reasoning: 'Automated AI evaluation encountered a temporary analysis error. Please review scheme details manually.',
        benefitsRelevant: ['Potential government startup support'],
        missingRequirements: ['Manual eligibility check required'],
        nextSteps: ['Visit official scheme portal link for complete guidelines']
      };
    }
  }
}

/**
 * Compares founder profile against multiple schemes concurrently (concurrency limit 3-5).
 * Sorts all matched schemes by eligibilityScore (highest first).
 * 
 * @param {Object} founderProfile - Structured founder profile object.
 * @param {Array<Object>} schemes - Array of retrieved scheme documents.
 * @param {number} concurrencyLimit - Number of simultaneous LLM calls (default: 3).
 * @returns {Promise<Array<Object>>} Sorted list of matched schemes.
 */
export async function compareAllSchemes(founderProfile, schemes, concurrencyLimit = 3) {
  if (!schemes || schemes.length === 0) {
    console.warn('[WARN] [compareScheme] No schemes provided for eligibility comparison.');
    return [];
  }

  console.log(`[INFO] [compareScheme] Starting AI eligibility evaluation for ${schemes.length} schemes (Concurrency limit: ${concurrencyLimit})...`);

  const results = [];

  // Execute in batches of `concurrencyLimit` to avoid Groq rate limits while keeping speed high
  for (let i = 0; i < schemes.length; i += concurrencyLimit) {
    const batch = schemes.slice(i, i + concurrencyLimit);
    console.log(`[INFO] [compareScheme] Evaluating batch ${Math.floor(i / concurrencyLimit) + 1}/${Math.ceil(schemes.length / concurrencyLimit)} (${batch.length} schemes)...`);
    
    const batchPromises = batch.map((scheme) => compareSingleScheme(founderProfile, scheme));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // 400ms pause between batches to prevent triggering Groq TPM rate limits
    if (i + concurrencyLimit < schemes.length) {
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
  }

  // Sort by eligibilityScore descending (highest score first)
  results.sort((a, b) => (b.eligibilityScore || 0) - (a.eligibilityScore || 0));

  console.log(`[SUCCESS] [compareScheme] Completed evaluation of ${results.length} schemes.`);
  return results;
}

export default {
  compareSingleScheme,
  compareAllSchemes
};
