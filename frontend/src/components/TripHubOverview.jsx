import React from 'react';
import { Bed, Car, Compass, Calendar, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function TripHubOverview({ trip }) {
  if (!trip) return null;

  const currency = trip.user_preferences?.currency || '₹';
  const hotelName = trip.user_preferences?.hotel_name || 'Central Hotel';
  
  // Calculate total transport metrics
  let totalDistanceKm = 0;
  let totalTransitMins = 0;
  let totalTransitCost = 0;
  let transportModes = new Set();
  let totalActivities = 0;
  let indoorCount = 0;
  let outdoorCount = 0;

  trip.days.forEach((day) => {
    day.activities.forEach((act) => {
      totalActivities += 1;
      if (act.is_indoor) indoorCount += 1;
      else outdoorCount += 1;

      if (act.transport_to_next) {
        totalDistanceKm += act.transport_to_next.distance_km || 0;
        totalTransitMins += act.transport_to_next.duration_mins || 0;
        totalTransitCost += act.transport_to_next.cost || 0;
        if (act.transport_to_next.mode) {
          transportModes.add(act.transport_to_next.mode);
        }
      }
    });
  });

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl mb-6">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Trip Management Hub</h3>
          </div>
          <p className="text-xs text-sky-300/80 mt-1 font-medium">
            Track planned transportation, accommodation, and activities in one place.
          </p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-mono flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> All Bookings Synchronized
        </span>
      </div>

      {/* 3 Unified Tracking Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Accommodation */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-indigo-400" /> Accommodation
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-semibold">
              Base HQ
            </span>
          </div>
          <div className="text-sm font-bold text-slate-100">{hotelName}</div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500" /> {trip.destination} Center
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/60 text-xs text-slate-300 flex justify-between">
            <span>Duration:</span>
            <strong className="text-slate-100">{trip.days.length} Nights</strong>
          </div>
        </div>

        {/* 2. Transportation */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Car className="w-4 h-4 text-sky-400" /> Transportation
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 font-semibold capitalize">
              {Array.from(transportModes).join(', ') || 'Taxi / Metro'}
            </span>
          </div>
          <div className="text-sm font-bold text-slate-100">
            {Math.round(totalDistanceKm * 10) / 10} km Total Distance
          </div>
          <div className="text-xs text-slate-400 mt-1">
            ~{totalTransitMins} mins total transit time
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/60 text-xs text-slate-300 flex justify-between">
            <span>Transit Budget:</span>
            <strong className="text-sky-400">{currency}{totalTransitCost}</strong>
          </div>
        </div>

        {/* 3. Activities */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" /> Activities
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-semibold">
              {totalActivities} Scheduled
            </span>
          </div>
          <div className="text-sm font-bold text-slate-100">
            {indoorCount} Indoor / {outdoorCount} Outdoor
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Day-by-day smart schedule
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/60 text-xs text-slate-300 flex justify-between">
            <span>Status:</span>
            <strong className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {trip.health_status}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
