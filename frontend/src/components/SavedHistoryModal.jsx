import React from 'react';
import {
  X,
  History,
  Rocket,
  Calendar,
  ChevronRight,
  Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SavedHistoryModal({ isOpen, onClose, onSelectHistoryItem }) {
  const { savedHistory } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/75 flex items-center justify-center p-4 animate-fadeIn">
      
      {/* Modal Container */}
      <div className="bg-[var(--color-surface-1)] border border-[var(--color-line)] w-full max-w-3xl rounded-[4px] overflow-hidden text-[var(--color-text)] relative animate-scaleUp max-h-[85vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[var(--color-line)] bg-[var(--color-surface-2)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[3px] bg-[var(--color-surface-1)] border border-[var(--color-line)] flex items-center justify-center text-[var(--color-signal)] shrink-0">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-text)] tracking-tight flex items-center gap-2">
                Startup Evaluation Archives
                <span className="text-[11px] font-mono bg-[var(--color-surface-1)] text-[var(--color-signal)] border border-[var(--color-line)] px-2 py-0.5 rounded-[2px] font-semibold">
                  {savedHistory.length} Dossiers
                </span>
              </h2>
              <p className="text-xs text-[var(--color-muted)] font-mono">
                Historical scheme evaluation telemetry and AI recommendations.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-text)] bg-[var(--color-surface-1)] hover:bg-[var(--color-surface-2)] rounded-[3px] transition-colors cursor-pointer border border-[var(--color-line)]"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / History Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {savedHistory.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-[var(--color-surface-2)] rounded-[3px] border border-[var(--color-line)]">
              <Rocket className="w-8 h-8 text-[var(--color-muted)] mx-auto" />
              <h3 className="text-sm font-mono font-bold text-[var(--color-text)]">// No Archived Analyses</h3>
              <p className="text-xs text-[var(--color-muted)] font-mono max-w-sm mx-auto">
                Submit a startup profile to trigger AI evaluation and persist the resulting dossier here.
              </p>
            </div>
          ) : (
            savedHistory.map((item, idx) => {
              const onboarding = item.onboarding || {};
              const matched = item.matchedSchemes || [];
              const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent';

              const runScores = matched
                .map((s) => s.eligibilityScore)
                .filter((s) => typeof s === 'number');
              const runReadiness = runScores.length > 0
                ? Math.round(runScores.reduce((a, b) => a + b, 0) / runScores.length)
                : null;

              return (
                <div
                  key={item._id || idx}
                  className="p-4 sm:p-5 bg-[var(--color-surface-2)] hover:border-[var(--color-signal)] rounded-[3px] border border-[var(--color-line)] transition-colors space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-line)] pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[var(--color-signal)]" />
                        {onboarding.startupName || 'Startup Venture'}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[var(--color-muted)] mt-1">
                        <span className="bg-[var(--color-surface-1)] border border-[var(--color-line)] px-1.5 py-0.5 rounded-[2px] text-[var(--color-signal)] text-[11px]">
                          {onboarding.stage || 'Idea Stage'}
                        </span>
                        <span>&bull;</span>
                        <span>{onboarding.state || 'India'}</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {dateStr}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {runReadiness !== null && (
                        <span className="text-xs font-mono font-semibold bg-[var(--color-surface-1)] text-[var(--color-signal)] border border-[var(--color-line)] px-2.5 py-1 rounded-[3px]">
                          {runReadiness}% Readiness
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          if (onSelectHistoryItem) onSelectHistoryItem(item);
                          onClose();
                        }}
                        className="bg-[var(--color-signal)] hover:brightness-110 text-[#0E1119] font-mono font-semibold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-[3px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>View Dossier</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Top Matched Opportunities Preview */}
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-muted)] block mb-1.5">
                      Matched Opportunities ({matched.length}):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {matched.slice(0, 3).map((sch, i) => (
                        <div
                          key={i}
                          className="bg-[var(--color-surface-1)] border border-[var(--color-line)] px-2.5 py-1 rounded-[3px] text-xs font-mono flex items-center gap-2"
                        >
                          <span className="font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1 py-0.2 rounded-[2px] text-[10px]">
                            {sch.eligibilityScore}%
                          </span>
                          <span className="text-[var(--color-text)] truncate max-w-[200px]">{sch.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
