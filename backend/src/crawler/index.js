/**
 * index.js
 * 
 * Purpose:
 * Simple, clean entry point for the FounderPilot government web crawler.
 * 
 * Responsibilities:
 * 1. Load environment variables from backend .env file.
 * 2. Imports crawlAll from crawlAll.js.
 * 3. Invokes crawlAll() to start the crawling pipeline.
 * 4. Handles any uncaught top-level error cleanly.
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Ensure .env is loaded from backend root directory regardless of current working directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

import { crawlAll } from './crawlAll.js';

// Execute the master crawling workflow
crawlAll().catch((error) => {
    console.error('Fatal uncaught error during crawler execution:', error);
    process.exit(1);
});
