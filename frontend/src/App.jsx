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

  const handleCreateTrip = async (prefs) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/trips/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs)
      });
      const data = await res.json();
      setAgentResponse(data);
      setActiveTrip(data.updated_trip);
    } catch (err) {
      console.error('Failed to create trip plan:', err);
      alert('Error communicating with TravelPilot FastAPI backend.');
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        healthStatus={activeTrip ? activeTrip.health_status : 'Ready'}
        activeTrip={activeTrip}
        onReset={() => {
          setActiveTrip(null);
          setAgentResponse(null);
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {!activeTrip ? (
          <TripForm onSubmit={handleCreateTrip} loading={loading} />
        ) : (
          <div className="space-y-6">
            {/* Agent Reasoning Diagnostic Bar */}
            <AgentThoughtLog agentResponse={agentResponse} />

            {/* Disruption Simulator Bar */}
            <DisruptionSimulator
              onDisrupt={handleDisrupt}
              onOptimize={handleOptimize}
              loading={loading}
            />

            {/* Trip Hub */}
            <TripHubOverview trip={activeTrip} />

            {/* Budget Analytics */}
            <BudgetOverview trip={activeTrip} />

            {/* Main Content Grid: Timeline + Map */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <ItineraryTimeline trip={activeTrip} />
              </div>
              <div className="lg:col-span-5 space-y-6">
                <InteractiveMap trip={activeTrip} />
              </div>
            </div>

            {/* Floating Chat Drawer */}
            <AIChatDrawer
              tripId={activeTrip.id}
              onChatSubmit={handleChatSubmit}
              lastChatResponse={lastChatResponse}
            />
          </div>
        )}
      </main>
    </div>
  );
}
