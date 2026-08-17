import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InitialLoader from './InitialLoader';
import {
  X,
  ArrowRight,
  Shield,
  Sparkles,
  Search,
  CheckCircle2,
  FileText,
  Award,
  Layers,
  ChevronRight,
  ExternalLink,
  Cpu,
  Building,
  Database,
  Cloud,
  Zap,
  Globe,
  Filter,
  Bot,
  Terminal,
  Clock,
  Lock,
  Compass,
  ArrowUpRight,
  TrendingUp,
  Activity
} from 'lucide-react';

// Custom fluid bezier physics curve
const smoothTransition = { duration: 0.7, ease: [0.16, 1, 0.3, 1] };

// Scroll Fade-Up Reveal wrapper component
function ScrollReveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ ...smoothTransition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Word-by-word reveal for headlines
function WordReveal({ text, className = "" }) {
  const words = text.split(" ");
  return (
    <span className={`inline-block ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export default function LandingPage({ onStartWizard }) {
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [ragQueryIndex, setRagQueryIndex] = useState(0);

  const handleLoaderComplete = () => {
    setLoading(false);
  };

  // Sample interactive RAG queries
  const ragQueries = [
    {
      query: "Can an early-stage AgriTech startup in Karnataka with no revenue get DST NIDHI-PRAYAS grant?",
      answer: "Yes. DST NIDHI-PRAYAS provides up to ₹10 Lakhs in non-dilutive grant support for proof-of-concept and prototype development. Pre-revenue startups and innovators incorporated as Private Limited or registered entities are eligible, provided they operate through a recognized TBI incubator.",
      source: "DST NIDHI Guidelines 2026 (Section 4.2)",
      sourceUrl: "http://nidhi-prayas.org/",
      score: "96% Confidence Match",
      badge: "DST NIDHI"
    },
    {
      query: "What is the maximum grant available for biotech startups under BIRAC BIG scheme?",
      answer: "BIRAC Biotechnology Ignition Grant (BIG) offers up to ₹50 Lakhs in non-dilutive grant-in-aid for 18 months. Startups must be incorporated for less than 5 years with at least 51% Indian equity ownership.",
      source: "BIRAC BIG Scheme Document v3.1",
      sourceUrl: "https://birac.nic.in/bionest.php",
      score: "98% Confidence Match",
      badge: "BIRAC BioNEST"
    },
    {
      query: "Is DPIIT recognition mandatory for Startup India Seed Fund Scheme (SISFS)?",
      answer: "Yes, DPIIT recognition is mandatory. Startups must be recognized by DPIIT, incorporated for less than 2 years, and have a business model with potential for commercialization and scaling.",
      source: "Startup India Seed Fund Official Portal",
      sourceUrl: "https://www.startupindia.gov.in/",
      score: "99% Confidence Match",
      badge: "StartupIndia"
    }
  ];

  const categories = [
    {
      id: 'schemes',
      name: 'Government Schemes',
      icon: Layers,
      count: '42 Active Policies',
      desc: 'Central & State startup incentive schemes, tax exemptions, and registration waivers.',
      examples: ['SISFS Seed Support', 'DPIIT Tax Holiday (Sec 80-IAC)', 'State Startup Policies']
    },
    {
      id: 'grants',
      name: 'Non-Dilutive Grants',
      icon: Award,
      count: '₹500+ Cr Available',
      desc: 'Zero-equity research, prototype, and commercialization grants from central ministries.',
      examples: ['BIRAC BIG (₹50L)', 'DST NIDHI-PRAYAS (₹10L)', 'TDB Commercialization Grant']
    },
    {
      id: 'incubators',
      name: 'Incubator Networks',
      icon: Building,
      count: '120+ Verified Hubs',
      desc: 'Top Technology Business Incubators (TBIs), BioNEST, and Atal Incubation Centres.',
      examples: ['Atal Incubation Centres (AIC)', 'BioNEST Incubator Hubs', 'MeitY TIDE 2.0']
    },
    {
      id: 'accelerators',
      name: 'Accelerators & GTM',
      icon: Zap,
      count: '35 Cohorts',
      desc: 'Cohort-based scaling, market access, and international trade mentorship programs.',
      examples: ['MeitY SAMRIDH Scheme', 'AIM Scale-up Cohort', 'Indo-US Tech Exchange']
    },
    {
      id: 'credits',
      name: 'Cloud & Tech Credits',
      icon: Cloud,
      count: '$250K+ per Startup',
      desc: 'Infrastructure, API, and cloud computing credits from global technology partners.',
      examples: ['AWS Activate ($100K)', 'GCP for Startups', 'Microsoft Founders Hub']
    },
    {
      id: 'programs',
      name: 'Startup Programs & Awards',
      icon: Globe,
      count: '18 Open Calls',
      desc: 'National competitions, ministry challenges, and public sector procurement access.',
      examples: ['National Startup Awards', 'RKVY-RAFTAAR Agri Challenge', 'GeM Portal Procurement']
    }
  ];

  const filteredCategories = selectedCategory === 'all' 
    ? categories 
    : categories.filter(c => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 overflow-x-hidden">
      
      {/* Site Opening Loading Screen */}
      <AnimatePresence>
        {loading && <InitialLoader onComplete={handleLoaderComplete} />}
      </AnimatePresence>

      {/* Dynamic Background Noise Texture & Grid Line Accents */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 px-4 sm:px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={smoothTransition}
          className="space-y-6 text-center"
        >
          {/* Top Precision Pill Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...smoothTransition, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-mono tracking-wide text-slate-300 shadow-inner"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="uppercase text-[11px] font-semibold tracking-wider text-slate-400">
              AI Retrieval & Matching Engine
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-emerald-400 font-semibold">100+ Live Govt Sources</span>
          </motion.div>

          {/* Headline with Word Reveal */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            <WordReveal text="Find the right opportunities for your startup." />
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smoothTransition, delay: 0.3 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Stop searching dozens of fragmented government portals manually. FounderPilot continuously indexes and matches your startup against verified schemes, non-dilutive grants, incubators, accelerators, and cloud credits.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smoothTransition, delay: 0.4 }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={onStartWizard}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base rounded-xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Find My Opportunities</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-6 py-4 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-semibold text-base rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>See How It Works</span>
            </a>
          </motion.div>
        </motion.div>

        {/* CUSTOM VISUAL FLOW ARCHITECTURE: Founder Profile -> AI Matching -> Best Opportunities */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...smoothTransition, delay: 0.5 }}
          className="mt-16 sm:mt-24 p-6 sm:p-8 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden"
        >
          {/* Card Label */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>LIVE DEMO ARCHITECTURE &bull; REAL-TIME SEMANTIC RAG PIPELINE</span>
            </div>
            <span className="text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/60">
              Active Index: Qdrant Vector DB (1024-d)
            </span>
          </div>

          {/* Flow Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            
            {/* NODE 1: FOUNDER PROFILE */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={smoothTransition}
              className="p-5 bg-[#070a12] rounded-xl border border-slate-800/90 space-y-4 relative"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Database className="w-4 h-4 text-indigo-400" /> 1. Founder Profile
                </span>
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2 bg-slate-900/60 rounded border border-slate-800/80 flex justify-between">
                  <span className="text-slate-400">Startup:</span>
                  <span className="text-white font-bold">AgriTech AI</span>
                </div>
                <div className="p-2 bg-slate-900/60 rounded border border-slate-800/80 flex justify-between">
                  <span className="text-slate-400">State / UT:</span>
                  <span className="text-emerald-400">Karnataka</span>
                </div>
                <div className="p-2 bg-slate-900/60 rounded border border-slate-800/80 flex justify-between">
                  <span className="text-slate-400">Stage / DPIIT:</span>
                  <span className="text-indigo-300">Early Stage &bull; DPIIT Yes</span>
                </div>
                <div className="p-2 bg-slate-900/60 rounded border border-slate-800/80 flex justify-between">
                  <span className="text-slate-400">Need:</span>
                  <span className="text-amber-300">Grants & Subsidies</span>
                </div>
              </div>
            </motion.div>

            {/* NODE 2: AI MATCHING ENGINE */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={smoothTransition}
              className="p-5 bg-[#070a12] rounded-xl border border-emerald-500/40 space-y-4 relative shadow-lg shadow-emerald-500/5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" /> 2. AI Matching Engine
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 bg-emerald-950/30 rounded border border-emerald-800/50 space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 block uppercase">Vector Search (Jina v3 1024-d)</span>
                  <p className="text-slate-300 text-[11px] font-mono">Cosine Sim Distance: 0.942</p>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-indigo-400 block uppercase">Zod Rule-Based Evaluation</span>
                  <p className="text-slate-300 text-[11px]">Strict State + Stage + DPIIT Coercion</p>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 block uppercase">LLM Reasoning Engine</span>
                  <p className="text-slate-300 text-[11px]">Groq `openai/gpt-oss-120b`</p>
                </div>
              </div>
            </motion.div>

            {/* NODE 3: BEST OPPORTUNITIES */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={smoothTransition}
              className="p-5 bg-[#070a12] rounded-xl border border-slate-800/90 space-y-3 relative"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" /> 3. Best Opportunities
                </span>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-slate-900/90 rounded border border-emerald-700/60 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">BIRAC BIG Grant</span>
                    <span className="text-[10px] text-slate-400">Non-dilutive ₹50 Lakhs</span>
                  </div>
                  <span className="font-extrabold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded text-[11px]">
                    98% Match
                  </span>
                </div>

                <div className="p-2.5 bg-slate-900/90 rounded border border-emerald-700/60 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">DST NIDHI-PRAYAS</span>
                    <span className="text-[10px] text-slate-400">Prototype Grant ₹10 Lakhs</span>
                  </div>
                  <span className="font-extrabold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded text-[11px]">
                    95% Match
                  </span>
                </div>

                <div className="p-2.5 bg-slate-900/90 rounded border border-amber-700/60 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">Startup India Seed Fund</span>
                    <span className="text-[10px] text-slate-400">Grant / Debt ₹50 Lakhs</span>
                  </div>
                  <span className="font-extrabold text-amber-300 bg-amber-950 px-2 py-0.5 rounded text-[11px]">
                    88% Match
                  </span>
                </div>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-800/80">
        <ScrollReveal className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
              The Fundamental Problem
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              Founders lose millions in non-dilutive funding because schemes are buried.
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              India has over 100+ active government schemes, grants, state policies, and incubation programs. But finding them requires wading through 40+ outdated ministry websites, downloading 80-page PDF guidelines, and guessing eligibility criteria.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300 leading-snug">
                  <strong className="text-white block font-semibold mb-0.5">Scattered across 40+ websites</strong>
                  DPIIT, SIDBI, BIRAC, AIM, and state startup portals don't talk to each other.
                </span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300 leading-snug">
                  <strong className="text-white block font-semibold mb-0.5">Missed deadlines & strict rules</strong>
                  Complex eligibility criteria (DPIIT status, incorporation age, state bounds) lead to rejected applications.
                </span>
              </div>
            </div>
          </div>

          {/* Solution Comparison Card */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={smoothTransition}
            className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> The FounderPilot Solution
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                Unified RAG Platform
              </span>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-3 p-3 bg-[#070a12] rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Unified Opportunity Index</strong>
                  100+ official schemes continuously crawled and indexed into vector embeddings.
                </div>
              </li>

              <li className="flex items-start gap-3 p-3 bg-[#070a12] rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Precision Match Scoring (0–100%)</strong>
                  Rule-based Zod evaluation engine scores your exact startup profile against policy rules.
                </div>
              </li>

              <li className="flex items-start gap-3 p-3 bg-[#070a12] rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Grounded Citations & Direct Links</strong>
                  Every recommendation links directly to the official government portal with exact gazette references.
                </div>
              </li>
            </ul>
          </motion.div>

        </ScrollReveal>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-800/80">
        <ScrollReveal className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
            3-Step Intelligence Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            How FounderPilot Matches Your Startup
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            From raw founder profile to verified government grant match in under 2 minutes.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* STEP 1 */}
          <ScrollReveal delay={0.1}>
            <motion.div
              whileHover={{ y: -6 }}
              transition={smoothTransition}
              className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-4 relative shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800/60 flex items-center justify-center font-bold font-mono text-indigo-400 text-sm">
                01
              </div>
              <h3 className="text-lg font-bold text-white">Tell Us About Your Startup</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Complete a 2-minute, 5-step profile describing your state, incorporation status, DPIIT recognition, stage, team size, and funding requirements.
              </p>
              <div className="pt-2 text-[11px] font-mono text-indigo-400 flex items-center gap-1">
                <span>No pitch deck required</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          </ScrollReveal>

          {/* STEP 2 */}
          <ScrollReveal delay={0.2}>
            <motion.div
              whileHover={{ y: -6 }}
              transition={smoothTransition}
              className="p-6 bg-slate-900/80 rounded-2xl border border-emerald-500/30 space-y-4 relative shadow-lg shadow-emerald-500/5"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/60 flex items-center justify-center font-bold font-mono text-emerald-400 text-sm">
                02
              </div>
              <h3 className="text-lg font-bold text-white">AI Deep Vector Retrieval</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Jina Embeddings v3 converts your profile into 1024-d vectors, querying Qdrant Cloud across 1,000+ policy document chunks, followed by LLM reasoning.
              </p>
              <div className="pt-2 text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <span>Qdrant + Jina + Groq Pipeline</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          </ScrollReveal>

          {/* STEP 3 */}
          <ScrollReveal delay={0.3}>
            <motion.div
              whileHover={{ y: -6 }}
              transition={smoothTransition}
              className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-4 relative shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800/60 flex items-center justify-center font-bold font-mono text-amber-400 text-sm">
                03
              </div>
              <h3 className="text-lg font-bold text-white">Get Verified Matches & Links</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive ranked scheme recommendations with Match % scores, eligibility reasoning, required document checklists, and direct official portal links.
              </p>
              <div className="pt-2 text-[11px] font-mono text-amber-400 flex items-center gap-1">
                <span>Direct application links</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          </ScrollReveal>

        </div>
      </section>

      {/* OPPORTUNITY CATEGORIES GRID */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-800/80">
        <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-2">
              Comprehensive Coverage
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Opportunity Categories Indexed
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Categories
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat, idx) => {
            const IconComp = cat.icon;
            return (
              <ScrollReveal key={cat.id} delay={idx * 0.05}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={smoothTransition}
                  className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-4 hover:border-emerald-500/40 transition-all shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 bg-[#070a12] rounded-xl border border-slate-800">
                      <IconComp className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-800/60">
                      {cat.count}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{cat.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{cat.desc}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-slate-500 block">Sample Indexed Programs:</span>
                    <div className="flex flex-wrap gap-1">
                      {cat.examples.map((ex, i) => (
                        <span key={i} className="text-[11px] bg-[#070a12] text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* AI / RAG QUESTION DEMO SECTION */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-800/80">
        <ScrollReveal>
          <div className="p-8 sm:p-12 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-8 relative shadow-2xl">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-1">
                  Grounded Scheme QA Engine
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Ask Questions Grounded in Official Policy Documents
                </h2>
              </div>

              {/* Toggle RAG Sample Query */}
              <div className="flex items-center gap-2">
                {ragQueries.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRagQueryIndex(idx)}
                    className={`w-8 h-8 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                      ragQueryIndex === idx
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Q{idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Query Box */}
            <div className="space-y-6">
              
              {/* User Question */}
              <div className="p-4 bg-[#070a12] rounded-xl border border-slate-800 space-y-2">
                <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-indigo-400" /> Founder Query
                </span>
                <p className="text-sm font-semibold text-white">
                  "{ragQueries[ragQueryIndex].query}"
                </p>
              </div>

              {/* AI Grounded Response */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={ragQueryIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={smoothTransition}
                  className="p-5 bg-[#070a12] rounded-xl border border-emerald-500/40 space-y-4 relative"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                      <Bot className="w-4 h-4 text-emerald-400" /> FounderPilot AI Grounded Response
                    </span>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-800">
                      {ragQueries[ragQueryIndex].score}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                    {ragQueries[ragQueryIndex].answer}
                  </p>

                  {/* Official Gazette Citation */}
                  <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-400">
                      <FileText className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Official Citation: <strong className="text-slate-200">{ragQueries[ragQueryIndex].source}</strong></span>
                    </div>

                    <a
                      href={ragQueries[ragQueryIndex].sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 font-mono text-[11px] flex items-center gap-1 hover:underline"
                    >
                      <span>Verify Original Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>

            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* TRUST & VERIFIED GOVERNMENT SOURCES */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-800/80">
        <ScrollReveal className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
            Verified Index Coverage
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            100+ Official Government Portals & Institutions
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Every opportunity in our vector index comes directly from official government gazettes, ministry portals, and verified startup bodies.
          </p>
        </ScrollReveal>

        {/* Source Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {[
            { name: 'Startup India', org: 'DPIIT / MoCI', badge: 'Central Portal' },
            { name: 'SIDBI', org: 'Small Industries Dev Bank', badge: 'MSME Finance' },
            { name: 'AIM', org: 'Atal Innovation Mission', badge: 'Incubators' },
            { name: 'BIRAC', org: 'Dept of Biotechnology', badge: 'Biotech Grants' },
            { name: 'DST NIDHI', org: 'Dept of Science & Tech', badge: 'PRAYAS / EIR' },
            { name: 'myScheme', org: 'MeitY / NIC', badge: 'Govt Schemes' },
            { name: 'Agri Ministry', org: 'MoA & FW', badge: 'RKVY-RAFTAAR' },
            { name: 'TDB', org: 'Tech Dev Board', badge: 'Comm. Grants' },
            { name: 'GeM', org: 'Govt e-Marketplace', badge: 'Procurement' },
            { name: 'State Policies', org: '28 States & UTs', badge: 'State Incentives' }
          ].map((src, i) => (
            <ScrollReveal key={i} delay={i * 0.03}>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={smoothTransition}
                className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-center space-y-1.5 hover:border-emerald-500/40 transition-all shadow-md"
              >
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                  {src.badge}
                </span>
                <strong className="text-sm font-bold text-white block">{src.name}</strong>
                <span className="text-[10px] text-slate-500 block truncate">{src.org}</span>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-800/80 text-center">
        <ScrollReveal>
          <div className="p-10 sm:p-16 bg-gradient-to-b from-slate-900/90 to-[#070a12] rounded-3xl border border-slate-800 space-y-8 shadow-2xl relative">
            
            <div className="space-y-4 max-w-3xl mx-auto">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                Get Matched Today
              </span>
              <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
                Stop searching. Start building.
              </h2>
              <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                Match your startup against ₹500+ Cr in non-dilutive grants, incubation schemes, and cloud credits in less than 2 minutes.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={onStartWizard}
                className="w-full sm:w-auto px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-lg rounded-xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 cursor-pointer group"
              >
                <span>Find My Opportunities</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                100% Free & Immediate
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                Official Government Citations
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                2-Minute Profile Setup
              </span>
            </div>

          </div>
        </ScrollReveal>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-800/80 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-sm">Founder's Hub</span>
          <span>&bull; AI Startup Opportunity Discovery Engine</span>
        </div>
        <p>&copy; {new Date().getFullYear()} Founder's Hub. Powered by Jina Embeddings, Qdrant Cloud & Groq AI.</p>
      </footer>

    </div>
  );
}
