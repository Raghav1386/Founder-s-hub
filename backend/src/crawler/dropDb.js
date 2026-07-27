import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

// Ensure .env is loaded from backend root directory regardless of current working directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

async function dropDocumentsCollection() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error('❌ MONGODB_URI is missing in .env!');
        process.exit(1);
    }

    const client = new MongoClient(mongoUri);

    try {
        await client.connect();
        const db = client.db(process.env.MONGODB_DB_NAME || 'founderpilot');
        const collectionName = process.env.MONGODB_COLLECTION || 'documents';

        console.log(`Connecting to MongoDB Atlas...`);
        const collections = await db.listCollections({ name: collectionName }).toArray();

        if (collections.length > 0) {
            await db.collection(collectionName).drop();
            console.log(`\n==============================================`);
            console.log(`🗑️ Successfully dropped collection "${collectionName}" from database "${db.databaseName}".`);
            console.log(`==============================================\n`);
        } else {
            console.log(`Collection "${collectionName}" does not exist or is already empty.`);
        }
    } catch (error) {
        console.error('❌ Error dropping collection:', error.message);
    } finally {
        await client.close();
    }
}

dropDocumentsCollection();
