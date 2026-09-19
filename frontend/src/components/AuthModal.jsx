import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Mail,
  Lock,
  User,
  Building,
  ArrowRight,
  Loader2,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const { user, loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [startupName, setStartupName] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-close modal when user becomes authenticated
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
      } else {
        if (!name.trim()) {
          throw new Error('Please enter your full name.');
        }
        await registerWithEmail(email, password, name, startupName);
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
    <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      
      {/* Modal Card */}
      <div className="bg-slate-900 border border-slate-800/90 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden text-slate-200 relative animate-scaleUp">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-all cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-2.5 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <img src="/favicon.jpg" alt="Founder's Hub Logo" className="w-5 h-5 rounded-md object-cover border border-emerald-500/40" />
            <span>Founder Authorization</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {activeTab === 'login' ? 'Welcome Back, Founder' : 'Create Founder Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to save your startup analysis and access grounded scheme Q&A.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Error Alert */}
          {error && (
            <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-slate-950 hover:bg-slate-800 text-slate-100 font-semibold py-3 px-4 rounded-xl border border-slate-700/80 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg group hover:border-slate-600 text-xs sm:text-sm"
          >
            {/* Google Multicolor SVG Icon */}
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
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
              Or With Email
            </span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Tabs Navigation */}
          <div className="flex border-b border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setError(null); }}
              className={`flex-1 py-2.5 text-center border-b-2 transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'border-indigo-500 text-indigo-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setError(null); }}
              className={`flex-1 py-2.5 text-center border-b-2 transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'border-indigo-500 text-indigo-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {activeTab === 'register' && (
              <>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 block">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Raghav Anand"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-slate-100 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 block">Startup Name (Optional)</label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      value={startupName}
                      onChange={(e) => setStartupName(e.target.value)}
                      placeholder="NexusAI Labs"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-slate-100 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400 block">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="founder@startup.com"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-slate-100 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400 block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-slate-100 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg text-xs sm:text-sm mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>{activeTab === 'login' ? 'Sign In to Hub' : 'Register Founder Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
