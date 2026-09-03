/**
 * User.js (src/models/User.js)
 * 
 * Purpose:
 * Mongoose schema and model for authenticated founders & users synchronized with Firebase Authentication.
 */

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    name: {
      type: String,
      default: 'Startup Founder',
      trim: true
    },
    avatar: {
      type: String,
      default: ''
    },
    startupName: {
      type: String,
      default: '',
      trim: true
    },
    role: {
      type: String,
      enum: ['founder', 'admin'],
      default: 'founder'
    }
  },
  {
    timestamps: true,
    collection: 'users'
  }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
