/**
 * discoverLinks.js
 * 
 * Purpose:
 * Filters and prepares new URLs discovered on a web page before they are added to the crawl queue.
 * 
 * Responsibilities:
 * 1. Check if maximum crawl depth has been reached.
 * 2. Clean and normalize discovered links (e.g. remove URL fragments `#`).
 * 3. Filter out duplicate links within the current page batch.
 * 4. Filter out URLs already present in the visited URLs set.
 * 5. Ensure links belong to allowed domains defined in config.
 * 6. Remove excluded URLs or file patterns (e.g. PDFs, images, anchor tags).
 * 7. Return formatted queue items `{ url, depth, discoveredFrom }`.
 */

import { logger } from './logger.js';

/**
 * Normalizes a URL string by trimming whitespace, stripping fragment anchors, and removing trailing slashes.
 * 
 * @param {string} rawUrl - The unformatted URL string
 * @returns {string|null} Normalized URL or null if invalid
 */
function normalizeUrl(rawUrl) {
    if (!rawUrl || typeof rawUrl !== 'string') {
        return null;
    }

    try {
        // Parse raw string using standard URL API to handle absolute/relative formats
        const parsedUrl = new URL(rawUrl);

        // Remove hash fragment (e.g., https://example.gov.in/page#section -> https://example.gov.in/page)
        parsedUrl.hash = '';

        let cleanedUrl = parsedUrl.toString();

        // Remove trailing slash if path is longer than '/'
        if (cleanedUrl.endsWith('/') && parsedUrl.pathname !== '/') {
            cleanedUrl = cleanedUrl.slice(0, -1);
        }

        return cleanedUrl;
    } catch {
        // Return null if URL constructor fails (invalid URL format)
        return null;
    }
}

/**
 * Checks if a given hostname matches any domain listed in allowedDomains.
 * 
 * @param {string} targetHostname - Hostname to test (e.g. "sub.startupindia.gov.in")
 * @param {Array<string>} allowedDomains - List of allowed hostnames/domains from config
 * @returns {boolean} True if hostname is permitted
 */
function isDomainAllowed(targetHostname, allowedDomains = []) {
    // If no domain restrictions are specified in config, permit all
    if (!allowedDomains || allowedDomains.length === 0) {
        return true;
    }

    const lowerHostname = targetHostname.toLowerCase();

    // Return true if hostname matches or ends with any allowed domain
    return allowedDomains.some(domain => {
        const lowerDomain = domain.toLowerCase();
        return lowerHostname === lowerDomain || lowerHostname.endsWith('.' + lowerDomain);
    });
}

/**
 * Discovers, filters, and formats new links for the crawl queue.
 * 
 * @param {Array<string|Object>} links - Raw links returned by Crawl4AI (strings or objects with href property)
 * @param {number} currentDepth - Depth of the current page being processed
 * @param {Object} config - Configuration object for the current target site
 * @param {Array<string>|string[]} config.allowedDomains - Allowed domain hostnames
 * @param {Array<string>|string[]} [config.excludeUrls] - Strings/patterns to exclude
 * @param {number} [config.maxDepth=2] - Maximum crawl depth
 * @param {Set<string>|Array<string>} visitedUrls - Collection of previously visited URLs
 * @param {string} [currentUrl=""] - The URL of the page where these links were discovered
 * 
 * @returns {Array<Object>} List of valid queue items: [{ url, depth, discoveredFrom }]
 */
export function discoverLinks(links = [], currentDepth = 0, config = {}, visitedUrls = new Set(), currentUrl = "") {
    const nextDepth = currentDepth + 1;
    const maxDepth = config.maxDepth ?? 2;

    // STEP 1: Check depth limit
    // If next depth exceeds maxDepth, stop discovering links from this page
    if (nextDepth > maxDepth) {
        logger.info(`Reached maximum crawl depth (${maxDepth}). Skipping link discovery for ${currentUrl}`);
        return [];
    }

    const allowedDomains = config.allowedDomains || [];
    const includePatterns = config.includePatterns || [];
    const excludePatterns = config.excludePatterns || config.excludeUrls || [];
    
    // Track unique links added in this specific batch to avoid duplicates
    const batchSeenUrls = new Set();
    const queueItems = [];

    // Ensure links input is an array
    const rawLinkList = Array.isArray(links) ? links : [];

    // STEP 2: Process each raw link returned by Crawl4AI
    for (const rawLink of rawLinkList) {
        // Extract string URL depending on whether Crawl4AI returned strings or objects ({ href: "..." })
        const linkString = (typeof rawLink === 'object' && rawLink !== null) ? (rawLink.href || rawLink.url) : rawLink;

        // Normalize URL to standard format
        const targetUrl = normalizeUrl(linkString);

        // Skip invalid URL strings
        if (!targetUrl) {
            continue;
        }

        // Keep only HTTP and HTTPS protocols (ignore mailto:, tel:, javascript:, etc.)
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            continue;
        }

        // STEP 3: Filter out duplicates in current batch
        if (batchSeenUrls.has(targetUrl)) {
            continue;
        }

        // STEP 4: Filter out already visited URLs across the entire crawl run
        const isVisited = (visitedUrls instanceof Set) ? visitedUrls.has(targetUrl) : visitedUrls.includes(targetUrl);
        if (isVisited) {
            continue;
        }

        // Parse hostname for domain check
        let parsedUrlObj;
        try {
            parsedUrlObj = new URL(targetUrl);
        } catch {
            continue;
        }

        // STEP 5: Check allowed domains constraint
        if (!isDomainAllowed(parsedUrlObj.hostname, allowedDomains)) {
            continue;
        }

        // STEP 6a: Check excluded URL patterns (static assets, UI forms, login, dashboard, etc.)
        const DEFAULT_BLOCKED_EXTENSIONS = ['.pdf', '.zip', '.rar', '.exe', '.png', '.jpg', '.jpeg', '.mp4', '.xlsx', '.docx'];
        const pathnameLower = parsedUrlObj.pathname.toLowerCase();
        const isStaticAsset = DEFAULT_BLOCKED_EXTENSIONS.some(ext => pathnameLower.endsWith(ext));
        if (isStaticAsset) {
            continue;
        }

        const isExcluded = excludePatterns.some(pattern => {
            const lowerTarget = targetUrl.toLowerCase();
            const lowerPattern = pattern.toLowerCase();
            return lowerTarget.includes(lowerPattern);
        });

        if (isExcluded) {
            continue;
        }

        // STEP 6b: Check includePatterns constraint (if configured)
        // If includePatterns is provided, link MUST match at least one include pattern
        if (includePatterns.length > 0) {
            const matchesIncludePattern = includePatterns.some(pattern => {
                const lowerTarget = targetUrl.toLowerCase();
                const lowerPattern = pattern.toLowerCase();
                return lowerTarget.includes(lowerPattern);
            });

            if (!matchesIncludePattern) {
                continue;
            }
        }

        // Mark as seen in this batch
        batchSeenUrls.add(targetUrl);

        // STEP 7: Create and push queue item
        queueItems.push({
            url: targetUrl,
            depth: nextDepth,
            discoveredFrom: currentUrl || null
        });
    }

    logger.info(`Discovered ${queueItems.length} new valid link(s) from ${currentUrl}`);
    return queueItems;
}

export default discoverLinks;
