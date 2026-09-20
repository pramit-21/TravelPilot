import React, { useState } from 'react';
import { MapPin, Calendar, DollarSign, Sparkles, Navigation, Check } from 'lucide-react';

export default function TripForm({ onSubmit, loading }) {
  const [destination, setDestination] = useState('');
  const [durationDays, setDurationDays] = useState('');
  const [budget, setBudget] = useState('');
  const [travelStyle, setTravelStyle] = useState('');
  const [interests, setInterests] = useState([]);
  const [formError, setFormError] = useState('');

  const allInterests = ['History', 'Food', 'Culture', 'Museums', 'Nature', 'Landmarks', 'Art'];

  const destinations = [
    {
      id: 'Kolkata',
      name: 'Kolkata',
      country: 'India',
      subtitle: 'City of Joy & Heritage',
      currency: '₹',
      defaultBudget: 20000,
      budgetSuggestions: [
        { label: 'Budget', amount: 10000 },
        { label: 'Standard', amount: 20000 },
        { label: 'Luxury', amount: 35000 }
      ],
      coords: { lat: 22.5540, lng: 88.3512 },
      hotel: 'Park Street Grand Hotel',
      image: '/kolkata.jpg'
    },
    {
      id: 'Paris',
      name: 'Paris',
      country: 'France',
      subtitle: 'Art, Architecture & Cuisine',
      currency: '€',
      defaultBudget: 2200,
      budgetSuggestions: [
        { label: 'Budget', amount: 1200 },
        { label: 'Standard', amount: 2200 },
        { label: 'Luxury', amount: 3800 }
      ],
      coords: { lat: 48.8566, lng: 2.3522 },
      hotel: 'Le Marais Boutique Hotel',
      image: '/paris.jpg'
    },
    {
      id: 'Tokyo',
      name: 'Tokyo',
      country: 'Japan',
      subtitle: 'Tradition Meets High-Tech',
      currency: '¥',
      defaultBudget: 180000,
      budgetSuggestions: [
        { label: 'Budget', amount: 100000 },
        { label: 'Standard', amount: 180000 },
        { label: 'Luxury', amount: 300000 }
      ],
      coords: { lat: 35.6895, lng: 139.6917 },
      hotel: 'Shinjuku Central Hotel',
      image: '/tokyo.jpg'
    }
  ];

  const getSuggestions = (city) => {
    if (!city || !city.budgetSuggestions) return [];
    if (!durationDays || Number(durationDays) === 3) {
      return city.budgetSuggestions;
    }
    const ratio = Number(durationDays) / 3;
    return city.budgetSuggestions.map((s) => {
      const scaled = s.amount * ratio;
      let cleanAmount;
      if (scaled >= 10000) {
        cleanAmount = Math.round(scaled / 1000) * 1000;
      } else if (scaled >= 1000) {
        cleanAmount = Math.round(scaled / 100) * 100;
      } else {
        cleanAmount = Math.round(scaled / 10) * 10;
      }
      return {
        ...s,
        amount: cleanAmount
      };
    });
  };

  const handleSelectCity = (city) => {
    const prevCity = destinations.find((d) => d.id === destination);
    const prevSuggestions = prevCity ? getSuggestions(prevCity).map((s) => s.amount) : [];
    if (!budget || (prevCity && (Number(budget) === prevCity.defaultBudget || prevSuggestions.includes(Number(budget))))) {
      const currentCitySuggestions = getSuggestions(city);
      const defaultSuggested = currentCitySuggestions.find((s) => s.label === 'Standard') || currentCitySuggestions[1];
      setBudget(defaultSuggested ? defaultSuggested.amount : city.defaultBudget);
    }
    setDestination(city.id);
    if (formError) setFormError('');
  };

  const toggleInterest = (tag) => {
    if (formError) setFormError('');
    if (interests.includes(tag)) {
      setInterests(interests.filter((i) => i !== tag));
    } else {
      setInterests([...interests, tag]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!destination) {
      setFormError('Please select a destination.');
      return;
    }
    if (!durationDays) {
      setFormError('Please select your trip duration.');
      return;
    }
    if (!budget || Number(budget) <= 0) {
      setFormError('Please specify a target budget.');
      return;
    }
    if (interests.length === 0) {
      setFormError('Please select at least one travel focus or interest.');
      return;
    }
    if (!travelStyle) {
      setFormError('Please select your preferred travel pace.');
      return;
    }

    setFormError('');
    const city = destinations.find((d) => d.id === destination);
    if (!city) return;

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

  const selectedCity = destinations.find((d) => d.id === destination) || null;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sky-200 text-xs font-semibold mb-4 shadow-lg shadow-black/20">
          <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
          Autonomous Multi-Agent AI Travel Engine
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl drop-shadow-md">
          Where would you like to travel?
        </h1>
        <p className="text-sm sm:text-base text-slate-200 mt-3 max-w-xl mx-auto leading-relaxed drop-shadow-sm font-medium">
          Our specialized AI agents synthesize schedules, optimize transit routes, check live weather, and balance your budget in real time.
        </p>

        {/* Trust Stats Bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-5 text-xs text-slate-300 font-medium">
          <span className="flex items-center gap-1.5 bg-slate-900/40 px-3 py-1 rounded-full border border-white/10 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            4 Coordinated AI Agents
          </span>
          <span className="flex items-center gap-1.5 bg-slate-900/40 px-3 py-1 rounded-full border border-white/10 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            Live Weather & Geo-Mapping
          </span>
          <span className="flex items-center gap-1.5 bg-slate-900/40 px-3 py-1 rounded-full border border-white/10 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            Autonomous Disruption Recovery
          </span>
        </div>
      </div>

      {/* Main Planning Form Card with Frosted Glass Elevation */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 shadow-2xl shadow-slate-950/40">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Destination Selection with Official Imagery */}
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
                    className={`group relative overflow-hidden rounded-2xl border text-left transition-all duration-300 cursor-pointer h-32 flex flex-col justify-end p-3.5 ${
                      isSelected
                        ? 'border-sky-500 shadow-lg shadow-sky-500/25 ring-2 ring-sky-500 scale-[1.02]'
                        : 'border-slate-200 hover:border-slate-400 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {/* Background City Image with Hover Zoom */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                    {/* Dark Vignette Overlay for Crisp Contrast */}
                    <div
                      className={`absolute inset-0 transition-opacity duration-300 ${
                        isSelected
                          ? 'bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-900/30'
                          : 'bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-slate-900/20 group-hover:from-slate-950/90'
                      }`}
                    />

                    {/* Card Content */}
                    <div className="relative z-10 w-full">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-sm tracking-tight text-white drop-shadow-sm">
                          {item.name}
                        </span>
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-md">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/50 backdrop-blur-xs text-white/90 font-mono uppercase font-semibold">
                            {item.country}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-200 line-clamp-1 font-medium drop-shadow-sm">
                        {item.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration & Budget Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-600" /> Trip Duration
              </label>
              <select
                value={durationDays}
                onChange={(e) => {
                  setDurationDays(e.target.value);
                  if (formError) setFormError('');
                }}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 transition cursor-pointer shadow-xs"
              >
                <option value="" disabled>Select trip duration...</option>
                {[1, 2, 3, 4, 5].map((d) => (
                  <option key={d} value={d}>
                    {d} {d === 1 ? 'Day (Express Tour)' : 'Days (Full Itinerary)'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Target Budget {selectedCity ? `(${selectedCity.currency})` : ''}
              </label>
              <div className="relative">
                {selectedCity && (
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
                    {selectedCity.currency}
                  </span>
                )}
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => {
                    setBudget(e.target.value);
                    if (formError) setFormError('');
                  }}
                  placeholder={selectedCity ? `e.g. ${selectedCity.defaultBudget}` : 'Select destination first or enter budget'}
                  className={`w-full bg-white border border-slate-300 rounded-xl ${selectedCity ? 'pl-9' : 'pl-4'} pr-4 py-2.5 text-slate-900 text-sm font-bold focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 transition shadow-xs`}
                />
              </div>

              {selectedCity ? (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Suggested Budgets {durationDays ? `(${durationDays} ${Number(durationDays) === 1 ? 'day' : 'days'})` : ''}:
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {getSuggestions(selectedCity).map((tier) => {
                      const isSelected = Number(budget) === tier.amount;
                      return (
                        <button
                          key={tier.label}
                          type="button"
                          onClick={() => {
                            setBudget(tier.amount);
                            if (formError) setFormError('');
                          }}
                          className={`py-1.5 px-1.5 rounded-xl text-center border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs ring-1 ring-emerald-500/30'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                            {tier.label}
                          </div>
                          <div className="text-xs font-extrabold text-slate-900 mt-0.5 truncate">
                            {selectedCity.currency}{tier.amount.toLocaleString()}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 mt-2 font-medium">
                  Select a destination to view suggested budget amounts.
                </p>
              )}
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
                  onClick={() => {
                    setTravelStyle(style);
                    if (formError) setFormError('');
                  }}
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

          {/* Validation Notice */}
          {formError && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

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
