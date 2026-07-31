import React from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { STEPS_CONFIG } from '../constants/formOptions';

export default function ProgressBar({ currentStep, totalSteps, completedSteps, onStepClick }) {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full mb-8">
      {/* Top Meta info: Step X of Y + Percentage */}
      <div className="flex items-center justify-between mb-3 text-xs sm:text-sm">
        <span className="font-semibold text-indigo-400 tracking-wide uppercase">
          Step {currentStep} of {totalSteps} &bull; {STEPS_CONFIG[currentStep - 1]?.title}
        </span>
        <span className="font-bold text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/60 shadow-inner">
          {percentage}% Completed
        </span>
      </div>

      {/* Main Animated Progress Bar Track */}
      <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/50 shadow-inner">
        <div
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500 ease-out shadow-lg shadow-indigo-500/20"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Step Indicators Breadcrumb */}
      <div className="mt-6 grid grid-cols-5 gap-1.5 sm:gap-3">
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
              className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 text-left border ${
                isCurrent
                  ? 'bg-indigo-950/60 border-indigo-500/80 ring-2 ring-indigo-500/30 text-white shadow-lg shadow-indigo-900/30'
                  : isCompleted
                  ? 'bg-slate-800/60 border-emerald-500/40 text-emerald-300 hover:bg-slate-800/90 cursor-pointer'
                  : 'bg-slate-900/40 border-slate-800/80 text-slate-500 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex items-center gap-1.5 w-full justify-center sm:justify-start">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/40'
                      : isCompleted
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" /> : step.id}
                </div>
                <span className="hidden sm:inline text-xs font-medium truncate">
                  {step.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
