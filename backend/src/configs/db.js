/**
 * db.js
 * 
 * Purpose:
 * Configures and establishes the connection to the MongoDB database using Mongoose.
 */

import mongoose from 'mongoose';

/**
 * Connects to MongoDB using Mongoose.
 * 
 * @returns {Promise<typeof mongoose>} The Mongoose connection instance.
 */
export async function connectDB() {
    const mongoUri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB_NAME || 'founderpilot';

    if (!mongoUri) {
        console.error('❌ [CRITICAL CONFIG ERROR] MONGODB_URI environment variable is missing!');
        console.error('👉 Please add MONGODB_URI in Render Dashboard -> Environment tab.');
        // If local dev without env, fallback to local mongo
        if (process.env.NODE_ENV !== 'production') {
            try {
                const localUri = 'mongodb://127.0.0.1:27017/founderpilot';
                console.log('Attempting local 127.0.0.1 fallback for development...');
                const connection = await mongoose.connect(localUri, { dbName, serverSelectionTimeoutMS: 5000 });
                console.log(`[SUCCESS] MongoDB connected to local database "${connection.connection.name}"`);
                return connection;
            } catch (err) {
                console.error(`[ERROR] Failed to connect to local MongoDB: ${err.message}`);
                process.exit(1);
            }
        } else {
            process.exit(1);
        }
    }

    try {
        const connection = await mongoose.connect(mongoUri, {
            dbName,
            family: 4, // Force IPv4 resolution to prevent Node 20/22 cloud IPv6 DNS timeouts
            serverSelectionTimeoutMS: 15000,
            connectTimeoutMS: 15000
        });
        console.log(`[SUCCESS] MongoDB connected successfully to database "${connection.connection.name}" on host ${connection.connection.host}`);
        return connection;
    } catch (error) {
        console.error(`❌ [ERROR] Primary MongoDB Atlas connection failed: ${error.message}`);
        console.error(`👉 Verify MONGODB_URI value in Render Environment tab and check MongoDB Atlas Network Access (0.0.0.0/0).`);
        process.exit(1);
    }
}

export default connectDB;
