import React, { useState } from 'react';
import { 
  Navigation, 
  MapPin, 
  Car, 
  AlertTriangle, 
  Compass, 
  Clock, 
  CheckCircle, 
  Bus, 
  ShieldCheck, 
  Layers, 
  RefreshCw,
  Share2,
  Train
} from 'lucide-react';
import { GarbaVenue, Restaurant, Language } from '../types';
import { GarbaInteractiveMap } from './GarbaInteractiveMap';

interface NavigationMapViewProps {
  venues: GarbaVenue[];
  restaurants: Restaurant[];
  selectedTarget?: GarbaVenue | Restaurant | null;
  onSelectTarget: (target: GarbaVenue | Restaurant) => void;
  language: Language;
  onOpenParkingModal?: (venue: GarbaVenue) => void;
}

export const NavigationMapView: React.FC<NavigationMapViewProps> = ({
  venues,
  restaurants,
  selectedTarget,
  onSelectTarget,
  onOpenParkingModal,
}) => {
  const [activeTab, setActiveTab] = useState<'venues' | 'food'>('venues');
  const [isNavigating, setIsNavigating] = useState(false);
  const [travelMode, setTravelMode] = useState<'car' | 'brts' | 'metro' | 'bike'>('metro');
  const [mapViewMode, setMapViewMode] = useState<'leaflet' | 'turn-by-turn'>('leaflet');

  // Default target if none selected
  const currentTarget = selectedTarget || venues[0];

  const getETA = () => {
    if (travelMode === 'metro') return '9 mins (GMRC Blue Line ↔ Thaltej Feeder)';
    if (travelMode === 'car') return '14 mins (4.8 km via SG Highway)';
    if (travelMode === 'brts') return '19 mins (Ahmedabad Night BRTS Route 10)';
    return '11 mins (Two Wheeler Fast Lane)';
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-20">
      
      {/* Title & Mode Switcher */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            Live Garba Grounds & Traffic Map
          </h2>
          <p className="text-xs text-slate-300">
            Real-time interactive OpenStreetMap & CARTO dark tiles with crowd density & parking telemetry
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setMapViewMode('leaflet')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mapViewMode === 'leaflet'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Interactive Map</span>
          </button>
          <button
            onClick={() => setMapViewMode('turn-by-turn')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mapViewMode === 'turn-by-turn'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>GPS Route</span>
          </button>
        </div>
      </div>

      {/* Target Selector Toolbar */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('venues')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'venues'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🏟️ Garba Grounds ({venues.length})
          </button>
          <button
            onClick={() => setActiveTab('food')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'food'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🍲 Midnight Food ({restaurants.length})
          </button>
        </div>

        {/* Selected target quick chip */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/30 text-xs">
          <MapPin className="w-3.5 h-3.5 text-rose-400" />
          <span className="font-bold text-white truncate max-w-[180px]">
            {currentTarget.name}
          </span>
        </div>
      </div>

      {/* MAP DISPLAY: Leaflet Interactive Map or Turn-by-Turn GPS Waypoints */}
      {mapViewMode === 'leaflet' ? (
        <div className="space-y-2">
          <GarbaInteractiveMap
            venues={venues}
            selectedVenue={currentTarget}
            onOpenParkingModal={onOpenParkingModal}
          />
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              CARTO Dark Matter Free Tiles • SG Highway, SBR, Drive-In & Heritage Pols
            </span>
            <span>Tap any marker for crowd density & parking</span>
          </div>
        </div>
      ) : (
        /* Interactive Ahmedabad Schematic Route & Map Canvas */
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl p-4 sm:p-6 min-h-[380px] flex flex-col justify-between">
          
          {/* Background Ahmedabad Grid Graphic */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>

          {/* Top Floating Map Status */}
          <div className="relative z-10 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/90 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                GPS Locked: Vastrapur, Ahmedabad
              </span>
              <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-slate-900 text-slate-300 border border-slate-800 hidden sm:inline">
                SP Ring Road Bypass Active
              </span>
            </div>

            <div className="flex items-center gap-1">
              {(['metro', 'car', 'brts', 'bike'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTravelMode(mode)}
                  className={`p-1.5 rounded-lg border text-xs capitalize transition-all cursor-pointer ${
                    travelMode === mode
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {mode === 'metro' ? <Train className="w-3.5 h-3.5" /> : mode === 'car' ? <Car className="w-3.5 h-3.5" /> : mode === 'brts' ? <Bus className="w-3.5 h-3.5" /> : '🏍️'}
                </button>
              ))}
            </div>
          </div>

          {/* Central Map Illustration with Waypoints */}
          <div className="relative z-10 py-6 my-auto">
            {/* Main Highway Vein */}
            <div className="relative max-w-xl mx-auto space-y-4">
              
              {/* Visual Route Path Line */}
              <div className="absolute left-6 top-8 bottom-8 w-1 bg-gradient-to-b from-amber-500 via-rose-500 to-purple-600 rounded-full"></div>

              {/* Step 1: User Origin */}
              <div className="flex items-center gap-3.5 relative">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0 z-10 border-2 border-white">
                  <Navigation className="w-6 h-6 animate-pulse" />
                </div>
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex-1">
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                    Current Amdavad Location
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white">
                    Near Alpha One Mall, Vastrapur Lake
                  </span>
                </div>
              </div>

              {/* Step 2: Traffic Alert Node */}
              <div className="flex items-center gap-3.5 relative pl-2">
                <div className="w-8 h-8 rounded-xl bg-rose-600/30 text-rose-400 border border-rose-500/50 flex items-center justify-center flex-shrink-0 z-10">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 flex-1 text-xs">
                  <span className="font-bold text-rose-300 block">
                    Chokepoint Alert: Pakwan Crossroads & Iscon Flyover
                  </span>
                  <span className="text-[11px] text-slate-300">
                    Navratri slow traffic (7-10 min delay). Suggest using Judges Bungalow Inner Road.
                  </span>
                </div>
              </div>

              {/* Step 3: Destination Node */}
              <div className="flex items-center gap-3.5 relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-rose-600 text-white font-black flex items-center justify-center shadow-lg shadow-purple-500/30 flex-shrink-0 z-10 border-2 border-amber-300">
                  <MapPin className="w-6 h-6 text-amber-300" />
                </div>
                <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/40 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                      Destination
                    </span>
                    <span className="text-[11px] font-bold text-amber-300">
                      {getETA()}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold text-white block">
                    {currentTarget.name}
                  </span>
                  <span className="text-[11px] text-slate-400 block truncate">
                    {'address' in currentTarget ? currentTarget.address : ''}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Turn-by-Turn & Parking Info */}
          <div className="relative z-10 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3 flex-wrap text-xs">
            
            <div className="flex items-center gap-3 text-slate-300">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" /> Parking Gate 3 Open (320 spots)
              </span>
              <span className="flex items-center gap-1 text-sky-400 font-semibold hidden sm:inline">
                <Bus className="w-3.5 h-3.5" /> Night Shuttle Frequency: 8 mins
              </span>
            </div>

            <div className="flex items-center gap-2">
              {'parkingSpots' in currentTarget && onOpenParkingModal && (
                <button
                  onClick={() => onOpenParkingModal(currentTarget as GarbaVenue)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 border border-slate-700"
                >
                  <Car className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reserve Parking</span>
                </button>
              )}

              <button
                onClick={() => setIsNavigating(!isNavigating)}
                className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-lg ${
                  isNavigating
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                }`}
              >
                <Navigation className="w-4 h-4" />
                <span>{isNavigating ? 'Stop Navigation' : 'Start Live GPS Navigation'}</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Target Venue & Food Selection Chips */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Tap any destination to route immediately:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {(activeTab === 'venues' ? venues : restaurants).map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectTarget(item)}
              className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                currentTarget.id === item.id
                  ? 'bg-amber-500/20 border-amber-400 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
              }`}
            >
              <div className="min-w-0 pr-2">
                <div className="font-bold text-xs truncate text-white">{item.name}</div>
                <div className="text-[10px] text-slate-400 truncate">
                  {'zone' in item ? item.zone : ''}
                </div>
              </div>
              <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
