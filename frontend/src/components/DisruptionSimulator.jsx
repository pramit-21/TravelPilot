import React from 'react';
import { CloudRain, AlertOctagon, DollarSign, Zap, Activity, RefreshCw } from 'lucide-react';

export default function DisruptionSimulator({ onDisrupt, onOptimize, loading }) {
  const actions = [
    {
      id: 'WEATHER_RAIN',
      type: 'disrupt',
      label: 'Torrential Rainstorm',
      badge: 'Weather Monitor',
      badgeColor: 'text-amber-800 bg-amber-50 border-amber-200',
      description: 'Swaps outdoor sites with indoor venues',
      icon: CloudRain,
      iconColor: 'text-amber-600'
    },
    {
      id: 'VENUE_CLOSED',
      type: 'disrupt',
      label: 'Sudden Venue Closure',
      badge: 'Replanner Agent',
      badgeColor: 'text-rose-800 bg-rose-50 border-rose-200',
      description: 'Replaces closed venue with nearest open alternative',
      icon: AlertOctagon,
      iconColor: 'text-rose-600'
    },
    {
      id: 'BUDGET_CUT',
      type: 'disrupt',
      label: 'Simulate Budget Cut',
      badge: 'Cost Optimizer',
      badgeColor: 'text-emerald-800 bg-emerald-50 border-emerald-200',
      description: 'Prunes premium costs to fit tight budget',
      icon: DollarSign,
      iconColor: 'text-emerald-600'
    },
    {
      id: 'OPTIMIZE_ROUTES',
      type: 'optimize',
      label: 'Optimize Transit Routes',
      badge: 'Routing Agent',
      badgeColor: 'text-sky-800 bg-sky-50 border-sky-200',
      description: 'Re-orders stops to minimize travel duration',
      icon: Zap,
      iconColor: 'text-sky-600'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Autonomous Agent Simulation & Stress-Test Console
            </h3>
            <p className="text-xs text-slate-500">
              Trigger real-world disruption events to observe live multi-agent recovery & replanning.
            </p>
          </div>
        </div>
        {loading && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold">
            <RefreshCw className="w-3 h-3 animate-spin text-sky-600" />
            <span>Agent Re-evaluating...</span>
          </div>
        )}
      </div>

      {/* Grid of Simulation Triggers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => (act.type === 'optimize' ? onOptimize() : onDisrupt(act.id))}
              disabled={loading}
              className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 hover:border-slate-300 hover:bg-white hover:shadow-md text-left transition-all group flex flex-col justify-between cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-white border border-slate-200 shadow-2xs group-hover:scale-105 transition ${act.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold ${act.badgeColor}`}>
                    {act.badge}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-sky-700 transition">
                  {act.label}
                </div>
              </div>
              <div className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                {act.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
