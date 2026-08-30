/**
 * structurePipeline.js (src/pipeline/structurePipeline.js)
 * 
 * Purpose:
 * Sequential Document Structuring Pipeline using LangChain JS, Mistral AI, and Zod.
 * Uses mistral-small-latest with native JSON extraction & Zod validation, with automatic fallback
 * to ChatGroq (openai/gpt-oss-120b) or Gemini if quota limits are reached.
 * 
 * Pipeline Flow:
 * 1. Connect to MongoDB via Mongoose.
 * 2. Find documents where processingStatus = "pending_structure".
 * 3. Filter out non-document assets (.css, .js, images, fonts).
 * 4. Check if document already has structured JSON; if so, skip API call and promote to pending_embedding.
 * 5. Send markdown content to Mistral AI / ChatGroq with structured schema extraction.
 * 6. Save the structured JSON into document.structured and set processingStatus = "pending_embedding".
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { ChatMistralAI } from '@langchain/mistralai';
import { ChatGroq } from '@langchain/groq';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import connectDB from '../configs/db.js';
import Document from '../models/Document.js';
import schemeSchema from './schema/schemeSchema.js';

// Ensure .env is loaded from backend root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Checks if a URL points to a non-content asset (CSS, JS, images, fonts).
 */
function isAssetUrl(urlStr) {
    if (!urlStr) return false;
    const lower = urlStr.toLowerCase();
    const assetExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.svg', '.gif', '.ico', '.woff', '.woff2', '.ttf', '.eot'];
    return assetExtensions.some((ext) => lower.endsWith(ext) || lower.includes(`${ext}?`));
}

/**
 * Invokes structuring model with Mistral AI as primary, with fallback to ChatGroq / Gemini.
 */
async function invokeStructuringLlm(mistralModel, groqLlm, geminiLlm, doc, maxRetries = 3) {
    const truncatedMarkdown = doc.markdown.length > 20000 
        ? doc.markdown.substring(0, 20000) + '\n\n[Content truncated for structuring]'
        : doc.markdown;

    const mistralPrompt = `You are a startup scheme and cloud credit metadata extractor. You MUST extract a JSON object matching this schema:
{
  "summary": "2-3 sentence overview of the scheme, grant, or cloud credit program",
  "eligibility": {
    "dpiitRequired": false,
    "startupStages": ["Ideation", "Validation", "Early Traction", "Scaling"],
    "sectors": ["All Sectors"],
    "states": ["All India"],
    "entityTypes": ["Private Limited", "LLP"]
  },
  "benefits": ["Benefit 1", "Benefit 2"],
  "funding": {
    "type": "Grant / Soft Loan / Credit / Subsidy",
    "amount": "Up to ₹20 Lakhs / $150,000 / N/A"
  },
  "requiredDocuments": ["Incorporation Certificate"],
  "applicationProcess": ["Step 1", "Step 2"],
  "deadline": "Rolling / Open All Year",
  "keywords": ["Keyword 1", "Keyword 2"]
}

OUTPUT ONLY VALID JSON. DO NOT INCLUDE EXTRA TEXT OR UNESCAPED CHARACTERS.

DOCUMENT TO ANALYZE:
DOCUMENT TITLE: ${doc.title || 'Untitled'}
DOCUMENT URL: ${doc.url}
SOURCE: ${doc.source}

RAW MARKDOWN CONTENT:
${truncatedMarkdown}`;

    const fallbackPrompt = `Analyze the following government scheme or cloud startup credit document and extract structured metadata adherence to schema:\n\nDOCUMENT TITLE: ${doc.title || 'Untitled'}\nDOCUMENT URL: ${doc.url}\nSOURCE: ${doc.source}\n\nRAW MARKDOWN CONTENT:\n${truncatedMarkdown}`;

    // 1. Primary: Mistral AI Direct JSON Mode + Zod Validation
    if (mistralModel) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`⏳ Sending markdown (${truncatedMarkdown.length} chars) to Mistral AI (mistral-small-latest)...`);
                const response = await mistralModel.invoke(mistralPrompt);
                let rawText = response.content;
                if (typeof rawText !== 'string') {
                    rawText = JSON.stringify(rawText);
                }

                // Strip markdown code fences if present
                const cleanedText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
                const parsedJson = JSON.parse(cleanedText);
                const validatedData = schemeSchema.parse(parsedJson);

                return validatedData;

            } catch (error) {
                const errorMsg = error.message || '';
                console.warn(`\n[Mistral AI Error Details]: ${errorMsg}`);
                const isRateLimit = errorMsg.includes('429') || errorMsg.includes('Rate limit') || errorMsg.includes('Quota');

                if (isRateLimit && attempt < maxRetries) {
                    console.warn(`⏳ [Mistral AI Rate Limit 429] Pausing 5s before retry attempt ${attempt + 1}/${maxRetries}...`);
                    await sleep(5000);
                    continue;
                }

                console.warn(`⚠️ [Mistral AI Unavailable] Falling back to ChatGroq / Gemini for structuring...`);
                break;
            }
        }
    }

    // 2. Fallback: ChatGroq
    if (groqLlm) {
        for (let groqAttempt = 1; groqAttempt <= 3; groqAttempt++) {
            try {
                console.log(`🤖 Processing document structuring via ChatGroq fallback...`);
                return await groqLlm.invoke(fallbackPrompt);
            } catch (groqErr) {
                const groqMsg = groqErr.message || '';
                const isGroqRateLimit = groqMsg.includes('429') || groqMsg.includes('rate_limit_exceeded') || groqMsg.includes('Rate limit reached');
                
                if (isGroqRateLimit && groqAttempt < 3) {
                    console.warn(`⏳ [Groq Rate Limit 429] Pausing 8s before retry attempt ${groqAttempt + 1}/3...`);
                    await sleep(8000);
                    continue;
                }
                console.error(`❌ Groq structuring error:`, groqErr.message);
                break;
            }
        }
    }

    // 3. Fallback: Gemini
    if (geminiLlm) {
        console.log(`🤖 Processing document structuring via Gemini fallback...`);
        return await geminiLlm.invoke(fallbackPrompt);
    }

    throw new Error('All structuring AI models (Mistral, Groq, Gemini) failed to extract schema.');
}

