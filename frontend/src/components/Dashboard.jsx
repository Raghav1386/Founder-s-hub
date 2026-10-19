import React, { useState } from 'react';
import {
  Rocket,
  Sparkles,
  ArrowRight,
  History,
  Building2,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Award,
  Layers,
  Cloud,
  FileText,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  Info,
  Clock,
  RefreshCw,
  Search,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard({
  onStartNewAnalysis,
  onSelectHistoryItem,
  onReRunAnalysis,
  onOpenSchemeModal
}) {
  const { user, mongoUser, savedHistory, fetchUserHistory, isAuthenticated } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  if (!isAuthenticated) {
    return null;
  }

  const displayName = user?.displayName || mongoUser?.name || 'Founder';
  const latestStartupName =
    savedHistory[0]?.onboarding?.startupName || mongoUser?.startupName || 'Your Startup';

  // Manual refresh history trigger
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchUserHistory();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Compute aggregate statistics
  const totalAnalyses = savedHistory.length;
  
  // Total opportunities matched across all history runs
  const totalMatchedCount = savedHistory.reduce((acc, curr) => {
    return acc + (curr.matchedSchemes?.length || 0);
  }, 0);

  // Calculate highest average match score
  const avgMatchScore = totalAnalyses > 0
    ? Math.round(
        savedHistory.reduce((acc, curr) => {
          const scores = (curr.matchedSchemes || []).map(s => s.eligibilityScore || 85);
          const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 85;
          return acc + avg;
        }, 0) / totalAnalyses
      )
    : 92;

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
      documentId: '6a777dd86a4da70e2a1a9fc8', // DST NIDHI / Startup India Seed
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
      documentId: '6a777d5bb5459bcb135dbdd4', // BIRAC BioNEST / BIG
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
      documentId: '6a777df26a4da70e2a1a9fcc', // NIDHI eligibility
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
      documentId: '6a8450c1fcdfa4322caef356', // MeitY / Tech
      title: 'MeitY SAMRIDH Accelerator Scheme',
      grantAmount: '₹40 Lakhs + Matching Co-investment',
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
      badge: 'AI Startups Priority',
      perks: ['$100k GCP credits for Year 1', 'Google Workspace free for 1 year', 'Gemini API credits', 'Google Web3 grant option'],
      portalUrl: 'https://cloud.google.com/startup'
    },
    {
      name: 'NVIDIA Inception Program',
      provider: 'NVIDIA AI Tech Center',
      credits: 'GPU Cloud Credits & Hardware',
      badge: 'Deep Tech & AI',
      perks: ['Preferred GPU pricing', 'NVIDIA Deep Learning Institute credits', 'Unlimited technical forum support', 'VC alliance introductions'],
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
      criteria: 'Union Budget 2024 officially abolished Angel Tax for all resident and non-resident startup investments, removing prior valuation friction.',
      actionNote: 'No special IMB filing required for capital raised above Fair Market Value (FMV).'
    },
    {
      title: 'Fast-Track Patent & IP Fee Rebate',
      benefit: '80% Patent Fee Waiver & 50% Trademark Waiver',
      criteria: 'Startups with verified DPIIT certificate receive expedited patent examination and an 80% direct statutory fee reduction with government-subsidized patent facilitators.',
      actionNote: 'Reduces patent grant timeline from 4-5 years down to 12-18 months.'
    },
    {
      title: 'GeM Startup Runway Direct Procurement',
      benefit: 'Waiver of Prior Turnover & Experience in Tenders',
      criteria: 'Startups can list innovative products directly on Government e-Marketplace (GeM) with exemption from prior experience, prior turnover, and earnest money deposits (EMD).',
      actionNote: 'Direct procurement channel to 70,000+ government buyer departments.'
    }
  ];

  return (
    <div className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-8 animate-fadeIn">
      
      {/* SECTION 1: FOUNDER WELCOME & METRIC KPI STRIP */}
      <section className="bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-indigo-950/40 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-5 sm:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-xs font-mono text-emerald-300 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Founder Command Center &bull; Active Ecosystem Index</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Welcome back, {displayName}</span>
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Centralized dashboard for <strong className="text-slate-200">{latestStartupName}</strong> &bull; Track evaluations, match government grants, and unlock non-dilutive capital.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Refresh evaluations"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
              <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Sync Data'}</span>
            </button>

            <button
              type="button"
              onClick={onStartNewAnalysis}
              className="px-4 py-2 sm:px-5 sm:py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Rocket className="w-4 h-4 text-slate-950" />
              <span>New Analysis</span>
            </button>
          </div>
        </div>

        {/* 4 Metric KPI Cards Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-6">
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1.5">
              <span>Saved Analyses</span>
              <History className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {totalAnalyses}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span>Total profile evaluations run</span>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1.5">
              <span>Capital Ceiling</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              ₹50L+
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Max non-dilutive grant / scheme
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1.5">
              <span>Tech Credits</span>
              <Cloud className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-300">
              $350K+
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Combined cloud credits pool
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1.5">
              <span>Readiness Score</span>
              <TrendingUp className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-300">
              {avgMatchScore}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Eligibility index across matches
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: PRIMARY ACTION HERO (START NEW ANALYSIS) */}
      <section className="bg-gradient-to-r from-emerald-950/30 via-slate-900 to-indigo-950/30 border border-emerald-900/40 hover:border-emerald-700/60 transition-all rounded-2xl sm:rounded-3xl p-5 sm:p-7 relative overflow-hidden shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              AI Opportunity Matcher
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Ready to evaluate a new venture or update your startup metrics?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Launch our 6-step guided wizard to run a semantic AI evaluation across <strong>216 verified schemes</strong>, incubation programs, and tier-1 cloud credits. Get immediate eligibility rankings and actionable step-by-step roadmaps.
            </p>
          </div>

          <button
            type="button"
            onClick={onStartNewAnalysis}
            className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <span>Start New Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* SECTION 3: PREVIOUS ANALYSES HUB (CORE FEATURE) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-400" />
              <span>Your Previous Analyses</span>
              <span className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded-full font-bold">
                {savedHistory.length}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review saved reports, view detailed eligibility breakdowns, or re-run evaluations with updated metrics.
            </p>
          </div>

          {savedHistory.length > 3 && (
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter past analyses..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
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

              return (
                <div
                  key={item._id || idx}
                  className="bg-slate-900/90 border border-slate-800/90 hover:border-indigo-500/50 rounded-2xl p-5 transition-all shadow-lg hover:shadow-indigo-950/20 flex flex-col justify-between space-y-4 group"
                >
                  <div>
                    {/* Top row: Startup Name & Date */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                          <span className="truncate max-w-[220px] sm:max-w-[280px]">
                            {onboarding.startupName || 'Startup Venture'}
                          </span>
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-1">
                          <span className="bg-slate-800/80 border border-slate-700/80 px-2 py-0.5 rounded font-semibold text-indigo-300">
                            {onboarding.stage || 'Idea Stage'}
                          </span>
                          <span>&bull;</span>
                          <span>{onboarding.state || 'India'}</span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1 text-slate-500">
                            <Calendar className="w-3 h-3" />
                            {dateStr}
                          </span>
                        </div>
                      </div>

                      <span className="text-[11px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded-full shrink-0">
                        {matched.length} Schemes
                      </span>
                    </div>

                    {/* AI Profile Summary Snippet */}
                    {item.founderProfile?.summary && (
                      <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed italic">
                        "{item.founderProfile.summary}"
                      </p>
                    )}

                    {/* Top 3 Matched Scheme Badges */}
                    <div className="mt-3.5 space-y-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                        Top Matched Opportunities:
                      </span>
                      <div className="space-y-1.5">
                        {matched.slice(0, 3).map((sch, i) => (
                          <div
                            key={i}
                            className="bg-slate-950/70 border border-slate-800/70 px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between gap-2"
                          >
                            <span className="text-slate-300 font-medium truncate">
                              {sch.title}
                            </span>
                            <span className="font-mono font-bold text-emerald-400 shrink-0 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40 text-[11px]">
                              {sch.eligibilityScore}% Match
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions: View Report vs Update & Re-run */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onReRunAnalysis && onReRunAnalysis(item)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3 text-slate-400" />
                      <span>Update & Re-run</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectHistoryItem && onSelectHistoryItem(item)}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>View Full Report</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Zero analyses state: Rich Interactive Walkthrough & Preview */
          <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center space-y-6">
            <div className="max-w-xl mx-auto space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-800 text-indigo-400 flex items-center justify-center mx-auto mb-3">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                No analyses created yet &bull; Start your first evaluation
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                You haven't run any evaluations yet. Complete our quick 2-minute founder profile to get instant matches against Central and State government schemes.
              </p>
            </div>

            {/* 3-Step Preview Flow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-4xl mx-auto">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold text-xs flex items-center justify-center">
                  1
                </div>
                <h4 className="text-xs font-bold text-white">2-Min Profile Setup</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Enter your startup's sector, stage, legal structure, and specific capital needs.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-400 font-bold text-xs flex items-center justify-center">
                  2
                </div>
                <h4 className="text-xs font-bold text-white">Semantic AI Match</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Our LLM evaluates your criteria against 216 verified schemes, grants, and incubators.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-teal-950 border border-teal-800 text-teal-400 font-bold text-xs flex items-center justify-center">
                  3
                </div>
                <h4 className="text-xs font-bold text-white">Actionable Roadmap</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Receive eligibility percentages, missing prerequisites, and direct application links.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onStartNewAnalysis}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-xl shadow-emerald-500/20 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Run Your First Startup Evaluation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* SECTION 4: LIVE GOVERNMENT GRANTS & STARTUP SCHEMES SPOTLIGHT */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span>Flagship Government Grants & Schemes Spotlight</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Curated, verified non-dilutive programs actively accepting applications across central ministries.
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800/60 hidden sm:inline-block">
            216 Verified Schemes In Index
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-slate-900/90 border border-slate-800/90 hover:border-emerald-500/50 rounded-2xl p-5 transition-all shadow-lg flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                      {scheme.department}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      {scheme.title}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-extrabold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-1 rounded-xl shrink-0">
                    {scheme.grantAmount}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {scheme.description}
                </p>

                <div className="space-y-1 text-[11px] bg-slate-950/60 border border-slate-800/70 p-2.5 rounded-xl">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>Stage:</strong> {scheme.stage}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span><strong>Key Criteria:</strong> {scheme.prerequisites}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <a
                  href={scheme.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="button"
                  onClick={() => onOpenSchemeModal && onOpenSchemeModal(scheme)}
                  className="px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>View Details & AI Q&A</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: STARTUP CLOUD & TECH CREDIT PERKS */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Cloud className="w-5 h-5 text-teal-400" />
              <span>Startup Cloud Credits & Infrastructure Perks</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Pre-approved computational grants, AI tokens, and infrastructure subsidies from global tech leaders.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cloudPerks.map((perk, i) => (
            <div
              key={i}
              className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:border-teal-500/40 transition-all shadow-md group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono font-bold text-teal-400 bg-teal-950/80 border border-teal-800/60 px-2 py-0.5 rounded">
                    {perk.badge}
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    {perk.credits}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                    {perk.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{perk.provider}</p>
                </div>

                <ul className="space-y-1.5 text-[11px] text-slate-300">
                  {perk.perks.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={perk.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
              >
                <span>Apply For Credits</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: FOUNDER POLICY & COMPLIANCE CHEAT-SHEETS */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span>Founder Policy, Tax & Compliance Cheat-Sheets</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Essential Indian startup policies, tax exemptions, and IP fee rebate regulations every founder should know.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policyCheatSheets.map((policy, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-2.5 hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>{policy.title}</span>
                </h3>
              </div>

              <div className="text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-2.5 py-1 rounded-lg">
                {policy.benefit}
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {policy.criteria}
              </p>

              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-800/60 flex items-center gap-1.5">
                <Info className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{policy.actionNote}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer copyright */}
      <footer className="pt-6 pb-2 text-center text-xs text-slate-500 border-t border-slate-800/80">
        <p>&copy; {new Date().getFullYear()} Founder's Hub &bull; Empowering Indian Startups with Verified Intelligence</p>
      </footer>

    </div>
  );
}
