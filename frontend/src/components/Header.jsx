import React from 'react';
import { Sparkles, Shield, Rocket } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Rocket className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-tight leading-none">
              Founder's Hub
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Startup Ecosystem & Readiness Analyzer
            </p>
          </div>
        </div>

        {/* Badges / Quick info */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/70 text-indigo-300 border border-indigo-800/50">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Founder Onboarding
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            Fast Analysis
          </span>
        </div>
      </div>
    </header>
  );
}
