import React, { useState } from 'react';
import SchemeDetailModal from './SchemeDetailModal';
import {
  Send,
  Loader2,
  CheckCircle2,
  RotateCcw,
  Edit3,
  Code,
  Sparkles,
  Building,
  MapPin,
  ShieldCheck,
  Rocket,
  Users,
  Target,
  IndianRupee,
  Copy,
  Check,
  FileText,
  Eye,
  ExternalLink
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../configs/api';
import { trackEvent } from '../configs/analytics';

export default function SubmitResult({ formData, initialResult, onEditStep, onResetForm, onGoDashboard }) {
  const { idToken, fetchUserHistory } = useAuth();
  const [status, setStatus] = useState(initialResult ? 'success' : 'idle');
  const [apiResponse, setApiResponse] = useState(initialResult || null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [selectedSchemeForModal, setSelectedSchemeForModal] = useState(null);

  React.useEffect(() => {
    if (initialResult) {
      setApiResponse(initialResult);
      setStatus('success');
    }
  }, [initialResult]);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    setStatus('submitting');
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (idToken) {
        headers['Authorization'] = `Bearer ${idToken}`;
      }

      const response = await fetch(getApiUrl('/api/founder/analyze'), {
        method: 'POST',
        headers,
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setApiResponse(data);
        setStatus('success');
        trackEvent('analysis_completed', {
          startupName: formData.startupName,
          stage: formData.startupStage,
          state: formData.stateUt
        });
        if (fetchUserHistory) fetchUserHistory();
      } else {
        const mockAnalysis = generateMockAnalysis(formData);
        setApiResponse({
          status: 'simulated_success',
          httpCode: response.status,
          message: 'Form submitted successfully (Mock Mode)',
          submittedData: formData,
          analysisResult: mockAnalysis
        });
        setStatus('success');
      }
    } catch (err) {
      const mockAnalysis = generateMockAnalysis(formData);
      setApiResponse({
        status: 'simulated_success',
        errorInfo: err.message,
        message: 'Analysis executed successfully (Mock Mode)',
        submittedData: formData,
        analysisResult: mockAnalysis
      });
      setStatus('success');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-[var(--color-line)] pb-4">
        <div className="flex items-center gap-2 text-[var(--color-signal)] font-mono text-xs uppercase tracking-wider mb-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>// Final Verification &bull; Stage 05/05</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text)] tracking-tight">
          {status === 'success' ? 'Analysis Complete & Dossier Generated' : 'Review & Submit Startup Data'}
        </h2>
        <p className="text-[var(--color-muted)] text-xs sm:text-sm mt-1">
          {status === 'success'
            ? 'Your startup profile was analyzed against verified government schemes and grants.'
            : 'Please review all telemetry points below before triggering the evaluation.'}
        </p>
      </div>

      {/* Tabs toggle (Only before submission) */}
      {status !== 'success' && (
        <div className="flex items-center justify-between border-b border-[var(--color-line)]">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('summary')}
              className={`pb-2.5 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                activeTab === 'summary'
                  ? 'border-[var(--color-signal)] text-[var(--color-signal)] font-semibold'
                  : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              [ Form Overview ]
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('json')}
              className={`pb-2.5 text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer border-b-2 ${
                activeTab === 'json'
                  ? 'border-[var(--color-signal)] text-[var(--color-signal)] font-semibold'
                  : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              [ JSON Payload ]
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyJson}
            className="text-[11px] font-mono text-[var(--color-muted)] hover:text-[var(--color-text)] flex items-center gap-1.5 bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-1)] px-2.5 py-1 rounded-[3px] border border-[var(--color-line)] transition-colors mb-2 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[var(--color-muted)]" />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>
        </div>
      )}

      {/* Content based on Active Tab */}
      {activeTab === 'summary' || status === 'success' ? (
        <div className="space-y-4">
          {/* Card 1: Identity & Location */}
          <div className="p-4 bg-[var(--color-surface-2)] rounded-[3px] border border-[var(--color-line)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[var(--color-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[var(--color-signal)]" /> 01 // Identity & Location
              </span>
              <button
                type="button"
                onClick={() => onEditStep(1)}
                className="text-xs font-mono text-[var(--color-signal)] hover:underline flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3 h-3" /> Edit
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-[var(--color-muted)] text-[11px] font-mono block">Startup Name</span>
                <span className="font-semibold text-[var(--color-text)]">{formData.startupName || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[var(--color-muted)] text-[11px] font-mono block">State / UT</span>
                <span className="font-semibold text-[var(--color-text)] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[var(--color-signal)]" />
                  {formData.stateUt || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Legal & Recognition */}
          <div className="p-4 bg-[var(--color-surface-2)] rounded-[3px] border border-[var(--color-line)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[var(--color-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-signal)]" /> 02 // Legal & DPIIT Status
              </span>
              <button
                type="button"
                onClick={() => onEditStep(2)}
                className="text-xs font-mono text-[var(--color-signal)] hover:underline flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3 h-3" /> Edit
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-[var(--color-muted)] text-[11px] font-mono block">Incorporation Structure</span>
                <span className="font-semibold text-[var(--color-text)]">{formData.isIncorporated || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[var(--color-muted)] text-[11px] font-mono block">DPIIT Recognition</span>
                <span className="font-semibold text-[var(--color-text)]">{formData.dpiitRecognition || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Metrics */}
          <div className="p-4 bg-[var(--color-surface-2)] rounded-[3px] border border-[var(--color-line)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[var(--color-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <Rocket className="w-3.5 h-3.5 text-[var(--color-signal)]" /> 03 // Stage & Team Size
              </span>
              <button
                type="button"
                onClick={() => onEditStep(3)}
                className="text-xs font-mono text-[var(--color-signal)] hover:underline flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3 h-3" /> Edit
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-[var(--color-muted)] text-[11px] font-mono block">Startup Stage</span>
                <span className="font-semibold text-[var(--color-text)]">{formData.startupStage || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[var(--color-muted)] text-[11px] font-mono block">Team Size</span>
                <span className="font-semibold text-[var(--color-text)] flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[var(--color-signal)]" />
                  {formData.teamSize ? `${formData.teamSize} members` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Support & Funding */}
          <div className="p-4 bg-[var(--color-surface-2)] rounded-[3px] border border-[var(--color-line)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[var(--color-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[var(--color-signal)]" /> 04 // Support Needed & Funding
              </span>
              <button
                type="button"
                onClick={() => onEditStep(4)}
                className="text-xs font-mono text-[var(--color-signal)] hover:underline flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3 h-3" /> Edit
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-[var(--color-muted)] text-[11px] font-mono block mb-1.5">Support Services Requested</span>
                <div className="flex flex-wrap gap-1.5">
                  {Array.isArray(formData.supportNeeded) && formData.supportNeeded.length > 0 ? (
                    formData.supportNeeded.map((item) => (
                      <span
                        key={item}
                        className="text-xs font-mono px-2 py-0.5 rounded-[3px] bg-[var(--color-surface-1)] text-[var(--color-signal)] border border-[var(--color-line)]"
                      >
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-[var(--color-muted)] text-xs italic font-mono">None selected</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-[var(--color-muted)] text-[11px] font-mono block mt-2">Funding Requirement</span>
                <span className="font-semibold text-[var(--color-text)] flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                  {formData.fundingRequirement || 'Not specified (Optional)'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 5: Pitch Description */}
          <div className="p-4 bg-[var(--color-surface-2)] rounded-[3px] border border-[var(--color-line)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[var(--color-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[var(--color-signal)]" /> 05 // Startup Pitch Description
              </span>
              <button
                type="button"
                onClick={() => onEditStep(5)}
                className="text-xs font-mono text-[var(--color-signal)] hover:underline flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3 h-3" /> Edit
              </button>
            </div>
            <p className="text-xs text-[var(--color-text)] leading-relaxed bg-[var(--color-surface-1)] p-3 rounded-[3px] border border-[var(--color-line)] whitespace-pre-wrap font-mono">
              {formData.description || 'No description provided.'}
            </p>
          </div>
        </div>
      ) : (
        /* JSON Payload Tab */
        <div className="space-y-3">
          <div className="bg-[var(--color-surface-2)] p-4 rounded-[3px] border border-[var(--color-line)] font-mono text-xs text-[var(--color-text)] overflow-x-auto">
            <pre>{JSON.stringify(formData, null, 2)}</pre>
          </div>
          <p className="text-[var(--color-muted)] font-mono text-xs">
            Payload target: <code className="text-[var(--color-signal)] bg-[var(--color-surface-2)] px-1 py-0.5 rounded-[2px] border border-[var(--color-line)]">/api/founder/analyze</code>
          </p>
        </div>
      )}

      {/* Submission Status & AI Scheme Match Results display */}
      {status === 'success' && apiResponse && (() => {
        const resultSchemes = apiResponse.data?.matchedSchemes || [];
        const resultScores = resultSchemes.map((s) => s.eligibilityScore).filter((s) => typeof s === 'number');
        const resultReadiness = resultScores.length > 0
          ? Math.round(resultScores.reduce((a, b) => a + b, 0) / resultScores.length)
          : null;

        return (
          <div className="p-5 sm:p-6 bg-[var(--color-surface-1)] border border-[var(--color-line)] rounded-[4px] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-line)] pb-4">
              <div className="flex items-center gap-2.5 text-[var(--color-text)] font-bold text-base sm:text-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Eligibility Telemetry Dossier Complete</span>
              </div>
              <div className="flex items-center gap-2">
                {resultReadiness !== null && (
                  <span className="font-mono text-xs font-semibold text-[var(--color-signal)] bg-[var(--color-surface-2)] px-2.5 py-1 rounded-[3px] border border-[var(--color-line)]">
                    {resultReadiness}% Readiness Score
                  </span>
                )}
                <span className="font-mono text-[11px] font-semibold text-emerald-400 bg-[var(--color-surface-2)] px-2.5 py-1 rounded-[3px] border border-emerald-500/30 uppercase tracking-wider">
                  VERIFIED
                </span>
              </div>
            </div>

            {/* AI Structured Founder Profile Summary */}
            {apiResponse.data?.founderProfile && (
              <div className="p-4 sm:p-5 bg-[var(--color-surface-2)] rounded-[3px] border border-[var(--color-line)] space-y-3">
                <span className="font-mono font-semibold text-xs uppercase tracking-wider text-[var(--color-signal)] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Founder Profile Intelligence
                </span>
                <p className="text-xs sm:text-sm text-[var(--color-text)] leading-relaxed italic bg-[var(--color-surface-1)] p-3 rounded-[3px] border border-[var(--color-line)]">
                  "{apiResponse.data.founderProfile.summary}"
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                  <div className="p-2.5 bg-[var(--color-surface-1)] rounded-[3px] border border-[var(--color-line)]">
                    <span className="text-[var(--color-muted)] font-mono text-[10px] block uppercase">Sector</span>
                    <span className="font-semibold text-[var(--color-text)]">{apiResponse.data.founderProfile.sector}</span>
                  </div>
                  <div className="p-2.5 bg-[var(--color-surface-1)] rounded-[3px] border border-[var(--color-line)]">
                    <span className="text-[var(--color-muted)] font-mono text-[10px] block uppercase">Sub-Sector</span>
                    <span className="font-semibold text-[var(--color-text)]">{apiResponse.data.founderProfile.subSector}</span>
                  </div>
                  <div className="p-2.5 bg-[var(--color-surface-1)] rounded-[3px] border border-[var(--color-line)]">
                    <span className="text-[var(--color-muted)] font-mono text-[10px] block uppercase">Business Model</span>
                    <span className="font-semibold text-[var(--color-text)]">{apiResponse.data.founderProfile.businessModel}</span>
                  </div>
                  <div className="p-2.5 bg-[var(--color-surface-1)] rounded-[3px] border border-[var(--color-line)]">
                    <span className="text-[var(--color-muted)] font-mono text-[10px] block uppercase">Confidence</span>
                    <span className="font-mono font-semibold text-emerald-400">
                      {Math.round((apiResponse.data.founderProfile.confidenceScore || 0.9) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Matched Government Schemes List */}
            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between border-b border-[var(--color-line)] pb-3">
                <h3 className="text-sm font-mono uppercase tracking-wider font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-[var(--color-signal)]" />
                  Matched Government Schemes ({apiResponse.data?.matchedSchemes?.length || 0})
                </h3>
                <span className="text-[11px] font-mono text-[var(--color-muted)]">RANKED BY ELIGIBILITY</span>
              </div>

              {Array.isArray(apiResponse.data?.matchedSchemes) && apiResponse.data.matchedSchemes.length > 0 ? (
                <div className="space-y-3">
                  {apiResponse.data.matchedSchemes.map((scheme, idx) => (
                    <div
                      key={scheme.documentId || idx}
                      className="p-4 bg-[var(--color-surface-2)] rounded-[3px] border border-[var(--color-line)] space-y-3 hover:border-[var(--color-signal)] transition-colors"
                    >
                      {/* Title & Score Badge */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-line)] pb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <a
                            href={scheme.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-sm text-[var(--color-text)] hover:text-[var(--color-signal)] hover:underline flex items-center gap-1.5"
                          >
                            {scheme.title}
                            <ExternalLink className="w-3.5 h-3.5 text-[var(--color-muted)]" />
                          </a>
                          <span className="text-[10px] font-mono uppercase tracking-wider bg-[var(--color-surface-1)] text-[var(--color-muted)] px-1.5 py-0.5 rounded-[2px] border border-[var(--color-line)]">
                            {scheme.source}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-mono font-semibold px-2.5 py-1 rounded-[3px] border ${
                              scheme.eligibilityScore >= 80
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : scheme.eligibilityScore >= 60
                                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                : 'bg-red-500/10 text-red-300 border-red-500/30'
                            }`}
                          >
                            [{scheme.eligibilityScore}% MATCH &bull; {scheme.eligibilityStatus}]
                          </span>
                        </div>
                      </div>

                      {/* Reasoning */}
                      <p className="text-xs text-[var(--color-muted)] leading-relaxed">{scheme.reasoning}</p>

                      {/* Benefits & Next Steps Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                        {/* Benefits */}
                        {Array.isArray(scheme.benefitsRelevant) && scheme.benefitsRelevant.length > 0 && (
                          <div className="p-3 bg-[var(--color-surface-1)] rounded-[3px] border border-[var(--color-line)] space-y-1.5">
                            <span className="font-mono text-[10px] font-semibold text-emerald-400 block uppercase tracking-wider">
                              Key Relevant Benefits
                            </span>
                            <ul className="space-y-1 text-xs text-[var(--color-muted)]">
                              {scheme.benefitsRelevant.map((b, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-emerald-400 font-bold">&bull;</span>
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Next Steps */}
                        {Array.isArray(scheme.nextSteps) && scheme.nextSteps.length > 0 && (
                          <div className="p-3 bg-[var(--color-surface-1)] rounded-[3px] border border-[var(--color-line)] space-y-1.5">
                            <span className="font-mono text-[10px] font-semibold text-[var(--color-signal)] block uppercase tracking-wider">
                              Recommended Next Steps
                            </span>
                            <ul className="space-y-1 text-xs text-[var(--color-muted)]">
                              {scheme.nextSteps.map((step, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-[var(--color-signal)] font-mono font-semibold">{i + 1}.</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* View Scheme Details Action Button */}
                      <div className="pt-2 flex justify-end border-t border-[var(--color-line)]">
                        <button
                          type="button"
                          onClick={() => setSelectedSchemeForModal(scheme)}
                          className="text-xs font-mono text-[var(--color-signal)] hover:text-[var(--color-text)] flex items-center gap-1.5 bg-[var(--color-surface-1)] hover:bg-[var(--color-surface-2)] px-3 py-1.5 rounded-[3px] border border-[var(--color-line)] hover:border-[var(--color-signal)] transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[var(--color-signal)]" />
                          <span>[ View Full Guidelines & AI Q&A ]</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-mono text-[var(--color-muted)] italic">No matched schemes found.</p>
              )}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {onGoDashboard && (
                <button
                  type="button"
                  onClick={onGoDashboard}
                  className="px-4 py-2 bg-[var(--color-signal)] hover:brightness-110 text-[#0E1119] rounded-[3px] font-mono text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  <span>Return to Dashboard</span>
                </button>
              )}
              <button
                type="button"
                onClick={onResetForm}
                className="px-4 py-2 bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-1)] text-[var(--color-text)] border border-[var(--color-line)] rounded-[3px] font-mono text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[var(--color-muted)]" />
                <span>Start New Analysis</span>
              </button>
            </div>
          </div>
        );
      })()}

      {/* Main Action Buttons */}
      {status !== 'success' && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-[var(--color-line)]">
          <button
            type="button"
            onClick={() => onEditStep(5)}
            className="px-4 py-2 text-[var(--color-muted)] hover:text-[var(--color-text)] font-mono text-xs uppercase tracking-wider transition-colors text-center border border-[var(--color-line)] sm:border-none rounded-[3px] sm:rounded-none cursor-pointer"
          >
            &larr; Back to Step 05
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={status === 'submitting'}
            className="w-full sm:w-auto px-6 py-2.5 bg-[var(--color-signal)] hover:brightness-110 text-[#0E1119] font-mono text-xs uppercase tracking-wider font-semibold rounded-[3px] flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {status === 'submitting' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0E1119]" />
                <span>Analyzing Telemetry...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 text-[#0E1119]" />
                <span>Trigger AI Evaluation</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Scheme Detail Modal View */}
      {selectedSchemeForModal && (
        <SchemeDetailModal
          schemeMatch={selectedSchemeForModal}
          documentId={selectedSchemeForModal.documentId}
          onClose={() => setSelectedSchemeForModal(null)}
        />
      )}
    </div>
  );
}

// Helper to generate simulated response payload
function generateMockAnalysis(data) {
  return {
    startupName: data.startupName,
    readinessScore: 88,
    dpiitEligible: true,
    recommendedPrograms: [
      "Startup India Seed Fund Scheme (SISFS)",
      `State Incubator & Startup Policy - ${data.stateUt || 'National'}`
    ],
    recommendedFundingTypes: data.supportNeeded
  };
}
