import React, { useState } from 'react';
import { MapPin, Calendar, DollarSign, Sparkles, Navigation, Check } from 'lucide-react';

export default function TripForm({ onSubmit, loading }) {
  const [destination, setDestination] = useState('Kolkata');
  const [durationDays, setDurationDays] = useState(3);
  const [budget, setBudget] = useState(20000);
  const [travelStyle, setTravelStyle] = useState('Balanced');
  const [interests, setInterests] = useState(['History', 'Food', 'Culture']);

  const allInterests = ['History', 'Food', 'Culture', 'Museums', 'Nature', 'Landmarks', 'Art'];

  const destinations = [
    {
      id: 'Kolkata',
      name: 'Kolkata',
      country: 'India',
      subtitle: 'City of Joy & Heritage',
      currency: '₹',
      defaultBudget: 20000,
      coords: { lat: 22.5540, lng: 88.3512 },
      hotel: 'Park Street Grand Hotel'
    },
    {
      id: 'Paris',
      name: 'Paris',
      country: 'France',
      subtitle: 'Art, Architecture & Cuisine',
      currency: '€',
      defaultBudget: 2200,
      coords: { lat: 48.8566, lng: 2.3522 },
      hotel: 'Le Marais Boutique Hotel'
    },
    {
      id: 'Tokyo',
      name: 'Tokyo',
      country: 'Japan',
      subtitle: 'Tradition Meets High-Tech',
      currency: '¥',
      defaultBudget: 180000,
      coords: { lat: 35.6895, lng: 139.6917 },
      hotel: 'Shinjuku Central Hotel'
    }
  ];

  const handleSelectCity = (city) => {
    setDestination(city.id);
    setBudget(city.defaultBudget);
  };

  const toggleInterest = (tag) => {
    if (interests.includes(tag)) {
      setInterests(interests.filter((i) => i !== tag));
    } else {
      setInterests([...interests, tag]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const city = destinations.find((d) => d.id === destination) || destinations[0];
    onSubmit({
      destination: city.id,
      duration_days: Number(durationDays),
      budget: Number(budget),
      currency: city.currency,
      interests,
      travel_style: travelStyle,
      hotel_name: city.hotel,
      hotel_lat: city.coords.lat,
      hotel_lng: city.coords.lng,
      start_date: '2026-10-01'
    });
  };

  const selectedCity = destinations.find((d) => d.id === destination) || destinations[0];

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          Autonomous Multi-Agent Planner
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Where would you like to travel?
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-lg mx-auto leading-relaxed">
          Our specialized AI agents will curate schedules, optimize transit routes, check live weather, and balance your budget.
        </p>
      </div>

      {/* Main Clean Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Destination Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Select Destination
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {destinations.map((item) => {
                const isSelected = destination === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectCity(item)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-sky-50/80 border-sky-600 text-slate-900 shadow-sm ring-2 ring-sky-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm tracking-tight text-slate-900">{item.name}</span>
                      {isSelected ? (
                        <div className="w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono uppercase font-semibold">{item.country}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{item.subtitle}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration & Budget Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-600" /> Trip Duration
              </label>
              <select
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 transition cursor-pointer shadow-xs"
              >
                {[1, 2, 3, 4, 5].map((d) => (
                  <option key={d} value={d}>
                    {d} {d === 1 ? 'Day (Express Tour)' : 'Days (Full Itinerary)'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Target Budget ({selectedCity.currency})
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
                  {selectedCity.currency}
                </span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-slate-900 text-sm font-bold focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 transition shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* Interests Pills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Travel Focus & Interests
            </label>
            <div className="flex flex-wrap gap-2">
              {allInterests.map((interest) => {
                const active = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      active
                        ? 'bg-sky-600 text-white border-sky-600 font-semibold shadow-xs'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-200/70'
                    }`}
                  >
                    {active && <span className="mr-1">✓</span>}
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Travel Pace Segmented Control */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-indigo-600" /> Travel Pace
            </label>
            <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
              {['Relaxed', 'Balanced', 'Fast-Paced'].map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setTravelStyle(style)}
                  className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    travelStyle === style
                      ? 'bg-white text-sky-700 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>AI Agents Synthesizing Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Autonomous Itinerary</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
