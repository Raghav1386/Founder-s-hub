import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

// Ensure .env is loaded from backend root directory regardless of current working directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

async function checkAtlasData() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error('❌ MONGODB_URI is missing in .env!');
        return;
    }

    const client = new MongoClient(mongoUri);
    try {
        await client.connect();
        const db = client.db(process.env.MONGODB_DB_NAME || 'founderpilot');
        const collectionName = process.env.MONGODB_COLLECTION || 'documents';
        const coll = db.collection(collectionName);

        const totalCount = await coll.countDocuments();
        console.log(`\n==============================================`);
        console.log(`✅ TOTAL DOCUMENTS IN MONGO DB ATLAS: ${totalCount}`);
        console.log(`==============================================`);

        if (totalCount === 0) {
            console.log(`Collection "${collectionName}" is empty.`);
            return;
        }

        const stats = await coll.aggregate([
            { $group: { _id: "$source", documentCount: { $sum: 1 } } },
            { $sort: { documentCount: -1 } }
        ]).toArray();

        console.table(stats.map(item => ({
            Source: item._id,
            TotalDocuments: item.documentCount
        })));

        // Print a sample document
        const sampleDoc = await coll.findOne({});
        if (sampleDoc) {
            console.log('\n📄 Sample Document Structure in Atlas:');
            console.dir({
                _id: sampleDoc._id,
                title: sampleDoc.title,
                url: sampleDoc.url,
                source: sampleDoc.source,
                processingStatus: sampleDoc.processingStatus,
                contentHash: sampleDoc.contentHash,
                markdownLength: sampleDoc.markdown ? sampleDoc.markdown.length : 0,
                lastCrawledAt: sampleDoc.lastCrawledAt
            }, { depth: null });
        }

    } catch (err) {
        console.error('Error connecting to Atlas:', err.message);
    } finally {
        await client.close();
    }
}

checkAtlasData();
