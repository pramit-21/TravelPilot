import React, { useState } from 'react';
import { Terminal, Cpu, ChevronDown, ChevronUp, CheckCircle2, Wrench } from 'lucide-react';

export default function AgentThoughtLog({ agentResponse }) {
  const [collapsed, setCollapsed] = useState(false);

  if (!agentResponse) return null;

  return (
    <div className="glass-card rounded-2xl border border-sky-500/20 p-5 mb-6 shadow-xl">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setCollapsed(!collapsed)}>
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">
                [{agentResponse.agent_name}]
              </span>
              <span className="text-sm font-semibold text-slate-200">Execution & Reasoning Trace</span>
            </div>
            <p className="text-xs text-slate-400">{agentResponse.summary}</p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-200">
          {collapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </button>
      </div>

      {!collapsed && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-4 font-mono text-xs">
          {/* Reasoning Steps */}
          <div>
            <div className="text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-indigo-400" /> Multi-Agent Chain-of-Thought:
            </div>
            <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800 space-y-2 text-slate-300">
              {agentResponse.reasoning?.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tools Called */}
          {agentResponse.tools_called?.length > 0 && (
            <div>
              <div className="text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-amber-400" /> Tool Calling Diagnostics:
              </div>
              <div className="flex flex-wrap gap-2">
                {agentResponse.tools_called.map((toolCall, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 text-[11px] flex items-center gap-1.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-semibold text-sky-400">{toolCall.tool || toolCall.tool_name}</span>
                    {toolCall.summary && <span className="text-slate-400">({toolCall.summary})</span>}
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
