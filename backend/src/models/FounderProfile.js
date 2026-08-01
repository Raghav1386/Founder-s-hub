/**
 * FounderProfile.js
 * 
 * Purpose:
 * Mongoose schema and model definition for Founder Profile Analysis.
 * Stores raw onboarding answers, structured AI profile JSON, and concise searchText.
 */

import mongoose from 'mongoose';

const founderProfileSchema = new mongoose.Schema(
  {
    // Raw onboarding form answers
    onboarding: {
      startupName: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      incorporated: { type: String, required: true, trim: true },
      dpiit: { type: String, required: true, trim: true },
      stage: { type: String, required: true, trim: true },
      teamSize: { type: String, required: true, trim: true },
      supportNeeded: { type: [String], default: [] },
      fundingRequired: { type: String, default: '' },
      description: { type: String, required: true, trim: true }
    },

    // Structured AI-generated profile JSON
    founderProfile: {
      summary: { type: String, required: true },
      sector: { type: String, required: true },
      subSector: { type: String, required: true },
      businessModel: { type: String, required: true },
      technology: { type: [String], default: [] },
      targetCustomers: { type: String, required: true },
      keywords: { type: [String], default: [] },
      goals: { type: [String], default: [] },
      challenges: { type: [String], default: [] },
      startupStage: { type: String, required: true },
      fundingIntent: { type: String, required: true },
      confidenceScore: { type: Number, required: true }
    },

    // Natural language summary string for Qdrant semantic search
    searchText: {
      type: String,
      required: true,
      index: true
    }
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
    collection: 'founderProfiles' // Collection name in MongoDB
  }
);

export const FounderProfile =
  mongoose.models.FounderProfile || mongoose.model('FounderProfile', founderProfileSchema);

export default FounderProfile;
