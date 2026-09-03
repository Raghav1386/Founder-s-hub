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
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function SchemeQaTab({ schemeId, schemeTitle, source, url }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Hello! I am your AI Policy Assistant for **${schemeTitle || 'this opportunity'}** (${source || 'Official Program'}).\n\nAsk me anything about eligibility rules, funding limits, stage requirements, or required application documents!`,
      suggestedFollowups: [
        'Am I eligible at my current stage?',
        'What are the exact funding or credit limits?',
        'What documents are required to apply?'
      ]
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
      // Build chat history context
      const chatHistory = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, text: m.text }));

      const response = await fetch(getApiUrl(`/api/founder/scheme/${schemeId}/qa`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText.trim(),
          chatHistory
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
    <div className="flex flex-col h-[650px] bg-slate-900/90 rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl">
      
      {/* Q&A Top Banner */}
      <div className="bg-slate-950/80 border-b border-slate-800 px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              AI Grounded Q&A Assistant
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded-full font-bold">
                100% Grounded
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Ask any question about <span className="text-slate-200 font-semibold">{schemeTitle}</span>
            </p>
          </div>
        </div>

        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-950/80 border border-emerald-800/60 px-3 py-1.5 rounded-lg transition-all"
          >
            <span>Official Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Chat Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* User or AI Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-md ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-emerald-950 border border-emerald-800/80 text-emerald-400'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Message Bubble */}
            <div className="space-y-3 flex-1">
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white font-medium rounded-tr-none shadow-indigo-900/30 shadow-lg'
                    : 'bg-slate-950/90 text-slate-200 border border-slate-800/80 rounded-tl-none shadow-xl'
                }`}
              >
                {/* Paragraph formatted message */}
                <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
                  {msg.text}
                </div>
              </div>

              {/* Suggested Followups Pill Grid */}
              {msg.role === 'assistant' && msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                <div className="pt-1 space-y-2">
                  <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Suggested Next Questions:</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {msg.suggestedFollowups.map((followup, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendQuestion(followup)}
                        disabled={isLoading}
                        className="text-xs font-medium bg-slate-950 hover:bg-emerald-950/80 text-emerald-300 hover:text-emerald-200 border border-emerald-900/60 hover:border-emerald-700/80 px-3 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer text-left shadow-sm group"
                      >
                        <span>{followup}</span>
                        <ArrowRight className="w-3 h-3 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading Indicator Shimmer */}
        {isLoading && (
          <div className="flex gap-3 max-w-2xl mr-auto animate-fadeIn">
            <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-800/80 flex items-center justify-center shrink-0 text-emerald-400">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-slate-950/90 border border-slate-800/80 rounded-2xl rounded-tl-none p-4 text-xs font-medium text-slate-400 flex items-center gap-2 shadow-xl">
              <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>Analyzing scheme guidelines & profile eligibility rules...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="bg-slate-950 border-t border-slate-800 p-4">
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
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-emerald-500/80 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || isLoading}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-slate-950 font-bold px-5 py-3 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shrink-0 text-xs sm:text-sm"
          >
            <span>Ask AI</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
