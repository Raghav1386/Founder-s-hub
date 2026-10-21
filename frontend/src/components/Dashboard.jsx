import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  History,
  Award,
  Cloud,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Search,
  Building2,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileText,
  Info,
  Check,
  Zap,
  Rocket
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard({
  onStartNewAnalysis,
  onSelectHistoryItem,
  onReRunAnalysis,
  onOpenSchemeModal
}) {
  const { user, mongoUser, savedHistory, fetchUserHistory, isAuthenticated, isHistoryLoading } = useAuth();
  const [searchFilter, setSearchFilter] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-fetch history on mount if user is authenticated and history is not yet populated
  useEffect(() => {
    if (isAuthenticated && savedHistory.length === 0 && fetchUserHistory) {
      fetchUserHistory();
    }
  }, [isAuthenticated]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (fetchUserHistory) {
      await fetchUserHistory();
    }
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const displayName = user?.displayName || mongoUser?.name || 'Founder';
  const latestStartupName =
    savedHistory[0]?.onboarding?.startupName || mongoUser?.startupName || 'Your Venture';

  // Aggregate statistics
  const totalAnalyses = savedHistory.length;

  // Most recent evaluation analysis
  const latestAnalysis = savedHistory[0];
  const latestScores = (latestAnalysis?.matchedSchemes || [])
    .map((s) => s.eligibilityScore)
    .filter((s) => typeof s === 'number');
  const latestReadinessScore = latestScores.length > 0
    ? Math.round(latestScores.reduce((a, b) => a + b, 0) / latestScores.length)
    : null;

  // Overall average across all evaluation runs
  const allScores = savedHistory.flatMap((item) =>
    (item.matchedSchemes || [])
      .map((s) => s.eligibilityScore)
      .filter((s) => typeof s === 'number')
  );
  const overallAvgScore = allScores.length > 0
    ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
    : null;

  // Filtered analyses
  const filteredHistory = savedHistory.filter((item) => {
    if (!searchFilter.trim()) return true;
    const term = searchFilter.toLowerCase();
    const name = (item.onboarding?.startupName || '').toLowerCase();
    const sector = (item.founderProfile?.sector || item.onboarding?.state || '').toLowerCase();
    return name.includes(term) || sector.includes(term);
  });

  // Featured flagship government schemes
  const featuredSchemes = [
    {
      id: 'sisfs',
      documentId: '6a777dd86a4da70e2a1a9fc8',
      title: 'Startup India Seed Fund Scheme (SISFS)',
      grantAmount: '₹50 Lakhs',
      fundingType: 'Grant & Convertible Debenture',
      stage: 'Proof of Concept / Prototype / Trial',
      department: 'DPIIT & Startup India',
      description: 'Provides non-dilutive financial assistance to startups for proof of concept, prototype development, product trials, market entry, and commercialization through approved incubators across India.',
      prerequisites: 'DPIIT Recognition, < 2 years incorporation, Indian shareholding >= 51%',
      portalUrl: 'https://seedfund.startupindia.gov.in/'
    },
    {
      id: 'birac_big',
      documentId: '6a777d5bb5459bcb135dbdd4',
      title: 'BIRAC Biotechnology Ignition Grant (BIG)',
      grantAmount: '₹50 Lakhs',
      fundingType: '100% Non-Dilutive Grant',
      stage: 'Early-Stage R&D / Feasibility',
      department: 'Department of Biotechnology (DBT)',
      description: 'Zero-equity grant-in-aid to support entrepreneurs and tech startups to establish proof-of-concept for innovative biotech, healthcare, agritech, and industrial bio-solutions.',
      prerequisites: 'Private Limited / LLP, < 5 years incorporation, registered scientific project',
      portalUrl: 'https://birac.nic.in/big.php'
    },
    {
      id: 'nidhi_prayas',
      documentId: '6a777df26a4da70e2a1a9fcc',
      title: 'DST NIDHI-PRAYAS Prototype Grant',
      grantAmount: '₹10 Lakhs',
      fundingType: 'Pure Prototype Grant',
      stage: 'Idea to Prototype / Hardware Lab',
      department: 'Department of Science and Technology (DST)',
      description: 'Addresses the gap between idea and prototype funding. Innovators and early-stage ventures get up to ₹10 Lakhs grant support and fab-lab fabrication access at DST-recognized TBIs.',
      prerequisites: 'Hardware / physical tech component, working through recognized PRAYAS Centre',
      portalUrl: 'http://www.nidhi-prayas.org/'
    },
    {
      id: 'meity_samridh',
      documentId: '6a8450c1fcdfa4322caef356',
      title: 'MeitY SAMRIDH Accelerator Scheme',
      grantAmount: '₹40 Lakhs + Matching Capital',
      fundingType: 'Matching Capital & Acceleration',
      stage: 'Scale-up / Customer Traction',
      department: 'Ministry of Electronics & IT (MeitY)',
      description: 'Supports software product startups with customized acceleration, product validation, global market access, and matching government investment up to ₹40 Lakhs alongside venture investors.',
      prerequisites: 'Tech product with demonstrable traction, active customer proof-points',
      portalUrl: 'https://meity.gov.in/'
    }
  ];

  // Featured Cloud & Tech Credit Perks
  const cloudPerks = [
    {
      name: 'Microsoft for Startups Founders Hub',
      provider: 'Microsoft & OpenAI',
      credits: 'Up to $150,000',
      badge: 'Tier-Free Access',
      perks: ['$150k Azure credits', '$2,500 OpenAI credits', 'GitHub Enterprise Free', 'Visual Studio Enterprise'],
      portalUrl: 'https://www.microsoft.com/en-us/startups'
    },
    {
      name: 'AWS Activate Portfolio & Founders',
      provider: 'Amazon Web Services',
      credits: 'Up to $100,000',
      badge: '2 Years Validity',
      perks: ['$100k AWS cloud credits', '$10k AWS Business Support', '1-on-1 Architect Office Hours', 'Free training labs'],
      portalUrl: 'https://aws.amazon.com/activate/'
    },
    {
      name: 'Google for Startups Cloud Program',
      provider: 'Google Cloud Platform',
      credits: 'Up to $100,000',
      badge: 'AI Priority',
      perks: ['$100k GCP credits for Year 1', 'Google Workspace free for 1 year', 'Gemini API credits', 'Google Web3 grant option'],
      portalUrl: 'https://cloud.google.com/startup'
    },
    {
      name: 'NVIDIA Inception Program',
      provider: 'NVIDIA AI Tech Center',
      credits: 'GPU Credits & Hardware',
      badge: 'Deep Tech & AI',
      perks: ['Preferred GPU pricing', 'NVIDIA Deep Learning Institute credits', 'Technical forum support', 'VC introductions'],
      portalUrl: 'https://www.nvidia.com/en-us/startups/'
    }
  ];

  // Regulatory & Tax Policy Cheat-Sheets
  const policyCheatSheets = [
    {
      title: 'DPIIT Section 80-IAC Tax Holiday',
      benefit: '100% Tax Exemption for 3 Consecutive Years',
      criteria: 'Eligible for Private Ltd or LLP incorporated between April 1, 2016 and March 31, 2025. Annual turnover must not exceed ₹100 Crore.',
      actionNote: 'Requires DPIIT Recognition + Inter-Ministerial Board (IMB) certification approval.'
    },
    {
      title: 'Section 56(2)(viib) Angel Tax Abolition',
      benefit: 'Zero Tax on Share Premium from All Investors',
      criteria: 'Union Budget officially abolished Angel Tax for all resident and non-resident startup investments, removing valuation friction.',
      actionNote: 'No special IMB filing required for capital raised above Fair Market Value (FMV).'
    },
    {
      title: 'Fast-Track Patent & IP Fee Rebate',
      benefit: '80% Patent Fee Waiver & 50% Trademark Waiver',
      criteria: 'Startups with verified DPIIT certificate receive expedited patent examination and an 80% statutory fee reduction with government-subsidized patent facilitators.',
      actionNote: 'Reduces patent grant timeline from 4-5 years down to 12-18 months.'
    },
    {
      title: 'GeM Startup Runway Direct Procurement',
      benefit: 'Waiver of Prior Turnover & Experience in Tenders',
      criteria: 'Startups can list innovative products directly on Government e-Marketplace (GeM) with exemption from prior experience, turnover, and EMD.',
      actionNote: 'Direct procurement channel to 70,000+ government buyer departments.'
    }
  ];

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn text-[var(--color-text-primary)]">
      
      {/* SECTION 1: FOUNDER CONSOLE HEADER & METRIC KPI STRIP */}
      <section className="studio-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-line)]">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[var(--color-signal)] mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-signal)]" />
              <span>Founder Console &bull; Active Index</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Welcome back, {displayName}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
              {totalAnalyses > 0 ? (
                <>
                  Active workspace for <strong className="text-[var(--color-text-primary)] font-semibold">{latestStartupName}</strong> &bull; {totalAnalyses} {totalAnalyses === 1 ? 'evaluation' : 'evaluations'} recorded.
                </>
              ) : (
                <>
                  Welcome to your founder workspace &bull; Complete your first startup evaluation to unlock your readiness score.
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="studio-btn-secondary"
              title="Refresh evaluations"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin text-[var(--color-signal)]' : 'text-[var(--color-text-dim)]'}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Data'}</span>
            </button>

            <button
              type="button"
              onClick={onStartNewAnalysis}
              className="studio-btn-primary"
              data-cursor="Evaluate"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              <span>New Analysis</span>
            </button>
          </div>
        </div>

        {/* 4 Metric KPI Cards Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-6">
          
          <div className="studio-card-nested p-4">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-dim)] mb-1">
              <span>Saved Analyses</span>
              <History className="w-3.5 h-3.5 text-[var(--color-signal)]" />
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
              {isHistoryLoading && totalAnalyses === 0 ? (
                <span className="inline-block h-7 w-8 bg-[var(--color-surface-2)] animate-pulse rounded-[2px]" />
              ) : (
                totalAnalyses
              )}
            </div>
            <div className="font-mono text-[11px] text-[var(--color-text-dim)] mt-1">
              {isHistoryLoading && totalAnalyses === 0
                ? 'Syncing archives...'
                : totalAnalyses === 0
                ? 'No evaluations yet'
                : `${totalAnalyses} ${totalAnalyses === 1 ? 'profile' : 'profiles'} recorded`}
            </div>
          </div>

          <div className="studio-card-nested p-4">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-dim)] mb-1">
              <span>Capital Ceiling</span>
              <Award className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-emerald-400">
              ₹50L+
            </div>
            <div className="font-mono text-[11px] text-[var(--color-text-dim)] mt-1">
              Max non-dilutive grant
            </div>
          </div>

          <div className="studio-card-nested p-4">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-dim)] mb-1">
              <span>Tech Credits</span>
              <Cloud className="w-3.5 h-3.5 text-[var(--color-signal)]" />
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
              $350K+
            </div>
            <div className="font-mono text-[11px] text-[var(--color-text-dim)] mt-1">
              Tier-1 cloud pool
            </div>
          </div>

          <div className="studio-card-nested p-4">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-dim)] mb-1">
              <span>Readiness Score</span>
              <TrendingUp className="w-3.5 h-3.5 text-[var(--color-signal)]" />
            </div>
            <div className={`font-mono text-2xl sm:text-3xl font-bold ${latestReadinessScore !== null ? 'text-[var(--color-signal)]' : 'text-[var(--color-text-dim)]'}`}>
              {isHistoryLoading && totalAnalyses === 0 ? (
                <span className="inline-block h-7 w-12 bg-[var(--color-surface-2)] animate-pulse rounded-[2px]" />
              ) : latestReadinessScore !== null ? (
                `${latestReadinessScore}%`
              ) : (
                '—'
              )}
            </div>
            <div className="font-mono text-[11px] text-[var(--color-text-dim)] mt-1 truncate" title={
              isHistoryLoading && totalAnalyses === 0
                ? 'Syncing evaluations...'
                : totalAnalyses === 0
                ? 'Pending first evaluation'
                : totalAnalyses === 1
                ? `${latestStartupName} readiness score`
                : `${latestStartupName} (Avg: ${overallAvgScore}% across ${totalAnalyses} runs)`
            }>
              {isHistoryLoading && totalAnalyses === 0
                ? 'Syncing evaluations...'
                : totalAnalyses === 0
                ? 'Pending first evaluation'
                : totalAnalyses === 1
                ? `${latestStartupName} readiness`
                : `${latestStartupName} (Avg: ${overallAvgScore}%)`}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: PRIMARY ACTION HERO (START NEW ANALYSIS) */}
      <section className="studio-card p-6 sm:p-7 border-[var(--color-signal)]/30 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-signal)] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              AI Opportunity Matcher
            </span>
            <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Ready to evaluate a new venture or update your metrics?
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
              Launch our 5-step guided wizard to run a semantic AI evaluation across <strong>216 verified schemes</strong>, incubation programs, and Tier-1 cloud credits. Get immediate eligibility rankings and actionable roadmaps.
            </p>
          </div>

          <button
            type="button"
            onClick={onStartNewAnalysis}
            className="studio-btn-primary shrink-0"
            data-cursor="Evaluate"
          >
            <span>Start New Analysis</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </section>

      {/* SECTION 3: PREVIOUS ANALYSES HUB */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-[var(--color-text-primary)] flex items-center gap-2">
              <History className="w-4 h-4 text-[var(--color-text-dim)]" />
              <span>Your Previous Analyses</span>
              <span className="font-mono text-[10px] bg-[var(--color-surface-2)] text-[var(--color-signal)] border border-[var(--color-line)] px-2 py-0.2 rounded-[2px] font-semibold">
                {isHistoryLoading && savedHistory.length === 0 ? '...' : savedHistory.length}
              </span>
            </h2>
            <p className="font-mono text-[11px] text-[var(--color-text-dim)] uppercase tracking-wider mt-0.5">
              Review saved reports, view detailed eligibility breakdowns, or re-run evaluations.
            </p>
          </div>

          {savedHistory.length > 3 && (
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-[var(--color-text-dim)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter past analyses..."
                className="studio-input pl-8 text-xs"
              />
            </div>
          )}
        </div>

        {/* If user has saved analyses */}
        {savedHistory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHistory.map((item, idx) => {
              const onboarding = item.onboarding || {};
              const matched = item.matchedSchemes || [];
              const dateStr = item.createdAt
                ? new Date(item.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })
                : 'Recent';

              const runScores = matched
                .map((s) => s.eligibilityScore)
                .filter((s) => typeof s === 'number');
              const runReadiness = runScores.length > 0
                ? Math.round(runScores.reduce((a, b) => a + b, 0) / runScores.length)
                : null;

              return (
                <div
                  key={item._id || idx}
                  className="studio-card p-5 flex flex-col justify-between space-y-4"
                >
                  <div>
                    {/* Top row: Startup Name & Date */}
                    <div className="flex items-start justify-between gap-2 border-b border-[var(--color-line)] pb-3">
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-[var(--color-signal)] shrink-0" />
                          <span className="truncate max-w-[200px] sm:max-w-[260px]">
                            {onboarding.startupName || 'Startup Venture'}
                          </span>
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-[var(--color-text-dim)] uppercase mt-1">
                          <span className="text-[var(--color-signal)]">
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

                      <div className="flex items-center gap-1.5 shrink-0">
                        {runReadiness !== null && (
                          <span className="font-mono text-[10px] font-semibold bg-[var(--color-surface-2)] text-[var(--color-signal)] border border-[var(--color-signal)]/30 px-2 py-0.5 rounded-[2px]">
                            {runReadiness}% Readiness
                          </span>
                        )}
                        <span className="font-mono text-[10px] font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded-[2px]">
                          {matched.length} Schemes
                        </span>
                      </div>
                    </div>

                    {/* AI Profile Summary Snippet */}
                    {item.founderProfile?.summary && (
                      <p className="text-xs text-[var(--color-text-muted)] mt-3 line-clamp-2 leading-relaxed">
                        "{item.founderProfile.summary}"
                      </p>
                    )}

                    {/* Top 3 Matched Scheme Badges */}
                    <div className="mt-3.5 space-y-1.5">
                      <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-[var(--color-text-dim)] block">
                        Top Matched Opportunities:
                      </span>
                      <div className="space-y-1.5">
                        {matched.slice(0, 3).map((sch, i) => (
                          <div
                            key={i}
                            className="studio-card-nested px-3 py-1.5 text-xs flex items-center justify-between gap-2"
                          >
                            <span className="text-[var(--color-text-primary)] font-medium truncate">
                              {sch.title}
                            </span>
                            <span className="font-mono text-[10px] font-semibold text-emerald-400 shrink-0">
                              {sch.eligibilityScore}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions: View Report vs Update & Re-run */}
                  <div className="pt-3 border-t border-[var(--color-line)] flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onReRunAnalysis && onReRunAnalysis(item)}
                      className="studio-btn-secondary text-xs h-8 px-3"
                    >
                      <RefreshCw className="w-3 h-3 mr-1 text-[var(--color-text-dim)]" />
                      <span>Re-run</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectHistoryItem && onSelectHistoryItem(item)}
                      className="studio-btn-primary text-xs h-8 px-3"
                      data-cursor="Open"
                    >
                      <span>Full Dossier</span>
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : isHistoryLoading ? (
          /* Subtle Studio Skeleton Pulse Loading State */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((n) => (
              <div key={n} className="studio-card p-5 space-y-4 animate-pulse">
                <div className="flex items-start justify-between border-b border-[var(--color-line)] pb-3">
                  <div className="space-y-2">
                    <div className="h-4 w-36 bg-[var(--color-surface-2)] rounded-[2px]" />
                    <div className="h-3 w-24 bg-[var(--color-surface-2)] rounded-[2px]" />
                  </div>
                  <div className="h-5 w-20 bg-[var(--color-surface-2)] rounded-[2px]" />
                </div>
                <div className="space-y-2 py-1">
                  <div className="h-3 w-full bg-[var(--color-surface-2)] rounded-[2px]" />
                  <div className="h-3 w-4/5 bg-[var(--color-surface-2)] rounded-[2px]" />
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[var(--color-line)]">
                  <div className="h-4 w-28 bg-[var(--color-surface-2)] rounded-[2px]" />
                  <div className="h-7 w-20 bg-[var(--color-surface-2)] rounded-[3px]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Zero analyses state */
          <div className="studio-card p-6 sm:p-10 text-center space-y-6">
            <div className="max-w-xl mx-auto space-y-2">
              <div className="w-10 h-10 rounded-[3px] bg-[var(--color-surface-2)] border border-[var(--color-line)] text-[var(--color-signal)] flex items-center justify-center mx-auto mb-3">
                <Rocket className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--color-text-primary)]">
                No evaluations recorded &bull; Start your first analysis
              </h3>
              <p className="text-xs sm:text-sm text-[var(--color-text-muted)]">
                Complete our 2-minute founder profile to get instant matches against verified non-dilutive grants, statutory schemes, and Tier-1 cloud credits.
              </p>
            </div>

            <button
              type="button"
              onClick={onStartNewAnalysis}
              className="studio-btn-primary h-10 px-5 text-sm"
              data-cursor="Start"
            >
              <span>Run Your First Startup Evaluation</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        )}
      </section>

      {/* SECTION 4: LIVE STARTUP SCHEMES & CAPITAL SPOTLIGHT */}
      <section id="flagship-schemes" className="space-y-4 pt-4 border-t border-[var(--color-line)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-[var(--color-text-primary)] flex items-center gap-2">
              <Award className="w-4 h-4 text-[var(--color-signal)]" />
              <span>Flagship Opportunity &amp; Grant Spotlight</span>
            </h2>
            <p className="font-mono text-[11px] text-[var(--color-text-dim)] uppercase tracking-wider mt-0.5">
              Curated, verified non-dilutive programs actively accepting applications across national funds and public bodies.
            </p>
          </div>
          <span className="font-mono text-[10px] text-[var(--color-text-dim)] uppercase bg-[var(--color-surface-2)] border border-[var(--color-line)] px-2 py-0.5 rounded-[2px] hidden sm:inline-block">
            216 Verified Schemes In Index
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="studio-card p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2 border-b border-[var(--color-line)] pb-3">
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-signal)] block">
                      {scheme.department}
                    </span>
                    <h3 className="font-bold text-base text-[var(--color-text-primary)] mt-0.5">
                      {scheme.title}
                    </h3>
                  </div>
                  <span className="font-mono text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2 py-0.5 rounded-[2px] shrink-0">
                    {scheme.grantAmount}
                  </span>
                </div>

                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  {scheme.description}
                </p>

                <div className="space-y-1 text-xs studio-card-nested p-3">
                  <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>Stage:</strong> {scheme.stage}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                    <Info className="w-3.5 h-3.5 text-[var(--color-signal)] shrink-0" />
                    <span><strong>Prerequisites:</strong> {scheme.prerequisites}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--color-line)] flex items-center justify-between gap-2">
                <a
                  href={scheme.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-[var(--color-text-dim)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-1"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="button"
                  onClick={() => onOpenSchemeModal && onOpenSchemeModal(scheme)}
                  className="studio-btn-secondary text-xs h-8 px-3"
                  data-cursor="Details"
                >
                  <Sparkles className="w-3 h-3 mr-1 text-[var(--color-signal)]" />
                  <span>Dossier &amp; Grounded Q&amp;A</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: STARTUP CLOUD & TECH CREDIT PERKS */}
      <section id="cloud-credits" className="space-y-4 pt-4 border-t border-[var(--color-line)]">
        <div>
          <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-[var(--color-text-primary)] flex items-center gap-2">
            <Cloud className="w-4 h-4 text-[var(--color-signal)]" />
            <span>Tier-1 Cloud Credits &amp; Compute Perks</span>
          </h2>
          <p className="font-mono text-[11px] text-[var(--color-text-dim)] uppercase tracking-wider mt-0.5">
            Pre-approved computational grants, AI tokens, and infrastructure subsidies from global tech leaders.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cloudPerks.map((perk, i) => (
            <div
              key={i}
              className="studio-card p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase border-b border-[var(--color-line)] pb-2.5">
                  <span className="text-[var(--color-signal)]">
                    {perk.badge}
                  </span>
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    {perk.credits}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-[var(--color-text-primary)]">
                    {perk.name}
                  </h3>
                  <p className="font-mono text-[10px] text-[var(--color-text-dim)] uppercase mt-0.5">{perk.provider}</p>
                </div>

                <ul className="space-y-1.5 text-xs text-[var(--color-text-muted)]">
                  {perk.perks.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <Check className="w-3 h-3 text-[var(--color-signal)] shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={perk.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="studio-btn-secondary text-xs h-8 w-full"
              >
                <span>Apply For Credits</span>
                <ExternalLink className="w-3 h-3 ml-1 text-[var(--color-text-dim)]" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: FOUNDER POLICY & COMPLIANCE CHEAT-SHEETS */}
      <section id="compliance-section" className="space-y-4 pt-4 border-t border-[var(--color-line)]">
        <div>
          <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-[var(--color-text-primary)] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[var(--color-text-dim)]" />
            <span>Statutory Policy &amp; Tax Cheat-Sheets</span>
          </h2>
          <p className="font-mono text-[11px] text-[var(--color-text-dim)] uppercase tracking-wider mt-0.5">
            Essential Indian startup policies, tax exemptions, and IP fee rebate regulations every founder should know.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policyCheatSheets.map((policy, idx) => (
            <div
              key={idx}
              className="studio-card p-5 space-y-2.5"
            >
              <h3 className="font-bold text-sm text-[var(--color-text-primary)] flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-[var(--color-signal)] shrink-0" />
                <span>{policy.title}</span>
              </h3>

              <div className="font-mono text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-1 rounded-[2px]">
                {policy.benefit}
              </div>

              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                {policy.criteria}
              </p>

              <div className="font-mono text-[10px] text-[var(--color-text-dim)] uppercase pt-2 border-t border-[var(--color-line)] flex items-center gap-1.5">
                <Info className="w-3 h-3 shrink-0" />
                <span>{policy.actionNote}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer copyright */}
      <footer className="pt-6 pb-2 text-center font-mono text-[11px] text-[var(--color-text-dim)] uppercase tracking-wider border-t border-[var(--color-line)]">
        <p>&copy; {new Date().getFullYear()} Founder's Hub &bull; Statutory &amp; Grant Discovery Engine</p>
      </footer>

    </div>
  );
}
