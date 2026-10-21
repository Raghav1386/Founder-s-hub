import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Building,
  ArrowRight,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { trackEvent } from '../configs/analytics';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const { user, loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [startupName, setStartupName] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && isOpen) {
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      trackEvent('user_signed_in', { method: 'google' });
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (err) {
      console.error('Google Sign In Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign in popup was closed before completing authentication.');
      } else {
        setError(err.message || 'Failed to sign in with Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (activeTab === 'login') {
        await loginWithEmail(email, password);
        trackEvent('user_signed_in', { method: 'email' });
      } else {
        if (!name.trim()) {
          throw new Error('Please enter your full name.');
        }
        await registerWithEmail(email, password, name, startupName);
        trackEvent('user_registered', { method: 'email' });
      }
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (err) {
      console.error('Auth Error:', err);
      let msg = err.message || 'Authentication failed.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password credentials.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email address already exists. Redirecting to Sign In...';
        setError(msg);
        setTimeout(() => {
          setActiveTab('login');
          setError('Account already exists. Please enter your password to sign in.');
        }, 1200);
        return;
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters long.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/75 flex items-center justify-center p-4 animate-fadeIn">
      
      {/* Modal Card */}
      <div className="bg-[var(--color-surface-1)] border border-[var(--color-line)] w-full max-w-md rounded-[4px] overflow-hidden text-[var(--color-text)] relative animate-scaleUp">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[var(--color-muted)] hover:text-[var(--color-text)] bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-1)] rounded-[3px] transition-colors cursor-pointer z-10 border border-[var(--color-line)]"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-[var(--color-line)] bg-[var(--color-surface-2)]">
          <div className="flex items-center gap-2 text-[var(--color-signal)] text-xs font-mono uppercase tracking-wider mb-2">
            <img src="/favicon.jpg" alt="Logo" className="w-4 h-4 rounded-[2px] object-cover border border-[var(--color-line)]" />
            <span>// Founder Portal Telemetry</span>
          </div>
          <h2 className="text-xl font-bold text-[var(--color-text)] tracking-tight">
            {activeTab === 'login' ? 'Authenticate Account' : 'Initialize Founder Account'}
          </h2>
          <p className="text-xs text-[var(--color-muted)] font-mono mt-1">
            Access previous analyses, grounded scheme Q&amp;A, and eligibility dossiers.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          
          {/* Error Alert */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-[3px] text-red-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-1)] text-[var(--color-text)] font-mono text-xs uppercase tracking-wider py-2.5 px-4 rounded-[3px] border border-[var(--color-line)] hover:border-[var(--color-signal)] transition-colors flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-[var(--color-line)]" />
            <span className="text-[10px] font-mono text-[var(--color-muted)] uppercase tracking-wider">
              Or with email credentials
            </span>
            <div className="flex-1 h-px bg-[var(--color-line)]" />
          </div>

          {/* Tabs Navigation */}
          <div className="flex border-b border-[var(--color-line)] text-xs font-mono">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setError(null); }}
              className={`flex-1 py-2 text-center uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                activeTab === 'login'
                  ? 'border-[var(--color-signal)] text-[var(--color-signal)] font-semibold'
                  : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              [ Sign In ]
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setError(null); }}
              className={`flex-1 py-2 text-center uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                activeTab === 'register'
                  ? 'border-[var(--color-signal)] text-[var(--color-signal)] font-semibold'
                  : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              [ Create Account ]
            </button>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {activeTab === 'register' && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[var(--color-muted)] uppercase tracking-wider block">Full Name</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-3 text-[var(--color-muted)]" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Raghav Anand"
                      className="w-full h-10 bg-[var(--color-surface-2)] border border-[var(--color-line)] focus:border-[var(--color-signal)] text-[var(--color-text)] rounded-[3px] pl-9 pr-3 text-xs outline-none transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[var(--color-muted)] uppercase tracking-wider block">Startup Name (Optional)</label>
                  <div className="relative">
                    <Building className="w-3.5 h-3.5 absolute left-3 top-3 text-[var(--color-muted)]" />
                    <input
                      type="text"
                      value={startupName}
                      onChange={(e) => setStartupName(e.target.value)}
                      placeholder="NexusAI Labs"
                      className="w-full h-10 bg-[var(--color-surface-2)] border border-[var(--color-line)] focus:border-[var(--color-signal)] text-[var(--color-text)] rounded-[3px] pl-9 pr-3 text-xs outline-none transition-colors font-mono"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[var(--color-muted)] uppercase tracking-wider block">Email Address</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-[var(--color-muted)]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="founder@startup.com"
                  className="w-full h-10 bg-[var(--color-surface-2)] border border-[var(--color-line)] focus:border-[var(--color-signal)] text-[var(--color-text)] rounded-[3px] pl-9 pr-3 text-xs outline-none transition-colors font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[var(--color-muted)] uppercase tracking-wider block">Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-[var(--color-muted)]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 bg-[var(--color-surface-2)] border border-[var(--color-line)] focus:border-[var(--color-signal)] text-[var(--color-text)] rounded-[3px] pl-9 pr-3 text-xs outline-none transition-colors font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-signal)] hover:brightness-110 disabled:opacity-50 text-[#0E1119] font-mono text-xs uppercase tracking-wider font-semibold h-10 px-4 rounded-[3px] transition-colors flex items-center justify-center gap-2 cursor-pointer mt-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0E1119]" />
                  <span>Authenticating Telemetry...</span>
                </>
              ) : (
                <>
                  <span>{activeTab === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
