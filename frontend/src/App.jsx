import React, { useState } from 'react';
import Navbar from './components/Navbar';
import TripForm from './components/TripForm';
import AgentThoughtLog from './components/AgentThoughtLog';
import ItineraryTimeline from './components/ItineraryTimeline';
import InteractiveMap from './components/InteractiveMap';
import DisruptionSimulator from './components/DisruptionSimulator';
import AIChatDrawer from './components/AIChatDrawer';
import BudgetOverview from './components/BudgetOverview';
import TripHubOverview from './components/TripHubOverview';
import DestinationHeroHeader, { getDestinationInfo } from './components/DestinationHeroHeader';
import { Sun, Moon, Image as ImageIcon } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function App() {
  const [activeTrip, setActiveTrip] = useState(null);
  const [agentResponse, setAgentResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastChatResponse, setLastChatResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeBg, setActiveBg] = useState(null);
  const [bgTheme, setBgTheme] = useState('cinematic'); // 'cinematic' | 'daylight'
  const [selectedLocation, setSelectedLocation] = useState(null);

  const getLandingWallpaper = () => {
    if (!selectedLocation) return '/hero-travel.jpg';
    const loc = selectedLocation.toLowerCase();
    if (loc.includes('kolkata')) return '/kolkata.jpg';
    if (loc.includes('paris')) return '/paris-eiffel.jpg';
    if (loc.includes('tokyo')) return '/tokyo-pagoda.jpg';
    return '/hero-travel.jpg';
  };

  const handleCreateTrip = async (prefs) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`${API_BASE}/trips/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs)
      });
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setAgentResponse(data);
      setActiveTrip(data.updated_trip);
      const destInfo = getDestinationInfo(data.updated_trip?.destination);
      setActiveBg(destInfo.defaultBg);
    } catch (err) {
      console.error('Failed to create trip plan:', err);
      setErrorMessage('Could not connect to the TravelPilot AI Backend. Please ensure python backend/main.py is active.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisrupt = async (disruptionType) => {
    if (!activeTrip) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/trips/disrupt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip_id: activeTrip.id,
          disruption_type: disruptionType
        })
      });
      const data = await res.json();
      setAgentResponse(data);
      setActiveTrip(data.updated_trip);
    } catch (err) {
      console.error('Disruption simulation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    if (!activeTrip) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/trips/optimize?trip_id=${activeTrip.id}`, {
        method: 'POST'
      });
      const data = await res.json();
      setAgentResponse(data);
      setActiveTrip(data.updated_trip);
    } catch (err) {
      console.error('Route optimization failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async (tripId, message) => {
    const res = await fetch(`${API_BASE}/trips/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trip_id: tripId || (activeTrip ? activeTrip.id : ''), message })
    });
    const data = await res.json();
    if (data.updated_trip) {
      setActiveTrip(data.updated_trip);
    }
    setLastChatResponse(data);
    return data;
  };

  const destInfo = activeTrip ? getDestinationInfo(activeTrip.destination) : null;
  const currentWallpaper = activeBg || destInfo?.defaultBg || '/hero-travel.jpg';

  return (
    <div className="min-h-screen text-slate-900 flex flex-col font-sans selection:bg-sky-500 selection:text-white relative">
      <Navbar
        healthStatus={activeTrip ? activeTrip.health_status : 'Ready'}
        activeTrip={activeTrip}
        onReset={() => {
          setActiveTrip(null);
          setAgentResponse(null);
          setErrorMessage(null);
          setActiveBg(null);
          setSelectedLocation(null);
        }}
      />

      {/* Landing View: Full-Bleed Cinematic Hero Banner */}
      {!activeTrip ? (
        <div className="flex-1 relative flex flex-col justify-center overflow-hidden min-h-[calc(100vh-65px)]">
          {/* Background Photo */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-all duration-1000"
            style={{ backgroundImage: `url('${getLandingWallpaper()}')` }}
          />

          {/* Deep Cinematic Gradient Overlay for Contrast & Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/65 to-slate-950/90 backdrop-blur-[0.5px]" />

          {/* Radial Ambient Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/20 via-transparent to-transparent pointer-events-none" />

          {/* Content Container */}
          <div className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            {errorMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs font-medium flex items-center justify-between shadow-xl backdrop-blur-md">
                <span>{errorMessage}</span>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="text-rose-400 hover:text-rose-200 underline font-semibold ml-4 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            <TripForm
              onSubmit={handleCreateTrip}
              loading={loading}
              onDestinationChange={setSelectedLocation}
            />
          </div>
        </div>
      ) : (
        /* 2nd Page: Active Trip Workspace with Atmospheric Destination Background & Rich Visuals */
        <div className="relative flex-1 min-h-[calc(100vh-65px)] overflow-hidden">
          {/* Fixed Destination Background Photo */}
          <div
            className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 transform scale-105 pointer-events-none z-0"
            style={{ backgroundImage: `url('${currentWallpaper}')` }}
          />

          {/* Ambient Glassmorphic Scrim (Toggleable: Cinematic Dark or Vibrant Daylight) */}
          <div
            className={`fixed inset-0 pointer-events-none z-0 transition-all duration-700 ${
              bgTheme === 'cinematic'
                ? 'bg-gradient-to-b from-slate-950/80 via-slate-900/70 to-slate-950/90 backdrop-blur-[2.5px]'
                : 'bg-gradient-to-b from-slate-100/90 via-slate-50/85 to-slate-100/95 backdrop-blur-[3px]'
            }`}
          />

          {/* Radial Ambient Glow */}
          <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/15 via-transparent to-transparent pointer-events-none z-0" />

          {/* Main Dashboard Content */}
          <main className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* Top Toolbar: Ambience Control & Wallpaper Indicator */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 shadow-xs text-slate-700">
                <ImageIcon className="w-3.5 h-3.5 text-sky-600" />
                <span className="hidden sm:inline">Active Wallpaper:</span>
                <span className="text-slate-900 font-bold">{destInfo?.name || activeTrip.destination}</span>
              </div>

              {/* Theme / Scrim Toggle */}
              <div className="flex items-center gap-1 bg-white/80 backdrop-blur-md p-1 rounded-full border border-slate-200 shadow-xs text-xs font-semibold">
                <button
                  onClick={() => setBgTheme('cinematic')}
                  className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                    bgTheme === 'cinematic'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Cinematic dark frosted background"
                >
                  <Moon className="w-3 h-3" />
                  <span className="hidden sm:inline">Cinematic</span>
                </button>
                <button
                  onClick={() => setBgTheme('daylight')}
                  className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                    bgTheme === 'daylight'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Vibrant daylight frosted background"
                >
                  <Sun className="w-3 h-3" />
                  <span className="hidden sm:inline">Daylight</span>
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center justify-between shadow-sm">
                <span>{errorMessage}</span>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="text-rose-600 hover:text-rose-800 underline font-semibold ml-4 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div className="space-y-6">
              {/* Grand Destination Hero Banner with Photo Gallery & Wallpaper Selector */}
              <DestinationHeroHeader
                trip={activeTrip}
                activeBg={currentWallpaper}
                onSelectBg={(url) => setActiveBg(url)}
              />

              {/* Agent Reasoning Diagnostic Trace */}
              <AgentThoughtLog agentResponse={agentResponse} />

              {/* Disruption Simulator Console */}
              <DisruptionSimulator
                onDisrupt={handleDisrupt}
                onOptimize={handleOptimize}
                loading={loading}
              />

              {/* Trip Management Hub */}
              <TripHubOverview trip={activeTrip} />

              {/* Budget & Spend Analytics */}
              <BudgetOverview key={`${activeTrip.id}_${activeTrip.health_status}_${activeTrip.total_cost}`} trip={activeTrip} />

              {/* Main Content Grid: Timeline (with Activity Photos) + Map */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7">
                  <ItineraryTimeline trip={activeTrip} />
                </div>
                <div className="lg:col-span-5 sticky top-20">
                  <InteractiveMap trip={activeTrip} />
                </div>
              </div>

              {/* Floating AI Copilot Drawer */}
              <AIChatDrawer
                tripId={activeTrip.id}
                onChatSubmit={handleChatSubmit}
                lastChatResponse={lastChatResponse}
              />
            </div>
          </main>
        </div>
      )}

      {/* Clean Light Footer */}
      <footer className="relative z-10 border-t border-slate-200/80 bg-white/80 backdrop-blur-md py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-medium text-slate-600">TravelPilot • Autonomous Multi-Agent AI Travel Engine</span>
          <span>FastAPI • React 19 • Leaflet • Tailwind</span>
        </div>
      </footer>
    </div>
  );
}