/**
 * Runs the document structuring pipeline.
 */
export async function runStructuringPipeline() {
    console.log('🚀 Starting Document Structuring Pipeline (Mistral AI Core)...');

    // Step 1: Check environment keys
    const mistralApiKey = process.env.MISTRAL_API_KEY;
    const groqApiKey = process.env.GROQ_API_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!mistralApiKey && !groqApiKey && !geminiApiKey) {
        console.error('❌ Error: Missing MISTRAL_API_KEY, GROQ_API_KEY, and GEMINI_API_KEY in environment variables (.env).');
        process.exit(1);
    }

    // Step 2: Connect to MongoDB via Mongoose
    await connectDB();

    try {
        // Step 3: Find documents queued for structuring
        const targetStatus = 'pending_structure';
        const documents = await Document.find({ processingStatus: targetStatus }).exec();

        console.log(`\n📋 Found ${documents.length} document(s) with processingStatus = "${targetStatus}".`);

        if (documents.length === 0) {
            const pendingCount = await Document.countDocuments({ processingStatus: 'pending' });
            const failedCount = await Document.countDocuments({ processingStatus: 'failed' });
            const completedCount = await Document.countDocuments({ processingStatus: 'pending_embedding' });
            
            console.log('ℹ️ No documents waiting for structuring.');
            console.log(`📊 Current DB Stats: ${completedCount} ready for embedding, ${pendingCount} pending, ${failedCount} failed.`);
            return;
        }

        // Step 4: Initialize Mistral AI, Groq, and Gemini LLM models
        let mistralModel = null;
        if (mistralApiKey) {
            mistralModel = new ChatMistralAI({
                apiKey: mistralApiKey,
                model: process.env.MISTRAL_MODEL || 'mistral-small-latest',
                temperature: 0.1
            });
            console.log('✅ Initialized Mistral AI structuring model (mistral-small-latest).');
        }

        let groqLlm = null;
        if (groqApiKey) {
            const groqModel = new ChatGroq({
                apiKey: groqApiKey,
                model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
                temperature: 0.1
            });
            groqLlm = groqModel.withStructuredOutput(schemeSchema, { name: 'government_scheme_extraction' });
        }

        let geminiLlm = null;
        if (geminiApiKey) {
            const geminiModel = new ChatGoogleGenerativeAI({
                model: process.env.GEMINI_MODEL || 'gemini-flash-latest',
                apiKey: geminiApiKey,
                temperature: 0.1
            });
            geminiLlm = geminiModel.withStructuredOutput(schemeSchema, { name: 'government_scheme_extraction' });
        }

        let successCount = 0;
        let skippedCount = 0;
        let failCount = 0;

        // Step 5: Process documents sequentially
        for (let i = 0; i < documents.length; i++) {
            const doc = documents[i];

            console.log(`\n--------------------------------------------------`);
            console.log(`[${i + 1}/${documents.length}] Processing Document: "${doc.title || 'Untitled'}"`);
            console.log(`🔗 URL: ${doc.url}`);
            console.log(`📌 Source: ${doc.source || 'Unknown'}`);

            if (isAssetUrl(doc.url)) {
                console.log(`⏭️ Skipping asset URL: ${doc.url}`);
                skippedCount++;
                doc.processingStatus = 'skipped_asset';
                await doc.save();
                continue;
            }

            if (doc.structured && Object.keys(doc.structured).length > 0) {
                console.log(`ℹ️ Document already contains structured data. Promoting to "pending_embedding"...`);
                doc.processingStatus = 'pending_embedding';
                await doc.save();
                successCount++;
                continue;
            }

            if (!doc.markdown || doc.markdown.trim().length === 0) {
                console.warn(`⚠️ Empty markdown content for document "${doc.title}". Skipping structuring...`);
                doc.processingStatus = 'failed';
                await doc.save();
                failCount++;
                continue;
            }

            try {
                const structuredData = await invokeStructuringLlm(mistralModel, groqLlm, geminiLlm, doc);

                doc.structured = structuredData;
                doc.processingStatus = 'pending_embedding';

                await doc.save();
                console.log(`💾 Saved document to MongoDB with processingStatus = "pending_embedding".`);
                successCount++;

                // Small pause between requests
                await sleep(1000);

            } catch (error) {
                console.error(`❌ Error structuring document "${doc.title}" (ID: ${doc._id}):`, error.message);
                doc.processingStatus = 'failed';
                await doc.save();
                failCount++;
            }
        }

        console.log(`\n==================================================`);
        console.log(`🎉 Pipeline Execution Completed!`);
        console.log(`   Successfully Structured: ${successCount}`);
        console.log(`   Skipped Asset URLs: ${skippedCount}`);
        console.log(`   Failed / Remaining: ${failCount}`);
        console.log(`==================================================\n`);

    } catch (err) {
        console.error('❌ Fatal error in structuring pipeline:', err);
    } finally {
        process.exit(0);
    }
}

// Execute if run directly from CLI
runStructuringPipeline();
