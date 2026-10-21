import React from 'react';
import { ShieldCheck, FileCheck, Check, AlertCircle } from 'lucide-react';
import { INCORPORATION_TYPES, DPIIT_OPTIONS } from '../constants/formOptions';

export default function Step2LegalStage({ formData, updateFormData, errors }) {
  return (
    <div className="space-y-8 animate-fadeIn text-[var(--color-text-primary)]">
      {/* Step Header */}
      <div className="border-b border-[var(--color-line)] pb-4">
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--color-signal)] uppercase tracking-widest mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Waypoint 02 // Legal &amp; Regulatory Mandate</span>
        </div>
        <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Incorporation &amp; Recognition
        </h2>
        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
          Specify your legal entity structure and DPIIT (Startup India) recognition status.
        </p>
      </div>

      {/* Field 1: Is the startup incorporated? */}
      <div className="space-y-3">
        <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          Is the startup incorporated? <span className="text-[var(--color-spark)]">*</span>
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {INCORPORATION_TYPES.map((type) => {
            const isSelected = formData.isIncorporated === type.value;
            return (
              <div
                key={type.value}
                onClick={() => updateFormData('isIncorporated', type.value)}
                className={`p-4 rounded-[3px] border cursor-pointer transition-colors flex items-start justify-between ${
                  isSelected
                    ? 'bg-[var(--color-surface-2)] border-[var(--color-signal)] text-[var(--color-text-primary)]'
                    : 'bg-[var(--color-surface-1)] border-[var(--color-line)] hover:border-[var(--color-line-strong)] text-[var(--color-text-muted)]'
                }`}
              >
                <div className="pr-3">
                  <div className={`font-semibold text-sm ${isSelected ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'}`}>
                    {type.label}
                  </div>
                  <p className="font-mono text-[11px] text-[var(--color-text-dim)] mt-1 leading-relaxed">{type.desc}</p>
                </div>
                <div
                  className={`w-4 h-4 rounded-[2px] border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isSelected
                      ? 'bg-[var(--color-signal)] border-[var(--color-signal)] text-[var(--color-accent-text)]'
                      : 'border-[var(--color-line)] bg-transparent'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        {errors.isIncorporated && (
          <p className="flex items-center gap-1.5 text-red-400 font-mono text-xs mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.isIncorporated}
          </p>
        )}
      </div>

      {/* Field 2: DPIIT Recognition */}
      <div className="space-y-3 pt-2">
        <div>
          <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            DPIIT Recognition <span className="text-[var(--color-spark)]">*</span>
          </label>
          <p className="font-mono text-[11px] text-[var(--color-text-dim)] mt-0.5">
            DPIIT recognition unlocks Government of India tax exemptions, self-certification, and relaxed tender norms.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DPIIT_OPTIONS.map((opt) => {
            const isSelected = formData.dpiitRecognition === opt.value;
            return (
              <div
                key={opt.value}
                onClick={() => updateFormData('dpiitRecognition', opt.value)}
                className={`p-4 rounded-[3px] border cursor-pointer transition-colors flex items-start justify-between ${
                  isSelected
                    ? 'bg-[var(--color-surface-2)] border-[var(--color-signal)] text-[var(--color-text-primary)]'
                    : 'bg-[var(--color-surface-1)] border-[var(--color-line)] hover:border-[var(--color-line-strong)] text-[var(--color-text-muted)]'
                }`}
              >
                <div className="pr-3">
                  <div className={`font-semibold text-sm flex items-center gap-2 ${isSelected ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'}`}>
                    <FileCheck className={`w-3.5 h-3.5 ${isSelected ? 'text-[var(--color-signal)]' : 'text-[var(--color-text-dim)]'}`} />
                    {opt.label}
                  </div>
                  <p className="font-mono text-[11px] text-[var(--color-text-dim)] mt-1">{opt.desc}</p>
                </div>
                <div
                  className={`w-4 h-4 rounded-[2px] border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isSelected
                      ? 'bg-[var(--color-signal)] border-[var(--color-signal)] text-[var(--color-accent-text)]'
                      : 'border-[var(--color-line)] bg-transparent'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        {errors.dpiitRecognition && (
          <p className="flex items-center gap-1.5 text-red-400 font-mono text-xs mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.dpiitRecognition}
          </p>
        )}
      </div>
    </div>
  );
}
