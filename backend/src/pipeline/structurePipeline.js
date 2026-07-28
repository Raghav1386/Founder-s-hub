/**
 * structurePipeline.js (src/pipeline/structurePipeline.js)
 * 
 * Purpose:
 * Sequential Document Structuring Pipeline using LangChain JS, Gemini 2.5 Flash, and Zod.
 * Includes rate-limit throttling (429 retry backoff) and asset URL filtering.
 * 
 * Pipeline Flow:
 * 1. Connect to MongoDB via Mongoose.
 * 2. Find documents where processingStatus = "pending_structure".
 * 3. Filter out non-document assets (.css, .js, images, fonts).
 * 4. Send markdown content to Gemini 2.5 Flash with structured schema extraction.
 * 5. Handle rate-limits (429) automatically with exponential backoff / retry.
 * 6. Save the structured JSON into document.structured.
 * 7. Update processingStatus = "pending_embedding".
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
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
 * Invokes Gemini structured output model with automatic 429 retry handling.
 */
async function invokeWithRetry(structuredLlm, prompt, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await structuredLlm.invoke(prompt);
        } catch (error) {
            const errorMsg = error.message || '';
            const isRateLimit = errorMsg.includes('429') || errorMsg.includes('Too Many Requests') || errorMsg.includes('Quota exceeded');

            if (isRateLimit && attempt < maxRetries) {
                // Attempt to parse retry delay from error message (e.g. "Please retry in 32s")
                let waitSeconds = 35;
                const match = errorMsg.match(/retry in ([0-9.]+)s/i);
                if (match && match[1]) {
                    waitSeconds = Math.ceil(parseFloat(match[1])) + 2;
                }

                console.warn(`⏳ [Rate Limit 429] Waiting ${waitSeconds}s before retry attempt ${attempt + 1}/${maxRetries}...`);
                await sleep(waitSeconds * 1000);
            } else {
                throw error;
            }
        }
    }
}

/**
 * Runs the document structuring pipeline.
 */
export async function runStructuringPipeline() {
    console.log('🚀 Starting Document Structuring Pipeline...');

    // Step 1: Ensure Gemini API Key is available
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.error('❌ Error: Missing GEMINI_API_KEY or GOOGLE_API_KEY in environment variables (.env).');
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
            console.log('ℹ️ No documents waiting for structuring.');
            if (pendingCount > 0 || failedCount > 0) {
                console.log(`💡 Found ${pendingCount} "pending" and ${failedCount} "failed" documents.`);
                console.log('👉 Run "npm run queue-structure" to queue them for structuring!');
            }
            return;
        }

        // Step 4: Initialize LangChain Gemini model with Gemini 2.5 Flash
        const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
        console.log(`🤖 Initializing LangChain Gemini LLM (Model: ${modelName})...`);

        const llm = new ChatGoogleGenerativeAI({
            model: modelName,
            apiKey: apiKey,
            temperature: 0.1, // Low temperature for deterministic, factual structured output
        });

        // Bind the structured output schema using LangChain's .withStructuredOutput()
        const structuredLlm = llm.withStructuredOutput(schemeSchema, {
            name: 'ExtractGovernmentSchemeMetadata',
        });

        let successCount = 0;
        let failCount = 0;
        let skippedCount = 0;

        // Step 5: Process documents sequentially using a for...of loop with async/await
        for (let i = 0; i < documents.length; i++) {
            const doc = documents[i];
            const currentNum = i + 1;
            console.log(`\n--------------------------------------------------`);
            console.log(`[${currentNum}/${documents.length}] Processing Document: "${doc.title}"`);
            console.log(`🔗 URL: ${doc.url}`);
            console.log(`📌 Source: ${doc.source}`);

            // Filter out non-content asset files (.css, .js, images)
            if (isAssetUrl(doc.url)) {
                console.warn(`⏭️ Skipping asset URL: ${doc.url}`);
                doc.processingStatus = 'failed';
                await doc.save();
                skippedCount++;
                continue;
            }

            if (!doc.markdown || doc.markdown.trim().length === 0) {
                console.warn(`⚠️ Skipping document ID ${doc._id}: Markdown content is empty.`);
                doc.processingStatus = 'failed';
                await doc.save();
                failCount++;
                continue;
            }

            try {
                // Construct prompt instructions for Gemini
                const prompt = `You are an expert AI assistant specializing in analyzing official Indian government scheme documents and startup policies.
Extract all key details from the document text provided below according to the required schema.
If a piece of information is not present or not specified in the document, use appropriate defaults such as empty arrays [], false, or "N/A".

Document Title: ${doc.title}
Source: ${doc.source}
URL: ${doc.url}

--- DOCUMENT MARKDOWN TEXT START ---
${doc.markdown}
--- DOCUMENT MARKDOWN TEXT END ---
`;

                console.log(`⏳ Sending markdown (${doc.markdown.length} chars) to Gemini for structured extraction...`);

                // Send to Gemini model via LangChain structured output with retry mechanism
                const structuredData = await invokeWithRetry(structuredLlm, prompt);

                console.log(`✅ Extracted structured data successfully!`);
                console.log(`   Summary snippet: ${structuredData.summary.substring(0, 100)}...`);

                // Step 6: Store extracted JSON inside document.structured
                doc.structured = structuredData;

                // Step 7: Update processingStatus to "pending_embedding"
                doc.processingStatus = 'pending_embedding';

                // Save updated document to MongoDB
                await doc.save();
                console.log(`💾 Saved document to MongoDB with processingStatus = "pending_embedding".`);

                successCount++;

                // Pause briefly (e.g. 4 seconds) between requests to stay within free-tier rate limits (15 RPM / 5 RPM)
                const DELAY_BETWEEN_REQUESTS_MS = parseInt(process.env.STRUCTURE_DELAY_MS || '4000', 10);
                if (DELAY_BETWEEN_REQUESTS_MS > 0 && i < documents.length - 1) {
                    await sleep(DELAY_BETWEEN_REQUESTS_MS);
                }

            } catch (error) {
                console.error(`❌ Error structuring document "${doc.title}" (ID: ${doc._id}):`, error.message);
                
                // Keep processingStatus as pending_structure if it was a rate limit failure after max retries, otherwise mark failed
                const isRateLimit = error.message.includes('429') || error.message.includes('Quota exceeded');
                doc.processingStatus = isRateLimit ? 'pending_structure' : 'failed';
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

// Execute the pipeline if script is run directly from command line
runStructuringPipeline();
