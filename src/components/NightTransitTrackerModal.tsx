import React, { useState, useEffect } from 'react';
import { 
  Train, 
  Bus, 
  Clock, 
  MapPin, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Compass, 
  Footprints, 
  Zap, 
  CreditCard,
  X,
  Share2
} from 'lucide-react';
import { MetroFeederRoute, Language } from '../types';

interface NightTransitTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  venueName?: string;
}

export const AHMEDABAD_METRO_FEEDER_DATA: MetroFeederRoute[] = [
  {
    id: 'metro-route-1',
    lineName: 'Blue Line (Thaltej Gam ↔ Vastral Gam)',
    lineColor: 'border-blue-500 bg-blue-500/10 text-blue-300',
    fromStation: 'Thaltej Gam (Near SBR / SG Highway)',
    toStation: 'Vastral Gam (via Old City & Kalupur)',
    nearestStation: 'Thaltej Station (Exit Gate 2)',
    walkMinutesToGround: 8,
    distanceKm: 0.9,
    nextDepartureTime: '11:15 PM',
    countdownMinutes: 6,
    lastTrainTime: '2:00 AM (Special Navratri Midnight Extension)',
    feederBusesAvailable: true,
    feederBusLine: 'AMTS Electric Shuttle E-204 (Thaltej Metro ↔ Karnavati & Rajpath Club)',
    feederFrequencyMinutes: 7,
    fareInr: 25,
    crowdCapacity: 'Moderate',
  },
  {
    id: 'metro-route-2',
    lineName: 'Red Line (Motera Stadium ↔ APMC / Vasna)',
    lineColor: 'border-rose-500 bg-rose-500/10 text-rose-300',
    fromStation: 'Narendra Modi Stadium (Motera)',
    toStation: 'APMC Vasna',
    nearestStation: 'Doordarshan Kendra / University Station',
    walkMinutesToGround: 6,
    distanceKm: 0.6,
    nextDepartureTime: '11:20 PM',
    countdownMinutes: 11,
    lastTrainTime: '2:00 AM (Special Navratri Midnight Extension)',
    feederBusesAvailable: true,
    feederBusLine: 'Janmarg BRTS Feeder Line 10 (Direct GMDC Vibrant Ground Gate 1)',
    feederFrequencyMinutes: 5,
    fareInr: 20,
    crowdCapacity: 'Heavy Rush',
  },
  {
    id: 'metro-route-3',
    lineName: 'SBR Party Plot Midnight Shuttle Corridor',
    lineColor: 'border-amber-500 bg-amber-500/10 text-amber-300',
    fromStation: 'Pakwan Cross Road Metro Hub',
    toStation: 'Sindhu Bhavan Road Food Parks & Plots',
    nearestStation: 'Bodakdev Elevated Station',
    walkMinutesToGround: 12,
    distanceKm: 1.4,
    nextDepartureTime: '11:12 PM',
    countdownMinutes: 3,
    lastTrainTime: '3:30 AM (Continuous Shuttle)',
    feederBusesAvailable: true,
    feederBusLine: 'Ahmedabad Police Fixed-Fare Night E-Rickshaws & AC Mini-Buses',
    feederFrequencyMinutes: 4,
    fareInr: 30,
    crowdCapacity: 'Moderate',
  },
  {
    id: 'metro-route-4',
    lineName: 'Heritage Pol Night Line (Kalupur ↔ Mandvi Ni Pol)',
    lineColor: 'border-purple-500 bg-purple-500/10 text-purple-300',
    fromStation: 'Gheekanta Heritage Metro Station',
    toStation: 'Manek Chowk Midnight Food Court & Pols',
    nearestStation: 'Gheekanta Underground Station',
    walkMinutesToGround: 5,
    distanceKm: 0.4,
    nextDepartureTime: '11:25 PM',
    countdownMinutes: 16,
    lastTrainTime: '2:00 AM (GMRC Special)',
    feederBusesAvailable: true,
    feederBusLine: 'Heritage Electric Golf Carts (Free for Senior Citizens & Families)',
    feederFrequencyMinutes: 5,
    fareInr: 15,
    crowdCapacity: 'Light',
  },
];

