import React from 'react';
import { ShieldCheck, X, Lock, Eye, Server, UserCheck, Sparkles } from 'lucide-react';

export default function PrivacyPolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/75 flex items-center justify-center p-4 animate-fadeIn">
      {/* Modal Card */}
      <div className="bg-[var(--color-surface-1)] border border-[var(--color-line)] w-full max-w-2xl max-h-[85vh] rounded-[4px] overflow-hidden text-[var(--color-text)] relative flex flex-col animate-scaleUp">

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[var(--color-line)] bg-[var(--color-surface-2)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--color-surface-1)] border border-[var(--color-line)] rounded-[3px] text-[var(--color-signal)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-text)] tracking-tight flex items-center gap-2">
                Terms &amp; Conditions &bull; Privacy Protocol
              </h2>
              <p className="text-xs font-mono text-[var(--color-muted)]">
                Last updated: {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })} &bull; Founder's Hub
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

        {/* Scrollable Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-[var(--color-muted)] leading-relaxed">

          {/* Key Guarantee Banner */}
          <div className="p-4 bg-[var(--color-surface-2)] border border-emerald-500/30 rounded-[3px] text-[var(--color-text)] flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider font-semibold text-emerald-400 mb-1">Founder Privacy &amp; Terms Commitment</h4>
              <p className="text-xs leading-relaxed text-[var(--color-muted)]">
                Your pitch, startup metrics, and operational details are processed strictly to match you with eligible government schemes and cloud perks.
                <strong className="text-[var(--color-text)] font-semibold"> We never sell, rent, or monetize your startup data to advertisers or third parties.</strong>
              </p>
            </div>
          </div>

          {/* Section 1 */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[var(--color-text)] flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-[var(--color-signal)]" />
              01 // Information Telemetry
            </h3>
            <p>
              When you use Founder's Hub, we collect the following minimal data to deliver personalized evaluation reports:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-[var(--color-text)]">Account Credentials:</strong> Name, Email Address, and Avatar URL provided via Firebase Authentication (Google OAuth or Email/Password).</li>
              <li><strong className="text-[var(--color-text)]">Startup Evaluation Profile:</strong> Startup name, state/UT location, incorporation status, DPIIT recognition, stage, team size, support needed, and pitch description.</li>
              <li><strong className="text-[var(--color-text)]">Usage Analytics:</strong> Anonymized interaction metrics to improve AI search quality and scheme precision.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[var(--color-text)] flex items-center gap-2">
              <Server className="w-3.5 h-3.5 text-[var(--color-signal)]" />
              02 // Telemetry Utilization &amp; Terms of Service
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>To synthesize structured founder profiles using LLM reasoning.</li>
              <li>To match your venture against indexed government grant collections (Startup India, BIRAC, SIDBI) and cloud credit perks.</li>
              <li>To answer grounded policy questions without revealing private details.</li>
              <li>To store your evaluation history securely so you can re-access past reports.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[var(--color-text)] flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-[var(--color-signal)]" />
              03 // Data Protection &amp; Encryption
            </h3>
            <p>
              All data transmitted between your browser and our API servers is encrypted using industry-standard TLS 1.3 / HTTPS. User records are stored in MongoDB Atlas with database encryption at rest, and authentication tokens are verified server-side using Google Firebase Admin SDK.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[var(--color-text)] flex items-center gap-2">
              <UserCheck className="w-3.5 h-3.5 text-[var(--color-signal)]" />
              04 // Founder Rights, Inquiries &amp; Data Deletion
            </h3>
            <p>
              You maintain 100% ownership of your startup data. You can view your saved history anytime, or request complete deletion of your account and records by contacting <a href="mailto:raghav.anandofficial10@gmail.com" className="text-[var(--color-signal)] underline hover:brightness-110 font-mono">raghav.anandofficial10@gmail.com</a>.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[var(--color-line)] bg-[var(--color-surface-2)] flex items-center justify-between shrink-0">
          <div className="text-[10px] font-mono text-[var(--color-muted)]">
            Founder's Hub &bull; Institutional Telemetry
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[var(--color-signal)] hover:brightness-110 text-[#0E1119] font-mono text-xs uppercase tracking-wider font-semibold rounded-[3px] transition-colors cursor-pointer"
          >
            I Acknowledge &amp; Accept
          </button>
        </div>

      </div>
    </div>
  );
}
