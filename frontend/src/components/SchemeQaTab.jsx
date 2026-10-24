import React, { useState, useRef, useEffect } from 'react';
import { getApiUrl } from '../configs/api';
import {
  Sparkles,
  Send,
  Loader2,
  Bot,
  User,
  HelpCircle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export default function SchemeQaTab({
  schemeId,
  schemeTitle,
  source,
  url,
  analysisId,
  startupContext,
  founderProfile
}) {
  const activeStartupName = startupContext?.startupName || founderProfile?.startupName;
  const initialWelcome = activeStartupName
    ? `Hello! I am your AI Policy Assistant for **${schemeTitle || 'this opportunity'}** (${source || 'Official Program'}).\n\nI have grounded the guidelines specifically for **${activeStartupName}**. Ask me how your venture's stage, location, or funding requirements align with the official scheme rules!`
    : `Hello! I am your AI Policy Assistant for **${schemeTitle || 'this opportunity'}** (${source || 'Official Program'}).\n\nAsk me anything about eligibility rules, funding limits, stage requirements, or required application documents!`;

  const initialFollowups = activeStartupName
    ? [
        `Is ${activeStartupName} eligible at our current stage?`,
        'What are the exact funding or credit limits?',
        'What specific documents do we need to apply?'
      ]
    : [
        'Am I eligible at my current stage?',
        'What are the exact funding or credit limits?',
        'What documents are required to apply?'
      ];

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: initialWelcome,
      suggestedFollowups: initialFollowups
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendQuestion = async (textToSend) => {
    const questionText = typeof textToSend === 'string' ? textToSend : inputQuestion;
    if (!questionText || !questionText.trim() || isLoading) return;

    const userMsgId = Date.now().toString();
    const newUserMsg = {
      id: userMsgId,
      role: 'user',
      text: questionText.trim()
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const chatHistory = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, text: m.text }));

      const response = await fetch(getApiUrl(`/api/founder/scheme/${schemeId}/qa`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText.trim(),
          chatHistory,
          analysisId: analysisId || null,
          startupContext: startupContext || null,
          founderProfile: founderProfile || null
        })
      });

      if (response.ok) {
        const json = await response.json();
        const data = json.data || {};

        const aiMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: data.answer || 'I evaluated the scheme documentation for your query.',
          suggestedFollowups: Array.isArray(data.suggestedFollowups) ? data.suggestedFollowups : []
        };

        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const errJson = await response.json().catch(() => ({}));
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            text: `⚠️ ${errJson.error || 'Failed to analyze scheme documentation. Please try again.'}`,
            suggestedFollowups: []
          }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: '⚠️ Network connection error. Please check your connection and try again.',
          suggestedFollowups: []
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[520px] sm:h-[620px] bg-[var(--color-surface-1)] rounded-[4px] border border-[var(--color-line)] overflow-hidden">
      
      {/* Q&A Top Banner */}
      <div className="bg-[var(--color-surface-2)] border-b border-[var(--color-line)] px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[3px] bg-[var(--color-surface-1)] border border-[var(--color-line)] flex items-center justify-center shrink-0 text-[var(--color-signal)]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
              AI Grounded Policy Assistant
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded-[2px] uppercase">
                Grounded
              </span>
            </h3>
            <p className="text-[11px] font-mono text-[var(--color-muted)] flex flex-wrap items-center gap-1.5">
              <span>Opportunity: <span className="text-[var(--color-text)] font-medium">{schemeTitle}</span></span>
              {activeStartupName && (
                <>
                  <span className="text-[var(--color-line-strong)]">&bull;</span>
                  <span>Startup: <span className="text-[var(--color-signal)] font-semibold">{activeStartupName}</span></span>
                </>
              )}
            </p>
          </div>
        </div>

        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[var(--color-text)] hover:text-[var(--color-signal)] bg-[var(--color-surface-1)] hover:bg-[var(--color-surface-2)] border border-[var(--color-line)] px-3 py-1.5 rounded-[3px] transition-colors"
          >
            <span>Official Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-[var(--color-muted)]" />
          </a>
        )}
      </div>

      {/* Chat Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-2xl ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* User or AI Avatar */}
            <div
              className={`w-7 h-7 rounded-[3px] flex items-center justify-center shrink-0 text-xs font-mono font-semibold ${
                msg.role === 'user'
                  ? 'bg-[var(--color-signal)] text-[#0E1119]'
                  : 'bg-[var(--color-surface-2)] border border-[var(--color-line)] text-[var(--color-signal)]'
              }`}
            >
              {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            {/* Message Bubble */}
            <div className="space-y-2 flex-1">
              <div
                className={`p-3.5 rounded-[3px] text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[var(--color-signal)] text-[#0E1119] font-medium'
                    : 'bg-[var(--color-surface-2)] text-[var(--color-text)] border border-[var(--color-line)]'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>
              </div>

              {/* Suggested Followups */}
              {msg.role === 'assistant' && msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                <div className="pt-1 space-y-1.5">
                  <p className="text-[10px] font-mono text-[var(--color-muted)] flex items-center gap-1 uppercase tracking-wider">
                    <HelpCircle className="w-3 h-3 text-[var(--color-signal)]" />
                    <span>Suggested Next Queries:</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedFollowups.map((followup, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendQuestion(followup)}
                        disabled={isLoading}
                        className="text-xs font-mono bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-1)] text-[var(--color-text)] hover:text-[var(--color-signal)] border border-[var(--color-line)] hover:border-[var(--color-signal)] px-2.5 py-1 rounded-[3px] transition-colors flex items-center gap-1.5 cursor-pointer text-left group"
                      >
                        <span>{followup}</span>
                        <ArrowRight className="w-3 h-3 text-[var(--color-muted)] group-hover:text-[var(--color-signal)] transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-xl mr-auto animate-fadeIn">
            <div className="w-7 h-7 rounded-[3px] bg-[var(--color-surface-2)] border border-[var(--color-line)] flex items-center justify-center shrink-0 text-[var(--color-signal)]">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-[3px] p-3 text-xs font-mono text-[var(--color-muted)] flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 text-[var(--color-signal)] animate-spin" />
              <span>Analyzing scheme guidelines & eligibility rules...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="bg-[var(--color-surface-2)] border-t border-[var(--color-line)] p-3 sm:p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuestion();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder="Ask anything about eligibility, funding limits, stage rules..."
            disabled={isLoading}
            className="flex-1 h-10 bg-[var(--color-surface-1)] border border-[var(--color-line)] focus:border-[var(--color-signal)] text-[var(--color-text)] placeholder:text-[var(--color-muted)] rounded-[3px] px-3.5 text-xs font-mono outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || isLoading}
            className="h-10 bg-[var(--color-signal)] hover:brightness-110 disabled:opacity-40 text-[#0E1119] font-mono text-xs uppercase tracking-wider font-semibold px-4 rounded-[3px] transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Ask AI</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
}
