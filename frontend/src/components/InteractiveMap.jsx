import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet marker icons issue in React Vite
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const hotelIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const activeIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export default function InteractiveMap({ trip }) {
  if (!trip) return null;

  const hotelLat = trip.user_preferences.hotel_lat || 22.5540;
  const hotelLng = trip.user_preferences.hotel_lng || 88.3512;

  // Collect all activity coordinates for current trip
  const allActivities = trip.days.flatMap((d) => d.activities);
  
  const polylinePositions = [
    [hotelLat, hotelLng],
    ...allActivities.map((a) => [a.lat, a.lng])
  ];

  return (
    <div className="glass-card rounded-2xl p-4 border border-slate-800 shadow-xl h-[420px] relative overflow-hidden">
      <div className="absolute top-6 left-6 z-[1000] bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-semibold text-slate-200">
        🗺️ Live GIS Map ({trip.destination})
      </div>

      <MapContainer center={[hotelLat, hotelLng]} zoom={12} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Hotel Marker */}
        <Marker position={[hotelLat, hotelLng]} icon={hotelIcon}>
          <Popup>
            <div className="font-bold text-xs">{trip.user_preferences.hotel_name}</div>
            <div className="text-[11px] text-slate-400">Hotel HQ</div>
          </Popup>
        </Marker>

        {/* Activity Stop Markers */}
        {allActivities.map((act, idx) => (
          <Marker key={act.id || idx} position={[act.lat, act.lng]} icon={act.status === 'replaced' ? activeIcon : defaultIcon}>
            <Popup>
              <div className="font-bold text-xs text-sky-400">{act.title}</div>
              <div className="text-[11px] text-slate-300">{act.category} ({act.start_time})</div>
              <div className="text-[10px] text-slate-400 font-semibold">{trip.user_preferences.currency}{act.cost}</div>
            </Popup>
          </Marker>
        ))}

        {/* Route Polyline */}
        <Polyline positions={polylinePositions} color="#0284c7" weight={3} dashArray="6, 8" />
      </MapContainer>
    </div>
  );
}
