/**
 * schemeQaController.js (src/controllers/schemeQaController.js)
 * 
 * Purpose:
 * Grounded AI Q&A Assistant controller for individual schemes and cloud opportunities.
 * Answers founder questions using ChatGroq AI based strictly on scheme guidelines,
 * structured metadata, and the founder's specific startup profile.
 */

import { ChatGroq } from '@langchain/groq';
import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';
import mongoose from 'mongoose';
import Document from '../models/Document.js';

// Zod Schema for Structured Q&A Output
const qaResponseZodSchema = z.object({
  answer: z
    .string()
    .describe('Clear, accurate, and professional answer to the founder\'s question, strictly grounded in the official scheme documentation.'),
  suggestedFollowups: z
    .array(z.string())
    .length(3)
    .describe('Exactly 3 relevant, actionable follow-up questions tailored to this specific scheme or cloud credit program.')
});

const SCHEME_QA_PROMPT = `You are the official AI Assistant and Policy Advisor for "{schemeTitle}".
Answer the startup founder's question accurately based on the opportunity context below.

FOUNDER STARTUP CONTEXT:
- Startup Name: {startupName}
- Location (State/UT): {state}
- Stage: {stage}
- DPIIT Recognition: {dpiit}
- Sector & Tech: {sector}

SCHEME / OPPORTUNITY DETAILS:
- Title: {schemeTitle}
- Provider / Source: {schemeSource}
- Official URL: {schemeUrl}
- Structured Metadata JSON:
{schemeStructuredJson}

DOCUMENT CONTEXT SUMMARY:
{schemeContext}

RECENT CHAT HISTORY:
{chatHistory}

FOUNDER'S QUESTION:
"{question}"

INSTRUCTIONS:
1. Provide a clear, accurate answer grounded in the scheme guidelines and metadata.
2. Address how this founder's stage, location, or tech stack aligns with the scheme rules.
3. If the answer is not contained in the context, state that clearly and advise checking the official portal link ({schemeUrl}).
4. Provide exactly 3 short, relevant follow-up questions the founder can click next.
`;

const promptTemplate = PromptTemplate.fromTemplate(SCHEME_QA_PROMPT);

/**
 * POST /api/founder/scheme/:id/qa
 * Grounded Q&A endpoint for a specific scheme document
 */
export async function answerSchemeQa(req, res) {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const question = body.question?.trim();
    const chatHistoryList = Array.isArray(body.chatHistory) ? body.chatHistory : [];
    const founderProfile = body.founderProfile || {};
    const onboarding = founderProfile.onboarding || body.onboarding || {};

    if (!id || id === 'undefined' || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or missing scheme ID.'
      });
    }

    if (!question) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: question is required.'
      });
    }

    // Step 1: Fetch scheme document from MongoDB
    const schemeDoc = await Document.findById(id).lean();
    if (!schemeDoc) {
      return res.status(404).json({
        success: false,
        error: 'Scheme document not found.'
      });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'GROQ_API_KEY is not configured on the server.'
      });
    }

    // Prepare token-optimized inputs
    const schemeStructuredJson = schemeDoc.structured
      ? JSON.stringify(schemeDoc.structured, null, 2)
      : 'No structured metadata available.';

    // Sliced context to keep prompt well under 1,000 tokens
    const schemeContext = schemeDoc.markdown
      ? schemeDoc.markdown.slice(0, 1500)
      : 'No detailed document markdown text available.';

    const formattedHistory = chatHistoryList.length > 0
      ? chatHistoryList.slice(-4).map(m => `${m.role === 'user' ? 'Founder' : 'AI Assistant'}: ${m.text}`).join('\n')
      : 'No prior chat history.';

    // Initialize ChatGroq
    const groqModel = new ChatGroq({
      apiKey: apiKey,
      model: process.env.GROQ_EVAL_MODEL || 'openai/gpt-oss-20b',
      temperature: 0.2,
      maxTokens: 1500
    });

    const structuredLlm = groqModel.withStructuredOutput(qaResponseZodSchema, {
      name: 'scheme_qa_response'
    });

    const chain = promptTemplate.pipe(structuredLlm);

    console.log(`\n🤖 [SCHEME QA] Answering question for scheme "${schemeDoc.title}": "${question}"...`);

    let aiResult = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        aiResult = await chain.invoke({
          startupName: onboarding.startupName || 'Startup Venture',
          state: onboarding.state || 'Unspecified',
          stage: onboarding.stage || 'Idea Stage',
          dpiit: onboarding.dpiit || "Don't Know",
          sector: founderProfile.sector || onboarding.description || 'General Tech',
          schemeTitle: schemeDoc.structured?.schemeName || schemeDoc.title || 'Scheme',
          schemeSource: schemeDoc.source || 'Official Portal',
          schemeUrl: schemeDoc.url || '#',
          schemeStructuredJson,
          schemeContext,
          chatHistory: formattedHistory,
          question
        });
        break;
      } catch (err) {
        const isRateLimit = err.message && (err.message.includes('429') || err.message.includes('rate limit'));
        if (isRateLimit && attempt < 3) {
          let waitMs = 3000;
          const match = err.message.match(/try again in ([\d\.]+)s/i);
          if (match && match[1]) {
            waitMs = Math.ceil(parseFloat(match[1]) * 1000) + 500;
          }
          console.warn(`[WARN] Groq rate limit hit in scheme Q&A. Waiting ${Math.round(waitMs / 1000)}s (Attempt ${attempt}/3)...`);
          await new Promise(r => setTimeout(r, waitMs));
          continue;
        }
        throw err;
      }
    }

    if (!aiResult) {
      throw new Error('Failed to obtain Q&A response from AI.');
    }

    console.log(`✅ [SCHEME QA] Successfully generated answer for "${schemeDoc.title}".`);

    return res.status(200).json({
      success: true,
      data: {
        schemeId: id,
        question,
        answer: aiResult.answer,
        suggestedFollowups: Array.isArray(aiResult.suggestedFollowups) ? aiResult.suggestedFollowups : []
      }
    });

  } catch (error) {
    console.error(`❌ [SCHEME QA ERROR] Failed to generate AI Q&A answer:`, error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process AI Q&A for this scheme.',
      details: error.message
    });
  }
}

export default { answerSchemeQa };
