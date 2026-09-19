import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Sparkles, X, Loader2 } from 'lucide-react';

export default function AIChatDrawer({ tripId, onChatSubmit, lastChatResponse }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Hello! I am your TravelPilot AI Assistant. You can ask me questions about your destination, request RAG advice, or ask me to replan activities.'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await onChatSubmit(tripId, userMsg);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: res.reply,
          action_taken: res.action_taken,
          tools_used: res.tools_used
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: 'Sorry, I encountered an error communicating with the agent server.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold shadow-xl shadow-sky-600/25 hover:scale-105 transition-all flex items-center gap-2.5 border border-white/20 cursor-pointer"
        >
          <div className="p-1 rounded-lg bg-white/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs tracking-wide">Ask AI Copilot</span>
        </button>
      ) : (
        <div className="w-96 sm:w-[410px] bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[540px] animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-3.5 bg-white border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                  TravelPilot AI Copilot
                </h3>
                <span className="text-[10px] text-slate-500">RAG Vector Intelligence & Tools</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/70 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed text-xs ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-br-xs font-medium shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {msg.action_taken && (
                    <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-sky-700 flex items-center gap-1 font-mono font-semibold">
                      <Sparkles className="w-3 h-3 text-sky-600" /> Action: {msg.action_taken}
                    </div>
                  )}

                  {msg.tools_used?.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {msg.tools_used.map((t, i) => (
                        <span
                          key={i}
                          className="text-[9px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-mono font-semibold"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 items-center text-slate-500 text-xs py-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-600" />
                <span>Agent querying RAG and calculating options...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggestions */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[11px]">
            {[
              "Check Victoria Memorial hours",
              "What if it rains tomorrow?",
              "Reduce my budget by 20%"
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => setInput(prompt)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 whitespace-nowrap transition cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask questions or command route changes..."
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-600 transition"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-sky-600 text-white hover:bg-sky-700 font-bold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
