import React from 'react';
import { Bed, Car, Compass, Calendar, MapPin, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

export default function TripHubOverview({ trip }) {
  if (!trip) return null;

  const currency = trip.user_preferences?.currency || '₹';
  const hotelName = trip.user_preferences?.hotel_name || 'Central Hotel';
  
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
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Trip Management Hub</h3>
            <p className="text-xs text-slate-500">Consolidated overview of bookings, transit logistics, and activities</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-1.5 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Bookings Synchronized
          </span>
        </div>
      </div>

      {/* 3 Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Accommodation */}
        <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4.5 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-indigo-600" /> Accommodation
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
              HQ Base
            </span>
          </div>
          <div className="text-base font-bold text-slate-900 tracking-tight truncate">{hotelName}</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {trip.destination} Center
          </div>
          <div className="mt-3.5 pt-3 border-t border-slate-200/80 text-xs text-slate-600 flex justify-between items-center">
            <span>Total Stay:</span>
            <span className="font-bold text-slate-900">{trip.days.length} Nights</span>
          </div>
        </div>

        {/* 2. Transportation */}
        <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4.5 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <Car className="w-4 h-4 text-sky-600" /> Transit Logistics
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-bold border border-sky-200 capitalize">
              {Array.from(transportModes).join(', ') || 'Metro / Cab'}
            </span>
          </div>
          <div className="text-base font-bold text-slate-900 tracking-tight">
            {Math.round(totalDistanceKm * 10) / 10} km Total Route
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" /> ~{totalTransitMins} mins estimated transit
          </div>
          <div className="mt-3.5 pt-3 border-t border-slate-200/80 text-xs text-slate-600 flex justify-between items-center">
            <span>Transit Cost:</span>
            <span className="font-bold text-sky-700">{currency}{totalTransitCost}</span>
          </div>
        </div>

        {/* 3. Activities */}
        <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4.5 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" /> Planned Stops
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              {totalActivities} Total
            </span>
          </div>
          <div className="text-base font-bold text-slate-900 tracking-tight">
            {indoorCount} Indoor • {outdoorCount} Outdoor
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Optimized for {trip.user_preferences?.travel_style || 'Balanced'} pace
          </div>
          <div className="mt-3.5 pt-3 border-t border-slate-200/80 text-xs text-slate-600 flex justify-between items-center">
            <span>Itinerary State:</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {trip.health_status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