export const NightTransitTrackerModal: React.FC<NightTransitTrackerModalProps> = ({
  isOpen,
  onClose,
  language,
  venueName = 'GMDC Ground & SG Highway Garba Hubs',
}) => {
  const [selectedRoute, setSelectedRoute] = useState<MetroFeederRoute>(AHMEDABAD_METRO_FEEDER_DATA[0]);
  const [bookedToken, setBookedToken] = useState<{
    tokenId: string;
    route: MetroFeederRoute;
    qrPayload: string;
    generatedAt: string;
    expiryTime: string;
  } | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [passengerCount, setPassengerCount] = useState(2);

  // Dynamic countdown simulator
  const [timeRemainingSecs, setTimeRemainingSecs] = useState(360);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemainingSecs((prev) => (prev > 0 ? prev - 1 : 420));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  const minutesLeft = Math.floor(timeRemainingSecs / 60);
  const secondsLeft = timeRemainingSecs % 60;

  const handleBookFastToken = () => {
    setIsPurchasing(true);
    setTimeout(() => {
      setIsPurchasing(false);
      const token = {
        tokenId: 'GMRC-AMD-' + Math.floor(100000 + Math.random() * 900000),
        route: selectedRoute,
        qrPayload: `GMRC-METRO-TICKET-${Date.now()}-ENCRYPTED-SECURE`,
        generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        expiryTime: '3:00 AM Tonight',
      };
      setBookedToken(token);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-sky-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-gradient-to-r from-sky-950/80 via-slate-900 to-indigo-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Ahmedabad Night Transit & Feeder Tracker
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  GMRC 2:00 AM Active
                </span>
              </div>
              <p className="text-[11px] text-sky-300/80">
                GMRC Metro Extension, AMTS/BRTS Night Feeders & Instant QR Tokens for {venueName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm flex-1">
          
          {/* Midnight 2:00 AM Last Train Alert & Countdown Nudge */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-transparent border border-amber-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <span className="font-bold text-xs text-amber-300 block">
                  Next Night Feeder Train in {minutesLeft}m {secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}s
                </span>
                <span className="text-[11px] text-slate-300">
                  Phase-1 lines operate continuously till <strong>2:00 AM</strong>. Avoid 45-min SG Highway traffic jams!
                </span>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Last Metro</span>
              <span className="font-mono font-black text-rose-400 text-sm">2:00 AM</span>
            </div>
          </div>

          {bookedToken ? (
            /* Digital QR Transit Token */
            <div className="p-4 rounded-2xl bg-slate-950 border border-sky-500/40 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div>
                <h4 className="font-bold text-base text-white">Digital Metro + Feeder Pass Issued!</h4>
                <p className="text-xs text-slate-400">
                  Scan at GMRC Automatic Fare Collection (AFC) turnstile gates and night electric shuttle doors.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-sky-950/60 to-slate-900 border-2 border-sky-400/50 max-w-sm mx-auto space-y-3">
                <div className="flex items-center justify-between text-[11px] text-sky-300 font-bold border-b border-sky-500/30 pb-2">
                  <span>GMRC METRO & AMTS FEEDER</span>
                  <span className="font-mono">{bookedToken.tokenId}</span>
                </div>

                <div className="py-2 flex flex-col items-center">
                  <div className="p-2.5 rounded-xl bg-white text-slate-950 shadow-lg">
                    <QrCode className="w-28 h-28" />
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold mt-2">
                    Valid for {passengerCount} Passenger(s) • Turnstile Ready
                  </span>
                </div>

                <div className="space-y-1 text-left text-xs border-t border-sky-500/30 pt-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Boarding Station:</span>
                    <span className="font-bold text-white">{bookedToken.route.nearestStation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Line:</span>
                    <span className="font-bold text-amber-300">{bookedToken.route.lineName.slice(0, 24)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Paid:</span>
                    <span className="font-bold text-emerald-400">₹{bookedToken.route.fareInr * passengerCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expires:</span>
                    <span className="text-slate-300">{bookedToken.expiryTime}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setBookedToken(null)}
                className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-all cursor-pointer"
              >
                Back to Transit Timetable
              </button>
            </div>
          ) : (
            /* Transit Lines Selector & Departure Board */
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Select Active Night Route / Destination:</span>
                  <span className="text-[11px] text-sky-400 font-normal">Real-Time GTFS-RT Connected</span>
                </label>

                <div className="space-y-2.5">
                  {AHMEDABAD_METRO_FEEDER_DATA.map((route) => {
                    const isSelected = selectedRoute.id === route.id;
                    return (
                      <div
                        key={route.id}
                        onClick={() => setSelectedRoute(route)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-950 border-sky-400 shadow-lg shadow-sky-500/10'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${route.lineColor}`}>
                            {route.lineName}
                          </span>

                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                              Next in {route.countdownMinutes}m
                            </span>
                            <span className="text-slate-400 text-[11px]">₹{route.fareInr}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 my-2">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                            <span>Nearest Station: <strong>{route.nearestStation}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5 text-amber-300 font-medium">
                            <Footprints className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                            <span>{route.walkMinutesToGround} min walk ({route.distanceKm} km) to ground gate</span>
                          </div>
                        </div>

                        {/* Feeder Bus Line badge */}
                        <div className="p-2 rounded-lg bg-sky-950/30 border border-sky-500/20 text-[11px] text-sky-200 flex items-center justify-between gap-1 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <Bus className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                            <span>{route.feederBusLine}</span>
                          </div>
                          <span className="text-emerald-400 font-bold whitespace-nowrap">
                            Every {route.feederFrequencyMinutes}m
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Passenger Selector & Instant Token Checkout */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-white block">
                      Fast QR Transit Token Booking
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Skip 40-minute station token queues at midnight
                    </span>
                  </div>

                  {/* Quantity selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Passengers:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
                        className="w-6 h-6 rounded bg-slate-800 text-white font-bold flex items-center justify-center hover:bg-slate-700"
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-bold text-amber-300">{passengerCount}</span>
                      <button
                        onClick={() => setPassengerCount(Math.min(6, passengerCount + 1))}
                        className="w-6 h-6 rounded bg-slate-800 text-white font-bold flex items-center justify-center hover:bg-slate-700"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Fare ({passengerCount}x)</span>
                    <span className="text-base font-extrabold text-amber-400">
                      ₹{selectedRoute.fareInr * passengerCount}
                    </span>
                  </div>

                  <button
                    onClick={handleBookFastToken}
                    disabled={isPurchasing}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20 cursor-pointer active:scale-95 transition-all"
                  >
                    <QrCode className="w-4 h-4 text-slate-950" />
                    <span>{isPurchasing ? 'Generating QR Ticket...' : 'Get Fast QR Metro Token'}</span>
                  </button>
                </div>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
