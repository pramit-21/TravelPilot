import React from 'react';
import { Compass, Sparkles, ShieldCheck, AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function Navbar({ healthStatus, activeTrip, onReset }) {
  const isReplanned = healthStatus?.includes('Replanned');
  const isDisrupted = healthStatus?.includes('Disrupted');

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-600/20">
            <Compass className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-base font-extrabold tracking-tight text-slate-900">
                TravelPilot
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-sky-600" /> Multi-Agent AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Autonomous Travel Planning & Real-Time Disruption Engine
            </p>
          </div>
        </div>

        {/* Right Section: Status & Controls */}
        <div className="flex items-center gap-3">
          {activeTrip && (
            <>
              {/* Active Trip Badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
                <span className="font-semibold text-slate-900">{activeTrip.destination}</span>
                <span className="text-slate-400">•</span>
                <span>{activeTrip.days?.length} Days</span>
              </div>

              {/* Engine Status Pill */}
              <div
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-2 border shadow-sm transition-all ${
                  isReplanned
                    ? 'bg-amber-50 border-amber-200 text-amber-800'
                    : isDisrupted
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isReplanned ? 'bg-amber-400' : isDisrupted ? 'bg-rose-400' : 'bg-emerald-400'
                    }`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      isReplanned ? 'bg-amber-500' : isDisrupted ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                  ></span>
                </span>
                <span>{healthStatus}</span>
              </div>

              {/* Reset / New Trip Action */}
              <button
                onClick={onReset}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-300 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>New Plan</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
