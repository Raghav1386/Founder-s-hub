import React from 'react';
import { Target, Check, AlertCircle, IndianRupee, Info } from 'lucide-react';
import { SUPPORT_NEEDED_OPTIONS, FUNDING_REQUIREMENTS } from '../constants/formOptions';

export default function Step4Needs({ formData, updateFormData, errors }) {
  // Toggle multi-select item in supportNeeded array
  const toggleSupportItem = (itemId) => {
    const currentList = Array.isArray(formData.supportNeeded) ? formData.supportNeeded : [];
    let updatedList;
    if (currentList.includes(itemId)) {
      updatedList = currentList.filter((id) => id !== itemId);
    } else {
      updatedList = [...currentList, itemId];
    }
    updateFormData('supportNeeded', updatedList);
  };

  const selectedCount = Array.isArray(formData.supportNeeded) ? formData.supportNeeded.length : 0;

  return (
    <div className="space-y-8 animate-fadeIn text-[var(--color-text-primary)]">
      {/* Step Header */}
      <div className="border-b border-[var(--color-line)] pb-4">
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--color-signal)] uppercase tracking-widest mb-1">
          <Target className="w-3.5 h-3.5" />
          <span>Waypoint 04 // Capital &amp; Incubation Needs</span>
        </div>
        <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Support &amp; Funding Requirements
        </h2>
        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
          Select the specific ecosystem support services and capital brackets you are seeking.
        </p>
      </div>

      {/* Field 1: Support Needed (Multi-select) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Support Needed <span className="text-[var(--color-spark)]">*</span>{' '}
            <span className="text-[var(--color-text-dim)] lowercase font-normal">(select all that apply)</span>
          </label>
          <span className="font-mono text-[10px] text-[var(--color-signal)] bg-[var(--color-surface-2)] px-2 py-0.5 rounded-[2px] border border-[var(--color-line)]">
            {selectedCount} selected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SUPPORT_NEEDED_OPTIONS.map((item) => {
            const isSelected = Array.isArray(formData.supportNeeded) && formData.supportNeeded.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleSupportItem(item.id)}
                className={`p-3.5 rounded-[3px] border cursor-pointer transition-colors flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[var(--color-surface-2)] border-[var(--color-signal)] text-[var(--color-text-primary)]'
                    : 'bg-[var(--color-surface-1)] border-[var(--color-line)] hover:border-[var(--color-line-strong)] text-[var(--color-text-muted)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-semibold text-sm ${isSelected ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'}`}>
                      {item.label}
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
                  <p className="font-mono text-[11px] text-[var(--color-text-dim)] leading-normal">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {errors.supportNeeded && (
          <p className="flex items-center gap-1.5 text-red-400 font-mono text-xs mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.supportNeeded}
          </p>
        )}
      </div>

      {/* Field 2: Funding Requirement (Optional) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Funding Bracket
          </label>
          <span className="font-mono text-[10px] text-[var(--color-text-dim)] uppercase bg-[var(--color-surface-2)] px-1.5 py-0.2 rounded-[2px] border border-[var(--color-line)]">
            Optional
          </span>
        </div>
        <p className="font-mono text-[11px] text-[var(--color-text-dim)] -mt-1">
          Target non-dilutive capital or seed investment range.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {FUNDING_REQUIREMENTS.map((req) => {
            const isSelected = formData.fundingRequirement === req.value;
            return (
              <button
                type="button"
                key={req.value}
                onClick={() =>
                  updateFormData('fundingRequirement', isSelected ? '' : req.value)
                }
                className={`py-2 px-3 rounded-[3px] border font-mono text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--color-signal)] border-[var(--color-signal)] text-[var(--color-accent-text)] font-semibold'
                    : 'bg-[var(--color-surface-1)] border-[var(--color-line)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-line-strong)]'
                }`}
              >
                <IndianRupee className={`w-3 h-3 ${isSelected ? 'text-[var(--color-accent-text)]' : 'text-[var(--color-text-dim)]'}`} />
                <span>{req.label}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--color-text-dim)] mt-1">
          <Info className="w-3 h-3 shrink-0" />
          <span>Click active bracket to deselect if non-dilutive grant search is preferred.</span>
        </div>
      </div>
    </div>
  );
}
