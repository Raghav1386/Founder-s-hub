import React from 'react';
import { Building, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { INDIAN_STATES_UTS } from '../constants/formOptions';

export default function Step1GeneralInfo({ formData, updateFormData, errors }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Step Header */}
      <div className="border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Basic Identity</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Startup General Information</h2>
        <p className="text-slate-400 text-sm mt-1">
          Let's begin with the official brand name and geographical location of your venture.
        </p>
      </div>

      {/* Startup Name Field */}
      <div className="space-y-2">
        <label htmlFor="startupName" className="block text-sm font-medium text-slate-200">
          Startup Name <span className="text-rose-400 font-bold">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Building className="w-5 h-5" />
          </div>
          <input
            type="text"
            id="startupName"
            name="startupName"
            value={formData.startupName}
            onChange={(e) => updateFormData('startupName', e.target.value)}
            placeholder="e.g. Acme Innovations, Bharat PayTech, Quantum Robotics"
            className={`w-full pl-11 pr-4 py-3 bg-slate-900/90 border rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
              errors.startupName
                ? 'border-rose-500/80 focus:ring-rose-500/40 bg-rose-950/10'
                : 'border-slate-700/80 focus:border-indigo-500 focus:ring-indigo-500/30'
            }`}
          />
        </div>
        {errors.startupName && (
          <p className="flex items-center gap-1.5 text-rose-400 text-xs font-medium mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.startupName}
          </p>
        )}
      </div>

      {/* State / UT Dropdown Field */}
      <div className="space-y-2">
        <label htmlFor="stateUt" className="block text-sm font-medium text-slate-200">
          State / Union Territory (UT) <span className="text-rose-400 font-bold">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <MapPin className="w-5 h-5" />
          </div>
          <select
            id="stateUt"
            name="stateUt"
            value={formData.stateUt}
            onChange={(e) => updateFormData('stateUt', e.target.value)}
            className={`w-full pl-11 pr-10 py-3 bg-slate-900/90 border rounded-xl text-slate-100 focus:outline-none focus:ring-2 appearance-none transition-all duration-200 ${
              errors.stateUt
                ? 'border-rose-500/80 focus:ring-rose-500/40 bg-rose-950/10'
                : 'border-slate-700/80 focus:border-indigo-500 focus:ring-indigo-500/30'
            }`}
          >
            <option value="" disabled className="bg-slate-900 text-slate-500">
              -- Select your primary State or Union Territory --
            </option>
            {INDIAN_STATES_UTS.map((state) => (
              <option key={state} value={state} className="bg-slate-900 text-slate-200 py-1">
                {state}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
        {errors.stateUt ? (
          <p className="flex items-center gap-1.5 text-rose-400 text-xs font-medium mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.stateUt}
          </p>
        ) : (
          <p className="text-slate-500 text-xs mt-1">
            Select the Indian state or UT where your head office or primary operations are based.
          </p>
        )}
      </div>
    </div>
  );
}
