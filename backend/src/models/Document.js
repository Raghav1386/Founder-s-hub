/**
 * Document.js (models/Document.js)
 * 
 * Purpose:
 * Mongoose schema and model definition for web documents crawled for FounderPilot RAG platform.
 * 
 * Schema Fields:
 * - title: Web page title
 * - url: Web page URL (unique identifier)
 * - source: Government source name (e.g. "StartupIndia", "MSME")
 * - markdown: Extracted markdown text content of the page
 * - contentHash: SHA-256 hash of the markdown text to detect updates
 * - processingStatus: Status of embedding pipeline ("pending", "processing", "completed", "failed")
 * - documentStatus: Status of document ("active", "archived", "deleted")
 * - lastSeenInCrawl: Identifies the latest crawl run that visited this page
 * - embeddingVersion: Schema/embedding version number
 * - lastEmbeddedAt: Timestamp when vector embedding was last generated
 * - lastCrawledAt: Timestamp when page was last fetched by crawler
 * - timestamps: Automatically generates createdAt and updatedAt fields
 */

import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Document title is required'],
            trim: true
        },
        url: {
            type: String,
            required: [true, 'Document URL is required'],
            unique: true,
            trim: true,
            index: true
        },
        source: {
            type: String,
            required: [true, 'Document source is required'],
            trim: true
        },
        markdown: {
            type: String,
            default: ''
        },
        contentHash: {
            type: String,
            default: '',
            index: true
        },
        processingStatus: {
            type: String,
            enum: ['pending', 'pending_structure', 'pending_embedding', 'processing', 'completed', 'failed'],
            default: 'pending',
            index: true
        },
        structured: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        },
        documentStatus: {
            type: String,
            enum: ['active', 'archived', 'deleted'],
            default: 'active'
        },
        lastSeenInCrawl: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        },
        embeddingVersion: {
            type: Number,
            default: 1
        },
        lastEmbeddedAt: {
            type: Date,
            default: null
        },
        embeddedAt: {
            type: Date,
            default: null
        },
        lastCrawledAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        // Enable Mongoose timestamps to automatically create and update createdAt & updatedAt
        timestamps: true
    }
);

// Create the Mongoose model (or reuse if already registered)
export const Document = mongoose.models.Document || mongoose.model('Document', documentSchema);

export default Document;
