import React, { useState } from 'react';
import { Clock, MapPin, DollarSign, Navigation, Building, Sun, Umbrella, Star, Eye, X } from 'lucide-react';
import { getActivityPhoto } from './DestinationHeroHeader';

export default function ItineraryTimeline({ trip }) {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  if (!trip || !trip.days || trip.days.length === 0) return null;

  const currentDay = trip.days[activeDayIndex] || trip.days[0];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-sm">
      {/* Day Selector Tabs & Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {trip.days.map((day, idx) => (
            <button
              key={day.day_number}
              onClick={() => setActiveDayIndex(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeDayIndex === idx
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-200/60'
              }`}
            >
              <span>Day {day.day_number}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeDayIndex === idx ? 'bg-white/20 text-white font-bold' : 'bg-white text-slate-600'}`}>
                {day.activities.length} stops
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="hidden sm:inline">Theme: <strong className="text-slate-900">{currentDay.theme}</strong></span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="px-2.5 py-1 rounded-md bg-sky-50 border border-sky-100 text-sky-700 font-semibold">
            ⏱ {currentDay.total_transit_mins} mins transit
          </span>
        </div>
      </div>

      {/* Activity Cards Timeline */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-200">
        {currentDay.activities.map((act, index) => {
          const isReplaced = act.status === 'replaced';
          const isCancelled = act.status === 'cancelled';
          const photoUrl = getActivityPhoto(act.title, trip.destination);

          return (
            <div key={act.id || index} className="relative pl-12">
              {/* Timeline Node Badge */}
              <div
                className={`absolute left-5 top-2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold border-2 border-white shadow-sm ring-2 ring-slate-100 ${
                  isReplaced
                    ? 'bg-amber-500 text-white'
                    : isCancelled
                    ? 'bg-rose-500 text-white'
                    : 'bg-sky-600 text-white'
                }`}
              >
                {index + 1}
              </div>

              {/* Activity Card */}
              <div
                className={`rounded-xl p-4 sm:p-5 border transition-all ${
                  isReplaced
                    ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {/* Activity Photo Thumbnail */}
                  <div
                    onClick={() => setSelectedPhoto({ url: photoUrl, title: act.title, desc: act.description })}
                    className="relative group w-full sm:w-32 h-36 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-2xs cursor-pointer bg-slate-100"
                    title="Click to expand photo"
                  >
                    <img
                      src={photoUrl}
                      alt={act.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-2">
                      <span className="text-[10px] text-white font-semibold flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Expand
                      </span>
                    </div>
                  </div>

                  {/* Activity Content */}
                  <div className="flex-1 min-w-0 w-full">
                    {/* Top Info Bar */}
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 tracking-tight">{act.title}</h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {act.category}
                        </span>
                        {act.is_indoor ? (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center gap-1 font-semibold">
                            <Umbrella className="w-2.5 h-2.5" /> Indoor
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-1 font-semibold">
                            <Sun className="w-2.5 h-2.5" /> Outdoor
                          </span>
                        )}
                        {isReplaced && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300">
                            ⚡ Replanned by AI
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs font-semibold">
                        <span className="flex items-center gap-1 text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
                          <Clock className="w-3 h-3 text-sky-600" /> {act.start_time} – {act.end_time}
                        </span>
                        <span className="text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 font-mono font-bold">
                          {trip.user_preferences?.currency || '₹'}{act.cost}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">{act.description}</p>

                    {/* Footer details */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-3 border-t border-slate-100">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Building className="w-3 h-3 text-slate-400" /> {act.opening_hours}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-amber-600 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" /> {act.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transit Connector to Next Stop */}
              {(act.transport_to_next || index === currentDay.activities.length - 1) && (() => {
                const transit = act.transport_to_next || {
                  mode: 'taxi',
                  duration_mins: 15,
                  distance_km: 3.2,
                  cost: trip.user_preferences?.currency === '€' ? 12 : trip.user_preferences?.currency === '¥' ? 1400 : 90
                };
                return (
                  <div className="my-2.5 ml-2 flex items-center gap-2 text-[11px] text-slate-600 bg-slate-100/90 border border-slate-200 rounded-lg px-3 py-1.5 w-fit shadow-2xs">
                    <Navigation className="w-3 h-3 text-sky-600" />
                    <span>
                      Transit: <strong className="text-slate-900">{transit.distance_km} km</strong> via{' '}
                      <span className="capitalize text-sky-700 font-bold">{transit.mode}</span> (~
                      {transit.duration_mins} mins, {trip.user_preferences?.currency || '₹'}
                      {transit.cost})
                    </span>
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative aspect-video w-full bg-black">
              <img src={selectedPhoto.url} alt={selectedPhoto.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-5 bg-slate-950 text-white">
              <h3 className="text-lg font-bold text-white">{selectedPhoto.title}</h3>
              <p className="text-xs text-slate-300 mt-1">{selectedPhoto.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

