/**
 * firebaseAuthMiddleware.js (src/middlewares/firebaseAuthMiddleware.js)
 * 
 * Purpose:
 * Middleware to verify Firebase ID tokens on API routes and sync user data into MongoDB.
 */

import { firebaseAuth } from '../configs/firebaseAdmin.js';
import User from '../models/User.js';

/**
 * Middleware: Requires a valid Firebase ID Token in Authorization header
 */
export async function verifyFirebaseToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Missing or malformed Bearer token.'
      });
    }

    const idToken = authHeader.split('Bearer ')[1]?.trim();
    if (!idToken) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Token payload is empty.'
      });
    }

    if (!firebaseAuth) {
      throw new Error('Firebase Auth instance is not initialized on the server.');
    }

    // Verify token with Firebase Auth
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    
    // Find or create synchronized MongoDB user record
    let mongoUser = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!mongoUser) {
      mongoUser = await User.create({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email || `user_${decodedToken.uid.slice(0, 8)}@founder.hub`,
        name: decodedToken.name || 'Startup Founder',
        avatar: decodedToken.picture || ''
      });
    }

    req.user = mongoUser;
    req.firebaseDecoded = decodedToken;
    next();

  } catch (error) {
    console.error('❌ [AUTH MIDDLEWARE] Firebase token verification failed:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or expired Firebase ID token.',
      details: error.message
    });
  }
}

/**
 * Middleware: Optional token check. Attaches req.user if token is present, but permits guest requests.
 */
export async function optionalFirebaseToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const idToken = authHeader.split('Bearer ')[1]?.trim();
    if (!idToken || !firebaseAuth) {
      req.user = null;
      return next();
    }

    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    let mongoUser = await User.findOne({ firebaseUid: decodedToken.uid });
    
    if (!mongoUser) {
      mongoUser = await User.create({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email || `user_${decodedToken.uid.slice(0, 8)}@founder.hub`,
        name: decodedToken.name || 'Startup Founder',
        avatar: decodedToken.picture || ''
      });
    }

    req.user = mongoUser;
    req.firebaseDecoded = decodedToken;
    next();

  } catch (error) {
    // If token verification fails on optional auth, continue as guest
    req.user = null;
    next();
  }
}

export default {
  verifyFirebaseToken,
  optionalFirebaseToken
};
