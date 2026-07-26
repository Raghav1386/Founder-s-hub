/**
 * saveDocument.js
 * 
 * Purpose:
 * Receives a crawled page, generates a content hash, and saves/updates 
 * the document in the MongoDB collection based on content changes.
 * 
 * Responsibilities:
 * 1. Calculate SHA-256 content hash from page markdown.
 * 2. Query MongoDB by page URL.
 * 3. If new URL: Insert document with processingStatus = "pending".
 * 4. If existing URL & hash changed: Update content, set processingStatus = "pending" (flagged for re-embedding).
 * 5. If existing URL & hash unchanged: Only update lastSeenInCrawl and lastCrawledAt.
 */

import { generateContentHash } from './hash.js';
import { logger } from './logger.js';

/**
 * Saves or updates a crawled web document in MongoDB.
 * 
 * @param {Object} pageData - Data extracted from the crawled page
 * @param {string} pageData.title - Title of the web page
 * @param {string} pageData.url - Full URL of the web page
 * @param {string} pageData.source - Source identifier (e.g. "Startup India", "MSME")
 * @param {string} pageData.markdown - Clean markdown content of the page
 * @param {Object} dbCollection - MongoDB collection instance (e.g. db.collection('documents'))
 * @param {string|Date} [crawlRunId] - Unique identifier or timestamp for the current crawl run
 * 
 * @returns {Promise<Object>} Summary of action taken ({ status: 'inserted' | 'updated' | 'unchanged' })
 */
export async function saveDocument(pageData, dbCollection, crawlRunId = null) {
    // Validate required input parameters
    if (!pageData || !pageData.url) {
        logger.error('saveDocument failed: Invalid or missing pageData / url');
        return { status: 'failed', reason: 'invalid_input' };
    }

    if (!dbCollection) {
        logger.error('saveDocument failed: MongoDB collection instance not provided');
        return { status: 'failed', reason: 'missing_collection' };
    }

    const {
        title = 'Untitled Page',
        url,
        source = 'unknown',
        markdown = ''
    } = pageData;

    // STEP 1: Generate SHA-256 hash of the markdown content
    const newContentHash = generateContentHash(markdown);

    const now = new Date();
    const currentRunId = crawlRunId || now.toISOString();

    try {
        // STEP 2: Check MongoDB to see if this URL already exists in the database
        const existingDoc = await dbCollection.findOne({ url: url });

        // CASE 1: Document does NOT exist in MongoDB -> INSERT NEW DOCUMENT
        if (!existingDoc) {
            const newDocument = {
                title: title,
                url: url,
                source: source,
                markdown: markdown,
                contentHash: newContentHash,
                processingStatus: 'pending',    // Flagged so embedding service knows to process this doc
                documentStatus: 'active',      // Document is active
                lastSeenInCrawl: currentRunId, // Tracks which crawl run saw this page
                embeddingVersion: 1,           // Initial embedding version
                lastEmbeddedAt: null,          // Not embedded yet
                lastCrawledAt: now,            // Timestamp when this page was crawled
                updatedAt: now                 // Timestamp when record was created/updated
            };

            await dbCollection.insertOne(newDocument);
            logger.success(`Inserted new document into MongoDB: ${url}`);
            return { status: 'inserted', url: url };
        }

        // CASE 2: Document EXISTS -> Check if content has CHANGED by comparing hashes
        const hasContentChanged = (existingDoc.contentHash !== newContentHash);

        if (hasContentChanged) {
            // Content changed -> UPDATE markdown, hash, reset processingStatus to "pending", and update timestamps
            const updateFields = {
                title: title,
                source: source,
                markdown: markdown,
                contentHash: newContentHash,
                processingStatus: 'pending',    // Re-flag as pending for re-embedding pipeline
                lastSeenInCrawl: currentRunId, // Update crawl run ID
                lastCrawledAt: now,            // Update crawl timestamp
                updatedAt: now                 // Update record modified timestamp
            };

            await dbCollection.updateOne(
                { _id: existingDoc._id },
                { $set: updateFields }
            );

            logger.success(`Updated modified document in MongoDB (flagged for re-embedding): ${url}`);
            return { status: 'updated', url: url };
        } else {
            // CASE 3: Content UNCHANGED -> Only update crawl timestamps without re-flagging for embedding
            const updateFields = {
                lastSeenInCrawl: currentRunId,
                lastCrawledAt: now
            };

            await dbCollection.updateOne(
                { _id: existingDoc._id },
                { $set: updateFields }
            );

            logger.info(`Document content unchanged, refreshed timestamps: ${url}`);
            return { status: 'unchanged', url: url };
        }

    } catch (error) {
        // Log database error and return failed status without crashing the crawler
        logger.error(`Error saving document to MongoDB for URL: ${url}`, error);
        return { status: 'error', error: error.message };
    }
}

export default saveDocument;
