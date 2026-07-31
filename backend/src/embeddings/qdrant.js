import { QdrantClient } from '@qdrant/js-client-rest';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * qdrant.js (src/embeddings/qdrant.js)
 * 
 * Purpose:
 * Connects to Qdrant Vector Database and manages collection creation and vector point upserts.
 */

let rawUrl = process.env.QDRANT_URL || process.env.QDRANT_HOST;
let qdrantApiKey = process.env.QDRANT_API_KEY || process.env.QDRANT;

// If user accidentally put JWT token in QDRANT_URL
if (rawUrl && rawUrl.startsWith('eyJ')) {
    if (!qdrantApiKey) {
        qdrantApiKey = rawUrl;
    }
    rawUrl = null;
}

let qdrantUrl = rawUrl || 'http://localhost:6333';

// Ensure Qdrant URL includes port 6333 if port is omitted
if (qdrantUrl.startsWith('https://') && !qdrantUrl.includes(':', 8)) {
    qdrantUrl = `${qdrantUrl}:6333`;
}

if (!qdrantUrl.startsWith('http://') && !qdrantUrl.startsWith('https://')) {
    console.error('\n❌ [Invalid QDRANT_URL in backend/.env]');
    console.error(`   The value in QDRANT_URL is not a valid URL: "${qdrantUrl.substring(0, 35)}..."`);
    console.error('   👉 Please set QDRANT_URL to your Qdrant cluster endpoint URL (starting with https:// or http://).');
    console.error('   Example for Qdrant Cloud: QDRANT_URL=https://<your-cluster-id>.<region>.cloud.qdrant.io:6333');
    console.error('   Example for Local Docker: QDRANT_URL=http://localhost:6333\n');
    process.exit(1);
}

if ((qdrantUrl === 'http://localhost:6333' || qdrantUrl === 'http://127.0.0.1:6333') && qdrantApiKey && !process.env.QDRANT_URL) {
    console.warn('\n⚠️ [Qdrant Cloud URL Missing]');
    console.warn('   You have provided a Qdrant API Key, but QDRANT_URL is missing in your backend/.env file.');
    console.warn('   Please copy your Cluster Endpoint URL from https://cloud.qdrant.io and set:');
    console.warn('   QDRANT_URL=https://your-cluster-id.us-east-4-0.aws.cloud.qdrant.io:6333\n');
}

console.log(`📡 Initializing Qdrant Client (URL: ${qdrantUrl})...`);

export const qdrantClient = new QdrantClient({
    url: qdrantUrl,
    apiKey: qdrantApiKey || undefined,
    checkCompatibility: false
});

/**
 * Ensures that the specified collection exists in Qdrant with Cosine similarity.
 * 
 * @param {string} collectionName - Name of the collection in Qdrant.
 * @param {number} vectorSize - Dimension size of the vector embeddings (e.g. 1024).
 */
export async function ensureCollectionExists(collectionName = 'founderpilot_schemes', vectorSize = 1024) {
    try {
        const { collections } = await qdrantClient.getCollections();
        const exists = collections.some((col) => col.name === collectionName);

        if (!exists) {
            console.log(`📦 Collection "${collectionName}" not found in Qdrant. Creating collection (Size: ${vectorSize}, Distance: Cosine)...`);
            await qdrantClient.createCollection(collectionName, {
                vectors: {
                    size: vectorSize,
                    distance: 'Cosine',
                },
            });
            console.log(`✅ Qdrant collection "${collectionName}" created successfully.`);
        } else {
            console.log(`✅ Qdrant collection "${collectionName}" exists and is ready.`);
        }
    } catch (error) {
        console.error(`❌ Error connecting to Qdrant at "${qdrantUrl}":`, error.message);
        if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed')) {
            console.error('\n👉 Setup Tip:');
            console.error('   1. If using Qdrant Cloud, add QDRANT_URL=https://your-cluster-url.qdrant.tech to your .env file.');
            console.error('   2. If running locally, start Qdrant via Docker: "docker run -p 6333:6333 qdrant/qdrant"\n');
        }
        throw error;
    }
}

/**
 * Prepares and upserts vector embeddings with metadata payload into Qdrant.
 * 
 * Payload structure per chunk:
 * {
 *   documentId: string,
 *   title: string,
 *   source: string,
 *   url: string,
 *   chunkIndex: number,
 *   text: string
 * }
 * 
 * @param {string} collectionName - Target Qdrant collection name.
 * @param {Array<Object>} chunksData - Array of chunk items ({ text, embedding, chunkIndex, doc })
 */
export async function storeChunksInQdrant(collectionName, chunksData) {
    if (!chunksData || chunksData.length === 0) {
        return;
    }

    // Format points array according to Qdrant REST API specification
    const points = chunksData.map((item) => {
        const id = crypto.randomUUID();

        return {
            id: id,
            vector: item.embedding,
            payload: {
                documentId: item.doc._id ? item.doc._id.toString() : item.doc.id,
                title: item.doc.title || 'Untitled',
                source: item.doc.source || 'Unknown',
                url: item.doc.url || '',
                chunkIndex: item.chunkIndex,
                text: item.text
            }
        };
    });

    // Upsert points into Qdrant in batches of 100 points
    const BATCH_SIZE = 100;
    for (let i = 0; i < points.length; i += BATCH_SIZE) {
        const batchPoints = points.slice(i, i + BATCH_SIZE);
        await qdrantClient.upsert(collectionName, {
            wait: true,
            points: batchPoints
        });
    }

    console.log(`💾 Stored ${points.length} chunk vectors in Qdrant collection "${collectionName}".`);
}

export default {
    qdrantClient,
    ensureCollectionExists,
    storeChunksInQdrant
};
