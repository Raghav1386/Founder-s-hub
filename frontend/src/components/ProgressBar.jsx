import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { STEPS_CONFIG } from '../constants/formOptions';

export default function ProgressBar({ currentStep, totalSteps, completedSteps, onStepClick }) {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full mb-8">
      {/* Top Meta info */}
      <div className="flex items-center justify-between mb-2.5 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[var(--color-signal)] uppercase tracking-wider font-semibold">
            Waypoint 0{currentStep} / 0{totalSteps}
          </span>
          <span className="text-[var(--color-text-dim)]">&bull;</span>
          <span className="text-[var(--color-text-primary)] font-medium">
            {STEPS_CONFIG[currentStep - 1]?.title}
          </span>
        </div>
        <span className="text-[var(--color-text-dim)] uppercase tracking-wider">
          {percentage}% Complete
        </span>
      </div>

      {/* Main Progress Bar Track */}
      <div className="w-full bg-[var(--color-surface-2)] h-1 rounded-[1px] overflow-hidden border border-[var(--color-line)]">
        <div
          className="bg-[var(--color-signal)] h-full transition-all duration-200 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Step Indicators Breadcrumb */}
      <div className="mt-4 overflow-x-auto no-scrollbar flex sm:grid sm:grid-cols-5 gap-2 pb-1">
        {STEPS_CONFIG.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = step.id === currentStep;
          const isClickable = isCompleted || step.id <= currentStep;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => isClickable && onStepClick(step.id)}
              disabled={!isClickable}
              className={`flex items-center gap-2 p-2 rounded-[3px] transition-colors text-left border min-w-[50px] sm:min-w-0 flex-1 shrink-0 sm:shrink font-mono ${
                isCurrent
                  ? 'bg-[var(--color-surface-2)] border-[var(--color-signal)] text-[var(--color-text-primary)] font-semibold'
                  : isCompleted
                  ? 'bg-[var(--color-surface-1)] border-[var(--color-line)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] cursor-pointer'
                  : 'bg-transparent border-[var(--color-line)]/50 text-[var(--color-text-dim)] cursor-not-allowed opacity-50'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-[2px] flex items-center justify-center text-[10px] font-semibold transition-colors shrink-0 ${
                  isCurrent
                    ? 'bg-[var(--color-signal)] text-[var(--color-accent-text)]'
                    : isCompleted
                    ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-800/60'
                    : 'bg-[var(--color-surface-2)] text-[var(--color-text-dim)] border border-[var(--color-line)]'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : `0${step.id}`}
              </div>
              <span className="hidden md:inline text-[11px] uppercase tracking-wider truncate">
                {step.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
