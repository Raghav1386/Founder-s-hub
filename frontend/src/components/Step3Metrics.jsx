import React from 'react';
import { Rocket, Users, Check, AlertCircle, Layers } from 'lucide-react';
import { STARTUP_STAGES, TEAM_SIZES } from '../constants/formOptions';

export default function Step3Metrics({ formData, updateFormData, errors }) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Step Header */}
      <div className="border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm mb-1">
          <Rocket className="w-4 h-4" />
          <span>Traction & Capability</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Startup Stage & Team Size</h2>
        <p className="text-slate-400 text-sm mt-1">
          Help us gauge your venture's current development phase and human capital size.
        </p>
      </div>

      {/* Field 1: Startup Stage */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-200">
          Startup Stage <span className="text-rose-400 font-bold">*</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {STARTUP_STAGES.map((stage) => {
            const isSelected = formData.startupStage === stage.value;
            return (
              <div
                key={stage.value}
                onClick={() => updateFormData('startupStage', stage.value)}
                className={`group relative p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-950/70 border-indigo-500 ring-2 ring-indigo-500/30 text-white shadow-lg shadow-indigo-950/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-base text-slate-100 flex items-center gap-1.5">
                      <Layers className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                      {stage.label}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? 'bg-indigo-500 border-indigo-400 text-white'
                          : 'border-slate-600 bg-slate-800/50 group-hover:border-slate-500'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{stage.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {errors.startupStage && (
          <p className="flex items-center gap-1.5 text-rose-400 text-xs font-medium mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.startupStage}
          </p>
        )}
      </div>

      {/* Field 2: Team Size */}
      <div className="space-y-3 pt-2">
        <label className="block text-sm font-medium text-slate-200">
          Team Size (Founders & Employees) <span className="text-rose-400 font-bold">*</span>
        </label>
        <p className="text-slate-400 text-xs -mt-1">
          Total count including full-time co-founders, key engineers, and active members.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {TEAM_SIZES.map((size) => {
            const isSelected = formData.teamSize === size.value;
            return (
              <button
                type="button"
                key={size.value}
                onClick={() => updateFormData('teamSize', size.value)}
                className={`py-3.5 px-3 rounded-xl border font-semibold text-sm transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-400 text-white ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-900/50'
                    : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <Users className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                <span>{size.label}</span>
              </button>
            );
          })}
        </div>

        {errors.teamSize && (
          <p className="flex items-center gap-1.5 text-rose-400 text-xs font-medium mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.teamSize}
          </p>
        )}
      </div>
    </div>
  );
}
