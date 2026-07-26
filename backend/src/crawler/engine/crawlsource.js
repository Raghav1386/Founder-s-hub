/**
 * crawlSource.js
 * 
 * Purpose:
 * Main crawling engine responsible for processing a single source configuration.
 * 
 * Responsibilities:
 * 1. Initialize Crawl4AI crawler instance.
 * 2. Create the URL queue and add initial starting URLs.
 * 3. Track visited URLs to prevent infinite loops.
 * 4. Process each page sequentially:
 *    a. Dequeue URL item.
 *    b. Fetch web page content using Crawl4AI.
 *    c. Save/update extracted document in MongoDB via saveDocument.
 *    d. Discover new valid links on the page using discoverLinks.
 *    e. Enqueue newly discovered links.
 * 5. Handle all errors gracefully so a single failing page does not stop the crawl process.
 */

import { Queue } from './queue.js';
import { discoverLinks } from './discoverLinks.js';
import { saveDocument } from './saveDocument.js';
import { logger } from './logger.js';

/**
 * Helper function to crawl a single URL using Crawl4AI.
 * Wraps Crawl4AI API calls with fallback logic and error handling.
 * 
 * @param {string} targetUrl - The page URL to crawl
 * @returns {Promise<Object>} Crawled page result containing { title, url, markdown, links }
 */
async function fetchPageWithCrawl4AI(targetUrl) {
    logger.info(`Fetching page with Crawl4AI: ${targetUrl}`);

    try {
        // Attempt to call local Crawl4AI REST service API endpoint (default port 11235)
        const crawl4aiEndpoint = process.env.CRAWL4AI_API_URL || 'http://localhost:11235/crawl';

        const response = await fetch(crawl4aiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                urls: targetUrl,
                word_count_threshold: 10,
                extraction_strategy: 'NoExtractionStrategy',
                bypass_cache: true
            })
        });

        if (response.ok) {
            const data = await response.json();
            // Crawl4AI returns an array of results or a single result object
            const result = Array.isArray(data) ? data[0] : (data.results ? data.results[0] : data);

            return {
                title: result.title || result.metadata?.title || targetUrl,
                url: targetUrl,
                markdown: result.markdown || result.cleaned_html || '',
                links: result.links?.internal?.concat(result.links?.external || []) || result.extracted_links || []
            };
        }
    } catch (apiError) {
        logger.warning(`Crawl4AI API server not reachable (${apiError.message}). Falling back to native fetch.`);
    }

    // FALLBACK METHOD: Standard HTTP fetch if Crawl4AI local service is offline
    try {
        const fetchResponse = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) FounderPilot-Crawler/1.0'
            }
        });

        if (!fetchResponse.ok) {
            throw new Error(`HTTP ${fetchResponse.status} ${fetchResponse.statusText}`);
        }

        const htmlText = await fetchResponse.text();

        // Extract title tag content using basic regex
        const titleMatch = htmlText.match(/<title[^>]*>(.*?)<\/title>/i);
        const pageTitle = titleMatch ? titleMatch[1].trim() : targetUrl;

        // Extract href links using regex for simple fallback link discovery
        const hrefMatches = [...htmlText.matchAll(/href=["'](https?:\/\/[^"'\s]+)["']/gi)];
        const extractedLinks = hrefMatches.map(match => match[1]);

        // Basic strip HTML tags for simple markdown fallback text
        const plainText = htmlText
            .replace(/<script\b[^<]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style\b[^<]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        return {
            title: pageTitle,
            url: targetUrl,
            markdown: plainText,
            links: extractedLinks
        };
    } catch (fallbackError) {
        logger.error(`Failed to fetch page content for ${targetUrl}:`, fallbackError.message);
        throw fallbackError;
    }
}

