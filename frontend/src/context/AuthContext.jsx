import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../configs/firebase';
import { getApiUrl } from '../configs/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [mongoUser, setMongoUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedHistory, setSavedHistory] = useState([]);

  // Sync user profile data with backend MongoDB
  const syncWithBackend = async (firebaseUser, extraData = {}) => {
    try {
      const token = await firebaseUser.getIdToken();
      setIdToken(token);

      const response = await fetch(getApiUrl('/api/auth/sync'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: firebaseUser.displayName || extraData.name || 'Startup Founder',
          avatar: firebaseUser.photoURL || '',
          startupName: extraData.startupName || ''
        })
      });

      if (response.ok) {
        const json = await response.json();
        setMongoUser(json.data);
      }
    } catch (err) {
      console.warn('⚠️ Backend user sync note:', err.message);
    }
  };

  // Fetch saved founder evaluation history
  const fetchUserHistory = async () => {
    if (!auth.currentUser) return [];
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(getApiUrl('/api/auth/history'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const json = await response.json();
        setSavedHistory(json.data || []);
        return json.data || [];
      }
    } catch (err) {
      console.warn('⚠️ Failed to fetch saved user history:', err.message);
    }
    return [];
  };

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await syncWithBackend(currentUser);
        await fetchUserHistory();
      } else {
        setUser(null);
        setMongoUser(null);
        setIdToken(null);
        setSavedHistory([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 1-Click Google Sign In
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await syncWithBackend(result.user);
      await fetchUserHistory();
      return result.user;
    } catch (error) {
      throw error;
    }
  };

  // Email Registration
  const registerWithEmail = async (email, password, name, startupName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(result.user, { displayName: name });
      }
      await syncWithBackend(result.user, { name, startupName });
      await fetchUserHistory();
      return result.user;
    } catch (error) {
      throw error;
    }
  };

  // Email Sign In
  const loginWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await syncWithBackend(result.user);
      await fetchUserHistory();
      return result.user;
    } catch (error) {
      throw error;
    }
  };

  // Sign Out
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setMongoUser(null);
    setIdToken(null);
    setSavedHistory([]);
  };

  const value = {
    user,
    mongoUser,
    idToken,
    loading,
    savedHistory,
    loginWithGoogle,
    registerWithEmail,
    loginWithEmail,
    logout,
    fetchUserHistory,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
