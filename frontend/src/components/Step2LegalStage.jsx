import React from 'react';
import { ShieldCheck, FileCheck, Check, AlertCircle } from 'lucide-react';
import { INCORPORATION_TYPES, DPIIT_OPTIONS } from '../constants/formOptions';

export default function Step2LegalStage({ formData, updateFormData, errors }) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Step Header */}
      <div className="border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Legal & Regulatory</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Incorporation & Recognition</h2>
        <p className="text-slate-400 text-sm mt-1">
          Specify your legal structure and DPIIT (Department for Promotion of Industry and Internal Trade) status.
        </p>
      </div>

      {/* Field 1: Is the startup incorporated? */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-200">
          Is the startup incorporated? <span className="text-rose-400 font-bold">*</span>
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {INCORPORATION_TYPES.map((type) => {
            const isSelected = formData.isIncorporated === type.value;
            return (
              <div
                key={type.value}
                onClick={() => updateFormData('isIncorporated', type.value)}
                className={`group relative p-3.5 rounded-xl border cursor-pointer transition-all duration-200 flex items-start justify-between ${
                  isSelected
                    ? 'bg-indigo-950/70 border-indigo-500 ring-2 ring-indigo-500/30 text-white shadow-lg shadow-indigo-950/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/40'
                }`}
              >
                <div className="pr-3">
                  <div className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                    {type.label}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{type.desc}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    isSelected
                      ? 'bg-indigo-500 border-indigo-400 text-white'
                      : 'border-slate-600 bg-slate-800/50 group-hover:border-slate-500'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        {errors.isIncorporated && (
          <p className="flex items-center gap-1.5 text-rose-400 text-xs font-medium mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.isIncorporated}
          </p>
        )}
      </div>

      {/* Field 2: DPIIT Recognition */}
      <div className="space-y-3 pt-2">
        <label className="block text-sm font-medium text-slate-200">
          DPIIT Recognition <span className="text-rose-400 font-bold">*</span>
        </label>
        <p className="text-slate-400 text-xs -mt-1">
          DPIIT recognition unlocks Government of India tax benefits, self-certification, and relaxed tender norms.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DPIIT_OPTIONS.map((opt) => {
            const isSelected = formData.dpiitRecognition === opt.value;
            return (
              <div
                key={opt.value}
                onClick={() => updateFormData('dpiitRecognition', opt.value)}
                className={`group relative p-3.5 rounded-xl border cursor-pointer transition-all duration-200 flex items-start justify-between ${
                  isSelected
                    ? 'bg-indigo-950/70 border-indigo-500 ring-2 ring-indigo-500/30 text-white shadow-lg shadow-indigo-950/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/40'
                }`}
              >
                <div className="pr-3">
                  <div className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                    <FileCheck className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                    {opt.label}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{opt.desc}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    isSelected
                      ? 'bg-indigo-500 border-indigo-400 text-white'
                      : 'border-slate-600 bg-slate-800/50 group-hover:border-slate-500'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        {errors.dpiitRecognition && (
          <p className="flex items-center gap-1.5 text-rose-400 text-xs font-medium mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.dpiitRecognition}
          </p>
        )}
      </div>
    </div>
  );
}
