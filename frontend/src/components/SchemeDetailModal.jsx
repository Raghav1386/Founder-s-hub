import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import SchemeQaTab from './SchemeQaTab';
import { getApiUrl } from '../configs/api';
import {
  X,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  IndianRupee,
  Calendar,
  Layers,
  ChevronRight,
  Loader2,
  Award
} from 'lucide-react';

export default function SchemeDetailModal({
  schemeMatch,
  documentId,
  analysisId,
  startupContext,
  founderProfile,
  onClose
}) {
  const [loading, setLoading] = useState(false);
  const [docDetails, setDocDetails] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const targetId = documentId || schemeMatch?.documentId || schemeMatch?._id || schemeMatch?.id;
  const isValidMongoId = typeof targetId === 'string' && /^[0-9a-fA-F]{24}$/.test(targetId);

  const resolvedAnalysisId = analysisId || schemeMatch?.analysisId;
  const resolvedStartupContext = startupContext || schemeMatch?.startupContext;
  const resolvedFounderProfile = founderProfile || schemeMatch?.founderProfile;

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
        const response = await fetch(getApiUrl(`/api/founder/scheme/${targetId}`));
        if (response.ok) {
          const json = await response.json();
          if (isMounted) {
            setDocDetails(json.data);
          }
        }
      } catch (err) {
        // Fallback to schemeMatch
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

  const title = schemeMatch?.title || docDetails?.title || 'Scheme Details';
  const source = schemeMatch?.source || docDetails?.source || 'Government Portal';
  const url = schemeMatch?.url || docDetails?.url;
  const structured = docDetails?.structured || {};

  const modalContent = (
    <div className="fixed inset-0 z-[9999] bg-[var(--color-ink)] overflow-y-auto min-h-screen w-full animate-fadeIn flex flex-col text-[var(--color-text)]">
      
      {/* Top Header Bar */}
      <div className="sticky top-0 z-20 bg-[var(--color-surface-1)] border-b border-[var(--color-line)] px-4 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Left: Back Button & Title */}
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={onClose}
              className="mt-0.5 p-2 bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-1)] text-[var(--color-text)] rounded-[3px] transition-colors flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider shrink-0 cursor-pointer border border-[var(--color-line)]"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[var(--color-signal)]" />
              <span>Back</span>
            </button>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider bg-[var(--color-surface-2)] text-[var(--color-muted)] border border-[var(--color-line)] px-2 py-0.5 rounded-[2px]">
                  {source}
                </span>
                {schemeMatch && (
                  <span
                    className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded-[3px] border ${
                      schemeMatch.eligibilityScore >= 80
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : schemeMatch.eligibilityScore >= 60
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        : 'bg-red-500/10 text-red-300 border-red-500/30'
                    }`}
                  >
                    [{schemeMatch.eligibilityScore}% MATCH &bull; {schemeMatch.eligibilityStatus}]
                  </span>
                )}
              </div>
              <h1 className="text-lg sm:text-2xl font-bold text-[var(--color-text)] tracking-tight leading-snug">
                {title}
              </h1>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-[var(--color-signal)] hover:brightness-110 text-[#0E1119] rounded-[3px] text-xs font-mono font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors"
              >
                <span>Portal Access</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[var(--color-muted)] hover:text-[var(--color-text)] bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-1)] rounded-[3px] transition-colors cursor-pointer border border-[var(--color-line)]"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Sub-Header */}
        <div className="max-w-6xl mx-auto pt-3 mt-2 border-t border-[var(--color-line)] flex gap-4 sm:gap-6 text-xs font-mono uppercase tracking-wider overflow-x-auto no-scrollbar whitespace-nowrap">
          {schemeMatch && (
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`pb-2.5 border-b-2 transition-colors flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-[var(--color-signal)] text-[var(--color-signal)] font-semibold'
                  : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>[ Match Telemetry ]</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('qa')}
            className={`pb-2.5 border-b-2 transition-colors flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'qa'
                ? 'border-[var(--color-signal)] text-[var(--color-signal)] font-semibold'
                : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-signal)]" />
            <span>[ AI Policy Q&A ]</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guidelines')}
            className={`pb-2.5 border-b-2 transition-colors flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'guidelines'
                ? 'border-[var(--color-signal)] text-[var(--color-signal)] font-semibold'
                : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>[ Guidelines Matrix ]</span>
          </button>
        </div>
      </div>

      {/* Main Page Body Content */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 space-y-6">
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-3 bg-[var(--color-surface-1)] rounded-[4px] border border-[var(--color-line)]">
            <Loader2 className="w-6 h-6 text-[var(--color-signal)] animate-spin" />
            <span className="text-xs font-mono text-[var(--color-muted)]">Retrieving complete policy guidelines...</span>
          </div>
        )}

        {error && !loading && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-[3px] text-red-300 text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* TAB: AI Q&A ASSISTANT */}
        {activeTab === 'qa' && (
          <div className="animate-fadeIn">
            <SchemeQaTab
              schemeId={targetId}
              schemeTitle={title}
              source={source}
              url={url}
              analysisId={resolvedAnalysisId}
              startupContext={resolvedStartupContext}
              founderProfile={resolvedFounderProfile}
            />
          </div>
        )}

        {/* TAB 1: MATCH ANALYSIS OVERVIEW */}
        {activeTab === 'overview' && schemeMatch && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Reasoning Card */}
            <div className="p-5 sm:p-6 bg-[var(--color-surface-1)] rounded-[4px] border border-[var(--color-line)] space-y-3">
              <span className="text-xs font-mono font-semibold text-[var(--color-signal)] uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" /> AI Compatibility Evaluation
              </span>
              <p className="text-xs sm:text-sm text-[var(--color-text)] leading-relaxed italic bg-[var(--color-surface-2)] p-4 rounded-[3px] border border-[var(--color-line)] font-mono">
                "{schemeMatch.reasoning}"
              </p>
            </div>

            {/* Quick AI Q&A Launcher Banner */}
            <div className="p-4 sm:p-5 bg-[var(--color-surface-1)] rounded-[4px] border border-[var(--color-line)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[3px] bg-[var(--color-surface-2)] border border-[var(--color-line)] flex items-center justify-center shrink-0 text-[var(--color-signal)]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--color-text)]">Have specific queries about this opportunity?</h4>
                  <p className="text-xs font-mono text-[var(--color-muted)]">Ask our grounded AI policy assistant about eligibility limits or compliance.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('qa')}
                className="bg-[var(--color-signal)] hover:brightness-110 text-[#0E1119] font-mono text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded-[3px] transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>Launch Policy Q&A</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Benefits & Missing Requirements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Benefits */}
              <div className="p-5 sm:p-6 bg-[var(--color-surface-1)] rounded-[4px] border border-[var(--color-line)] space-y-3.5">
                <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Key Relevant Benefits
                </span>
                {Array.isArray(schemeMatch.benefitsRelevant) && schemeMatch.benefitsRelevant.length > 0 ? (
                  <ul className="space-y-2 text-xs">
                    {schemeMatch.benefitsRelevant.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5 p-2.5 bg-[var(--color-surface-2)] rounded-[3px] border border-[var(--color-line)]">
                        <span className="text-emerald-400 font-bold mt-0.5">&bull;</span>
                        <span className="text-[var(--color-text)] leading-normal">{b}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-xs font-mono text-[var(--color-muted)] italic">No specific benefits listed.</span>
                )}
              </div>

              {/* Missing Requirements */}
              <div className="p-5 sm:p-6 bg-[var(--color-surface-1)] rounded-[4px] border border-[var(--color-line)] space-y-3.5">
                <span className="text-xs font-mono font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Missing Requirements / Prerequisites
                </span>
                {Array.isArray(schemeMatch.missingRequirements) && schemeMatch.missingRequirements.length > 0 ? (
                  <ul className="space-y-2 text-xs">
                    {schemeMatch.missingRequirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2.5 p-2.5 bg-[var(--color-surface-2)] rounded-[3px] border border-[var(--color-line)]">
                        <span className="text-amber-400 font-bold mt-0.5">&bull;</span>
                        <span className="text-[var(--color-text)] leading-normal">{req}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-[3px] text-emerald-300 text-xs font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>All startup prerequisites met for this opportunity!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Recommended Next Steps */}
            {Array.isArray(schemeMatch.nextSteps) && schemeMatch.nextSteps.length > 0 && (
              <div className="p-5 sm:p-6 bg-[var(--color-surface-1)] rounded-[4px] border border-[var(--color-line)] space-y-4">
                <span className="text-xs font-mono font-semibold text-[var(--color-signal)] uppercase tracking-wider flex items-center gap-2">
                  <ChevronRight className="w-3.5 h-3.5" /> Actionable Next Steps
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {schemeMatch.nextSteps.map((step, i) => (
                    <div key={i} className="p-3 bg-[var(--color-surface-2)] rounded-[3px] border border-[var(--color-line)] flex items-start gap-2.5">
                      <span className="font-mono font-semibold text-[var(--color-signal)] bg-[var(--color-surface-1)] px-1.5 py-0.5 rounded-[2px] border border-[var(--color-line)] text-[10px] shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[var(--color-text)] leading-relaxed">{step}</span>
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
              <div className="p-5 sm:p-6 bg-[var(--color-surface-1)] rounded-[4px] border border-[var(--color-line)] space-y-2">
                <span className="text-xs font-mono font-semibold text-[var(--color-signal)] uppercase tracking-wider">
                  Summary Overview
                </span>
                <p className="text-xs sm:text-sm text-[var(--color-text)] leading-relaxed">
                  {structured.summary}
                </p>
              </div>
            )}

            {/* Funding & Key Criteria Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-[var(--color-surface-1)] rounded-[4px] border border-[var(--color-line)] space-y-1.5">
                <span className="text-[11px] font-mono text-[var(--color-muted)] uppercase tracking-wider flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-400" /> Funding Support Amount
                </span>
                <span className="text-base font-bold text-emerald-400 block font-mono">
                  {structured.funding?.amount || 'Refer to Official Portal'}
                </span>
                <span className="text-[10px] font-mono text-[var(--color-muted)]">
                  Instrument: {structured.funding?.type || 'N/A'}
                </span>
              </div>

              <div className="p-4 bg-[var(--color-surface-1)] rounded-[4px] border border-[var(--color-line)] space-y-1.5">
                <span className="text-[11px] font-mono text-[var(--color-muted)] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-signal)]" /> DPIIT Status Required
                </span>
                <span className="text-base font-bold text-[var(--color-text)] block font-mono">
                  {structured.eligibility?.dpiitRequired ? 'Yes (Mandatory)' : 'No (Open to all)'}
                </span>
                <span className="text-[10px] font-mono text-[var(--color-muted)]">Startup India Recognition</span>
              </div>

              <div className="p-4 bg-[var(--color-surface-1)] rounded-[4px] border border-[var(--color-line)] space-y-1.5">
                <span className="text-[11px] font-mono text-[var(--color-muted)] uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" /> Intake Timeline / Deadline
                </span>
                <span className="text-base font-bold text-amber-300 block font-mono">
                  {structured.deadline || 'Rolling Intake'}
                </span>
                <span className="text-[10px] font-mono text-[var(--color-muted)]">Application Cycle</span>
              </div>
            </div>

            {/* Eligibility Parameters Matrix */}
            {structured.eligibility && (
              <div className="p-5 sm:p-6 bg-[var(--color-surface-1)] rounded-[4px] border border-[var(--color-line)] space-y-4">
                <span className="text-xs font-mono font-semibold text-[var(--color-signal)] uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" /> Eligibility Requirements Matrix
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-[var(--color-surface-2)] rounded-[3px] border border-[var(--color-line)]">
                    <span className="text-[var(--color-text)] font-mono font-semibold block mb-2">Target Industry Sectors</span>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(structured.eligibility.sectors) && structured.eligibility.sectors.length > 0 ? (
                        structured.eligibility.sectors.map((sec, i) => (
                          <span key={i} className="bg-[var(--color-surface-1)] text-[var(--color-text)] px-2 py-0.5 rounded-[2px] font-mono text-[11px] border border-[var(--color-line)]">
                            {sec}
                          </span>
                        ))
                      ) : (
                        <span className="text-[var(--color-muted)] font-mono italic">Open to All Sectors</span>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 bg-[var(--color-surface-2)] rounded-[3px] border border-[var(--color-line)]">
                    <span className="text-[var(--color-text)] font-mono font-semibold block mb-2">Applicable Startup Stages</span>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(structured.eligibility.startupStages) && structured.eligibility.startupStages.length > 0 ? (
                        structured.eligibility.startupStages.map((stg, i) => (
                          <span key={i} className="bg-[var(--color-surface-1)] text-[var(--color-signal)] px-2 py-0.5 rounded-[2px] font-mono text-[11px] border border-[var(--color-line)]">
                            {stg}
                          </span>
                        ))
                      ) : (
                        <span className="text-[var(--color-muted)] font-mono italic">All Stages</span>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 bg-[var(--color-surface-2)] rounded-[3px] border border-[var(--color-line)]">
                    <span className="text-[var(--color-text)] font-mono font-semibold block mb-2">Eligible Entity Types</span>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(structured.eligibility.entityTypes) && structured.eligibility.entityTypes.length > 0 ? (
                        structured.eligibility.entityTypes.map((ent, i) => (
                          <span key={i} className="bg-[var(--color-surface-1)] text-[var(--color-text)] px-2 py-0.5 rounded-[2px] font-mono text-[11px] border border-[var(--color-line)]">
                            {ent}
                          </span>
                        ))
                      ) : (
                        <span className="text-[var(--color-muted)] font-mono italic">All Entity Types</span>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 bg-[var(--color-surface-2)] rounded-[3px] border border-[var(--color-line)]">
                    <span className="text-[var(--color-text)] font-mono font-semibold block mb-2">Applicable States / UTs</span>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(structured.eligibility.states) && structured.eligibility.states.length > 0 ? (
                        structured.eligibility.states.map((st, i) => (
                          <span key={i} className="bg-[var(--color-surface-1)] text-[var(--color-text)] px-2 py-0.5 rounded-[2px] font-mono text-[11px] border border-[var(--color-line)]">
                            {st}
                          </span>
                        ))
                      ) : (
                        <span className="text-[var(--color-muted)] font-mono italic">All India</span>
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
                <div className="p-5 sm:p-6 bg-[var(--color-surface-1)] rounded-[4px] border border-[var(--color-line)] space-y-3">
                  <span className="text-xs font-mono font-semibold text-[var(--color-signal)] uppercase tracking-wider">
                    Step-by-Step Application Procedure
                  </span>
                  <ol className="space-y-2 text-xs text-[var(--color-text)]">
                    {structured.applicationProcess.map((step, i) => (
                      <li key={i} className="flex items-start gap-2.5 p-2.5 bg-[var(--color-surface-2)] rounded-[3px] border border-[var(--color-line)]">
                        <span className="font-mono font-semibold text-[var(--color-signal)] shrink-0">{i + 1}.</span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Required Documents */}
              {Array.isArray(structured.requiredDocuments) && structured.requiredDocuments.length > 0 && (
                <div className="p-5 sm:p-6 bg-[var(--color-surface-1)] rounded-[4px] border border-[var(--color-line)] space-y-3">
                  <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                    Required Application Documents
                  </span>
                  <ul className="space-y-2 text-xs text-[var(--color-text)]">
                    {structured.requiredDocuments.map((docItem, i) => (
                      <li key={i} className="flex items-start gap-2.5 p-2.5 bg-[var(--color-surface-2)] rounded-[3px] border border-[var(--color-line)]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{docItem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Keywords */}
            {Array.isArray(structured.keywords) && structured.keywords.length > 0 && (
              <div className="p-4 bg-[var(--color-surface-1)] rounded-[4px] border border-[var(--color-line)] flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[var(--color-muted)] font-mono text-[11px] mr-1">Telemetry Tags:</span>
                {structured.keywords.map((kw, i) => (
                  <span key={i} className="bg-[var(--color-surface-2)] text-[var(--color-text)] px-2 py-0.5 rounded-[2px] font-mono text-[11px] border border-[var(--color-line)]">
                    #{kw}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Page Footer Bar */}
      <div className="mt-auto bg-[var(--color-surface-1)] border-t border-[var(--color-line)] px-4 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-1)] text-[var(--color-text)] rounded-[3px] text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer border border-[var(--color-line)]"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[var(--color-signal)]" />
            <span>Return to Dashboard</span>
          </button>
          
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-[var(--color-signal)] hover:underline flex items-center gap-1.5"
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
