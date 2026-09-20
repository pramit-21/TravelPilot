import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Wallet } from 'lucide-react';

export default function BudgetOverview({ trip }) {
  if (!trip) return null;

  const currency = trip.user_preferences?.currency || '₹';
  const totalCost = trip.total_cost || 0;
  const budget = trip.budget || 20000;
  const remaining = Math.max(0, budget - totalCost);
  const percentUsed = Math.min(100, roundVal((totalCost / budget) * 100));

  function roundVal(v) {
    return Math.round(v * 10) / 10;
  }

  // Extract user selected interests from trip preferences
  const selectedInterests = (trip.user_preferences?.interests && trip.user_preferences.interests.length > 0)
    ? trip.user_preferences.interests
    : [];

  const normalizeInterest = (interestStr) => {
    const s = (interestStr || '').toLowerCase();
    if (s.includes('hist')) return 'History';
    if (s.includes('food') || s.includes('dini') || s.includes('culin')) return 'Food';
    if (s.includes('cultur') || s.includes('spirit') || s.includes('templ')) return 'Culture';
    if (s.includes('museum') || s.includes('scienc')) return 'Museums';
    if (s.includes('natur') || s.includes('park') || s.includes('garden')) return 'Nature';
    if (s.includes('landmark') || s.includes('monument') || s.includes('bridg') || s.includes('tower')) return 'Landmarks';
    if (s.includes('art') || s.includes('galler')) return 'Art';
    return interestStr;
  };

  const matchActivityToSelectedInterest = (act, validInterests) => {
    const cat = (act.category || '').toLowerCase();
    const title = (act.title || '').toLowerCase();

    // 1. Direct or normalized string match
    for (const interest of validInterests) {
      const norm = normalizeInterest(interest).toLowerCase();
      const direct = interest.toLowerCase();
      if (cat === direct || cat === norm) return interest;
      if (cat.startsWith(direct) || cat.startsWith(norm)) return interest;
      if (direct.startsWith(cat) || norm.startsWith(cat)) return interest;
    }

    // 2. Semantic keywords match for interest categories
    for (const interest of validInterests) {
      const norm = normalizeInterest(interest);
      if (norm === 'History' && (cat.includes('hist') || title.includes('memorial') || title.includes('heritage') || title.includes('palace') || title.includes('cathedral'))) {
        return interest;
      }
      if (norm === 'Food' && (cat.includes('food') || cat.includes('dining') || cat.includes('culin') || cat.includes('cafe') || cat.includes('market') || title.includes('culinary') || title.includes('market') || title.includes('food') || title.includes('bistro') || title.includes('pastry'))) {
        return interest;
      }
      if (norm === 'Culture' && (cat.includes('cultur') || cat.includes('temple') || cat.includes('shrine') || cat.includes('spirit') || title.includes('temple') || title.includes('math') || title.includes('shrine') || title.includes('basilica'))) {
        return interest;
      }
      if (norm === 'Museums' && (cat.includes('museum') || cat.includes('scienc') || title.includes('museum') || title.includes('planetarium'))) {
        return interest;
      }
      if (norm === 'Nature' && (cat.includes('natur') || cat.includes('garden') || cat.includes('park') || title.includes('garden') || title.includes('park') || title.includes('river') || title.includes('lake'))) {
        return interest;
      }
      if (norm === 'Landmarks' && (cat.includes('landmark') || cat.includes('tower') || cat.includes('bridge') || title.includes('tower') || title.includes('bridge') || title.includes('arc') || title.includes('crossing') || title.includes('square'))) {
        return interest;
      }
      if (norm === 'Art' && (cat.includes('art') || cat.includes('gallery') || title.includes('art') || title.includes('louvre') || title.includes('orsay') || title.includes('pompidou') || title.includes('teamlab'))) {
        return interest;
      }
    }
    return null;
  };

  const categories = {};
  if (selectedInterests.length > 0) {
    // Assure that ONLY selected Travel focus & interests appear in the categories
    selectedInterests.forEach((interest) => {
      categories[interest] = 0;
    });

    trip.days?.forEach((day) => {
      day.activities?.forEach((act) => {
        const cost = (act.cost || 0) + (act.transport_to_next ? (act.transport_to_next.cost || 0) : 0);
        const matchedInterest = matchActivityToSelectedInterest(act, selectedInterests);
        if (matchedInterest) {
          categories[matchedInterest] = (categories[matchedInterest] || 0) + cost;
        }
      });
    });
  } else {
    // Fallback if no specific interests selected
    trip.days?.forEach((day) => {
      day.activities?.forEach((act) => {
        const cat = act.category || 'Sightseeing';
        const cost = (act.cost || 0) + (act.transport_to_next ? (act.transport_to_next.cost || 0) : 0);
        categories[cat] = (categories[cat] || 0) + cost;
      });
    });
  }

  const chartData = Object.keys(categories).map((cat) => ({
    name: cat,
    value: Math.round(categories[cat])
  }));

  const COLORS = ['#0284c7', '#4f46e5', '#9333ea', '#059669', '#d97706', '#db2777', '#0891b2', '#7c3aed'];

  const totalAllocated = chartData.reduce((acc, curr) => acc + curr.value, 0);
  const pieData = totalAllocated > 0
    ? chartData.filter((d) => d.value > 0)
    : chartData.map((d) => ({ ...d, chartValue: 1 }));

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Budget & Financial Analytics</h3>
            <p className="text-xs text-slate-500">Autonomous spend tracking and cost allocation</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Utilization</span>
            <span className="text-sm font-extrabold text-emerald-600">{percentUsed}% of Limit</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Progress gauge */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-slate-500">Total Spent</span>
              <span className="text-slate-900">{currency}{totalCost} <span className="text-slate-400 font-normal">/ {currency}{budget}</span></span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 border border-slate-200 overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-sky-500 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-2xs"
                style={{ width: `${percentUsed}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200">
              <span className="text-slate-500 block text-[10px] font-bold uppercase">Remaining Buffer</span>
              <span className="font-extrabold text-emerald-600 text-sm mt-0.5 block">{currency}{remaining}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200">
              <span className="text-slate-500 block text-[10px] font-bold uppercase">Daily Avg Pace</span>
              <span className="font-extrabold text-sky-700 text-sm mt-0.5 block">
                {currency}{roundVal(totalCost / (trip.days?.length || 1))}
              </span>
            </div>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="h-44 flex items-center justify-center">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey={totalAllocated > 0 ? "value" : "chartValue"}
                >
                  {pieData.map((entry) => {
                    const colorIndex = chartData.findIndex((d) => d.name === entry.name);
                    return (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={COLORS[(colorIndex >= 0 ? colorIndex : 0) % COLORS.length]}
                      />
                    );
                  })}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '10px',
                    color: '#0f172a',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.12)'
                  }}
                  formatter={(val, name, item) => {
                    const realItem = chartData.find((d) => d.name === item.payload.name);
                    return [`${currency}${realItem ? realItem.value : val}`, 'Allocation'];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-xs text-slate-400">No spend breakdown</div>
          )}
        </div>

        {/* Category Legend */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {selectedInterests.length > 0 ? 'Selected Interests' : 'Category Allocations'}
            </span>
            {selectedInterests.length > 0 && (
              <span className="text-[10px] text-sky-600 font-semibold bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                {selectedInterests.length} Selected
              </span>
            )}
          </div>
          {chartData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-slate-700 py-0.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-slate-700 font-medium">{item.name}</span>
              </div>
              <span className="font-bold text-slate-900 font-mono">{currency}{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
