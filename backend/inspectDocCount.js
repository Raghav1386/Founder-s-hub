import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './src/configs/db.js';
import Document from './src/models/Document.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

async function inspectDocCount() {
    await connectDB();

    const totalCount = await Document.countDocuments();
    console.log(`\n==================================================`);
    console.log(`📊 TOTAL DOCUMENTS IN MONGODB: ${totalCount}`);
    console.log(`==================================================`);

    const breakdown = await Document.aggregate([
        {
            $group: {
                _id: "$source",
                count: { $sum: 1 },
                opportunityType: { $first: "$opportunityType" },
                provider: { $first: "$provider" }
            }
        },
        { $sort: { count: -1 } }
    ]);

    console.table(breakdown.map(b => ({
        Source: b._id || 'Unknown',
        OpportunityType: b.opportunityType || 'scheme',
        Provider: b.provider || 'N/A',
        DocumentCount: b.count
    })));

    process.exit(0);
}

inspectDocCount();
