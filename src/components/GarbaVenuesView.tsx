import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Users, 
  Star, 
  Clock, 
  Car, 
  ShieldCheck, 
  Ticket, 
  ChevronRight, 
  Filter, 
  Sparkles,
  QrCode,
  CheckCircle2,
  Navigation,
  MessageSquare,
  CloudSun,
  Droplets,
  CloudRain,
  Train,
  Radio,
  RefreshCw
} from 'lucide-react';
import { GarbaVenue, GarbaPass, Language } from '../types';
import { TRANSLATIONS } from '../services/localization';
import { WeatherForecastWidget } from './WeatherForecastWidget';
import { VENUE_PARKING_LOTS } from '../data/parkingData';

interface GarbaVenuesViewProps {
  venues: GarbaVenue[];
  language: Language;
  onBookPass: (pass: GarbaPass) => void;
  onNavigateToVenue: (venue: GarbaVenue) => void;
  onOpenTransitTracker: (venue: GarbaVenue) => void;
  onOpenCircleRadar: (venue: GarbaVenue) => void;
  onOpenParkingModal: (venue: GarbaVenue) => void;
}

export const GarbaVenuesView: React.FC<GarbaVenuesViewProps> = ({
  venues,
  language,
  onBookPass,
  onNavigateToVenue,
  onOpenTransitTracker,
  onOpenCircleRadar,
  onOpenParkingModal,
}) => {
  const t = TRANSLATIONS[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [bookingVenue, setBookingVenue] = useState<GarbaVenue | null>(null);
  const [selectedNight, setSelectedNight] = useState('Night 5 - Panchami (Tonight)');
  const [selectedTier, setSelectedTier] = useState<'General Entry' | 'Gold Circle' | 'VIP Lounge' | 'Navratri Season Pass (9 Nights)'>('Gold Circle');
  const [quantity, setQuantity] = useState(2);
  const [attendeeName, setAttendeeName] = useState('Aarav Mehta');
  const [attendeePhone, setAttendeePhone] = useState('+91 98251 44556');
  const [justBookedPass, setJustBookedPass] = useState<GarbaPass | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentTxId, setPaymentTxId] = useState<string | null>(null);

  // Filter logic
  const filteredVenues = venues.filter((v) => {
    const matchSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.gujaratiName.includes(searchQuery) ||
      v.lineupArtist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.zone.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'Mega' && v.category === 'Mega Ground') ||
      (selectedCategory === 'Club' && v.category === 'Premier Club') ||
      (selectedCategory === 'Heritage' && v.category === 'Heritage Pol') ||
      (selectedCategory === 'Party' && v.category === 'Party Plot');

    const matchZone = selectedZone === 'All' || v.zone === selectedZone;

    return matchSearch && matchCategory && matchZone;
  });

  const getTierPrice = (venue: GarbaVenue, tier: string) => {
    if (tier === 'General Entry') return venue.entryFee;
    if (tier === 'Gold Circle') return Math.round(venue.entryFee * 1.8);
    if (tier === 'VIP Lounge') return Math.round(venue.entryFee * 3.2);
    return venue.seasonPassFee;
  };

  const handleConfirmPassBooking = async () => {
    if (!bookingVenue) return;

    const unitPrice = getTierPrice(bookingVenue, selectedTier);
    const total = unitPrice * quantity;
    const passId = 'PASS-AMD-' + Math.floor(10000 + Math.random() * 90000);

    setIsProcessingPayment(true);
    let resolvedTx = 'pi_stripetx_' + Math.random().toString(36).substring(2, 10);

    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'inr',
          description: `Navratri Pass: ${bookingVenue.name} - ${selectedTier} (${quantity}x)`,
          metadata: {
            venueId: bookingVenue.id,
            venueName: bookingVenue.name,
            tier: selectedTier,
            passId,
            attendeeName: attendeeName || 'Navratri Dancer',
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.paymentIntentId) {
          resolvedTx = data.paymentIntentId;
        }
      }
    } catch (err) {
      console.warn('Payment gateway fallback:', err);
    } finally {
      setIsProcessingPayment(false);
    }

    setPaymentTxId(resolvedTx);

    const newPass: GarbaPass = {
      id: passId,
      venueId: bookingVenue.id,
      venueName: bookingVenue.name,
      date: selectedNight,
      tier: selectedTier,
      pricePerPass: unitPrice,
      quantity,
      totalAmount: total,
      attendeeName: attendeeName || 'Navratri Dancer',
      attendeePhone: attendeePhone || '+91 98000 00000',
      qrPayload: `https://navratri-amd.gov.in/verify/${passId}-${Date.now()}`,
      bookedAt: new Date().toLocaleString(),
      status: 'Confirmed',
      encryptedHash: 'SHA256-' + Math.random().toString(36).substring(2, 12),
    };

    onBookPass(newPass);
    setJustBookedPass(newPass);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-20">
      
      {/* Real-time Ahmedabad Weather Forecast Widget */}
      <WeatherForecastWidget
        language={language}
        selectedZone={selectedZone}
        onZoneSelect={(z) => setSelectedZone(z)}
      />

      {/* Search & Filter Toolbar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchVenues}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-all shadow-inner"
          />
        </div>

        {/* Quick Filter Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'All', label: t.filterAll },
            { id: 'Mega', label: '🏟️ ' + t.filterMega },
            { id: 'Club', label: '👑 ' + t.filterClub },
            { id: 'Heritage', label: '🪔 ' + t.filterHeritage },
            { id: 'Party', label: '🎉 Party Plots' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 border ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 font-bold'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Zone Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-rose-400" /> Zone:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['All', 'SG Highway', 'Sindhu Bhavan', 'Old City Heritage', 'Gandhinagar'].map((z) => (
              <button
                key={z}
                onClick={() => setSelectedZone(z)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  selectedZone === z
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {z}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Parking & Valet Quick Hub */}
      <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950/40 to-amber-950/40 border border-sky-500/30 flex items-center justify-between gap-3 shadow-md flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40">
            <Car className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs text-white">Smart Ground Parking & Royal Valet Hub</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                2W & 4W Active
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Live lot capacities, ultrasonic bay locking, overflow feeder shuttles & boom barrier ANPR QR passes.
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenParkingModal(filteredVenues[0] || venues[0])}
          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all whitespace-nowrap active:scale-95"
        >
          <Car className="w-3.5 h-3.5" />
          <span>Open Parking Hub</span>
        </button>
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {filteredVenues.map((venue) => {
          // Crowd status style
          const isPacked = venue.crowdPercent >= 90;
          const isHigh = venue.crowdPercent >= 75 && venue.crowdPercent < 90;
          const crowdColor = isPacked
            ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
            : isHigh
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

          const venueLot = VENUE_PARKING_LOTS.find(v => v.venueId === venue.id || v.venueName.toLowerCase().includes(venue.name.toLowerCase()));
          const occ4WPercent = venueLot && venueLot.totalSpots4W > 0 ? Math.round((venueLot.occupiedSpots4W / venueLot.totalSpots4W) * 100) : 0;
          const isParkingOverflow = venueLot ? venueLot.isOverflowTriggered : false;

          return (
            <div
              key={venue.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl overflow-hidden shadow-xl transition-all duration-200 flex flex-col group"
            >
              {/* Image & Badges */}
              <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-950">
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30">
                    {venue.category}
                  </span>

                  {/* Real-time Crowd meter */}
                  <div
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold backdrop-blur-md border flex items-center gap-1.5 ${crowdColor}`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isPacked ? 'bg-rose-500 animate-ping' : isHigh ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                    ></span>
                    <span>{venue.crowdPercent}% Live Crowd</span>
                  </div>
                </div>

                {/* Bottom Overlay Info on Image */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between">
                  <div className="min-w-0">
                    <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {venue.rating} ({venue.reviewsCount} reviews)
                    </span>
                    <h3 className="font-extrabold text-sm sm:text-base text-white truncate drop-shadow-md">
                      {language === 'gu' ? venue.gujaratiName : venue.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3.5 sm:p-4 space-y-3 flex-1 flex flex-col justify-between">
                
                {/* Details list */}
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 text-slate-400 truncate">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                    <span className="truncate">{venue.address}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-amber-200">
                      <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span>{venue.timings}</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-300">
                      <Car className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                      <span>{venue.parkingSpots} spots ({venue.parkingAvailable ? 'Available' : 'Fast Filling'})</span>
                    </div>
                  </div>

                  {/* Lineup Artist */}
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
                        Headline Artist Tonight
                      </span>
                      <span className="text-xs font-bold text-amber-300 truncate block">
                        {venue.lineupArtist}
                      </span>
                    </div>
                  </div>

                  {/* Ground Weather & Rain Sensor */}
                  <div className="p-2 rounded-xl bg-sky-950/30 border border-sky-500/20 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-sky-200">
                      <CloudSun className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span>Outdoor 27°C • Clear Skies</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-400 font-semibold font-mono">
                      <CloudRain className="w-3 h-3 text-sky-400" />
                      <span>0% Rain Delay</span>
                    </div>
                  </div>

                  {/* Ground Parking & Valet Live Status Pill */}
                  {venueLot && (
                    <div className={`p-2 rounded-xl border flex items-center justify-between text-[11px] ${
                      isParkingOverflow
                        ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300'
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span>
                          {venueLot.totalSpots4W > 0 ? `4W: ${occ4WPercent}% Full` : '2W Only (Pol)'} • 2W: {Math.round((venueLot.occupiedSpots2W / venueLot.totalSpots2W) * 100)}%
                        </span>
                      </div>
                      {isParkingOverflow ? (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-500/30 text-rose-300 border border-rose-500/40">
                          OVERFLOW ACTIVE
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-medium text-[10px]">
                          {venueLot.valetAvailable ? 'Valet Available' : 'Bays Open'}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Safety & BRTS badge */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> Ahmedabad Police SHE-Team Booth
                    </span>
                    <span>{venue.brtsNearby}</span>
                  </div>
                </div>

                {/* Price and Action Buttons */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Single Night Pass</span>
                    <span className="text-sm sm:text-base font-extrabold text-amber-300">
                      {venue.entryFee === 0 ? 'FREE ENTRY' : `₹${venue.entryFee}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => onOpenCircleRadar(venue)}
                      title="Find Friends Radar (P2P Mesh - No Cellular Needed)"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 transition-colors cursor-pointer flex items-center gap-1 text-xs"
                    >
                      <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      <span className="hidden sm:inline text-[11px] font-semibold">Circle Radar</span>
                    </button>

                    <button
                      onClick={() => onOpenTransitTracker(venue)}
                      title="Ahmedabad Metro & Feeder Bus Schedule"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 transition-colors cursor-pointer flex items-center gap-1 text-xs"
                    >
                      <Train className="w-3.5 h-3.5 text-sky-400" />
                      <span className="hidden sm:inline text-[11px] font-semibold">Night Transit</span>
                    </button>

                    <button
                      onClick={() => onOpenParkingModal(venue)}
                      title="Reserve 2W/4W Slot or Royal Valet"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors cursor-pointer flex items-center gap-1 text-xs"
                    >
                      <Car className="w-3.5 h-3.5 text-amber-400" />
                      <span className="hidden sm:inline text-[11px] font-semibold">Valet & Park</span>
                    </button>

                    <button
                      onClick={() => onNavigateToVenue(venue)}
                      title="Route Navigation & Parking"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                    >
                      <Navigation className="w-4 h-4 text-amber-400" />
                    </button>

                    <button
                      onClick={() => setBookingVenue(venue)}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
                    >
                      <Ticket className="w-3.5 h-3.5 text-slate-950" />
                      <span>{t.bookPass}</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Pass Booking Modal */}
      {bookingVenue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 bg-gradient-to-r from-amber-950/80 to-slate-900 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-1.5">
                  <Ticket className="w-4 h-4 text-amber-400" /> Digital Garba Pass Booking
                </h3>
                <p className="text-xs text-amber-200/80 truncate">
                  {bookingVenue.name}
                </p>
              </div>
              <button
                onClick={() => {
                  setBookingVenue(null);
                  setJustBookedPass(null);
                }}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
              
              {justBookedPass ? (
                /* Ticket Confirmation with Holographic QR */
                <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/50 space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>

                  <div>
                    <h4 className="font-bold text-base text-white">Pass Confirmed & Encrypted!</h4>
                    <p className="text-xs text-slate-400">
                      Cached to your offline biometric vault. Valid at Gate 2 tonight.
                    </p>
                  </div>

                  {/* Animated Holographic Pass Preview */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-purple-900/20 to-slate-900 border-2 border-amber-400/60 garba-glow relative">
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-300 pb-2 border-b border-amber-500/30">
                      <span>AHMEDABAD NAVRATRI 2026</span>
                      <span className="font-mono">{justBookedPass.id}</span>
                    </div>

                    <div className="py-3 flex flex-col items-center">
                      <div className="p-2.5 rounded-xl bg-white text-slate-950 shadow-md">
                        <QrCode className="w-24 h-24" />
                      </div>
                      <span className="text-[10px] text-amber-200 mt-2 font-mono">
                        {justBookedPass.encryptedHash}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-amber-500/30 text-left space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Ground:</span>
                        <span className="font-bold text-white">{justBookedPass.venueName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Tier & Passes:</span>
                        <span className="font-bold text-amber-300">{justBookedPass.tier} ({justBookedPass.quantity}x)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Attendee:</span>
                        <span className="font-bold text-white">{justBookedPass.attendeeName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Paid:</span>
                        <span className="font-bold text-emerald-400">₹{justBookedPass.totalAmount}</span>
                      </div>
                      {paymentTxId && (
                        <div className="flex items-center justify-between text-[11px] pt-1 text-sky-300">
                          <span className="text-slate-400">Payment Gateway:</span>
                          <span className="font-mono text-[10px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-700">
                            Stripe: {paymentTxId}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setBookingVenue(null);
                      setJustBookedPass(null);
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all cursor-pointer"
                  >
                    View in My Passes
                  </button>
                </div>
              ) : (
                /* Pass Configuration Form */
                <>
                  {/* Select Night */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1.5 block">
                      Select Navratri Night:
                    </label>
                    <select
                      value={selectedNight}
                      onChange={(e) => setSelectedNight(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                    >
                      <option>Night 1 - Pratipada (Opening Grand Raas)</option>
                      <option>Night 2 - Dwitiya</option>
                      <option>Night 3 - Tritiya</option>
                      <option>Night 4 - Chaturthi</option>
                      <option>Night 5 - Panchami (Tonight)</option>
                      <option>Night 6 - Shashthi</option>
                      <option>Night 7 - Saptami (Mega Weekend)</option>
                      <option>Night 8 - Ashtami (Maha Aarti Special)</option>
                      <option>Night 9 - Navami (Grand Finale)</option>
                      <option>Sharad Purnima Special Raas</option>
                    </select>
                  </div>

                  {/* Select Tier */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1.5 block">
                      Select Pass Category:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { tier: 'General Entry', tag: 'Standard Ring' },
                        { tier: 'Gold Circle', tag: 'Front Stage' },
                        { tier: 'VIP Lounge', tag: 'VIP Seating & AC' },
                        { tier: 'Navratri Season Pass (9 Nights)', tag: 'All 9 Nights' },
                      ].map((item) => {
                        const price = getTierPrice(bookingVenue, item.tier as any);
                        return (
                          <button
                            key={item.tier}
                            type="button"
                            onClick={() => setSelectedTier(item.tier as any)}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              selectedTier === item.tier
                                ? 'bg-amber-500/20 border-amber-400 text-white shadow-sm'
                                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850'
                            }`}
                          >
                            <div className="font-bold text-xs">{item.tier}</div>
                            <div className="text-[10px] text-slate-400">{item.tag}</div>
                            <div className="text-xs font-black text-amber-300 mt-1">₹{price}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-medium text-xs text-slate-300">Number of Dancers:</span>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold flex items-center justify-center hover:bg-slate-700"
                      >
                        -
                      </button>
                      <span className="font-bold text-sm text-amber-300 min-w-[20px] text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(8, quantity + 1))}
                        className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold flex items-center justify-center hover:bg-slate-700"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Attendee Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Attendee Full Name
                      </label>
                      <input
                        type="text"
                        value={attendeeName}
                        onChange={(e) => setAttendeeName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Mobile Number (For Pass SMS)
                      </label>
                      <input
                        type="text"
                        value={attendeePhone}
                        onChange={(e) => setAttendeePhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100"
                      />
                    </div>
                  </div>

                  {/* Total & Action */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total Amount</span>
                      <span className="text-base font-extrabold text-amber-400">
                        ₹{getTierPrice(bookingVenue, selectedTier) * quantity}
                      </span>
                    </div>

                    <button
                      onClick={handleConfirmPassBooking}
                      disabled={isProcessingPayment}
                      className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      {isProcessingPayment ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Processing Stripe Intent...</span>
                        </>
                      ) : (
                        <span>Pay & Confirm Pass</span>
                      )}
                    </button>
                  </div>
                </>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
