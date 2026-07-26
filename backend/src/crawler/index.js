/**
 * index.js
 * 
 * Purpose:
 * Simple, clean entry point for the FounderPilot government web crawler.
 * 
 * Responsibilities:
 * 1. Imports crawlAll from crawlAll.js.
 * 2. Invokes crawlAll() to start the crawling pipeline.
 * 3. Handles any uncaught top-level error cleanly.
 */

import { crawlAll } from './crawlAll.js';

// Execute the master crawling workflow
crawlAll().catch((error) => {
    console.error('Fatal uncaught error during crawler execution:', error);
    process.exit(1);
});
