/**
 * firebaseAdmin.js (src/configs/firebaseAdmin.js)
 * 
 * Purpose:
 * Initializes Firebase Admin SDK on Node.js ESM backend for verifying Firebase ID Tokens.
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

let firebaseAdminApp = null;
let firebaseAuth = null;

try {
  const existingApps = getApps();
  if (existingApps.length === 0) {
    const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;
    
    if (serviceAccountVar) {
      try {
        const serviceAccount = JSON.parse(serviceAccountVar);
        firebaseAdminApp = initializeApp({
          credential: cert(serviceAccount)
        });
        console.log('✅ Firebase Admin SDK initialized with Service Account.');
      } catch (e) {
        console.warn('⚠️ Note on FIREBASE_SERVICE_ACCOUNT:', e.message);
        firebaseAdminApp = initializeApp({
          projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'founder-s-co-pilot'
        });
      }
    } else {
      firebaseAdminApp = initializeApp({
        projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'founder-s-co-pilot'
      });
      console.log('✅ Firebase Admin SDK initialized (Project Mode).');
    }
  } else {
    firebaseAdminApp = existingApps[0];
  }

  firebaseAuth = getAuth(firebaseAdminApp);

} catch (err) {
  console.warn('⚠️ Firebase Admin SDK initialization error:', err.message);
}

export { firebaseAdminApp, firebaseAuth };
export default firebaseAuth;
