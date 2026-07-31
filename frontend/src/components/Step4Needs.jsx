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
    <div className="space-y-8 animate-fadeIn">
      {/* Step Header */}
      <div className="border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm mb-1">
          <Target className="w-4 h-4" />
          <span>Ecosystem Support</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Support & Funding Requirements</h2>
        <p className="text-slate-400 text-sm mt-1">
          Select the specific ecosystem support services and capital ranges you are seeking.
        </p>
      </div>

      {/* Field 1: Support Needed (Multi-select) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-slate-200">
            Support Needed <span className="text-rose-400 font-bold">*</span>{' '}
            <span className="text-slate-400 text-xs font-normal">(Select all that apply)</span>
          </label>
          <span className="text-xs font-medium text-indigo-400 bg-indigo-950/80 px-2.5 py-0.5 rounded-full border border-indigo-800/60">
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
                className={`group relative p-3.5 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-950/80 border-indigo-500 ring-2 ring-indigo-500/30 text-white shadow-lg shadow-indigo-950/60'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-sm text-slate-100">{item.label}</span>
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? 'bg-indigo-500 border-indigo-400 text-white'
                          : 'border-slate-600 bg-slate-800/50 group-hover:border-slate-500'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-normal">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {errors.supportNeeded && (
          <p className="flex items-center gap-1.5 text-rose-400 text-xs font-medium mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.supportNeeded}
          </p>
        )}
      </div>

      {/* Field 2: Funding Requirement (Optional) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <label className="block text-sm font-medium text-slate-200">Funding Requirement</label>
          <span className="text-xs font-medium text-amber-400/90 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40">
            Optional
          </span>
        </div>
        <p className="text-slate-400 text-xs -mt-1">
          If you are seeking capital, choose your estimated target fundraising bracket.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {FUNDING_REQUIREMENTS.map((req) => {
            const isSelected = formData.fundingRequirement === req.value;
            return (
              <button
                type="button"
                key={req.value}
                onClick={() =>
                  updateFormData('fundingRequirement', isSelected ? '' : req.value)
                }
                className={`py-3 px-3 rounded-xl border text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-600/90 border-emerald-400 text-white ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-950/50'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <IndianRupee className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                <span>{req.label}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Click an active selection again to deselect if you don't require funding right now.</span>
        </div>
      </div>
    </div>
  );
}
