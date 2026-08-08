/**
 * embedDocuments.js (src/embeddings/embedDocuments.js)
 * 
 * Purpose:
 * Sequential Document Embedding Pipeline for RAG application.
 * 
 * Pipeline Workflow:
 * 1. Read MongoDB documents where processingStatus = "pending_embedding" or "failed" (retries).
 * 2. Skip documents with empty markdown or asset URLs (.css, .js).
 * 3. Chunk markdown using LangChain RecursiveCharacterTextSplitter (1000 size, 200 overlap).
 * 4. Generate vector embeddings for text chunks using Jina Embeddings API with 429 retry backoff.
 * 5. Store vector embeddings + payload metadata in Qdrant Vector DB.
 * 6. Update MongoDB document status to "completed" and set embeddedAt timestamp.
 * 7. Process all documents sequentially with robust per-document error handling.
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../configs/db.js';
import Document from '../models/Document.js';
import { splitMarkdown } from './textSplitter.js';
import { jinaEmbeddings } from './embeddingModel.js';
import { ensureCollectionExists, storeChunksInQdrant } from './qdrant.js';

// Load environment variables from backend root .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const COLLECTION_NAME = process.env.QDRANT_COLLECTION || 'founderpilot_schemes';

function isAssetUrl(urlStr) {
    if (!urlStr) return false;
    const lower = urlStr.toLowerCase();
    const assetExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.svg', '.gif', '.ico', '.woff', '.woff2', '.ttf', '.eot'];
    return assetExtensions.some((ext) => lower.endsWith(ext) || lower.includes(`${ext}?`));
}

/**
 * Runs the document embedding pipeline.
 */
export async function runEmbeddingPipeline() {
    console.log('🚀 Starting Sequential Document Embedding Pipeline...');

    // Step 1: Connect to MongoDB via Mongoose
    await connectDB();

    try {
        // Step 2: Ensure Qdrant Vector Collection exists (1024 dimensions for Jina v3)
        try {
            const vectorDimensions = jinaEmbeddings.dimensions || 1024;
            await ensureCollectionExists(COLLECTION_NAME, vectorDimensions);
        } catch (qdrantErr) {
            console.warn(`⚠️ Qdrant vector DB warning (${qdrantErr.message}). Pipeline will use MongoDB direct fallback.`);
        }

        // Step 3: Query MongoDB documents ready for embedding (pending_embedding or previously failed)
        const documents = await Document.find({
            processingStatus: { $in: ['pending_embedding', 'failed'] }
        }).exec();

        // Filter out asset URLs and empty markdowns
        const validDocuments = documents.filter(doc => !isAssetUrl(doc.url) && doc.markdown && doc.markdown.trim().length > 0);

        console.log(`\n📋 Found ${validDocuments.length} document(s) ready for vector embedding.`);

        if (validDocuments.length === 0) {
            const completedCount = await Document.countDocuments({ processingStatus: 'completed' });
            console.log(`ℹ️ No documents waiting for vector embedding.`);
            console.log(`🎉 Total Completed & Stored in Qdrant: ${completedCount} documents!`);
            return;
        }

        let successCount = 0;
        let failCount = 0;
        let skippedCount = 0;

        // Step 4: Process documents sequentially using a for...of loop with async/await
        for (let i = 0; i < validDocuments.length; i++) {
            const doc = validDocuments[i];
            const currentNum = i + 1;

            console.log(`\n--------------------------------------------------`);
            console.log(`[${currentNum}/${validDocuments.length}] Embedding Document: "${doc.title}"`);
            console.log(`🔗 URL: ${doc.url}`);
            console.log(`📌 Source: ${doc.source}`);

            try {
                // Step 4a: Chunk markdown using LangChain text splitter
                console.log(`✂️ Chunking markdown text (${doc.markdown.length} chars)...`);
                const textChunks = await splitMarkdown(doc.markdown);

                if (textChunks.length === 0) {
                    console.warn(`⚠️ No text chunks generated for document ID ${doc._id}.`);
                    doc.processingStatus = 'failed';
                    await doc.save();
                    skippedCount++;
                    continue;
                }

                console.log(`📦 Generated ${textChunks.length} chunk(s). Requesting Jina Embeddings...`);

                // Step 4b: Generate vector embeddings for all chunks via Jina API
                const embeddings = await jinaEmbeddings.embedDocuments(textChunks);

                if (embeddings.length !== textChunks.length) {
                    throw new Error(`Embedding count mismatch: expected ${textChunks.length}, got ${embeddings.length}`);
                }

                // Step 4c: Prepare chunk objects with text, vector, and index metadata
                const chunksData = textChunks.map((chunkText, index) => ({
                    text: chunkText,
                    embedding: embeddings[index],
                    chunkIndex: index,
                    doc: doc
                }));

                // Step 4d: Store vectors + payload in Qdrant Vector DB
                console.log(`💾 Storing ${chunksData.length} vector points in Qdrant collection "${COLLECTION_NAME}"...`);
                await storeChunksInQdrant(COLLECTION_NAME, chunksData);

                // Step 5: Update MongoDB document status and embeddedAt timestamp
                const now = new Date();
                doc.processingStatus = 'completed';
                doc.embeddedAt = now;
                doc.lastEmbeddedAt = now;

                await doc.save();
                console.log(`✅ Document "${doc.title}" successfully embedded and marked as "completed"!`);

                successCount++;

            } catch (error) {
                console.error(`❌ Error embedding document "${doc.title}" (ID: ${doc._id}):`, error.message);
                
                // If it was a rate limit error, keep as pending_embedding so it can be safely re-run
                const isRateLimit = error.message.includes('429') || error.message.includes('RATE_TOKEN_LIMIT_EXCEEDED');
                doc.processingStatus = isRateLimit ? 'pending_embedding' : 'failed';
                await doc.save();
                failCount++;
            }
        }

        console.log(`\n==================================================`);
        console.log(`🎉 Embedding Pipeline Completed!`);
        console.log(`   Successfully Embedded: ${successCount}`);
        console.log(`   Skipped: ${skippedCount}`);
        console.log(`   Failed / Pending Retry: ${failCount}`);
        console.log(`==================================================\n`);

    } catch (err) {
        console.error('❌ Fatal error in embedding pipeline:', err);
    } finally {
        process.exit(0);
    }
}

// Execute the pipeline if run directly from command line
runEmbeddingPipeline();
