/**
 * db.js
 * 
 * Purpose:
 * Configures and establishes the connection to the MongoDB database using Mongoose.
 * 
 * Responsibilities:
 * 1. Read the MongoDB connection URI from process.env.MONGODB_URI.
 * 2. Connect to MongoDB using Mongoose.
 * 3. Log a success message once connected.
 * 4. Log an error and terminate the process (process.exit(1)) if the initial connection fails.
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
        const connection = await mongoose.connect(mongoUri, { dbName, serverSelectionTimeoutMS: 5000 });
        console.log(`[SUCCESS] MongoDB connected successfully to database "${connection.connection.name}" on host ${connection.connection.host}`);
        return connection;
    } catch (error) {
        console.warn(`[WARN] Primary MongoDB connection failed (${error.message}). Attempting local fallback (127.0.0.1)...`);
        try {
            const localUri = 'mongodb://127.0.0.1:27017/founderpilot';
            const connection = await mongoose.connect(localUri, { dbName, serverSelectionTimeoutMS: 5000 });
            console.log(`[SUCCESS] MongoDB connected to local database "${connection.connection.name}"`);
            return connection;
        } catch (localErr) {
            console.error(`[ERROR] Failed to connect to MongoDB: ${error.message}`);
            console.error(`👉 Tip: If using MongoDB Atlas, make sure your IP is whitelisted in Atlas Network Access (Allow Access from Anywhere: 0.0.0.0/0).`);
            process.exit(1);
        }
    }
}

export default connectDB;
