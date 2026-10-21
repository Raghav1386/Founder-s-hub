import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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

// Local storage caching helpers for 0ms instantaneous history restoration
const getHistoryCacheKey = (uid) => `fh_history_${uid}`;

const loadCachedHistory = (uid) => {
  if (!uid) return [];
  try {
    const raw = localStorage.getItem(getHistoryCacheKey(uid));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const setCachedHistory = (uid, history) => {
  if (!uid || !Array.isArray(history)) return;
  try {
    localStorage.setItem(getHistoryCacheKey(uid), JSON.stringify(history));
  } catch (e) {
    console.warn('⚠️ LocalStorage history cache note:', e);
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [mongoUser, setMongoUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedHistory, setSavedHistory] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  // In-flight promise ref to deduplicate simultaneous duplicate history requests
  const inFlightHistoryRef = useRef(null);

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

  // Fetch saved founder evaluation history with deduplication and caching
  const fetchUserHistory = async (targetUser = null) => {
    const activeUser = targetUser || auth.currentUser;
    if (!activeUser) {
      setSavedHistory([]);
      setIsHistoryLoading(false);
      return [];
    }

    // Reuse existing in-flight request if one is already running
    if (inFlightHistoryRef.current) {
      return inFlightHistoryRef.current;
    }

    setIsHistoryLoading(true);

    inFlightHistoryRef.current = (async () => {
      try {
        const token = await activeUser.getIdToken();
        const response = await fetch(getApiUrl('/api/auth/history'), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const json = await response.json();
          const historyData = json.data || [];
          setSavedHistory(historyData);
          setCachedHistory(activeUser.uid, historyData);
          return historyData;
        }
      } catch (err) {
        console.warn('⚠️ Failed to fetch saved user history:', err.message);
      } finally {
        setIsHistoryLoading(false);
        inFlightHistoryRef.current = null;
      }
      return [];
    })();

    return inFlightHistoryRef.current;
  };

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Instant 0ms cache hydration so Dashboard renders past analyses immediately
        const cached = loadCachedHistory(currentUser.uid);
        if (cached && cached.length > 0) {
          setSavedHistory(cached);
          setIsHistoryLoading(false);
        } else {
          setIsHistoryLoading(true);
        }

        // Run sync and history revalidation concurrently in parallel
        await Promise.allSettled([
          syncWithBackend(currentUser),
          fetchUserHistory(currentUser)
        ]);
      } else {
        setUser(null);
        setMongoUser(null);
        setIdToken(null);
        setSavedHistory([]);
        setIsHistoryLoading(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 1-Click Google Sign In
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      // Instant cache hydration if returning user
      const cached = loadCachedHistory(result.user.uid);
      if (cached && cached.length > 0) {
        setSavedHistory(cached);
      }
      // Run sync and history in parallel
      await Promise.allSettled([
        syncWithBackend(result.user),
        fetchUserHistory(result.user)
      ]);
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
      setUser(result.user);
      await Promise.allSettled([
        syncWithBackend(result.user, { name, startupName }),
        fetchUserHistory(result.user)
      ]);
      return result.user;
    } catch (error) {
      throw error;
    }
  };

  // Email Sign In
  const loginWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      // Instant cache hydration if returning user
      const cached = loadCachedHistory(result.user.uid);
      if (cached && cached.length > 0) {
        setSavedHistory(cached);
      }
      // Run sync and history in parallel
      await Promise.allSettled([
        syncWithBackend(result.user),
        fetchUserHistory(result.user)
      ]);
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
    setIsHistoryLoading(false);
  };

  const value = {
    user,
    mongoUser,
    idToken,
    loading,
    savedHistory,
    isHistoryLoading,
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
