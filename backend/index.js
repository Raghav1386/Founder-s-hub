/**
 * index.js (src/index.js)
 * 
 * Purpose:
 * Main entry point for the FounderPilot Express.js backend server.
 * 
 * Step 1: Load Environment Variables
 * Step 2: Connect to MongoDB via connectDB()
 * Step 3: Create Express Application instance
 * Step 4: Configure Global Middlewares (JSON parser, CORS, Morgan logger)
 * Step 5: Setup Health Check Routes
 * Step 6: Start HTTP Server on specified PORT
 */

// Step 1: Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectDB } from './src/configs/db.js';

// Optional request logger middleware
let morgan;
try {
    const morganModule = await import('morgan');
    morgan = morganModule.default;
} catch {
    // Optional morgan logger fallback if package is absent
    morgan = null;
}

// Step 2: Initialize MongoDB Connection
await connectDB();

// Step 3: Create Express Application
const app = express();

// Step 4: Configure Middlewares
// Enable Cross-Origin Resource Sharing for frontend access
app.use(cors());

// Parse incoming HTTP request JSON payloads
app.use(express.json());

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Enable morgan HTTP request logger middleware if available
if (morgan) {
    app.use(morgan('dev'));
}

// Step 5: Health Check Routes
/**
 * GET /
 * Main root health check endpoint
 */
app.get('/', (req, res) => {
    return res.status(200).json({
        message: 'FounderPilot API Running'
    });
});

/**
 * GET /health
 * Detailed server health check endpoint
 */
app.get('/health', (req, res) => {
    return res.status(200).json({
        status: 'ok',
        message: 'FounderPilot API Running',
        timestamp: new Date().toISOString()
    });
});

// Step 6: Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`[SUCCESS] FounderPilot API server running on port ${PORT}`);
    console.log(`[INFO] Health check available at: http://localhost:${PORT}/`);
});

export default app;
