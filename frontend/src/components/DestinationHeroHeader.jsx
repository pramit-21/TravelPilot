import React, { useState } from 'react';
import { Camera, Maximize2, Sparkles, MapPin, Calendar, DollarSign, Image, Eye, X, ChevronRight, Check } from 'lucide-react';

export const DESTINATION_MEDIA = {
  kolkata: {
    name: 'Kolkata',
    country: 'India',
    tagline: 'The Cultural Capital & City of Joy',
    defaultBg: '/kolkata-victoria.jpg',
    gallery: [
      {
        url: '/kolkata-victoria.jpg',
        title: 'Victoria Memorial',
        category: 'Royal Heritage',
        desc: 'Magnificent white marble monument surrounded by reflecting pools and lush landscaped gardens.'
      },
      {
        url: '/kolkata-howrah.jpg',
        title: 'Howrah Bridge & Mullick Ghat',
        category: 'Iconic Landmark',
        desc: 'Famous cantilever bridge over the Hooghly River, buzzing with classic yellow taxis and vibrant flower markets.'
      },
      {
        url: '/kolkata.jpg',
        title: 'Heritage Streetscapes',
        category: 'Colonial Architecture',
        desc: 'Timeless boulevards, historic tram lines, and rich intellectual culture.'
      }
    ]
  },
  paris: {
    name: 'Paris',
    country: 'France',
    tagline: 'The City of Light, Art & Romance',
    defaultBg: '/paris-eiffel.jpg',
    gallery: [
      {
        url: '/paris-eiffel.jpg',
        title: 'Eiffel Tower Sunset',
        category: 'World Wonder',
        desc: 'Golden hour panorama over the Seine River with warm twilight skies illuminating the iron spire.'
      },
      {
        url: '/paris-louvre.jpg',
        title: 'The Louvre Glass Pyramid',
        category: 'Art & Culture',
        desc: 'I.M. Pei’s illuminated glass pyramid surrounded by the historic Cour Napoléon palace facade.'
      },
      {
        url: '/paris.jpg',
        title: 'Classic Haussmann Boulevards',
        category: 'City Life',
        desc: 'Charming café terraces, limestone architecture, and romantic Parisian ambiance.'
      }
    ]
  },
  tokyo: {
    name: 'Tokyo',
    country: 'Japan',
    tagline: 'Futuristic Neon Metropolis Meets Ancient Spirit',
    defaultBg: '/tokyo-pagoda.jpg',
    gallery: [
      {
        url: '/tokyo-pagoda.jpg',
        title: 'Senso-ji Pagoda & Mt. Fuji',
        category: 'Ancient Heritage',
        desc: 'Traditional five-tier pagoda amidst blooming cherry blossoms with sunset silhouette of Mt. Fuji.'
      },
      {
        url: '/tokyo-shibuya.jpg',
        title: 'Shibuya Crossing at Night',
        category: 'Neon Pulse',
        desc: 'World’s most electrifying pedestrian scramble illuminated by towering hyper-modern displays.'
      },
      {
        url: '/tokyo.jpg',
        title: 'Vibrant Tokyo Skyline',
        category: 'Modern Metropolis',
        desc: 'Dynamic cityscape blending cutting-edge innovation with serene garden shrines.'
      }
    ]
  }
};

export function getDestinationInfo(destinationName) {
  const d = (destinationName || '').toLowerCase();
  if (d.includes('kolkata') || d.includes('calcutta')) return DESTINATION_MEDIA.kolkata;
  if (d.includes('paris')) return DESTINATION_MEDIA.paris;
  if (d.includes('tokyo')) return DESTINATION_MEDIA.tokyo;

  return {
    name: destinationName || 'Global Voyage',
    country: 'International',
    tagline: 'Autonomous AI Curated Itinerary & Dynamic Exploration',
    defaultBg: '/hero-travel.jpg',
    gallery: [
      {
        url: '/hero-travel.jpg',
        title: 'Alpine Panorama',
        category: 'Scenic Vista',
        desc: 'Breathtaking mountain peaks, serene blue lakes, and untamed natural beauty.'
      },
      {
        url: '/paris-eiffel.jpg',
        title: 'European Landmarks',
        category: 'Architecture',
        desc: 'World heritage sites and golden sunsets.'
      },
      {
        url: '/tokyo-pagoda.jpg',
        title: 'Eastern Wonders',
        category: 'Tradition',
        desc: 'Serene temple gardens bathed in warm dusk lanterns.'
      }
    ]
  };
}

