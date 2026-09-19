import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Wallet, TrendingUp, AlertCircle } from 'lucide-react';

export default function BudgetOverview({ trip }) {
  if (!trip) return null;

  const currency = trip.user_preferences.currency || '₹';
  const totalCost = trip.total_cost || 0;
  const budget = trip.budget || 20000;
  const remaining = Math.max(0, budget - totalCost);
  const percentUsed = Math.min(100, roundVal((totalCost / budget) * 100));

  function roundVal(v) {
    return Math.round(v * 10) / 10;
  }

  // Calculate breakdown by category
  const categories = {};
  trip.days.forEach((day) => {
    day.activities.forEach((act) => {
      const cat = act.category || 'Sightseeing';
      const cost = act.cost + (act.transport_to_next ? act.transport_to_next.cost : 0);
      categories[cat] = (categories[cat] || 0) + cost;
    });
  });

  const chartData = Object.keys(categories).map((cat) => ({
    name: cat,
    value: categories[cat]
  }));

  const COLORS = ['#0284c7', '#6366f1', '#a855f7', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl mb-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">AI Budget Analytics & Spend</h3>
            <p className="text-xs text-slate-400">Real-time expenditure tracking</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400">Budget Utilized</span>
          <div className="text-base font-bold text-emerald-400">{percentUsed}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Progress gauge */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-400">Total Spent</span>
              <span className="text-slate-200">{currency}{totalCost} / {currency}{budget}</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-3 border border-slate-800 overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${percentUsed}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Remaining Buffer</span>
              <span className="font-bold text-emerald-400 text-sm">{currency}{remaining}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Pace Daily Avg</span>
              <span className="font-bold text-sky-400 text-sm">
                {currency}{roundVal(totalCost / (trip.days.length || 1))}
              </span>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="h-44 flex items-center justify-center">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-xs text-slate-500">No spend breakdown</div>
          )}
        </div>

        {/* Category Legend */}
        <div className="space-y-1.5 text-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">Category Allocations</span>
          {chartData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span>{item.name}</span>
              </div>
              <span className="font-semibold">{currency}{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
