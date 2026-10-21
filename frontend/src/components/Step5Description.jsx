import React from 'react';
import { FileText, Sparkles, AlertCircle, HelpCircle, Plus } from 'lucide-react';

export default function Step5Description({ formData, updateFormData, errors }) {
  const charCount = formData.description ? formData.description.length : 0;
  const wordCount = formData.description ? formData.description.trim().split(/\s+/).filter(Boolean).length : 0;

  // Prompt suggestions to help the founder quickly structure their narrative
  const promptPrompts = [
    { label: "Product & Problem", text: "\n\n🚀 Product & Problem:\nWe are solving... with our product which..." },
    { label: "Target Market", text: "\n\n🎯 Target Market & Customers:\nOur primary customers are... in market sector..." },
    { label: "Tech Stack & IP", text: "\n\n💡 Tech Stack & Proprietary IP:\nOur platform is built using... key innovation includes..." },
    { label: "12-Month Roadmap", text: "\n\n📈 12-Month Deployment Plan:\nOver the next 12 months, our operational goal is to..." }
  ];

  const appendPrompt = (promptText) => {
    const current = formData.description || '';
    updateFormData('description', current + promptText);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-[var(--color-text-primary)]">
      {/* Step Header */}
      <div className="border-b border-[var(--color-line)] pb-4">
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--color-signal)] uppercase tracking-widest mb-1">
          <FileText className="w-3.5 h-3.5" />
          <span>Waypoint 05 // Executive Pitch &amp; Tech Dossier</span>
        </div>
        <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Describe Your Startup
        </h2>
        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
          Provide a technical and commercial overview of your venture to run high-precision semantic matching.
        </p>
      </div>

      {/* Guidance Card */}
      <div className="p-4 bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-[3px] space-y-2">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[var(--color-signal)]">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Recommended parameters for maximum match accuracy</span>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px] text-[var(--color-text-muted)]">
          <li className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-[var(--color-signal)] shrink-0" />
            Core technical problem &amp; solution architecture
          </li>
          <li className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-[var(--color-signal)] shrink-0" />
            Customer archetype &amp; vertical industry focus
          </li>
          <li className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-[var(--color-signal)] shrink-0" />
            Development stage &amp; commercial traction
          </li>
          <li className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-[var(--color-signal)] shrink-0" />
            Proprietary IP, hardware fab or software stack
          </li>
        </ul>
      </div>

      {/* Quick Helper Prompt Templates */}
      <div className="space-y-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-text-dim)] flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[var(--color-signal)]" />
          Insert structured template markers:
        </span>
        <div className="flex flex-wrap gap-2">
          {promptPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => appendPrompt(p.text)}
              className="studio-btn-secondary text-xs h-7 px-2.5 font-mono"
            >
              <Plus className="w-3 h-3 text-[var(--color-text-dim)]" />
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="description" className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Startup Narrative <span className="text-[var(--color-spark)]">*</span>
          </label>
          <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--color-text-dim)]">
            <span>{wordCount} words</span>
            <span>&bull;</span>
            <span>{charCount} chars</span>
          </div>
        </div>

        <textarea
          id="description"
          name="description"
          rows={7}
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          placeholder="Describe your venture... For example: 'We are engineering an AI-driven predictive irrigation controller for Indian horticultural farms. Our hardware prototype is deployed across 14 test farms in Belagavi. We are seeking ₹50L in non-dilutive grant capital to complete regulatory trials and file patent claims...'"
          className={`w-full p-3.5 text-xs sm:text-sm bg-[var(--color-surface-2)] border rounded-[3px] text-[var(--color-text-primary)] placeholder:[var(--color-text-dim)] focus:outline-none transition-colors leading-relaxed ${
            errors.description
              ? 'border-red-500/80 bg-red-950/20 text-red-200'
              : 'border-[var(--color-line)] focus:border-[var(--color-signal)]'
          }`}
        />

        {errors.description ? (
          <p className="flex items-center gap-1.5 text-red-400 font-mono text-xs mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.description}
          </p>
        ) : (
          <p className="font-mono text-[11px] text-[var(--color-text-dim)] mt-1">
            Specific sector keywords and metrics produce significantly higher precision Qdrant matches.
          </p>
        )}
      </div>
    </div>
  );
}
