import React from 'react';
import { Compass, Sparkles, ShieldCheck, AlertTriangle, RefreshCw } from 'lucide-react';

export default function Navbar({ healthStatus, activeTrip, onReset }) {
  return (
    <header className="sticky top-0 z-40 glass-card border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-2xl">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-xl shadow-lg shadow-sky-500/20">
          <Compass className="w-6 h-6 text-white animate-spin-slow" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              TravelPilot
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Multi-Agent AI System
            </span>
          </div>
          <p className="text-xs text-slate-400">Autonomous Travel Planner, Disruption Scanner & RAG Engine</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {activeTrip && (
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${
              healthStatus.includes('Replanned')
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                : healthStatus.includes('Disrupted')
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
            }`}>
              {healthStatus.includes('Replanned') ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : healthStatus.includes('Disrupted') ? (
                <AlertTriangle className="w-3.5 h-3.5" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5" />
              )}
              <span>Status: {healthStatus}</span>
            </div>

            <button
              onClick={onReset}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            >
              New Trip
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
