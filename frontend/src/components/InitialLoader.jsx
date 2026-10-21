import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Database, CheckCircle2, Sparkles } from 'lucide-react';

export default function InitialLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const logs = [
    { text: "01 // Initializing Founder's Hub discovery pipeline...", icon: Cpu },
    { text: "02 // Connecting to verified Qdrant vector collection...", icon: Database },
    { text: "03 // Indexing 216+ startup programs, Tier-1 cloud credits & capital schemes...", icon: Terminal },
    { text: "04 // Calibrating semantic embedding coordinates...", icon: Sparkles },
    { text: "05 // Discovery engine operational. Ready.", icon: CheckCircle2 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 300);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8) + 6;
        return next > 100 ? 100 : next;
      });
    }, 60);

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
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[10000] bg-[var(--color-ink)] text-[var(--color-text-primary)] flex flex-col items-center justify-center p-4 select-none font-sans"
    >
      <div className="max-w-md w-full bg-[var(--color-surface-1)] border border-[var(--color-line)] rounded-[4px] p-6 sm:p-8 relative z-10 text-center space-y-5">

        {/* Existing Favicon Logo Asset */}
        <div className="w-9 h-9 mx-auto rounded-[3px] bg-[var(--color-surface-2)] border border-[var(--color-line)] flex items-center justify-center overflow-hidden p-0.5">
          <img src="/favicon.jpg" alt="Logo" className="w-full h-full object-cover" />
        </div>

        {/* Wordmark Title */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <h2 className="font-display font-bold text-lg text-[var(--color-text-primary)] tracking-tight">
              Founder's Hub
            </h2>
            <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--color-signal)] px-1.5 py-0.2 rounded-[2px] bg-[var(--color-surface-2)] border border-[var(--color-line)]">
              Console
            </span>
          </div>
          <p className="font-mono text-[11px] text-[var(--color-text-dim)] uppercase tracking-wider">
            Startup Opportunity Discovery Engine
          </p>
        </div>

        {/* Progress Bar Hairline */}
        <div className="space-y-2 pt-1">
          <div className="h-1 w-full bg-[var(--color-surface-2)] rounded-[1px] overflow-hidden">
            <motion.div
              className="h-full bg-[var(--color-signal)]"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-dim)]">
            <span>Index Status</span>
            <span className="text-[var(--color-signal)] font-semibold">{progress}%</span>
          </div>
        </div>

        {/* Monospaced Log Stream */}
        <div className="p-3 bg-[var(--color-surface-2)] rounded-[3px] border border-[var(--color-line)] text-left font-mono text-xs text-[var(--color-text-primary)] h-12 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2 text-xs truncate"
            >
              <CurrentIcon className="w-3.5 h-3.5 shrink-0 text-[var(--color-signal)]" />
              <span className="truncate text-[var(--color-text-muted)] text-[11px]">{logs[currentStep]?.text}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={onComplete}
          className="font-mono text-[10px] text-[var(--color-text-dim)] hover:text-[var(--color-text-primary)] uppercase tracking-wider transition-colors cursor-pointer"
        >
          Skip initialization &rarr;
        </button>

      </div>
    </motion.div>
  );
}
