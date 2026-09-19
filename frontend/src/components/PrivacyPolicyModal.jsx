import React from 'react';
import { ShieldCheck, X, Lock, Eye, Server, UserCheck, FileText, Sparkles } from 'lucide-react';

export default function PrivacyPolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      {/* Modal Card */}
      <div className="bg-slate-900 border border-slate-800/90 w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden text-slate-200 relative flex flex-col animate-scaleUp">

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Privacy Policy & Data Security
              </h2>
              <p className="text-xs text-slate-400">
                Last updated: {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })} &bull; Founder's Hub
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

        {/* Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">

          {/* Key Guarantee Banner */}
          <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-200 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-emerald-300 text-sm mb-1">Our Founder Privacy Commitment</h4>
              <p className="text-emerald-200/90 text-xs">
                Your pitch, startup metrics, and operational details are processed strictly to match you with eligible government schemes and cloud perks.
                <strong className="text-white font-semibold"> We never sell, rent, or monetize your startup data to advertisers or third parties.</strong>
              </p>
            </div>
          </div>

          {/* Section 1 */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-400" />
              1. Information We Collect
            </h3>
            <p className="text-slate-400">
              When you use Founder's Hub, we collect the following minimal data to deliver personalized evaluation reports:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li><strong>Account Credentials:</strong> Name, Email Address, and Avatar URL provided via Firebase Authentication (Google 1-Click OAuth or Email/Password).</li>
              <li><strong>Startup Evaluation Profile:</strong> Startup name, state/UT location, incorporation status, DPIIT recognition, stage, team size, support needed, and pitch description submitted during questionnaire wizard.</li>
              <li><strong>Usage Analytics:</strong> Anonymized interaction metrics to improve AI search quality and scheme precision.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              2. How We Use Your Data
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>To synthesize structured founder profiles using LangChain & Groq LLMs.</li>
              <li>To match your venture against indexed government grant collections (Startup India, BIRAC, SIDBI) and cloud credit perks (AWS, Azure, Google Cloud).</li>
              <li>To answer grounded policy questions without revealing private details.</li>
              <li>To store your evaluation history securely so you can re-access past reports.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" />
              3. Data Protection & Encryption
            </h3>
            <p className="text-slate-400">
              All data transmitted between your browser and our API servers is encrypted using industry-standard TLS 1.3 / HTTPS. User records are stored in MongoDB Atlas with database encryption at rest, and authentication tokens are verified server-side using Google Firebase Admin SDK.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-400" />
              4. Your Rights & Data Deletion
            </h3>
            <p className="text-slate-400">
              You maintain 100% ownership of your startup data. You can view your saved history anytime, or request complete deletion of your account and saved evaluation records by contacting <a href="mailto:support@foundershub.in" className="text-indigo-400 underline hover:text-indigo-300">support@foundershub.in</a>.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500">
            Founder's Hub &bull; Empowering Indian Entrepreneurs
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg"
          >
            I Understand & Accept
          </button>
        </div>

      </div>
    </div>
  );
}
