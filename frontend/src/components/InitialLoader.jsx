import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Database, CheckCircle2, Rocket, Sparkles } from 'lucide-react';

export default function InitialLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const logs = [
    { text: "Initializing FounderPilot AI Core Engine...", icon: Cpu },
    { text: "Connecting to Qdrant Cloud Vector Database...", icon: Database },
    { text: "Indexing 100+ Govt Schemes, BIRAC BIG, DST NIDHI & SIDBI...", icon: Terminal },
    { text: "Loading Jina Embeddings v3 (1024-d Vector Space)...", icon: Sparkles },
    { text: "Startup Opportunity Discovery Engine Ready.", icon: CheckCircle2 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 400);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8) + 4;
        return next > 100 ? 100 : next;
      });
    }, 80);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    if (progress < 20) setCurrentStep(0);
    else if (progress < 45) setCurrentStep(1);
    else if (progress < 70) setCurrentStep(2);
    else if (progress < 90) setCurrentStep(3);
    else setCurrentStep(4);
  }, [progress]);

  const CurrentIcon = logs[currentStep]?.icon || Cpu;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -40, scale: 0.98 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[10000] bg-[#050811] text-slate-100 flex flex-col items-center justify-center p-6 select-none"
    >
      {/* Background Noise & Grid Line Glow */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-md w-full space-y-8 relative z-10 text-center">
        
        {/* Center Glowing Power Core */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          {/* Animated pulse rings */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 blur-sm"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute inset-2 rounded-xl border border-dashed border-emerald-400/40"
          />
          <div className="w-16 h-16 rounded-xl bg-slate-900 border border-emerald-500/60 flex items-center justify-center shadow-xl shadow-emerald-500/20">
            <Rocket className="w-8 h-8 text-emerald-400" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            <span>FOUNDERPILOT</span>
            <span className="text-xs font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded">
              v2.5
            </span>
          </h2>
          <p className="text-xs font-mono text-slate-400">
            AI STARTUP OPPORTUNITY DISCOVERY ENGINE
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="space-y-3">
          <div className="h-2 w-full bg-slate-900 rounded-full border border-slate-800/80 overflow-hidden p-0.5">
            <motion.div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">STATUS: INITIALIZING</span>
            <span className="font-extrabold text-emerald-400">{progress}%</span>
          </div>
        </div>

        {/* Terminal Logs Showcase */}
        <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/90 text-left font-mono text-xs text-slate-300 space-y-2 h-20 flex flex-col justify-center shadow-inner">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2.5 text-emerald-400 font-medium"
            >
              <CurrentIcon className="w-4 h-4 shrink-0 text-emerald-400" />
              <span className="truncate">{logs[currentStep]?.text}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={onComplete}
          className="text-[11px] font-mono text-slate-500 hover:text-slate-300 underline transition-all cursor-pointer"
        >
          Skip Intro &rarr;
        </button>

      </div>
    </motion.div>
  );
}
