import React, { useState } from 'react';
import { MapPin, Calendar, DollarSign, Sparkles, Navigation } from 'lucide-react';

export default function TripForm({ onSubmit, loading }) {
  const [destination, setDestination] = useState('Kolkata');
  const [durationDays, setDurationDays] = useState(3);
  const [budget, setBudget] = useState(20000);
  const [travelStyle, setTravelStyle] = useState('Balanced');
  const [interests, setInterests] = useState(['History', 'Food', 'Culture']);

  const allInterests = ['History', 'Food', 'Culture', 'Museums', 'Nature', 'Landmarks', 'Art'];

  const toggleInterest = (tag) => {
    if (interests.includes(tag)) {
      setInterests(interests.filter((i) => i !== tag));
    } else {
      setInterests([...interests, tag]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      destination,
      duration_days: Number(durationDays),
      budget: Number(budget),
      currency: destination === 'Paris' ? '€' : destination === 'Tokyo' ? '¥' : '₹',
      interests,
      travel_style: travelStyle,
      hotel_name: destination === 'Paris' ? 'Le Marais Boutique Hotel' : destination === 'Tokyo' ? 'Shinjuku Hotel' : 'Park Street Grand Hotel',
      hotel_lat: destination === 'Paris' ? 48.8566 : destination === 'Tokyo' ? 35.6895 : 22.5540,
      hotel_lng: destination === 'Paris' ? 2.3522 : destination === 'Tokyo' ? 139.6917 : 88.3512,
      start_date: '2026-10-01'
    });
  };

  return (
    <div className="max-w-2xl mx-auto glass-card rounded-2xl p-8 border border-slate-800 shadow-2xl glass-glow mt-8">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 bg-sky-500/10 rounded-2xl border border-sky-500/20 mb-3 text-sky-400">
          <Sparkles className="w-8 h-8 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100">Plan Trip with Multi-Agent AI</h2>
        <p className="text-sm text-slate-400 mt-1">
          TravelPilot synthesizes schedules, calculates route ETAs, queries weather & RAG guides.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
          ✨ Track planned transportation, accommodation, and activities in one place.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Select Destination
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'Kolkata', name: 'Kolkata, India', flag: '🇮🇳' },
              { id: 'Paris', name: 'Paris, France', flag: '🇫🇷' },
              { id: 'Tokyo', name: 'Tokyo, Japan', flag: '🇯🇵' }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setDestination(item.id)}
                className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                  destination === item.id
                    ? 'bg-sky-500/15 border-sky-500 text-sky-300 ring-1 ring-sky-500'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <span className="text-2xl mb-2">{item.flag}</span>
                <span className="font-semibold text-sm">{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-sky-400" /> Duration (Days)
            </label>
            <select
              value={durationDays}
              onChange={(e) => setDurationDays(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-sky-500"
            >
              {[1, 2, 3, 4, 5].map((d) => (
                <option key={d} value={d}>
                  {d} {d === 1 ? 'Day' : 'Days'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" /> Total Budget
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-sky-500 font-semibold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Interests & Preferences
          </label>
          <div className="flex flex-wrap gap-2">
            {allInterests.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition ${
                  interests.includes(interest)
                    ? 'bg-sky-500 text-slate-950 border-sky-400 font-semibold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-indigo-400" /> Travel Pace
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['Relaxed', 'Balanced', 'Fast-Paced'].map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => setTravelStyle(style)}
                className={`py-2.5 rounded-xl border text-xs font-medium transition ${
                  travelStyle === style
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 text-white font-bold text-base hover:opacity-95 transition shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Agents Planning Itinerary...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Synthesize AI Itinerary</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
