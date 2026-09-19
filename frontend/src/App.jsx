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

const API_BASE = 'http://127.0.0.1:8000/api';

export default function App() {
  const [activeTrip, setActiveTrip] = useState(null);
  const [agentResponse, setAgentResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastChatResponse, setLastChatResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

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

  return (
    <div className="min-h-screen text-slate-900 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      <Navbar
        healthStatus={activeTrip ? activeTrip.health_status : 'Ready'}
        activeTrip={activeTrip}
        onReset={() => {
          setActiveTrip(null);
          setAgentResponse(null);
          setErrorMessage(null);
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {!activeTrip ? (
          <TripForm onSubmit={handleCreateTrip} loading={loading} />
        ) : (
          <div className="space-y-6">
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
            <BudgetOverview trip={activeTrip} />

            {/* Main Content Grid: Timeline + Map */}
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
        )}
      </main>

      {/* Clean Light Footer */}
      <footer className="border-t border-slate-200 bg-white/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-medium text-slate-600">TravelPilot • Autonomous Multi-Agent AI Travel Engine</span>
          <span>FastAPI • React 19 • Leaflet • Tailwind</span>
        </div>
      </footer>
    </div>
  );
}
