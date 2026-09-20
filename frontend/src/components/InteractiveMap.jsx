import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import { getActivityPhoto } from './DestinationHeroHeader';

// Marker icons
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [22, 36],
  iconAnchor: [11, 36]
});

const hotelIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [22, 36],
  iconAnchor: [11, 36]
});

const activeIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [22, 36],
  iconAnchor: [11, 36]
});

export default function InteractiveMap({ trip }) {
  if (!trip) return null;

  const hotelLat = trip.user_preferences.hotel_lat || 22.5540;
  const hotelLng = trip.user_preferences.hotel_lng || 88.3512;

  const allActivities = trip.days.flatMap((d) => d.activities);
  
  const polylinePositions = [
    [hotelLat, hotelLng],
    ...allActivities.map((a) => [a.lat, a.lng])
  ];

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm h-[460px] relative overflow-hidden flex flex-col">
      {/* Floating Map Header */}
      <div className="absolute top-6 left-6 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2 shadow-md">
        <MapPin className="w-3.5 h-3.5 text-sky-600" />
        <span>Live Route • {trip.destination}</span>
        <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 font-mono">
          {allActivities.length} Stops
        </span>
      </div>

      <div className="flex-1 w-full rounded-xl overflow-hidden border border-slate-200">
        <MapContainer center={[hotelLat, hotelLng]} zoom={12} scrollWheelZoom={false} className="w-full h-full">
          {/* CartoDB Voyager tiles for crisp, clean Airbnb/Stripe style mapping */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* Hotel Base Marker */}
          <Marker position={[hotelLat, hotelLng]} icon={hotelIcon}>
            <Popup>
              <div className="p-1 max-w-[190px]">
                <img
                  src={getActivityPhoto(trip.user_preferences.hotel_name, trip.destination)}
                  alt={trip.user_preferences.hotel_name}
                  className="w-full h-20 object-cover rounded-lg mb-1.5 shadow-2xs"
                />
                <div className="font-bold text-xs text-amber-700">{trip.user_preferences.hotel_name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Accommodation HQ</div>
              </div>
            </Popup>
          </Marker>

          {/* Activity Stop Markers */}
          {allActivities.map((act, idx) => (
            <Marker
              key={act.id || idx}
              position={[act.lat, act.lng]}
              icon={act.status === 'replaced' ? activeIcon : defaultIcon}
            >
              <Popup>
                <div className="p-1 max-w-[190px]">
                  <img
                    src={getActivityPhoto(act.title, trip.destination)}
                    alt={act.title}
                    className="w-full h-20 object-cover rounded-lg mb-1.5 shadow-2xs"
                  />
                  <div className="font-bold text-xs text-sky-700 leading-tight">{act.title}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    {act.category} • <span className="text-slate-400">{act.start_time}</span>
                  </div>
                  <div className="text-[11px] text-emerald-700 font-mono font-bold mt-1">
                    {trip.user_preferences.currency}{act.cost}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Route Polyline in crisp cobalt blue */}
          <Polyline positions={polylinePositions} color="#0284c7" weight={3} dashArray="5, 7" opacity={0.9} />
        </MapContainer>
      </div>
    </div>
  );
}
