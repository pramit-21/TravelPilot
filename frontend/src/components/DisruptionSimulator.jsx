import React from 'react';
import { CloudRain, AlertOctagon, DollarSign, Zap, ShieldAlert, Sparkles } from 'lucide-react';

export default function DisruptionSimulator({ onDisrupt, onOptimize, loading }) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-rose-500/20 shadow-xl mb-6 bg-slate-900/60">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              Live AI Disruption & Replanning Simulator
            </h3>
            <p className="text-xs text-slate-400">
              Trigger real-world events to evaluate autonomous multi-agent adaptation in real-time.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => onDisrupt('WEATHER_RAIN')}
          disabled={loading}
          className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 hover:border-amber-500 text-left transition flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-2">
            <CloudRain className="w-5 h-5 text-amber-400 group-hover:scale-110 transition" />
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-semibold">Monitor</span>
          </div>
          <span className="text-xs font-bold text-slate-200">Simulate Torrential Rain</span>
          <span className="text-[10px] text-slate-400 mt-1">Replaces outdoor stops with indoor places</span>
        </button>

        <button
          onClick={() => onDisrupt('VENUE_CLOSED')}
          disabled={loading}
          className="p-3.5 rounded-xl bg-slate-950 border border-rose-500/30 hover:border-rose-500 text-left transition flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-2">
            <AlertOctagon className="w-5 h-5 text-rose-400 group-hover:scale-110 transition" />
            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 font-semibold">Replanner</span>
          </div>
          <span className="text-xs font-bold text-slate-200">Simulate Venue Closure</span>
          <span className="text-[10px] text-slate-400 mt-1">Swaps closed attraction with nearby spot</span>
        </button>

        <button
          onClick={() => onDisrupt('BUDGET_CUT')}
          disabled={loading}
          className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 hover:border-emerald-500 text-left transition flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition" />
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-semibold">Budget AI</span>
          </div>
          <span className="text-xs font-bold text-slate-200">Simulate Budget Cut</span>
          <span className="text-[10px] text-slate-400 mt-1">Restructures costs to lower target</span>
        </button>

        <button
          onClick={onOptimize}
          disabled={loading}
          className="p-3.5 rounded-xl bg-slate-950 border border-sky-500/30 hover:border-sky-500 text-left transition flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-5 h-5 text-sky-400 group-hover:scale-110 transition" />
            <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 font-semibold">Optimizer</span>
          </div>
          <span className="text-xs font-bold text-slate-200">Optimize Transit Routes</span>
          <span className="text-[10px] text-slate-400 mt-1">Re-sequences stops to cut travel time</span>
        </button>
      </div>
    </div>
  );
}
