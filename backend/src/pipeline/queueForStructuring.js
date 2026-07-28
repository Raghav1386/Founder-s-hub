/**
 * queueForStructuring.js (src/pipeline/queueForStructuring.js)
 * 
 * Purpose:
 * Helper script to update existing MongoDB documents with processingStatus = "pending" or "failed"
 * back to processingStatus = "pending_structure" so they can be re-processed by the structuring pipeline.
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../configs/db.js';
import Document from '../models/Document.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function queueDocuments() {
    console.log('🔄 Connecting to MongoDB...');
    await connectDB();

    try {
        const result = await Document.updateMany(
            { processingStatus: { $in: ['pending', 'failed'] } },
            { $set: { processingStatus: 'pending_structure' } }
        );

        console.log(`✅ Updated ${result.modifiedCount} document(s) (pending/failed) to processingStatus = "pending_structure".`);
    } catch (error) {
        console.error('❌ Error updating documents:', error.message);
    } finally {
        process.exit(0);
    }
}

queueDocuments();
