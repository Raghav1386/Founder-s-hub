import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Rocket,
  ArrowRight,
  Home,
  User,
  LogOut,
  History,
  ChevronDown,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ viewMode, onGoHome, onStartWizard, onOpenAuthModal, onOpenHistoryModal }) {
  const { user, mongoUser, logout, isAuthenticated, savedHistory } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = user?.displayName || mongoUser?.name || 'Startup Founder';
  const displayEmail = user?.email || mongoUser?.email || '';
  const avatarUrl = user?.photoURL || mongoUser?.avatar || '';

  return (
    <header className="border-b border-slate-800/80 bg-[#070a12]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <button
          type="button"
          onClick={onGoHome}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#070a12] rounded-[10px] flex items-center justify-center">
              <Rocket className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-tight leading-none flex items-center gap-2">
              <span>Founder's Hub</span>
              <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded">
                AI Platform
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Startup Ecosystem & Opportunity Engine
            </p>
          </div>
        </button>

        {/* Navigation & Auth Action Buttons */}
        <div className="flex items-center gap-3">
          
          {viewMode === 'wizard' ? (
            <button
              type="button"
              onClick={onGoHome}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-indigo-400" />
              <span>Back to Overview</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onStartWizard}
              className="px-4 py-2 rounded-xl text-xs font-extrabold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <span>Find Opportunities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Authenticated User Menu vs Guest Sign In Button */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 p-1.5 pr-3 rounded-xl transition-all cursor-pointer"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-lg object-cover shrink-0 border border-slate-700"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-bold text-slate-200 hidden sm:inline-block max-w-[120px] truncate">
                  {displayName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-slate-200 animate-fadeIn">
                  
                  <div className="px-3 py-2 border-b border-slate-800/80">
                    <p className="text-xs font-bold text-white truncate">{displayName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{displayEmail}</p>
                  </div>

                  <div className="py-1 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        if (onOpenHistoryModal) onOpenHistoryModal();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <History className="w-4 h-4 text-indigo-400" />
                      <span>My Saved Analyses</span>
                      {savedHistory.length > 0 && (
                        <span className="ml-auto text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800 px-1.5 py-0.5 rounded font-bold">
                          {savedHistory.length}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      <span>Sign Out</span>
                    </button>
                  </div>

                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-indigo-300 hover:text-white border border-indigo-900/60 hover:border-indigo-700/80 transition-all flex items-center gap-1.5 cursor-pointer shadow"
            >
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sign In / Register</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
