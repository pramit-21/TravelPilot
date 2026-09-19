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

  const COLORS = ['#0284c7', '#4f46e5', '#9333ea', '#059669', '#d97706', '#db2777'];

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
                {currency}{roundVal(totalCost / (trip.days.length || 1))}
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
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
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
                  formatter={(val) => [`${currency}${val}`, 'Spend']}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-xs text-slate-400">No spend breakdown</div>
          )}
        </div>

        {/* Category Legend */}
        <div className="space-y-2 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Category Allocations</span>
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