export function getActivityPhoto(title = '', destination = '') {
  const t = (title || '').toLowerCase();
  const d = (destination || '').toLowerCase();

  // 1. Kolkata Specific Landmark Locations
  if (t.includes('victoria')) return '/kolkata-victoria.jpg';
  if (t.includes('howrah') || t.includes('flower')) return '/kolkata-howrah.jpg';
  if (t.includes('indian museum') || (t.includes('museum') && d.includes('kolkata'))) return '/places/indian-museum.jpg';
  if (t.includes('park street') || t.includes('peter cat') || t.includes('culinary')) return '/places/park-street.jpg';
  if (t.includes('dakshineswar') || t.includes('belur')) return '/places/dakshineswar.jpg';
  if (t.includes('princep') || t.includes('ghat')) return '/places/princep-ghat.jpg';
  if (t.includes('paul') || t.includes('cathedral')) return '/places/st-pauls.jpg';
  if (t.includes('eco') || t.includes('park')) return '/places/eco-park.jpg';
  if (t.includes('kalighat')) return '/places/kalighat.jpg';
  if (t.includes('college street') || t.includes('coffee house')) return '/places/college-street.jpg';

  // 2. Paris Specific Landmark Locations
  if (t.includes('eiffel')) return '/paris-eiffel.jpg';
  if (t.includes('louvre')) return '/paris-louvre.jpg';
  if (t.includes('arc de triomphe') || t.includes('champs')) return '/places/arc-de-triomphe.jpg';
  if (t.includes('sacre') || t.includes('sacré') || t.includes('montmartre')) return '/places/sacre-coeur.jpg';
  if (t.includes('notre-dame') || t.includes('notre dame')) return '/places/notre-dame.jpg';
  if (t.includes('orsay')) return '/places/musee-orsay.jpg';
  if (t.includes('sainte-chapelle') || t.includes('chapelle')) return '/places/sainte-chapelle.jpg';
  if (t.includes('garnier') || t.includes('opera')) return '/places/palais-garnier.jpg';
  if (t.includes('luxembourg')) return '/places/luxembourg-gardens.jpg';
  if (t.includes('seine') || t.includes('cruise')) return '/places/seine-cruise.jpg';
  if (t.includes('catacomb')) return '/places/catacombs.jpg';

  // 3. Tokyo Specific Landmark Locations
  if (t.includes('senso') || t.includes('pagoda')) return '/tokyo-pagoda.jpg';
  if (t.includes('shibuya') || t.includes('hachiko')) return '/tokyo-shibuya.jpg';
  if (t.includes('skytree')) return '/places/tokyo-skytree.jpg';
  if (t.includes('tokyo tower') || t.includes('zojo')) return '/places/tokyo-tower.jpg';
  if (t.includes('meiji') || t.includes('yoyogi')) return '/places/meiji-shrine.jpg';
  if (t.includes('akihabara')) return '/places/akihabara.jpg';
  if (t.includes('shinjuku gyoen')) return '/places/shinjuku-gyoen.jpg';
  if (t.includes('tsukiji')) return '/places/tsukiji.jpg';
  if (t.includes('teamlab')) return '/places/teamlab.jpg';
  if (t.includes('roppongi') || t.includes('mori')) return '/places/roppongi-hills.jpg';
  if (t.includes('ginza')) return '/places/ginza.jpg';
  if (t.includes('harajuku') || t.includes('takeshita')) return '/places/harajuku.jpg';
  if (t.includes('odaiba') || t.includes('gundam')) return '/places/odaiba.jpg';

  // City Destination-level fallbacks
  if (d.includes('kolkata')) return '/kolkata.jpg';
  if (d.includes('paris')) return '/paris.jpg';
  if (d.includes('tokyo')) return '/tokyo.jpg';

  return '/hero-travel.jpg';
}

