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
    try {
        // Read MongoDB connection string from environment variables
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/founderpilot';

        // Connect to MongoDB using Mongoose
        const connection = await mongoose.connect(mongoUri);

        console.log(`[SUCCESS] MongoDB connected successfully: ${connection.connection.host}`);
        return connection;
    } catch (error) {
        // Log the failure details and terminate process immediately
        console.error(`[ERROR] Failed to connect to MongoDB: ${error.message}`);
        
        // Exit process with failure code (1) to prevent app from running without a DB connection
        process.exit(1);
    }
}

export default connectDB;
