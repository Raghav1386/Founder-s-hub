import React from 'react';
import { FileText, Sparkles, AlertCircle, HelpCircle, Plus } from 'lucide-react';

export default function Step5Description({ formData, updateFormData, errors }) {
  const charCount = formData.description ? formData.description.length : 0;
  const wordCount = formData.description ? formData.description.trim().split(/\s+/).filter(Boolean).length : 0;

  // Prompt suggestions to help the founder quickly structure their narrative
  const promptPrompts = [
    { label: "Product & Problem", text: "\n\n🚀 Product & Problem:\nWe are solving... with our product which..." },
    { label: "Target Customers", text: "\n\n🎯 Target Market & Customers:\nOur primary customers are... in market sector..." },
    { label: "Tech & Innovation", text: "\n\n💡 Tech Stack & Secret Sauce:\nOur platform is built using... key innovation includes..." },
    { label: "Future Growth Plan", text: "\n\n📈 12-Month Growth Roadmap:\nOver the next 12 months, our goal is to..." }
  ];

  const appendPrompt = (promptText) => {
    const current = formData.description || '';
    updateFormData('description', current + promptText);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Step Header */}
      <div className="border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm mb-1">
          <FileText className="w-4 h-4" />
          <span>Executive Pitch</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Describe Your Startup</h2>
        <p className="text-slate-400 text-sm mt-1">
          Provide a comprehensive overview of your startup to receive tailored ecosystem recommendations and AI analysis.
        </p>
      </div>

      {/* Guidance Card */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
        <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          <span>What to include in your description</span>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
          <li className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Product features & core value proposition
          </li>
          <li className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Target customers & industry focus
          </li>
          <li className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Current stage & traction metrics
          </li>
          <li className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Technology stack & IP / proprietary tech
          </li>
          <li className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Funding requirement & capital deployment
          </li>
          <li className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Future expansion & 12-month vision
          </li>
        </ul>
      </div>

      {/* Quick Helper Prompt Templates */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Click to add prompt templates:
        </span>
        <div className="flex flex-wrap gap-2">
          {promptPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => appendPrompt(p.text)}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 text-indigo-300 hover:text-white transition-all"
            >
              <Plus className="w-3 h-3" />
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="description" className="block text-sm font-medium text-slate-200">
            Startup Description <span className="text-rose-400 font-bold">*</span>
          </label>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>{wordCount} words</span>
            <span>&bull;</span>
            <span>{charCount} characters</span>
          </div>
        </div>

        <textarea
          id="description"
          name="description"
          rows={7}
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          placeholder="Describe your startup here... For example: 'We are building an AI-powered supply chain optimization platform for Indian D2C brands. Our MVP is serving 12 paid clients in Bengaluru. We are seeking ₹50L in grant/equity funding to scale our engineering team and acquire 100 enterprise clients in the next 12 months...'"
          className={`w-full p-4 bg-slate-900/90 border rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 leading-relaxed ${
            errors.description
              ? 'border-rose-500/80 focus:ring-rose-500/40 bg-rose-950/10'
              : 'border-slate-700/80 focus:border-indigo-500 focus:ring-indigo-500/30'
          }`}
        />

        {errors.description ? (
          <p className="flex items-center gap-1.5 text-rose-400 text-xs font-medium mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.description}
          </p>
        ) : (
          <p className="text-slate-500 text-xs mt-1">
            Tip: Be as specific as possible. Clear descriptions yield significantly higher quality analysis and ecosystem match rates.
          </p>
        )}
      </div>
    </div>
  );
}
