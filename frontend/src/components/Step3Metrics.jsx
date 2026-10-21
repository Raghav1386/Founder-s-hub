import React from 'react';
import { Rocket, Users, Check, AlertCircle, Layers } from 'lucide-react';
import { STARTUP_STAGES, TEAM_SIZES } from '../constants/formOptions';

export default function Step3Metrics({ formData, updateFormData, errors }) {
  return (
    <div className="space-y-8 animate-fadeIn text-[var(--color-text-primary)]">
      {/* Step Header */}
      <div className="border-b border-[var(--color-line)] pb-4">
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--color-signal)] uppercase tracking-widest mb-1">
          <Rocket className="w-3.5 h-3.5" />
          <span>Waypoint 03 // Development Phase &amp; Capacity</span>
        </div>
        <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Startup Stage &amp; Team Size
        </h2>
        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
          Specify your venture's current development maturity and headcount.
        </p>
      </div>

      {/* Field 1: Startup Stage */}
      <div className="space-y-3">
        <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          Development Stage <span className="text-[var(--color-spark)]">*</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {STARTUP_STAGES.map((stage) => {
            const isSelected = formData.startupStage === stage.value;
            return (
              <div
                key={stage.value}
                onClick={() => updateFormData('startupStage', stage.value)}
                className={`p-4 rounded-[3px] border cursor-pointer transition-colors flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[var(--color-surface-2)] border-[var(--color-signal)] text-[var(--color-text-primary)]'
                    : 'bg-[var(--color-surface-1)] border-[var(--color-line)] hover:border-[var(--color-line-strong)] text-[var(--color-text-muted)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-semibold text-sm flex items-center gap-1.5 ${isSelected ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'}`}>
                      <Layers className={`w-3.5 h-3.5 ${isSelected ? 'text-[var(--color-signal)]' : 'text-[var(--color-text-dim)]'}`} />
                      {stage.label}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-[2px] border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[var(--color-signal)] border-[var(--color-signal)] text-[var(--color-accent-text)]'
                          : 'border-[var(--color-line)] bg-transparent'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="font-mono text-[11px] text-[var(--color-text-dim)] leading-relaxed">{stage.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {errors.startupStage && (
          <p className="flex items-center gap-1.5 text-red-400 font-mono text-xs mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.startupStage}
          </p>
        )}
      </div>

      {/* Field 2: Team Size */}
      <div className="space-y-3 pt-2">
        <div>
          <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Team Size (Founders &amp; Employees) <span className="text-[var(--color-spark)]">*</span>
          </label>
          <p className="font-mono text-[11px] text-[var(--color-text-dim)] mt-0.5">
            Total active headcount including full-time co-founders, engineers, and key operators.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {TEAM_SIZES.map((size) => {
            const isSelected = formData.teamSize === size.value;
            return (
              <button
                type="button"
                key={size.value}
                onClick={() => updateFormData('teamSize', size.value)}
                className={`py-2.5 px-3 rounded-[3px] border text-xs font-mono font-medium transition-colors flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--color-signal)] border-[var(--color-signal)] text-[var(--color-accent-text)] font-semibold'
                    : 'bg-[var(--color-surface-1)] border-[var(--color-line)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-line-strong)]'
                }`}
              >
                <Users className={`w-3.5 h-3.5 ${isSelected ? 'text-[var(--color-accent-text)]' : 'text-[var(--color-text-dim)]'}`} />
                <span>{size.label}</span>
              </button>
            );
          })}
        </div>

        {errors.teamSize && (
          <p className="flex items-center gap-1.5 text-red-400 font-mono text-xs mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.teamSize}
          </p>
        )}
      </div>
    </div>
  );
}
