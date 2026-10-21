import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InitialLoader from './InitialLoader';
import TrajectoryLine from './TrajectoryLine';
import {
  ArrowRight,
  ExternalLink,
  Shield,
  Search,
  CheckCircle2,
  FileText,
  Award,
  Layers,
  ChevronRight,
  Cpu,
  Building,
  Database,
  Cloud,
  Zap,
  Globe,
  Bot,
  Terminal,
  Clock,
  ArrowUpRight
} from 'lucide-react';

const studioEase = [0.22, 1, 0.36, 1];

export default function LandingPage({ onStartWizard, onOpenPrivacyModal }) {
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [ragQueryIndex, setRagQueryIndex] = useState(0);

  const handleLoaderComplete = () => {
    setLoading(false);
  };

  const ragQueries = [
    {
      query: "Can an early-stage AgriTech startup in Karnataka with zero revenue receive the DST NIDHI-PRAYAS prototype grant?",
      answer: "Yes. DST NIDHI-PRAYAS provides up to ₹10 Lakhs in non-dilutive grant funding specifically for idea-to-prototype development. Pre-revenue startups registered as Private Limited or LLP are eligible, provided the project is hosted at a recognized TBI incubator.",
      source: "DST NIDHI-PRAYAS Operating Guidelines (Section 4.2)",
      sourceUrl: "http://www.nidhi-prayas.org/",
      score: "96%",
      badge: "DST NIDHI"
    },
    {
      query: "What are the equity and incorporation limits for the BIRAC Biotechnology Ignition Grant (BIG)?",
      answer: "BIRAC BIG provides up to ₹50 Lakhs in non-dilutive grant-in-aid for 18 months. Startups must be incorporated for less than 5 years and have at least 51% Indian shareholding.",
      source: "BIRAC BIG Scheme Guidelines (Eligibility Criteria)",
      sourceUrl: "https://birac.nic.in/big.php",
      score: "98%",
      badge: "BIRAC BioNEST"
    },
    {
      query: "Is DPIIT recognition mandatory to apply for the Startup India Seed Fund Scheme (SISFS)?",
      answer: "Yes. DPIIT recognition is a statutory prerequisite. The startup must be recognized by DPIIT, incorporated for less than 2 years, and demonstrate viable market potential.",
      source: "Startup India Seed Fund Gazette Notification",
      sourceUrl: "https://seedfund.startupindia.gov.in/",
      score: "99%",
      badge: "Startup India"
    }
  ];

  const categories = [
    {
      id: 'grants',
      name: 'Non-Dilutive Grants',
      count: '₹500+ Cr Pool',
      desc: 'Zero-equity research, prototype, and commercialization grants from public innovation bodies and national funds.',
      highlight: 'Up to ₹50L per venture',
      examples: ['BIRAC BIG (₹50L)', 'DST NIDHI-PRAYAS (₹10L)', 'TDB Commercialization Grant']
    },
    {
      id: 'schemes',
      name: 'Statutory Policies & Subsidies',
      count: '42 Active Policies',
      desc: 'Section 80-IAC tax holidays, patent fee concessions, and public procurement waivers.',
      highlight: '100% Tax Exemption 3 Yrs',
      examples: ['SISFS Seed Fund', 'DPIIT Section 80-IAC', 'GeM Startup Runway']
    },
    {
      id: 'incubators',
      name: 'Incubator & BioNEST Networks',
      count: '120+ Verified Hubs',
      desc: 'DST-recognized Technology Business Incubators and Atal Incubation Centres offering lab space and EIR stipends.',
      highlight: 'Lab access + EIR grants',
      examples: ['Atal Incubation Centres', 'BioNEST Hubs', 'MeitY TIDE 2.0']
    },
    {
      id: 'accelerators',
      name: 'Accelerators & Market Access',
      count: '35 Active Cohorts',
      desc: 'Structured scaling programs providing corporate pilots and global trade access.',
      highlight: 'Co-investment & matching capital',
      examples: ['MeitY SAMRIDH', 'AIM Scale-up Cohort', 'Indo-US Tech Exchange']
    },
    {
      id: 'credits',
      name: 'Cloud & Compute Perks',
      count: '$350K+ per Startup',
      desc: 'Tier-1 GPU compute credits, AI API tokens, and development licenses from cloud partners.',
      highlight: 'Up to $150K credits',
      examples: ['AWS Activate ($100K)', 'Google for Startups Cloud', 'Microsoft Founders Hub']
    }
  ];

  const marqueeItems = [
    "Startup India Seed Fund (SISFS) &bull; ₹50 Lakhs",
    "BIRAC Biotechnology Ignition Grant (BIG) &bull; ₹50 Lakhs",
    "DST NIDHI-PRAYAS Prototype Support &bull; ₹10 Lakhs",
    "MeitY SAMRIDH Scale-Up Program &bull; ₹40 Lakhs",
    "Microsoft for Startups Founders Hub &bull; $150,000 Credits",
    "AWS Activate Founders &bull; $100,000 Credits",
    "DPIIT Section 80-IAC 3-Year Tax Exemption",
    "GeM Portal Startup Runway Direct Procurement"
  ];

  const filteredCategories = selectedCategory === 'all'
    ? categories
    : categories.filter((c) => c.id === selectedCategory);

  return (
    <div className="relative min-h-screen bg-[var(--color-ink)] text-[var(--color-text-primary)] font-sans overflow-x-hidden selection:bg-[var(--color-signal)]/25">
      
      {/* Site Initialization Console */}
      <AnimatePresence>
        {loading && <InitialLoader onComplete={handleLoaderComplete} />}
      </AnimatePresence>

      {/* Trajectory Motif: Scroll-Driven Flight Path Indicator */}
      <TrajectoryLine />

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-20 sm:pt-28 sm:pb-28 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="space-y-8">
          
          {/* Top Technical Metadata Tag */}
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[var(--color-text-dim)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-signal)]" />
            <span className="text-[var(--color-text-muted)]">Index Coverage</span>
            <span>&bull;</span>
            <span className="text-[var(--color-text-primary)]">216 Verified Statutory Schemes</span>
            <span>&bull;</span>
            <span className="text-[var(--color-spark)] font-semibold">Active Vector Space</span>
          </div>

          {/* Massive Typographic Headline with Kinetic Rolling Slot Reel */}
          <div className="space-y-2 max-w-5xl">
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[var(--color-text-primary)] leading-[0.98]">
              The direct trajectory to verified startup{' '}
              <span className="kinetic-slot-window text-[var(--color-signal)] inline-block">
                <span className="kinetic-slot-reel flex flex-col">
                  <span>capital.</span>
                  <span>credits.</span>
                  <span>grants.</span>
                  <span>incubation.</span>
                </span>
              </span>
            </h1>
          </div>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
            Stop navigating fragmented portals and founder perk programs manually. Founder's Hub indexes verified schemes, non-dilutive capital, and Tier-1 cloud credits—evaluating your venture's exact eligibility in seconds.
          </p>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <button
              type="button"
              onClick={onStartWizard}
              className="studio-btn-primary h-12 px-6 text-sm sm:text-base font-medium"
              data-cursor="Launch"
            >
              <span>Evaluate My Startup</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <a
              href="#matrix"
              className="studio-btn-secondary h-12 px-5 text-sm sm:text-base font-medium"
              data-cursor="Inspect"
            >
              <span>Inspect Opportunity Matrix</span>
            </a>
          </div>

        </div>

        {/* Real Live Evaluation Product Window (Framed in 1px Studio Hairline) */}
        <div className="mt-14 sm:mt-20 studio-card p-4 sm:p-6 relative overflow-hidden">
          
          {/* Top Window Bar */}
          <div className="flex items-center justify-between border-b border-[var(--color-line)] pb-3 mb-5 font-mono text-[11px] text-[var(--color-text-dim)] uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-[var(--color-signal)]" />
              <span className="text-[var(--color-text-primary)] font-semibold">Live Evaluation Pipeline</span>
              <span className="text-[var(--color-text-dim)]">/ Session #0842</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[var(--color-text-muted)]">Verified Qdrant Vector Match</span>
            </div>
          </div>

          {/* 3-Column Studio Dossier Visual */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Panel 1: Profile State */}
            <div className="studio-card-nested p-4 space-y-3">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-dim)] border-b border-[var(--color-line)] pb-2">
                <span>01 // Input Vector</span>
                <span className="text-[var(--color-signal)]">Normalized</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-[var(--color-line)]/50">
                  <span className="text-[var(--color-text-muted)]">Startup Name:</span>
                  <span className="font-semibold text-[var(--color-text-primary)]">AgriSense Robotics</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--color-line)]/50">
                  <span className="text-[var(--color-text-muted)]">State / UT:</span>
                  <span className="text-[var(--color-text-primary)]">Karnataka</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--color-line)]/50">
                  <span className="text-[var(--color-text-muted)]">DPIIT Status:</span>
                  <span className="text-emerald-400 font-mono">Recognized (DIPP98412)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[var(--color-text-muted)]">Stage:</span>
                  <span className="text-[var(--color-text-primary)]">Prototype / Lab Trial</span>
                </div>
              </div>
            </div>

            {/* Panel 2: Vector & LLM Reasoning */}
            <div className="studio-card-nested p-4 space-y-3 border-[var(--color-signal)]/30">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[var(--color-signal)] border-b border-[var(--color-line)] pb-2">
                <span>02 // Reasoning Engine</span>
                <span className="text-[var(--color-spark)] font-semibold">&bull; Active</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-[var(--color-surface-1)] rounded-[2px] border border-[var(--color-line)]">
                  <span className="font-mono text-[10px] text-[var(--color-text-dim)] uppercase block">Semantic Similarity</span>
                  <p className="text-[var(--color-text-primary)] text-[11px] mt-0.5">High proximity to DST &amp; BIRAC bio-hardware clusters.</p>
                </div>
                <div className="p-2 bg-[var(--color-surface-1)] rounded-[2px] border border-[var(--color-line)]">
                  <span className="font-mono text-[10px] text-[var(--color-text-dim)] uppercase block">Statutory Rule Coercion</span>
                  <p className="text-[var(--color-text-primary)] text-[11px] mt-0.5">Passed incorporation age &lt; 2 yrs and Karnataka domicile mandate.</p>
                </div>
              </div>
            </div>

            {/* Panel 3: Recommended Opportunities */}
            <div className="studio-card-nested p-4 space-y-3">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-dim)] border-b border-[var(--color-line)] pb-2">
                <span>03 // Ranked Grants</span>
                <span className="text-emerald-400 font-semibold">3 Matched</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 bg-[var(--color-surface-1)] rounded-[2px] border border-[var(--color-line)] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[var(--color-text-primary)] block">BIRAC BIG Grant</span>
                    <span className="font-mono text-[10px] text-[var(--color-text-dim)]">₹50L Non-dilutive</span>
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-emerald-400 px-1.5 py-0.5 rounded-[2px] bg-emerald-950/40 border border-emerald-800/60">
                    98%
                  </span>
                </div>

                <div className="p-2 bg-[var(--color-surface-1)] rounded-[2px] border border-[var(--color-line)] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[var(--color-text-primary)] block">DST NIDHI-PRAYAS</span>
                    <span className="font-mono text-[10px] text-[var(--color-text-dim)]">₹10L Prototype</span>
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-emerald-400 px-1.5 py-0.5 rounded-[2px] bg-emerald-950/40 border border-emerald-800/60">
                    95%
                  </span>
                </div>

                <div className="p-2 bg-[var(--color-surface-1)] rounded-[2px] border border-[var(--color-line)] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[var(--color-text-primary)] block">Startup India Seed Fund</span>
                    <span className="font-mono text-[10px] text-[var(--color-text-dim)]">₹50L Grant/Debt</span>
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-[var(--color-signal)] px-1.5 py-0.5 rounded-[2px] bg-[var(--color-surface-2)] border border-[var(--color-signal)]/30">
                    91%
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* REAL CONTENT MARQUEE STRIP */}
      <section className="border-y border-[var(--color-line)] bg-[var(--color-surface-1)] py-3 overflow-hidden select-none">
        <div className="flex gap-8 whitespace-nowrap animate-none overflow-x-auto no-scrollbar font-mono text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
          {marqueeItems.concat(marqueeItems).map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-signal)]" />
              <span dangerouslySetInnerHTML={{ __html: item }} />
            </div>
          ))}
        </div>
      </section>

      {/* WAYPOINT SECTION: THE TRAJECTORY WORKFLOW */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto border-b border-[var(--color-line)]">
        
        {/* Section Header */}
        <div className="space-y-3 mb-16 max-w-2xl">
          <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-signal)] block">
            Waypoint Journey
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
            How evaluation progresses from input to official grant.
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            A continuous four-stage pipeline that eliminates bureaucratic friction and pinpoints exact statutory eligibility.
          </p>
        </div>

        {/* 4 Connected Waypoints */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="studio-card p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--color-line)] pb-3">
              <span className="font-mono text-xs font-semibold text-[var(--color-signal)]">01 / Onboarding</span>
              <span className="font-mono text-[10px] text-[var(--color-text-dim)] uppercase">2 Minutes</span>
            </div>
            <h3 className="font-bold text-base text-[var(--color-text-primary)]">Structured Profile Capture</h3>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Define your venture's state domicile, incorporation structure, DPIIT certification, team size, and immediate capital intent without submitting pitch decks.
            </p>
          </div>

          <div className="studio-card p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--color-line)] pb-3">
              <span className="font-mono text-xs font-semibold text-[var(--color-signal)]">02 / Embedding</span>
              <span className="font-mono text-[10px] text-[var(--color-text-dim)] uppercase">Vector DB</span>
            </div>
            <h3 className="font-bold text-base text-[var(--color-text-primary)]">High-Dimensional Vector Search</h3>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Your parameters are embedded into high-dimensional semantic vectors and matched against 216 indexed central and state policy documents in Qdrant.
            </p>
          </div>

          <div className="studio-card p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--color-line)] pb-3">
              <span className="font-mono text-xs font-semibold text-[var(--color-signal)]">03 / Verification</span>
              <span className="font-mono text-[10px] text-[var(--color-text-dim)] uppercase">LLM Rules</span>
            </div>
            <h3 className="font-bold text-base text-[var(--color-text-primary)]">Statutory Rule Coercion</h3>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              The reasoning engine parses legal restrictions: strict incorporation limits, sector bounds, DPIIT verification rules, and turnover thresholds.
            </p>
          </div>

          <div className="studio-card p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--color-line)] pb-3">
              <span className="font-mono text-xs font-semibold text-[var(--color-signal)]">04 / Action</span>
              <span className="font-mono text-[10px] text-emerald-400 uppercase">Verified</span>
            </div>
            <h3 className="font-bold text-base text-[var(--color-text-primary)]">Grounded Recommendations</h3>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Receive ranked opportunities with precise Match % scores, statutory reasoning, required document checklists, and direct links to official application portals.
            </p>
          </div>

        </div>
      </section>

      {/* OPPORTUNITY MATRIX (BENTO / VARYING CELL GRID) */}
      <section id="matrix" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto border-b border-[var(--color-line)]">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-signal)] block">
              Indexed Matrix
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Comprehensive Opportunity Coverage
            </h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              Continuous indexing across ₹500+ Cr in startup schemes, non-dilutive grants, and Tier-1 cloud credits.
            </p>
          </div>

          {/* Category Filter Controls */}
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 font-mono text-[11px] uppercase rounded-[3px] transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[var(--color-signal)] text-[var(--color-accent-text)] font-semibold'
                  : 'bg-[var(--color-surface-1)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] border border-[var(--color-line)]'
              }`}
            >
              All Categories
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 font-mono text-[11px] uppercase rounded-[3px] transition-colors cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-[var(--color-signal)] text-[var(--color-accent-text)] font-semibold'
                    : 'bg-[var(--color-surface-1)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] border border-[var(--color-line)]'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="studio-card p-5 space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[var(--color-line)] pb-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-signal)]">
                    {cat.highlight}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--color-text-dim)]">
                    {cat.count}
                  </span>
                </div>

                <h3 className="font-bold text-base text-[var(--color-text-primary)] mt-3">
                  {cat.name}
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-1 leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--color-line)] space-y-1.5">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--color-text-dim)] block">
                  Sample Programs:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {cat.examples.map((ex, i) => (
                    <span
                      key={i}
                      className="font-mono text-[10px] bg-[var(--color-surface-2)] text-[var(--color-text-muted)] px-2 py-0.5 rounded-[2px] border border-[var(--color-line)]"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GROUNDED SCHEME Q&A ENGINE (INTERACTIVE STUDIO CONSOLE) */}
      <section id="grounded-qa" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto border-b border-[var(--color-line)]">
        <div className="studio-card p-6 sm:p-10 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-line)] pb-5">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-signal)] block mb-1">
                Grounded Verification Console
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
                Ask Questions Grounded in Official Policy Documents
              </h2>
            </div>

            {/* Toggle Questions */}
            <div className="flex items-center gap-1.5 font-mono text-xs">
              {ragQueries.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setRagQueryIndex(idx)}
                  className={`w-8 h-8 rounded-[3px] font-semibold transition-colors cursor-pointer border ${
                    ragQueryIndex === idx
                      ? 'bg-[var(--color-signal)] text-[var(--color-accent-text)] border-[var(--color-signal)]'
                      : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border-[var(--color-line)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  Q{idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Query Box */}
          <div className="space-y-4">
            {/* User Query */}
            <div className="p-4 bg-[var(--color-surface-2)] rounded-[3px] border border-[var(--color-line)] space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-signal)] flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" /> Founder Statutory Query
              </span>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                "{ragQueries[ragQueryIndex].query}"
              </p>
            </div>

            {/* Grounded AI Response */}
            <div className="p-5 bg-[var(--color-surface-1)] rounded-[3px] border border-[var(--color-line)] space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--color-line)] pb-2.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-dim)] flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-[var(--color-signal)]" /> Grounded Policy Finding
                </span>
                <span className="font-mono text-xs font-semibold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-[2px] border border-emerald-800/60">
                  {ragQueries[ragQueryIndex].score} Match
                </span>
              </div>

              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                {ragQueries[ragQueryIndex].answer}
              </p>

              {/* Official Citation Link */}
              <div className="pt-3 border-t border-[var(--color-line)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--color-text-dim)]">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Official Citation: <strong className="text-[var(--color-text-primary)]">{ragQueries[ragQueryIndex].source}</strong></span>
                </div>

                <a
                  href={ragQueries[ragQueryIndex].sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-[var(--color-signal)] hover:underline flex items-center gap-1"
                >
                  <span>Verify Original Gazette</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* INSTITUTIONAL COVERAGE DIRECTORY */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto border-b border-[var(--color-line)]">
        <div className="space-y-2 mb-10 max-w-xl">
          <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-signal)] block">
            Statutory Sources
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Verified Statutory Bodies &amp; Institutional Programs
          </h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            Every indexed opportunity maps directly to official gazettes, institutional funds, and cloud partner networks.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[
            { name: 'Startup India', org: 'DPIIT / MoCI', badge: 'Central Body' },
            { name: 'SIDBI', org: 'Small Industries Dev Bank', badge: 'MSME Finance' },
            { name: 'AIM', org: 'Atal Innovation Mission', badge: 'Incubators' },
            { name: 'BIRAC', org: 'Dept of Biotechnology', badge: 'Biotech Grants' },
            { name: 'DST NIDHI', org: 'Dept of Science & Tech', badge: 'PRAYAS / EIR' },
            { name: 'myScheme', org: 'MeitY / NIC', badge: 'National Schemes' },
            { name: 'Agri Ministry', org: 'MoA & FW', badge: 'RKVY-RAFTAAR' },
            { name: 'TDB', org: 'Tech Dev Board', badge: 'Commercialization' },
            { name: 'GeM', org: 'Govt e-Marketplace', badge: 'Procurement' },
            { name: 'State Policies', org: '28 States & UTs', badge: 'State Incentives' }
          ].map((src, i) => (
            <div
              key={i}
              className="p-3 bg-[var(--color-surface-1)] border border-[var(--color-line)] rounded-[3px] text-center space-y-1 hover:border-[var(--color-line-strong)] transition-colors"
            >
              <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-signal)] block">
                {src.badge}
              </span>
              <strong className="text-xs font-semibold text-[var(--color-text-primary)] block">
                {src.name}
              </strong>
              <span className="font-mono text-[10px] text-[var(--color-text-dim)] block truncate">
                {src.org}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CALL TO ACTION (STUDIO SPLIT) */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="studio-card p-8 sm:p-14 space-y-6">
          <div className="space-y-3 max-w-2xl">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-signal)] block">
              Immediate Evaluation
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Evaluate your venture in under two minutes.
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed">
              Match your startup against verified non-dilutive grants, incubation schemes, and Tier-1 cloud credits.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onStartWizard}
              className="studio-btn-primary h-12 px-8 text-base font-medium"
              data-cursor="Evaluate"
            >
              <span>Launch Startup Evaluation</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>

          <div className="pt-4 border-t border-[var(--color-line)] flex flex-wrap gap-6 font-mono text-[11px] uppercase tracking-wider text-[var(--color-text-dim)]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              100% Free &amp; Immediate
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[var(--color-signal)]" />
              Statutory Gazette References
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
              Two-Minute Profile Setup
            </span>
          </div>
        </div>
      </section>

      {/* LARGE STUDIO FOOTER */}
      <footer className="border-t border-[var(--color-line)] bg-[var(--color-surface-1)] py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-[var(--color-line)]">
            <div className="space-y-2">
              <span className="font-display font-bold text-2xl sm:text-3xl text-[var(--color-text-primary)] block">
                Founder's Hub
              </span>
              <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-text-dim)]">
                Startup Opportunity Discovery Engine &bull; Statutory &amp; Grant Matrix
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 font-mono text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
              <button
                type="button"
                onClick={onStartWizard}
                className="hover:text-[var(--color-signal)] transition-colors cursor-pointer"
              >
                Evaluation Wizard
              </button>
              <span>&bull;</span>
              <a href="#how-it-works" className="hover:text-[var(--color-signal)] transition-colors">
                Trajectory
              </a>
              <span>&bull;</span>
              <a href="#matrix" className="hover:text-[var(--color-signal)] transition-colors">
                Index Coverage
              </a>
              <span>&bull;</span>
              <button
                type="button"
                onClick={() => {
                  if (onOpenPrivacyModal) onOpenPrivacyModal();
                }}
                className="hover:text-[var(--color-signal)] transition-colors cursor-pointer"
              >
                Terms &amp; Conditions
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[11px] text-[var(--color-text-dim)] uppercase tracking-wider">
            <p>&copy; {new Date().getFullYear()} Founder's Hub. All scheme intelligence verified against official public gazettes and authorized partner frameworks.</p>
            <p className="text-[var(--color-text-dim)]">Engineered for Indian Founders</p>
          </div>

        </div>
      </footer>

    </div>
  );
}
