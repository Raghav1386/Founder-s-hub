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
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/founderpilot';
    const dbName = process.env.MONGODB_DB_NAME || 'founderpilot';

    try {
        const connection = await mongoose.connect(mongoUri, {
            dbName,
            serverSelectionTimeoutMS: 15000,
            connectTimeoutMS: 15000
        });
        console.log(`[SUCCESS] MongoDB connected successfully to database "${connection.connection.name}" on host ${connection.connection.host}`);
        return connection;
    } catch (error) {
        console.error(`[ERROR] Primary MongoDB connection failed: ${error.message}`);
        console.error(`👉 Verify MONGODB_URI environment variable and MongoDB Atlas Network Access (0.0.0.0/0).`);
        
        // Attempt local 127.0.0.1 fallback only if no remote MONGODB_URI is specified
        if (!process.env.MONGODB_URI) {
            try {
                const localUri = 'mongodb://127.0.0.1:27017/founderpilot';
                const connection = await mongoose.connect(localUri, { dbName, serverSelectionTimeoutMS: 5000 });
                console.log(`[SUCCESS] MongoDB connected to local database "${connection.connection.name}"`);
                return connection;
            } catch (localErr) {
                console.error(`[ERROR] Failed to connect to local MongoDB fallback: ${localErr.message}`);
                process.exit(1);
            }
        } else {
            process.exit(1);
        }
    }
}

export default connectDB;
