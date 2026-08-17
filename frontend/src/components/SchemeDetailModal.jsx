import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  ShieldCheck,
  Building2,
  IndianRupee,
  Calendar,
  Layers,
  HelpCircle,
  ChevronRight,
  Loader2,
  Award,
  BookOpen
} from 'lucide-react';

export default function SchemeDetailModal({ schemeMatch, documentId, onClose }) {
  const [loading, setLoading] = useState(false);
  const [docDetails, setDocDetails] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'guidelines' | 'markdown'

  const targetId = documentId || schemeMatch?.documentId;
  const isValidMongoId = typeof targetId === 'string' && /^[0-9a-fA-F]{24}$/.test(targetId);

  // Lock background scroll when full screen page is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    if (!targetId || !isValidMongoId) return;

    let isMounted = true;
    const fetchDoc = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/founder/scheme/${targetId}`);
        if (response.ok) {
          const json = await response.json();
          if (isMounted) {
            setDocDetails(json.data);
          }
        }
      } catch (err) {
        // Preserve schemeMatch view fallback
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDoc();

    return () => {
      isMounted = false;
    };
  }, [targetId, isValidMongoId]);

  // Combined data between matched analysis and fetched MongoDB document
  const title = schemeMatch?.title || docDetails?.title || 'Scheme Details';
  const source = schemeMatch?.source || docDetails?.source || 'Government Portal';
  const url = schemeMatch?.url || docDetails?.url;
  const structured = docDetails?.structured || {};

  const modalContent = (
    <div className="fixed inset-0 z-[9999] bg-slate-950 overflow-y-auto min-h-screen w-full animate-fadeIn flex flex-col text-slate-200">
      
      {/* Top Full Screen Header Bar (Sticky) */}
      <div className="sticky top-0 z-20 bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-4 shadow-2xl">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Left: Back Button & Title */}
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={onClose}
              className="mt-0.5 p-2.5 bg-indigo-950 hover:bg-indigo-900 text-indigo-200 hover:text-white rounded-xl transition-all flex items-center gap-2 text-xs font-bold shrink-0 cursor-pointer shadow-lg border border-indigo-800/80"
            >
              <ArrowLeft className="w-4 h-4 text-indigo-400" />
              <span>Back to Results</span>
            </button>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-indigo-950 text-indigo-300 border border-indigo-800/80 px-2.5 py-0.5 rounded-md">
                  {source}
                </span>
                {schemeMatch && (
                  <span
                    className={`text-xs font-extrabold px-3 py-0.5 rounded-full border ${
                      schemeMatch.eligibilityScore >= 80
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                        : schemeMatch.eligibilityScore >= 60
                        ? 'bg-amber-950 text-amber-300 border-amber-700'
                        : 'bg-rose-950 text-rose-300 border-rose-700'
                    }`}
                  >
                    {schemeMatch.eligibilityScore}% Match &bull; {schemeMatch.eligibilityStatus}
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                {title}
              </h1>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-indigo-500/20"
              >
                <span>Apply on Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
              title="Close Page"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Sub-Header */}
        <div className="max-w-6xl mx-auto pt-4 mt-2 border-t border-slate-800/60 flex gap-6 text-sm font-semibold overflow-x-auto">
          {schemeMatch && (
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`pb-3 border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Match Analysis</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('guidelines')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'guidelines'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Scheme Guidelines Matrix</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('markdown')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'markdown'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Full Documentation Text</span>
          </button>
        </div>
      </div>

      {/* Main Full Page Body Content */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 space-y-6">
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-3 bg-slate-900/60 rounded-2xl border border-slate-800">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            <span className="text-xs text-slate-400">Loading complete scheme guidelines from database...</span>
          </div>
        )}

        {error && !loading && (
          <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* TAB 1: MATCH ANALYSIS OVERVIEW */}
        {activeTab === 'overview' && schemeMatch && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Reasoning Card */}
            <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3 shadow-lg">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> AI Founder-Scheme Compatibility Evaluation
              </span>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed italic bg-slate-950/80 p-4 rounded-xl border border-slate-800/80">
                "{schemeMatch.reasoning}"
              </p>
            </div>

            {/* Benefits & Missing Requirements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Benefits */}
              <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3.5 shadow-lg">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Key Relevant Benefits
                </span>
                {Array.isArray(schemeMatch.benefitsRelevant) && schemeMatch.benefitsRelevant.length > 0 ? (
                  <ul className="space-y-2 text-xs sm:text-sm">
                    {schemeMatch.benefitsRelevant.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5 p-2 bg-slate-950/50 rounded-lg border border-slate-800/60">
                        <span className="text-emerald-400 font-bold mt-0.5">&bull;</span>
                        <span className="text-slate-300 leading-normal">{b}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-xs text-slate-500 italic">No specific benefits listed.</span>
                )}
              </div>

              {/* Missing Requirements */}
              <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3.5 shadow-lg">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Missing Requirements / Prerequisites
                </span>
                {Array.isArray(schemeMatch.missingRequirements) && schemeMatch.missingRequirements.length > 0 ? (
                  <ul className="space-y-2 text-xs sm:text-sm">
                    {schemeMatch.missingRequirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2.5 p-2 bg-slate-950/50 rounded-lg border border-slate-800/60">
                        <span className="text-amber-400 font-bold mt-0.5">&bull;</span>
                        <span className="text-slate-300 leading-normal">{req}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-300 text-xs font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>All startup prerequisites met for this scheme!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Recommended Next Steps */}
            {Array.isArray(schemeMatch.nextSteps) && schemeMatch.nextSteps.length > 0 && (
              <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-4 shadow-lg">
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-indigo-400" /> Actionable Next Steps
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  {schemeMatch.nextSteps.map((step, i) => (
                    <div key={i} className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex items-start gap-3">
                      <span className="font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded text-xs shrink-0">
                        Step {i + 1}
                      </span>
                      <span className="text-slate-300 leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: STRUCTURED GUIDELINES MATRIX */}
        {activeTab === 'guidelines' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Scheme Summary */}
            {structured.summary && (
              <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2 shadow-lg">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Summary Overview
                </span>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {structured.summary}
                </p>
              </div>
            )}

            {/* Funding & Key Criteria Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1.5 shadow-lg">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-emerald-400" /> Funding Support Amount
                </span>
                <span className="text-base font-bold text-emerald-300 block">
                  {structured.funding?.amount || 'Refer to Official Portal'}
                </span>
                <span className="text-xs text-slate-500">
                  Instrument: {structured.funding?.type || 'N/A'}
                </span>
              </div>

              <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1.5 shadow-lg">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" /> DPIIT Status Required
                </span>
                <span className="text-base font-bold text-white block">
                  {structured.eligibility?.dpiitRequired ? 'Yes (Mandatory)' : 'No (Open to all)'}
                </span>
                <span className="text-xs text-slate-500">Startup India Recognition</span>
              </div>

              <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1.5 shadow-lg">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-400" /> Intake Timeline / Deadline
                </span>
                <span className="text-base font-bold text-amber-300 block">
                  {structured.deadline || 'Rolling Intake'}
                </span>
                <span className="text-xs text-slate-500">Application Cycle</span>
              </div>
            </div>

            {/* Eligibility Parameters Matrix */}
            {structured.eligibility && (
              <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-4 shadow-lg">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Eligibility Requirements Matrix
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-slate-400 font-semibold block mb-2">Target Industry Sectors</span>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(structured.eligibility.sectors) && structured.eligibility.sectors.length > 0 ? (
                        structured.eligibility.sectors.map((sec, i) => (
                          <span key={i} className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-md text-xs border border-slate-700">
                            {sec}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 italic">Open to All Sectors</span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-slate-400 font-semibold block mb-2">Applicable Startup Stages</span>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(structured.eligibility.startupStages) && structured.eligibility.startupStages.length > 0 ? (
                        structured.eligibility.startupStages.map((stg, i) => (
                          <span key={i} className="bg-indigo-950 text-indigo-300 px-2.5 py-1 rounded-md text-xs border border-indigo-800/60">
                            {stg}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 italic">All Stages</span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-slate-400 font-semibold block mb-2">Eligible Entity Types</span>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(structured.eligibility.entityTypes) && structured.eligibility.entityTypes.length > 0 ? (
                        structured.eligibility.entityTypes.map((ent, i) => (
                          <span key={i} className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-md text-xs border border-slate-700">
                            {ent}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 italic">All Entity Types</span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-slate-400 font-semibold block mb-2">Applicable States / UTs</span>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(structured.eligibility.states) && structured.eligibility.states.length > 0 ? (
                        structured.eligibility.states.map((st, i) => (
                          <span key={i} className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-md text-xs border border-slate-700">
                            {st}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 italic">All India</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Required Documents & Application Procedure Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Application Procedure */}
              {Array.isArray(structured.applicationProcess) && structured.applicationProcess.length > 0 && (
                <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3 shadow-lg">
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                    Step-by-Step Application Procedure
                  </span>
                  <ol className="space-y-2 text-xs sm:text-sm text-slate-300">
                    {structured.applicationProcess.map((step, i) => (
                      <li key={i} className="flex items-start gap-2.5 p-2 bg-slate-950/50 rounded-lg border border-slate-800/60">
                        <span className="font-bold text-indigo-400 shrink-0">{i + 1}.</span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Required Documents */}
              {Array.isArray(structured.requiredDocuments) && structured.requiredDocuments.length > 0 && (
                <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3 shadow-lg">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Required Application Documents
                  </span>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                    {structured.requiredDocuments.map((docItem, i) => (
                      <li key={i} className="flex items-start gap-2.5 p-2 bg-slate-950/50 rounded-lg border border-slate-800/60">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{docItem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Keywords */}
            {Array.isArray(structured.keywords) && structured.keywords.length > 0 && (
              <div className="p-4 bg-slate-900/70 rounded-2xl border border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-semibold mr-1">Domain Tags:</span>
                {structured.keywords.map((kw, i) => (
                  <span key={i} className="bg-slate-800 text-indigo-300 px-2.5 py-1 rounded-full text-xs border border-slate-700">
                    #{kw}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FULL DOCUMENT MARKDOWN TEXT */}
        {activeTab === 'markdown' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Raw Extracted Web Page Markdown Content
              </span>
              <span className="text-xs text-slate-500">
                URL: {docDetails?.url}
              </span>
            </div>
            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed max-h-[65vh] overflow-y-auto whitespace-pre-wrap shadow-inner">
              {docDetails?.markdown || 'No raw markdown text stored for this document.'}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Page Footer Bar */}
      <div className="mt-auto bg-slate-900 border-t border-slate-800 px-4 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border border-slate-700/60"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            <span>Return to Results Dashboard</span>
          </button>
          
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 hover:underline"
            >
              <span>{url}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

    </div>
  );

  return createPortal(modalContent, document.body);
}
