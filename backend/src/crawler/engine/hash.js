/**
 * hash.js
 * 
 * Purpose:
 * Provides a helper function to generate a cryptographic SHA-256 hash
 * from page markdown content.
 * 
 * Why SHA-256?
 * SHA-256 converts any input text of any length into a fixed 64-character 
 * hexadecimal string. By comparing hashes between crawl runs, we can instantly
 * tell if a web page's content has changed without comparing massive text strings.
 */

import { createHash } from 'node:crypto';

/**
 * Generates a SHA-256 hash from the provided markdown content string.
 * 
 * @param {string} markdown - The raw markdown text extracted from a crawled web page.
 * @returns {string} The 64-character hexadecimal SHA-256 hash representation.
 */
export function generateContentHash(markdown) {
    // Fallback to empty string if markdown content is null, undefined, or not a string
    const safeContent = (typeof markdown === 'string') ? markdown : '';

    // Create a new SHA-256 hash instance using Node.js crypto module
    const hashGenerator = createHash('sha256');

    // Feed the content into the hash generator using UTF-8 encoding
    hashGenerator.update(safeContent, 'utf8');

    // Calculate and return the final hash string in hexadecimal format
    const hexHash = hashGenerator.digest('hex');

    return hexHash;
}

export default generateContentHash;
