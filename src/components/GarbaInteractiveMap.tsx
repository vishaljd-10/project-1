import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { GarbaVenue, Restaurant } from '../types';

// Fix missing default Leaflet icons in Vite/Webpack build bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Coordinates for top Ahmedabad Garba venues
const AHMEDABAD_VENUES = [
  { 
    id: 'karnavati-club', 
    name: 'Karnavati Club (SG Highway)', 
    lat: 23.0185, 
    lng: 72.5085, 
    crowd: '88% (Peak)',
    category: 'Premier Club',
    parking: '4W: 92% • Valet Available'
  },
  { 
    id: 'rajpath-club', 
    name: 'Rajpath Club (SG Highway)', 
    lat: 23.0384, 
    lng: 72.5118, 
    crowd: '94% (Very High)',
    category: 'Premier Club',
    parking: '4W: 80% • Valet Ready'
  },
  { 
    id: 'gmdc-ground', 
    name: 'GMDC Vibrant Ground (Drive-In)', 
    lat: 23.0489, 
    lng: 72.5318, 
    crowd: '75% (Moderate)',
    category: 'Mega Ground',
    parking: '4W: 95% (Overflow Lot Active)'
  },
  { 
    id: 'mandvi-ni-pol', 
    name: 'Mandvi Ni Pol (Heritage Sheri Garba)', 
    lat: 23.0242, 
    lng: 72.5898, 
    crowd: '60% (Comfortable)',
    category: 'Heritage Pol',
    parking: '2W Only (Kalupur Deck for 4W)'
  },
  { 
    id: 'mirchi-rock-n-dhol', 
    name: 'Mirchi Rock N Dhol (SBR)', 
    lat: 23.0435, 
    lng: 72.4950, 
    crowd: '82% (High)',
    category: 'Party Plot',
    parking: '4W: 96% (SBR Overflow Yard)'
  },
  {
    id: 'shankus-dandiya',
    name: 'Shankus Dandiya Grounds (SG Highway)',
    lat: 23.0890,
    lng: 72.5280,
    crowd: '68% (Moderate)',
    category: 'Party Plot',
    parking: '4W: 68% • Ample Space'
  }
];

interface GarbaInteractiveMapProps {
  venues?: GarbaVenue[];
  selectedVenue?: GarbaVenue | Restaurant | null;
  onSelectVenue?: (venue: GarbaVenue) => void;
  onOpenParkingModal?: (venue: GarbaVenue) => void;
}

export const GarbaInteractiveMap: React.FC<GarbaInteractiveMapProps> = ({
  venues,
  selectedVenue,
  onSelectVenue,
  onOpenParkingModal,
}) => {
  const centerLat = selectedVenue && 'coordinates' in selectedVenue && selectedVenue.coordinates 
    ? selectedVenue.coordinates.lat 
    : 23.0338;
  const centerLng = selectedVenue && 'coordinates' in selectedVenue && selectedVenue.coordinates 
    ? selectedVenue.coordinates.lng 
    : 72.5267;

  return (
    <div className="w-full h-[460px] rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl relative z-0">
      <MapContainer
        center={[centerLat, centerLng]} // SG Highway / Ahmedabad center
        zoom={12}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
      >
        {/* CARTO Dark Matter: 100% Free, No API key, matches festive dark mode */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {AHMEDABAD_VENUES.map((venue) => {
          const matchingVenueObj = venues?.find(v => v.id === venue.id || v.name.toLowerCase().includes(venue.name.toLowerCase()));
          return (
            <Marker key={venue.id} position={[venue.lat, venue.lng]}>
              <Popup>
                <div className="text-zinc-900 p-1.5 min-w-[200px]">
                  <p className="font-extrabold text-sm text-amber-600 m-0 leading-tight">
                    {venue.name}
                  </p>
                  <p className="text-[11px] text-zinc-500 font-semibold mt-0.5 mb-1">
                    {venue.category}
                  </p>
                  
                  <div className="text-xs text-zinc-700 space-y-1 mb-2">
                    <p className="m-0">
                      Crowd Density: <span className="font-bold text-rose-600">{venue.crowd}</span>
                    </p>
                    <p className="m-0 text-[11px] text-sky-800 font-medium">
                      🅿️ {venue.parking}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {matchingVenueObj && onOpenParkingModal && (
                      <button
                        type="button"
                        onClick={() => onOpenParkingModal(matchingVenueObj)}
                        className="block w-full text-center text-xs bg-slate-900 text-amber-300 font-bold py-1 px-2 rounded hover:bg-slate-800 border border-slate-700 cursor-pointer"
                      >
                        Reserve Parking & Valet
                      </button>
                    )}

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-center text-xs bg-amber-500 text-white font-medium py-1 px-2 rounded hover:bg-amber-600 no-underline"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