export default function DestinationHeroHeader({ trip, activeBg, onSelectBg }) {
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const destInfo = getDestinationInfo(trip?.destination);

  const currency = trip?.user_preferences?.currency || '$';
  const totalDays = trip?.days?.length || 0;
  const travelStyle = trip?.user_preferences?.travel_style || 'Balanced';
  const budget = trip?.user_preferences?.budget ? `${currency}${trip.user_preferences.budget}` : null;

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-slate-950 text-white">
      {/* Background Banner Image with Smooth Transition */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-105"
        style={{ backgroundImage: `url('${activeBg || destInfo.defaultBg}')` }}
      />

      {/* Cinematic Multilayer Gradients for Readability & Drama */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-950/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-500/20 via-transparent to-transparent pointer-events-none" />

      {/* Content Area */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col justify-between min-h-[340px]">
        {/* Top Badges Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md border border-white/20 text-white flex items-center gap-1.5 shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              {destInfo.name}, {destInfo.country}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/20 backdrop-blur-md border border-sky-400/30 text-sky-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              AI Verified Itinerary
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {trip?.health_status || 'Optimized'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="px-3 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {totalDays} Days Journey
            </span>
            {budget && (
              <span className="px-3 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-1.5 font-medium">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Budget: {budget}
              </span>
            )}
          </div>
        </div>

        {/* Center Title & Tagline */}
        <div className="my-6 max-w-2xl">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
            {destInfo.name}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-200 font-medium drop-shadow leading-relaxed">
            {destInfo.tagline}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span className="bg-white/10 px-2.5 py-1 rounded-md backdrop-blur-sm">
              Style: <strong className="text-white">{travelStyle}</strong>
            </span>
            <span>•</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-md backdrop-blur-sm">
              Total Stops: <strong className="text-white">{trip?.days?.reduce((acc, d) => acc + (d.activities?.length || 0), 0) || 0}</strong>
            </span>
          </div>
        </div>

        {/* Bottom Destination Photo Strip & Wallpaper Selector */}
        <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Camera className="w-4 h-4 text-sky-400" />
            <span>Destination Highlights & Wallpapers:</span>
          </div>

          {/* Mini Gallery Cards */}
          <div className="flex items-center gap-3 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {destInfo.gallery.map((photo, idx) => {
              const isCurrent = (activeBg || destInfo.defaultBg) === photo.url;
              return (
                <div
                  key={idx}
                  className={`group relative rounded-xl overflow-hidden cursor-pointer border transition-all duration-300 shrink-0 w-28 sm:w-36 h-20 sm:h-22 ${
                    isCurrent
                      ? 'border-sky-400 ring-2 ring-sky-400/50 shadow-lg shadow-sky-500/20 scale-105'
                      : 'border-white/30 hover:border-white/80 hover:scale-102 opacity-85 hover:opacity-100'
                  }`}
                  onClick={() => onSelectBg && onSelectBg(photo.url)}
                  title={`Click to set as wallpaper: ${photo.title}`}
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Badge */}
                  <div className="absolute bottom-1.5 left-1.5 right-1.5">
                    <p className="text-[10px] font-bold text-white leading-tight truncate drop-shadow">
                      {photo.title}
                    </p>
                    <p className="text-[9px] text-sky-300 truncate">
                      {photo.category}
                    </p>
                  </div>

                  {/* Active Indicator */}
                  {isCurrent && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-sky-500 text-white flex items-center justify-center shadow">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}

                  {/* Inspect Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxPhoto(photo);
                    }}
                    className="absolute top-1.5 left-1.5 p-1 rounded-md bg-black/50 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="View Full Photo"
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-video w-full bg-black">
              <img
                src={lightboxPhoto.url}
                alt={lightboxPhoto.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 bg-slate-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  {lightboxPhoto.category}
                </span>
                <h3 className="text-xl font-bold mt-2 text-white">{lightboxPhoto.title}</h3>
                <p className="text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
                  {lightboxPhoto.desc}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => {
                    onSelectBg && onSelectBg(lightboxPhoto.url);
                    setLightboxPhoto(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Set as Background
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
