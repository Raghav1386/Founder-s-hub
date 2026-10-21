import React from 'react';
import { Building, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { INDIAN_STATES_UTS } from '../constants/formOptions';

export default function Step1GeneralInfo({ formData, updateFormData, errors }) {
  return (
    <div className="space-y-6 animate-fadeIn text-[var(--color-text-primary)]">
      {/* Step Header */}
      <div className="border-b border-[var(--color-line)] pb-4">
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--color-signal)] uppercase tracking-widest mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Waypoint 01 // Identity &amp; Domicile</span>
        </div>
        <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Startup General Information
        </h2>
        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
          Specify the registered brand name and primary geographical domicile of your venture.
        </p>
      </div>

      {/* Startup Name Field */}
      <div className="space-y-1.5">
        <label htmlFor="startupName" className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          Startup Name <span className="text-[var(--color-spark)]">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-text-dim)]">
            <Building className="w-4 h-4" />
          </div>
          <input
            type="text"
            id="startupName"
            name="startupName"
            value={formData.startupName}
            onChange={(e) => updateFormData('startupName', e.target.value)}
            placeholder="e.g. Acme Innovations, Bharat PayTech, Quantum Robotics"
            className={`w-full h-10 pl-10 pr-4 text-xs sm:text-sm bg-[var(--color-surface-2)] border rounded-[3px] text-[var(--color-text-primary)] placeholder:[var(--color-text-dim)] focus:outline-none transition-colors ${
              errors.startupName
                ? 'border-red-500/80 bg-red-950/20 text-red-200'
                : 'border-[var(--color-line)] focus:border-[var(--color-signal)]'
            }`}
          />
        </div>
        {errors.startupName && (
          <p className="flex items-center gap-1.5 text-red-400 font-mono text-xs mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.startupName}
          </p>
        )}
      </div>

      {/* State / UT Dropdown Field */}
      <div className="space-y-1.5">
        <label htmlFor="stateUt" className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          State / Union Territory (UT) <span className="text-[var(--color-spark)]">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-text-dim)]">
            <MapPin className="w-4 h-4" />
          </div>
          <select
            id="stateUt"
            name="stateUt"
            value={formData.stateUt}
            onChange={(e) => updateFormData('stateUt', e.target.value)}
            className={`w-full h-10 pl-10 pr-10 text-xs sm:text-sm bg-[var(--color-surface-2)] border rounded-[3px] text-[var(--color-text-primary)] focus:outline-none appearance-none transition-colors cursor-pointer ${
              errors.stateUt
                ? 'border-red-500/80 bg-red-950/20 text-red-200'
                : 'border-[var(--color-line)] focus:border-[var(--color-signal)]'
            }`}
          >
            <option value="" disabled className="bg-[var(--color-surface-1)] text-[var(--color-text-dim)]">
              -- Select your primary State or Union Territory --
            </option>
            {INDIAN_STATES_UTS.map((state) => (
              <option key={state} value={state} className="bg-[var(--color-surface-1)] text-[var(--color-text-primary)]">
                {state}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[var(--color-text-dim)]">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
        {errors.stateUt ? (
          <p className="flex items-center gap-1.5 text-red-400 font-mono text-xs mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.stateUt}
          </p>
        ) : (
          <p className="font-mono text-[11px] text-[var(--color-text-dim)] mt-1">
            State policies and regional incubators apply strictly according to domicile registration.
          </p>
        )}
      </div>
    </div>
  );
}
