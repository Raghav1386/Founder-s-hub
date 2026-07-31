/**
 * queueForStructuring.js (src/pipeline/queueForStructuring.js)
 * 
 * Purpose:
 * Helper script to update existing MongoDB documents that haven't been structured yet
 * (where structured is null or missing, and processingStatus is "pending" or "failed")
 * to processingStatus = "pending_structure".
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
        // Only target documents that do NOT have structured data yet
        const filter = {
            $or: [
                { structured: null },
                { structured: { $exists: false } }
            ],
            processingStatus: { $ne: 'pending_embedding' }
        };

        const result = await Document.updateMany(
            filter,
            { $set: { processingStatus: 'pending_structure' } }
        );

        console.log(`✅ Queued ${result.modifiedCount} document(s) (unstructured) to processingStatus = "pending_structure".`);

        const alreadyStructured = await Document.countDocuments({ processingStatus: 'pending_embedding' });
        console.log(`ℹ️ Already structured documents preserved in DB: ${alreadyStructured}`);

    } catch (error) {
        console.error('❌ Error updating documents:', error.message);
    } finally {
        process.exit(0);
    }
}

queueDocuments();
