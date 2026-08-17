import React from 'react';
import { Sparkles, Shield, Rocket, ArrowRight, Home } from 'lucide-react';

export default function Header({ viewMode, onGoHome, onStartWizard }) {
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

        {/* Navigation & Action Buttons */}
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
              <span>Find My Opportunities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
