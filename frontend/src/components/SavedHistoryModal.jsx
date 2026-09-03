import React from 'react';
import {
  X,
  History,
  Sparkles,
  Rocket,
  Calendar,
  ChevronRight,
  Award,
  Building2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SavedHistoryModal({ isOpen, onClose, onSelectHistoryItem }) {
  const { savedHistory, loading } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      
      {/* Modal Container */}
      <div className="bg-slate-900 border border-slate-800/90 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden text-slate-200 relative animate-scaleUp max-h-[85vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 shrink-0">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                My Saved Startup Analyses
                <span className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded-full font-bold">
                  {savedHistory.length} Saved
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Access your past scheme evaluation results and AI recommendations.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / History Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {savedHistory.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-slate-950/40 rounded-2xl border border-slate-800/80">
              <Rocket className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300">No Saved Analyses Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Submit a startup profile to run AI evaluation and your results will automatically save here.
              </p>
            </div>
          ) : (
            savedHistory.map((item, idx) => {
              const onboarding = item.onboarding || {};
              const matched = item.matchedSchemes || [];
              const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent';

              return (
                <div
                  key={item._id || idx}
                  className="p-5 bg-slate-950/80 hover:bg-slate-950 rounded-2xl border border-slate-800/80 hover:border-indigo-500/50 transition-all space-y-3 group shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-indigo-400" />
                        {onboarding.startupName || 'Startup Venture'}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-semibold text-indigo-300">
                          {onboarding.stage || 'Idea Stage'}
                        </span>
                        <span>&bull;</span>
                        <span>{onboarding.state || 'India'}</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {dateStr}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectHistoryItem) onSelectHistoryItem(item);
                        onClose();
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow shrink-0"
                    >
                      <span>View Results</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Top Matched Opportunities Preview */}
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-2">
                      Top Matched Opportunities ({matched.length}):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {matched.slice(0, 3).map((sch, i) => (
                        <div
                          key={i}
                          className="bg-slate-900 border border-slate-800/80 px-3 py-1.5 rounded-xl text-xs flex items-center gap-2"
                        >
                          <span className="font-bold text-emerald-400">{sch.eligibilityScore}%</span>
                          <span className="text-slate-300 font-medium truncate max-w-[200px]">{sch.title}</span>
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
