/**
 * firebase.js (frontend/src/configs/firebase.js)
 * 
 * Purpose:
 * Initializes Firebase Web App SDK and exports Auth and GoogleAuthProvider instances.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoApiKeyForFoundersHub2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "founders-hub-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "founders-hub-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "founders-hub-app.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:demo1234567890"
};

// Initialize Firebase App singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export default app;
