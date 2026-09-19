import React, { useState } from 'react';
import { Clock, MapPin, DollarSign, Navigation, ShieldAlert, Sparkles, Building, Sun, Umbrella } from 'lucide-react';

export default function ItineraryTimeline({ trip }) {
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  if (!trip || !trip.days || trip.days.length === 0) return null;

  const currentDay = trip.days[activeDayIndex] || trip.days[0];

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl">
      {/* Day Selector Tabs */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex gap-2 overflow-x-auto">
          {trip.days.map((day, idx) => (
            <button
              key={day.day_number}
              onClick={() => setActiveDayIndex(idx)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 ${
                activeDayIndex === idx
                  ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/25'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>Day {day.day_number}</span>
              <span className="text-xs opacity-75 font-normal">({day.activities.length} stops)</span>
            </button>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400">
          <div>Theme: <span className="text-slate-200 font-semibold">{currentDay.theme}</span></div>
          <div>Total Transit: <span className="text-sky-400 font-semibold">{currentDay.total_transit_mins} mins</span></div>
        </div>
      </div>

      {/* Activity Cards List */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-slate-800">
        {currentDay.activities.map((act, index) => (
          <div key={act.id || index} className="relative pl-14">
            {/* Timeline Node Badge */}
            <div className={`absolute left-3.5 top-1 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-slate-950 ${
              act.status === 'replaced'
                ? 'bg-amber-400 text-slate-950'
                : act.status === 'cancelled'
                ? 'bg-rose-500 text-white'
                : 'bg-sky-500 text-slate-950'
            }`}>
              {index + 1}
            </div>

            {/* Main Activity Card */}
            <div className={`rounded-xl p-5 border transition ${
              act.status === 'replaced'
                ? 'bg-amber-500/5 border-amber-500/30'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}>
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-slate-100">{act.title}</h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700">
                    {act.category}
                  </span>
                  {act.is_indoor ? (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 flex items-center gap-1">
                      <Umbrella className="w-3 h-3" /> Indoor Protected
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-1">
                      <Sun className="w-3 h-3" /> Outdoor
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1 text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-md border border-sky-500/20">
                    <Clock className="w-3.5 h-3.5" /> {act.start_time} – {act.end_time}
                  </span>
                  <span className="text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                    {trip.user_preferences.currency}{act.cost}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-3">{act.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-3 border-t border-slate-800/60">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-500" /> {act.opening_hours}
                </span>
                <span className="flex items-center gap-1 text-amber-400 font-medium">
                  ★ {act.rating}
                </span>
              </div>
            </div>

            {/* Transit Indicator to Next Stop */}
            {act.transport_to_next && index < currentDay.activities.length - 1 && (
              <div className="my-3 ml-2 flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 border border-slate-800/80 rounded-lg px-3 py-1.5 w-fit">
                <Navigation className="w-3.5 h-3.5 text-sky-400" />
                <span>
                  Next Stop: <strong className="text-slate-200">{act.transport_to_next.distance_km} km</strong> via{' '}
                  <span className="capitalize text-sky-300">{act.transport_to_next.mode}</span> (~
                  {act.transport_to_next.duration_mins} mins, {trip.user_preferences.currency}
                  {act.transport_to_next.cost})
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
