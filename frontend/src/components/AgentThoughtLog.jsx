import React, { useState } from 'react';
import { Terminal, Cpu, ChevronDown, ChevronUp, CheckCircle2, Wrench } from 'lucide-react';

export default function AgentThoughtLog({ agentResponse }) {
  const [collapsed, setCollapsed] = useState(false);

  if (!agentResponse) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm transition-all">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-50 rounded-xl text-sky-600 border border-sky-100">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 font-mono">
                {agentResponse.agent_name}
              </span>
              <span className="text-sm font-bold text-slate-900 tracking-tight">Multi-Agent Execution & Reasoning Trace</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{agentResponse.summary}</p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer">
          {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {!collapsed && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 text-xs">
          {/* Reasoning Steps */}
          <div>
            <div className="text-slate-600 font-bold mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <Terminal className="w-3.5 h-3.5 text-indigo-600" /> Chain-of-Thought Trace:
            </div>
            <div className="bg-[#0f172a] rounded-xl p-4 border border-slate-800 space-y-2 text-slate-300 font-mono text-[11px] shadow-inner">
              {agentResponse.reasoning?.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tools Called */}
          {agentResponse.tools_called?.length > 0 && (
            <div>
              <div className="text-slate-600 font-bold mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                <Wrench className="w-3.5 h-3.5 text-amber-600" /> Dispatched Tool Invocations:
              </div>
              <div className="flex flex-wrap gap-2">
                {agentResponse.tools_called.map((toolCall, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-[11px] flex items-center gap-1.5 font-mono"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-sky-800">{toolCall.tool || toolCall.tool_name}</span>
                    {toolCall.summary && <span className="text-slate-500 font-sans">({toolCall.summary})</span>}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
