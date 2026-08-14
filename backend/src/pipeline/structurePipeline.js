/**
 * structurePipeline.js (src/pipeline/structurePipeline.js)
 * 
 * Purpose:
 * Sequential Document Structuring Pipeline using LangChain JS, Gemini, and Zod.
 * Uses gemini-2.0-flash by default, with automatic fallback to ChatGroq (llama-3.1-8b-instant)
 * if Gemini free-tier daily quota is reached.
 * 
 * Pipeline Flow:
 * 1. Connect to MongoDB via Mongoose.
 * 2. Find documents where processingStatus = "pending_structure".
 * 3. Filter out non-document assets (.css, .js, images, fonts).
 * 4. Check if document already has structured JSON; if so, skip API call and promote to pending_embedding.
 * 5. Send markdown content to Gemini Flash / ChatGroq fallback with structured schema extraction.
 * 6. Save the structured JSON into document.structured and set processingStatus = "pending_embedding".
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatGroq } from '@langchain/groq';
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
 * Invokes structuring model with Gemini and fallback to ChatGroq on 429 quota limits.
 */
async function invokeStructuringLlm(geminiLlm, groqLlm, prompt, maxRetries = 3) {
    let geminiQuotaExceeded = false;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            if (!geminiQuotaExceeded && geminiLlm) {
                return await geminiLlm.invoke(prompt);
            }
        } catch (error) {
            const errorMsg = error.message || '';
            console.warn(`\n[Gemini Error Details]: ${errorMsg}`);
            
            const isDailyQuotaExceeded = errorMsg.includes('GenerateRequestsPerDayPerProjectPerModel-FreeTier') || 
                                         errorMsg.includes('limit: 0, model');
            const isPerMinuteLimit = errorMsg.includes('GenerateRequestsPerMinute') || errorMsg.includes('429') || errorMsg.includes('Too Many Requests') || errorMsg.includes('Quota exceeded');

            if (isDailyQuotaExceeded) {
                console.warn(`⚠️ [Gemini Daily Quota Reached] Falling back to ChatGroq (llama-3.1-8b-instant) for structuring...`);
                geminiQuotaExceeded = true;
            } else if (isPerMinuteLimit && attempt <= maxRetries) {
                let waitSeconds = 15;
                const match = errorMsg.match(/retry in ([0-9.]+)s/i);
                if (match && match[1]) {
                    waitSeconds = Math.ceil(parseFloat(match[1])) + 2;
                }
                console.warn(`⏳ [Gemini Per-Minute Rate Limit 429] Pausing ${waitSeconds}s before retry attempt ${attempt}/${maxRetries}...`);
                await sleep(waitSeconds * 1000);
                attempt--;
                continue;
            }
        }

        // Try Groq LLM fallback if Gemini failed or quota exceeded
        if (groqLlm) {
            for (let groqAttempt = 1; groqAttempt <= 3; groqAttempt++) {
                try {
                    console.log(`🤖 Processing document structuring via ChatGroq fallback...`);
                    return await groqLlm.invoke(prompt);
                } catch (groqErr) {
                    const groqMsg = groqErr.message || '';
                    const isGroqRateLimit = groqMsg.includes('429') || groqMsg.includes('rate_limit_exceeded') || groqMsg.includes('Rate limit reached');
                    
                    if (isGroqRateLimit && groqAttempt < 3) {
                        let waitSec = 12;
                        const match = groqMsg.match(/try again in ([0-9.]+)s/i);
                        if (match && match[1]) {
                            waitSec = Math.ceil(parseFloat(match[1])) + 2;
                        }
                        console.warn(`⏳ [Groq Rate Limit 429] Pausing ${waitSec}s before retry attempt ${groqAttempt + 1}/3...`);
                        await sleep(waitSec * 1000);
                        continue;
                    }
                    console.error(`❌ Groq structuring error:`, groqErr.message);
                    throw groqErr;
                }
            }
        }
    }
}

/**
 * Runs the document structuring pipeline.
 */
export async function runStructuringPipeline() {
    console.log('🚀 Starting Document Structuring Pipeline...');

    // Step 1: Check environment keys
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const groqApiKey = process.env.GROQ_API_KEY;

    if (!geminiApiKey && !groqApiKey) {
        console.error('❌ Error: Missing GEMINI_API_KEY and GROQ_API_KEY in environment variables (.env).');
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

        // Step 4: Initialize Gemini and Groq LLM models
        let geminiLlm = null;
        if (geminiApiKey) {
            const geminiModel = new ChatGoogleGenerativeAI({
                model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
                apiKey: geminiApiKey,
                temperature: 0.1
            });
            geminiLlm = geminiModel.withStructuredOutput(schemeSchema, { name: 'government_scheme_extraction' });
        }

        let groqLlm = null;
        if (groqApiKey) {
            const groqModel = new ChatGroq({
                apiKey: groqApiKey,
                model: 'llama-3.3-70b-versatile',
                temperature: 0.1
            });
            groqLlm = groqModel.withStructuredOutput(schemeSchema, { name: 'government_scheme_extraction' });
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

            const truncatedMarkdown = doc.markdown.length > 20000 
                ? doc.markdown.substring(0, 20000) + '\n\n[Content truncated for structuring]'
                : doc.markdown;

            const prompt = `Analyze the following government scheme web document and extract structured scheme metadata adherence to schema:\n\nDOCUMENT TITLE: ${doc.title || 'Untitled'}\nDOCUMENT URL: ${doc.url}\nSOURCE: ${doc.source}\n\nRAW MARKDOWN CONTENT:\n${truncatedMarkdown}`;

            try {
                console.log(`⏳ Sending markdown (${truncatedMarkdown.length} chars) to AI LLM for structured extraction...`);
                const structuredData = await invokeStructuringLlm(geminiLlm, groqLlm, prompt);

                doc.structured = structuredData;
                doc.processingStatus = 'pending_embedding';

                await doc.save();
                console.log(`💾 Saved document to MongoDB with processingStatus = "pending_embedding".`);
                successCount++;

                // Small pause between requests
                await sleep(1500);

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