/**
 * Crawls a single government website source based on its configuration file.
 * 
 * @param {Object} config - Configuration object for the source (e.g. startupIndia config)
 * @param {string} config.name - Name of the source (e.g. "StartupIndia")
 * @param {string} [config.baseUrl] - Base URL of the site
 * @param {Array<string>} [config.startUrls] - List of initial seed URLs to crawl
 * @param {Array<string>} [config.allowedDomains] - Allowed domains for link discovery
 * @param {Array<string>} [config.excludePatterns] - Exclude patterns (maps to excludeUrls)
 * @param {number} [config.maxDepth=2] - Maximum crawl depth
 * @param {Object} dbCollection - MongoDB collection instance to store documents
 * @param {string} crawlRunId - Unique identifier for this global crawl run
 * 
 * @returns {Promise<Object>} Statistics summary for this source crawl run
 */
export async function crawlSource(config, dbCollection, crawlRunId) {
    const sourceName = config.name || config.source || 'Unknown Source';
    logger.info(`=== Starting Crawl for Source: ${sourceName} (Run ID: ${crawlRunId}) ===`);

    // Normalize config properties to ensure consistency
    const sourceConfig = {
        ...config,
        allowedDomains: config.allowedDomains || [],
        excludeUrls: config.excludePatterns || config.excludeUrls || [],
        maxDepth: config.maxDepth ?? 2
    };

    // STEP 1: Initialize Queue and Visited Tracking Set
    const queue = new Queue();
    const visitedUrls = new Set();

    // Stats counter for final summary
    const stats = {
        totalProcessed: 0,
        inserted: 0,
        updated: 0,
        unchanged: 0,
        failed: 0
    };

    // STEP 2: Enqueue Starting Seed URLs
    const seedUrls = sourceConfig.startUrls || (sourceConfig.baseUrl ? [sourceConfig.baseUrl] : []);
    
    if (seedUrls.length === 0) {
        logger.warning(`No starting URLs found for source: ${sourceName}. Skipping crawl.`);
        return stats;
    }

    for (const startUrl of seedUrls) {
        queue.enqueue({
            url: startUrl,
            depth: 0,
            discoveredFrom: null
        });
    }

    logger.info(`Initialized queue with ${seedUrls.length} seed URL(s) for ${sourceName}`);

    // STEP 3: Sequential Crawl Loop
    // Continue processing while there are URLs remaining in the queue
    while (!queue.isEmpty()) {
        const currentItem = queue.dequeue();
        const { url, depth, discoveredFrom } = currentItem;

        // Skip if this URL was already visited in this run
        if (visitedUrls.has(url)) {
            continue;
        }

        // Mark URL as visited immediately
        visitedUrls.add(url);
        stats.totalProcessed++;

        logger.info(`[${stats.totalProcessed}] Crawling (Depth ${depth}): ${url}`);

        try {
            // STEP 3a: Crawl page using Crawl4AI
            const pageResult = await fetchPageWithCrawl4AI(url);

            // Prepare standardized page document object
            const pageData = {
                title: pageResult.title || 'Untitled',
                url: url,
                source: sourceName,
                markdown: pageResult.markdown || ''
            };

            // STEP 3b: Save or update document in MongoDB
            const saveResult = await saveDocument(pageData, dbCollection, crawlRunId);

            if (saveResult.status === 'inserted') stats.inserted++;
            else if (saveResult.status === 'updated') stats.updated++;
            else if (saveResult.status === 'unchanged') stats.unchanged++;
            else stats.failed++;

            // STEP 3c: Discover new links from page content
            const discoveredItems = discoverLinks(
                pageResult.links || [],
                depth,
                sourceConfig,
                visitedUrls,
                url
            );

            // STEP 3d: Enqueue discovered links
            for (const newItem of discoveredItems) {
                if (!visitedUrls.has(newItem.url)) {
                    queue.enqueue(newItem);
                }
            }

        } catch (pageError) {
            // Handle individual page failure gracefully so crawler continues to next page
            stats.failed++;
            logger.error(`Error processing page ${url}: ${pageError.message}. Continuing crawl...`);
        }
    }

    logger.success(`=== Completed Crawl for Source: ${sourceName} ===`, stats);
    return stats;
}

export default crawlSource;
