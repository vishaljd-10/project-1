import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Bike, 
  Key, 
  Zap, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  QrCode, 
  ArrowRight, 
  ChevronRight, 
  Compass, 
  X, 
  Share2, 
  Download, 
  Sparkles, 
  Navigation, 
  RefreshCw,
  Info,
  Radio,
  Sliders,
  Check
} from 'lucide-react';
import { 
  GarbaVenue, 
  VenueParkingLot, 
  ParkingSlot, 
  ParkingReservation, 
  VehicleType, 
  ParkingServiceType, 
  Language 
} from '../types';
import { VENUE_PARKING_LOTS } from '../data/parkingData';
import { TRANSLATIONS } from '../services/localization';

interface ParkingValetModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  initialVenueName?: string;
  venues: GarbaVenue[];
  activeReservations: ParkingReservation[];
  onReserveSlot: (reservation: ParkingReservation) => void;
  onRequestValetRetrieval: (reservationId: string) => void;
}

export const ParkingValetModal: React.FC<ParkingValetModalProps> = ({
  isOpen,
  onClose,
  language,
  initialVenueName,
  venues,
  activeReservations,
  onReserveSlot,
  onRequestValetRetrieval,
}) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'reserve' | 'my-passes' | 'overflow-info'>('reserve');
  
  // Selected venue matching
  const [selectedVenueLot, setSelectedVenueLot] = useState<VenueParkingLot>(() => {
    if (initialVenueName) {
      const found = VENUE_PARKING_LOTS.find(v => v.venueName.toLowerCase().includes(initialVenueName.toLowerCase()) || initialVenueName.toLowerCase().includes(v.venueName.toLowerCase()));
      if (found) return found;
    }
    return VENUE_PARKING_LOTS[0];
  });

  // When initialVenueName changes, sync
  useEffect(() => {
    if (initialVenueName) {
      const found = VENUE_PARKING_LOTS.find(v => v.venueName.toLowerCase().includes(initialVenueName.toLowerCase()) || initialVenueName.toLowerCase().includes(v.venueName.toLowerCase()));
      if (found) setSelectedVenueLot(found);
    }
  }, [initialVenueName]);

  // Reservation form state
  const [vehicleType, setVehicleType] = useState<VehicleType>('4-Wheeler');
  const [serviceType, setServiceType] = useState<ParkingServiceType>('Self Park');
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [vehicleNumber, setVehicleNumber] = useState('GJ-01-AB-4050');
  const [driverName, setDriverName] = useState('Aarav Mehta');
  const [driverPhone, setDriverPhone] = useState('+91 98251 44556');
  const [timeDuration, setTimeDuration] = useState<'night-pass' | 'midnight-pass'>('night-pass');
  const [includeEVCharging, setIncludeEVCharging] = useState(false);
  const [includeHelmetLocker, setIncludeHelmetLocker] = useState(false);
  const [useOverflowLot, setUseOverflowLot] = useState(false);

  // Filter for slot grid
  const [filterEVOnly, setFilterEVOnly] = useState(false);
  const [filterCoveredOnly, setFilterCoveredOnly] = useState(false);
  const [filterZone, setFilterZone] = useState<string>('All');

  // Confirmation view
  const [confirmedReservation, setConfirmedReservation] = useState<ParkingReservation | null>(null);
  const [retrievalNotice, setRetrievalNotice] = useState<string | null>(null);
  const [lastRefreshedSecs, setLastRefreshedSecs] = useState(12);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentTxId, setPaymentTxId] = useState<string | null>(null);

  // Simulated live sensor heartbeat
  useEffect(() => {
    const timer = setInterval(() => {
      setLastRefreshedSecs(prev => (prev >= 60 ? 4 : prev + 4));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  // Capacity calculations
  const total4W = selectedVenueLot.totalSpots4W;
  const occ4W = selectedVenueLot.occupiedSpots4W;
  const avail4W = Math.max(0, total4W - occ4W);
  const percent4W = total4W > 0 ? Math.round((occ4W / total4W) * 100) : 0;

  const total2W = selectedVenueLot.totalSpots2W;
  const occ2W = selectedVenueLot.occupiedSpots2W;
  const avail2W = Math.max(0, total2W - occ2W);
  const percent2W = total2W > 0 ? Math.round((occ2W / total2W) * 100) : 0;

  const isCritical4W = percent4W >= (selectedVenueLot.overflowThresholdPercent || 90);
  const isCritical2W = percent2W >= 85;

  // Filter slots for interactive grid
  const displayedSlots = selectedVenueLot.slots.filter(slot => {
    if (vehicleType === '4-Wheeler' && slot.vehicleType !== '4-Wheeler') return false;
    if (vehicleType === '2-Wheeler' && slot.vehicleType !== '2-Wheeler') return false;
    if (serviceType === 'Royal Valet' && !slot.isValet) return false;
    if (filterEVOnly && !slot.hasEVCharging) return false;
    if (filterCoveredOnly && !slot.isCovered) return false;
    if (filterZone !== 'All' && !slot.zone.includes(filterZone)) return false;
    return true;
  });

  // Calculate pricing
  const calculateTotal = () => {
    if (useOverflowLot && selectedVenueLot.overflowLot) {
      return selectedVenueLot.overflowLot.rateInr;
    }
    let base = 0;
    if (selectedSlot) {
      base = selectedSlot.rateInr;
    } else {
      base = vehicleType === '4-Wheeler' ? selectedVenueLot.baseRate4W : selectedVenueLot.baseRate2W;
      if (serviceType === 'Royal Valet') base += selectedVenueLot.valetChargeInr;
    }
    if (includeEVCharging) base += 100;
    if (includeHelmetLocker) base += 20;
    return base;
  };

  const handleConfirmReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValet = serviceType === 'Royal Valet';
    const finalAmount = calculateTotal();
    const resId = 'PARK-AMD-' + Math.floor(1000 + Math.random() * 9000);

    setIsProcessingPayment(true);
    let resolvedTx = 'pi_parking_' + Math.random().toString(36).substring(2, 9);

    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          currency: 'inr',
          description: `Ahmedabad Navratri Parking: ${selectedVenueLot.venueName} (${vehicleNumber})`,
          metadata: {
            venueId: selectedVenueLot.venueId,
            vehicleNumber,
            serviceType,
            resId,
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
      console.warn('Parking payment proxy fallback:', err);
    } finally {
      setIsProcessingPayment(false);
    }

    setPaymentTxId(resolvedTx);

    const newRes: ParkingReservation = {
      id: resId,
      venueId: selectedVenueLot.venueId,
      venueName: selectedVenueLot.venueName,
      vehicleType,
      serviceType,
      vehicleNumber: vehicleNumber.toUpperCase().trim(),
      slotId: useOverflowLot ? undefined : selectedSlot?.id,
      slotNumber: useOverflowLot 
        ? `Overflow Bay #${Math.floor(10 + Math.random() * 80)}` 
        : (selectedSlot?.slotNumber || (isValet ? 'Royal Valet Fast Bay' : 'General Bay')),
      zoneName: useOverflowLot 
        ? (selectedVenueLot.overflowLot?.name || 'Overflow Satellite Yard')
        : (selectedSlot?.zone || (isValet ? 'Zone A (Gate 1 Valet Hub)' : 'General Parking Bay')),
      driverName,
      driverPhone,
      entryTime: timeDuration === 'night-pass' ? '7:30 PM' : '11:00 PM',
      validUntil: '4:30 AM',
      totalAmount: finalAmount,
      status: isValet ? 'Valet_Parked' : 'Confirmed',
      bookedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      qrPayload: `https://navratri-amd.gov.in/parking/verify/${resId}-${vehicleNumber.toUpperCase()}`,
      valetClaimToken: isValet ? `VALET-${Math.floor(100 + Math.random() * 900)}` : undefined,
      valetKeyBay: isValet ? `Kiosk Gate 1 - Bay ${Math.floor(1 + Math.random() * 25)}` : undefined,
      isOverflowLot: useOverflowLot,
      overflowLotName: useOverflowLot ? selectedVenueLot.overflowLot?.name : undefined,
      helmetLockerBooked: includeHelmetLocker,
      evPlugReserved: includeEVCharging,
    };

    onReserveSlot(newRes);
    setConfirmedReservation(newRes);
  };

  const handleRequestRetrieval = (resId: string) => {
    onRequestValetRetrieval(resId);
    setRetrievalNotice(`Valet runner dispatched! Your vehicle will be brought to Gate 1 Valet Drop Bay in approx. 6 minutes.`);
    setTimeout(() => {
      setRetrievalNotice(null);
    }, 8000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 bg-gradient-to-r from-amber-950/80 via-slate-900 to-sky-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Car className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-extrabold text-base sm:text-lg text-white">
                  Ahmedabad Smart Parking & Royal Valet
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Ultrasonic IoT
                </span>
              </div>
              <p className="text-xs text-amber-200/80">
                Slot-specific reservations, 2W/4W capacities, overflow shuttles & digital boom barrier QR
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center justify-between border-b border-slate-800 px-3 sm:px-4 py-2 bg-slate-950/60 flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => { setActiveTab('reserve'); setConfirmedReservation(null); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'reserve'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Reserve Bay & Valet</span>
            </button>

            <button
              onClick={() => setActiveTab('my-passes')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'my-passes'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Active Passes ({activeReservations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('overflow-info')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'overflow-info'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Overflow Feeder Guide</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <RefreshCw className="w-3 h-3 text-sky-400 animate-spin" />
            <span>Sensors synced {lastRefreshedSecs}s ago</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-3.5 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm flex-1">
          
          {/* Retrieval alert notification if triggered */}
          {retrievalNotice && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 flex items-center gap-2.5 animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div className="text-xs">
                <strong>Valet Dispatch Order Confirmed:</strong> {retrievalNotice}
              </div>
            </div>
          )}

          {/* TAB 1: RESERVE */}
          {activeTab === 'reserve' && !confirmedReservation && (
            <div className="space-y-4">
              
              {/* Venue Selector */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Select Ahmedabad Garba Ground
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {VENUE_PARKING_LOTS.map(v => {
                    const isSelected = selectedVenueLot.venueId === v.venueId;
                    const occRate = v.totalSpots4W > 0 ? Math.round((v.occupiedSpots4W / v.totalSpots4W) * 100) : 0;
                    const isOver = occRate >= 90;
                    return (
                      <button
                        key={v.venueId}
                        onClick={() => {
                          setSelectedVenueLot(v);
                          setSelectedSlot(null);
                          setUseOverflowLot(false);
                          if (v.totalSpots4W === 0) {
                            setVehicleType('2-Wheeler');
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500 text-white shadow-md'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-bold text-xs truncate">{v.venueName.split(' - ')[0]}</span>
                          {isOver && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-500/30 text-rose-300 border border-rose-500/40">
                              OVERFLOW
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center justify-between">
                          <span>4W: {v.totalSpots4W > 0 ? `${occRate}%` : 'N/A'}</span>
                          <span>2W: {Math.round((v.occupiedSpots2W / v.totalSpots2W) * 100)}%</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Real-time Capacity Monitoring Gauges */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-amber-400" />
                    Ground Live Capacity Gauges: {selectedVenueLot.venueName}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Gate 1 & 2 Boom Barriers Online
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 4-Wheeler Gauge */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200 flex items-center gap-1.5">
                        <Car className="w-4 h-4 text-sky-400" />
                        4-Wheeler Lot (Cars & SUVs)
                      </span>
                      <span className={`font-mono font-extrabold text-xs px-2 py-0.5 rounded-full ${
                        isCritical4W 
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {selectedVenueLot.totalSpots4W > 0 ? `${percent4W}% FULL` : 'RESTRICTED'}
                      </span>
                    </div>

                    {selectedVenueLot.totalSpots4W > 0 ? (
                      <>
                        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 rounded-full ${
                              isCritical4W ? 'bg-gradient-to-r from-amber-500 to-rose-500' : 'bg-gradient-to-r from-emerald-500 to-sky-500'
                            }`}
                            style={{ width: `${percent4W}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>{avail4W} slots remaining</span>
                          <span>Total {total4W} bays</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-[11px] text-rose-300">
                        Narrow heritage pol lanes. 4-Wheelers restricted. Park at Kalupur Multi-Level Deck.
                      </p>
                    )}
                  </div>

                  {/* 2-Wheeler Gauge */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200 flex items-center gap-1.5">
                        <Bike className="w-4 h-4 text-emerald-400" />
                        2-Wheeler Lot (Scooters / Activa / Bikes)
                      </span>
                      <span className={`font-mono font-extrabold text-xs px-2 py-0.5 rounded-full ${
                        isCritical2W 
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {percent2W}% FULL
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
                        style={{ width: `${percent2W}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{avail2W} slots remaining</span>
                      <span>Total {total2W} bays</span>
                    </div>
                  </div>
                </div>

                {/* OVERFLOW DIVERSION ALERT BANNER */}
                {isCritical4W && selectedVenueLot.overflowLot && (
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-rose-950/80 via-amber-950/70 to-slate-950 border-2 border-rose-500/60 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5 animate-pulse" />
                        <div>
                          <div className="font-extrabold text-xs sm:text-sm text-rose-200 flex items-center gap-2">
                            <span>OVERFLOW ALERT: Main 4W Lot At {percent4W}% Capacity</span>
                            <span className="px-1.5 py-0.5 rounded bg-rose-500 text-white text-[10px] font-black">
                              GMRC / AMC ACTIVE
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-0.5">
                            Heavy vehicular influx on SG Highway. Official overflow lot open at{' '}
                            <strong className="text-amber-300">{selectedVenueLot.overflowLot.name}</strong> ({selectedVenueLot.overflowLot.distanceMeters}m).
                          </p>
                          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-emerald-300">
                            <span className="flex items-center gap-1 font-semibold">
                              <Zap className="w-3.5 h-3.5 text-amber-400" />
                              Free Electric Shuttles every {selectedVenueLot.overflowLot.shuttleFrequencyMinutes} mins
                            </span>
                            <span>•</span>
                            <span className="font-semibold">
                              {selectedVenueLot.overflowLot.availableSlots4W} Overflow bays open
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setUseOverflowLot(!useOverflowLot);
                          setSelectedSlot(null);
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-md ${
                          useOverflowLot
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-rose-600 hover:bg-rose-500 text-white'
                        }`}
                      >
                        {useOverflowLot ? '✓ Overflow Selected' : 'Divert to Overflow Yard'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Service & Vehicle Type Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* 4-Wheeler Self Park */}
                {selectedVenueLot.totalSpots4W > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setVehicleType('4-Wheeler');
                      setServiceType('Self Park');
                      setSelectedSlot(null);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      vehicleType === '4-Wheeler' && serviceType === 'Self Park'
                        ? 'bg-sky-500/20 border-sky-400 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs flex items-center gap-1.5 text-slate-200">
                        <Car className="w-4 h-4 text-sky-400" />
                        4-Wheeler Self Park
                      </span>
                      <span className="font-mono font-bold text-amber-300 text-xs">
                        ₹{selectedVenueLot.baseRate4W}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Reserved bay, boom barrier QR access, EV charging options.
                    </p>
                  </button>
                )}

                {/* 2-Wheeler Self Park */}
                <button
                  type="button"
                  onClick={() => {
                    setVehicleType('2-Wheeler');
                    setServiceType('Self Park');
                    setSelectedSlot(null);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    vehicleType === '2-Wheeler' && serviceType === 'Self Park'
                      ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs flex items-center gap-1.5 text-slate-200">
                      <Bike className="w-4 h-4 text-emerald-400" />
                      2-Wheeler Bay
                    </span>
                    <span className="font-mono font-bold text-amber-300 text-xs">
                      ₹{selectedVenueLot.baseRate2W}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Bikes & scooters, covered staging, optional helmet locker.
                  </p>
                </button>

                {/* Royal Valet Drop-off */}
                {selectedVenueLot.valetAvailable && (
                  <button
                    type="button"
                    onClick={() => {
                      setVehicleType('4-Wheeler');
                      setServiceType('Royal Valet');
                      setSelectedSlot(null);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      serviceType === 'Royal Valet'
                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs flex items-center gap-1.5 text-amber-300">
                        <Key className="w-4 h-4 text-amber-400" />
                        Royal Valet Service
                      </span>
                      <span className="font-mono font-bold text-amber-300 text-xs">
                        ₹{selectedVenueLot.baseRate4W + selectedVenueLot.valetChargeInr}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Gate 1 VIP drop, electronic key safe, 1-tap car retrieval.
                    </p>
                  </button>
                )}
              </div>

              {/* Interactive Slot Grid Visualizer (When not using overflow yard) */}
              {!useOverflowLot && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h4 className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-amber-400" />
                        Interactive Ground Bay Selector ({displayedSlots.length} bays shown)
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Tap any open green slot to lock your exact parking space.
                      </p>
                    </div>

                    {/* Filter pills */}
                    <div className="flex items-center gap-1.5 text-xs flex-wrap">
                      <button
                        type="button"
                        onClick={() => setFilterEVOnly(!filterEVOnly)}
                        className={`px-2 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                          filterEVOnly
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        <Zap className="w-3 h-3 text-purple-400" />
                        EV Charging
                      </button>

                      <button
                        type="button"
                        onClick={() => setFilterCoveredOnly(!filterCoveredOnly)}
                        className={`px-2 py-1 rounded-lg border text-[11px] font-semibold cursor-pointer transition-colors ${
                          filterCoveredOnly
                            ? 'bg-sky-500/20 text-sky-300 border-sky-500'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        Covered Shed
                      </button>

                      <select
                        aria-label="Filter parking zones"
                        value={filterZone}
                        onChange={(e) => setFilterZone(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-300"
                      >
                        <option value="All">All Zones</option>
                        <option value="Zone A">Zone A (Gate 1 VIP)</option>
                        <option value="Zone B">Zone B (Fast Exit & EV)</option>
                        <option value="Zone C">Zone C (Main Deck)</option>
                        <option value="Zone D">Zone D (2W Bay)</option>
                      </select>
                    </div>
                  </div>

                  {/* Slot Visual Legend */}
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 flex-wrap py-1 border-y border-slate-800/60">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500" /> Available
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-amber-500 border border-amber-400 shadow-sm" /> Selected
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700" /> Occupied
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-purple-400" /> Fast EV Charger
                    </span>
                    <span className="flex items-center gap-1">
                      <Key className="w-3 h-3 text-amber-400" /> Valet Dedicated
                    </span>
                  </div>

                  {/* Slot Bay Matrix */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-56 overflow-y-auto p-1">
                    {displayedSlots.map(slot => {
                      const isSelected = selectedSlot?.id === slot.id;
                      const isOccupied = slot.status === 'Occupied';

                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={isOccupied}
                          onClick={() => setSelectedSlot(slot)}
                          className={`relative p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-between min-h-[64px] ${
                            isOccupied
                              ? 'bg-slate-900/60 border-slate-800 text-slate-600 cursor-not-allowed opacity-60'
                              : isSelected
                              ? 'bg-amber-500/25 border-amber-400 ring-2 ring-amber-400/50 shadow-lg text-white scale-105 cursor-pointer'
                              : 'bg-slate-900 border-emerald-500/30 text-slate-200 hover:border-emerald-400 hover:bg-slate-800 cursor-pointer'
                          }`}
                        >
                          {/* Top Badges */}
                          <div className="flex items-center justify-between w-full text-[9px]">
                            {slot.hasEVCharging ? (
                              <Zap className="w-3 h-3 text-purple-400" />
                            ) : slot.isValet ? (
                              <Key className="w-3 h-3 text-amber-400" />
                            ) : (
                              <span />
                            )}
                            <span className="text-[9px] text-slate-400 font-mono">
                              {slot.walkMinutesToArena}m
                            </span>
                          </div>

                          <div className="font-black text-xs tracking-tight">
                            {slot.slotNumber}
                          </div>

                          <div className="text-[9px] font-mono text-amber-300">
                            {isOccupied ? 'TAKEN' : `₹${slot.rateInr}`}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Slot Information Banner */}
                  {selectedSlot && (
                    <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-sky-950/60 border border-amber-500/40 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-extrabold text-white flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Locked Slot: {selectedSlot.slotNumber}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-amber-300">
                            {selectedSlot.zone}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          {selectedSlot.walkMinutesToArena} min walking distance to main Garba entrance • {selectedSlot.isCovered ? 'Covered Roof Shade' : 'Open Ground'}
                          {selectedSlot.hasEVCharging && ' • Fast 30kW EV Charger Included'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Rate</span>
                        <span className="font-mono font-extrabold text-amber-300 text-sm">
                          ₹{selectedSlot.rateInr}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* RESERVATION FORM */}
              <form onSubmit={handleConfirmReservation} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h4 className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  Vehicle & Contact Details (Linked to Digital QR Boom Barrier)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Vehicle License Plate Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. GJ-01-AB-1234"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono font-bold uppercase tracking-wider focus:outline-none focus:border-amber-400 text-xs"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      Auto-read by Boom Barrier ANPR cameras
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Attendee / Driver Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      WhatsApp / Mobile Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98251 00000"
                      value={driverPhone}
                      onChange={(e) => setDriverPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-amber-400 text-xs"
                    />
                  </div>
                </div>

                {/* Duration & Optional Add-ons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1.5">
                      Parking Duration Pass
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setTimeDuration('night-pass')}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          timeDuration === 'night-pass'
                            ? 'bg-amber-500/20 border-amber-400 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="font-bold text-xs block">Full Night Pass</span>
                        <span className="text-[10px] text-slate-400">7:30 PM - 4:30 AM</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTimeDuration('midnight-pass')}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          timeDuration === 'midnight-pass'
                            ? 'bg-amber-500/20 border-amber-400 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="font-bold text-xs block">Post-11 PM Shift</span>
                        <span className="text-[10px] text-slate-400">11:00 PM - 5:00 AM</span>
                      </button>
                    </div>
                  </div>

                  {/* Add-ons */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Festival Ground Add-ons
                    </label>

                    {vehicleType === '4-Wheeler' && selectedVenueLot.evChargingAvailable && (
                      <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={includeEVCharging}
                            onChange={(e) => setIncludeEVCharging(e.target.checked)}
                            className="rounded accent-amber-500"
                          />
                          <span className="text-xs text-slate-200">
                            Fast EV Charging Bay Plugin (30kW)
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-amber-300">+₹100</span>
                      </label>
                    )}

                    {vehicleType === '2-Wheeler' && (
                      <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={includeHelmetLocker}
                            onChange={(e) => setIncludeHelmetLocker(e.target.checked)}
                            className="rounded accent-amber-500"
                          />
                          <span className="text-xs text-slate-200">
                            Secure OTP Helmet Locker Box
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-amber-300">+₹20</span>
                      </label>
                    )}

                    <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Encrypted pass saved to offline vault. Scans without mobile data.</span>
                    </div>
                  </div>
                </div>

                {/* Price summary & CTA */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <span className="text-xs text-slate-400 block">Total Payable</span>
                    <span className="text-xl font-black text-amber-400 font-mono">
                      ₹{calculateTotal()}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-2">
                      {serviceType === 'Royal Valet' ? '(Includes Valet)' : '(Self-Parking Pass)'}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer transition-all active:scale-95"
                  >
                    {isProcessingPayment ? (
                      <>
                        <RefreshCw className="w-4 h-4 text-slate-950 animate-spin" />
                        <span>Processing Stripe Payment...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-slate-950" />
                        <span>Pay with Stripe & Confirm Pass</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* CONFIRMATION TICKET VIEW */}
          {confirmedReservation && (
            <div className="space-y-4 max-w-lg mx-auto py-2">
              <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/60 shadow-2xl relative overflow-hidden text-center space-y-4">
                
                {/* Holographic header */}
                <div className="flex items-center justify-between text-xs pb-3 border-b border-amber-500/30">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <Sparkles className="w-4 h-4" />
                    <span>AHMEDABAD TRAFFIC POLICE & AMC PASS</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                    {confirmedReservation.status}
                  </span>
                </div>

                {/* Big QR with scanner ring */}
                <div className="relative inline-block mx-auto p-4 rounded-2xl bg-white border-4 border-amber-500 shadow-2xl">
                  <QrCode className="w-36 h-36 text-slate-950" />
                  <div className="absolute inset-0 border-2 border-dashed border-amber-500/60 rounded-2xl pointer-events-none animate-pulse" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white">
                    {confirmedReservation.vehicleNumber}
                  </h3>
                  <p className="text-xs text-amber-300 font-bold">
                    {confirmedReservation.slotNumber} • {confirmedReservation.zoneName}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {confirmedReservation.venueName}
                  </p>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-2 text-left p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Service Type</span>
                    <span className="font-bold text-slate-200">{confirmedReservation.serviceType}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Valid Window</span>
                    <span className="font-bold text-slate-200">{confirmedReservation.entryTime} - {confirmedReservation.validUntil}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Driver / Holder</span>
                    <span className="font-bold text-slate-200">{confirmedReservation.driverName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Total Paid</span>
                    <span className="font-mono font-bold text-amber-400">₹{confirmedReservation.totalAmount}</span>
                  </div>
                  {confirmedReservation.valetKeyBay && (
                    <div className="col-span-2 pt-2 border-t border-slate-800 text-amber-300 font-bold">
                      🔑 Valet Key Claim: {confirmedReservation.valetKeyBay} (Token #{confirmedReservation.valetClaimToken})
                    </div>
                  )}
                  {paymentTxId && (
                    <div className="col-span-2 pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-sky-300">
                      <span className="text-slate-400">Payment Gateway:</span>
                      <span className="font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-700">
                        Stripe: {paymentTxId}
                      </span>
                    </div>
                  )}
                </div>

                {/* Instructions */}
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300 text-left flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>
                    Show this QR at the boom barrier scanner. Automated ANPR camera will match plate number {confirmedReservation.vehicleNumber}.
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      setConfirmedReservation(null);
                      setActiveTab('my-passes');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                  >
                    View in Active Passes
                  </button>
                  <button
                    onClick={() => {
                      setConfirmedReservation(null);
                      setActiveTab('reserve');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer"
                  >
                    Book Another Slot
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: ACTIVE RESERVATIONS & VALET RETRIEVAL */}
          {activeTab === 'my-passes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-amber-400" />
                  Your Active Parking & Valet Passes ({activeReservations.length})
                </h3>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Available Offline
                </span>
              </div>

              {activeReservations.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
                  <Car className="w-12 h-12 text-slate-600 mx-auto" />
                  <h4 className="font-bold text-slate-300">No Parking Reservations Yet</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Reserve a slot or book Royal Valet at GMDC Ground or Karnavati Club to avoid parking bottlenecks.
                  </p>
                  <button
                    onClick={() => setActiveTab('reserve')}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                  >
                    Reserve Now
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeReservations.map(res => {
                    const isValet = res.serviceType === 'Royal Valet';
                    return (
                      <div
                        key={res.id}
                        className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2.5 rounded-xl border ${
                              isValet 
                                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' 
                                : 'bg-sky-500/20 border-sky-500/40 text-sky-400'
                            }`}>
                              {isValet ? <Key className="w-5 h-5" /> : <Car className="w-5 h-5" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-sm text-white">
                                  {res.vehicleNumber}
                                </span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-amber-300">
                                  {res.slotNumber}
                                </span>
                              </div>
                              <p className="text-xs text-slate-300">
                                {res.venueName} • <span className="text-amber-200">{res.zoneName}</span>
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-mono font-extrabold text-amber-400 text-xs">
                              ₹{res.totalAmount}
                            </span>
                            <span className="block text-[10px] text-slate-500">{res.status}</span>
                          </div>
                        </div>

                        {/* Valet Car Retrieval Action */}
                        {isValet && (
                          <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/50 border border-amber-500/40 flex items-center justify-between gap-3 flex-wrap">
                            <div>
                              <div className="font-bold text-xs text-amber-200 flex items-center gap-1.5">
                                <Key className="w-3.5 h-3.5 text-amber-400" />
                                <span>Royal Valet Active ({res.valetKeyBay || 'Gate 1 Safe'})</span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                Leaving Garba arena? Tap below to summon your car to the valet pickup bay before you reach the gate.
                              </p>
                            </div>

                            <button
                              onClick={() => handleRequestRetrieval(res.id)}
                              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow-md transition-all active:scale-95"
                            >
                              Request Car Retrieval
                            </button>
                          </div>
                        )}

                        {/* Bottom barcode info */}
                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-900">
                          <span className="font-mono">PASS-ID: {res.id}</span>
                          <span>Entry: {res.entryTime} to {res.validUntil}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: OVERFLOW & FEEDER INFO */}
          {activeTab === 'overflow-info' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/60 border border-rose-500/40 space-y-2">
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Ahmedabad Municipal Corporation (AMC) Overflow Parking Protocol
                </h3>
                <p className="text-xs text-slate-300">
                  During peak Navratri nights (Day 5 to Day 9), vehicular traffic on SG Highway and Sindhu Bhavan Road exceeds 120,000 cars between 9:30 PM and 1:30 AM. When grounds reach 90% capacity, traffic is diverted to designated satellite yards with zero congestion.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {VENUE_PARKING_LOTS.filter(v => v.overflowLot).map(v => (
                  <div key={v.venueId} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white truncate">{v.venueName.split(' - ')[0]}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300">
                        {v.overflowLot?.distanceMeters}m away
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <p className="font-semibold text-amber-300">{v.overflowLot?.name}</p>
                      <p className="text-[11px] text-slate-400">{v.overflowLot?.address}</p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-emerald-300 p-2 rounded-xl bg-slate-900">
                      <span>⚡ Free AC Feeder Shuttle: Every {v.overflowLot?.shuttleFrequencyMinutes}m</span>
                      <span className="font-mono font-bold">₹{v.overflowLot?.rateInr} flat</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedVenueLot(v);
                        setUseOverflowLot(true);
                        setActiveTab('reserve');
                      }}
                      className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs cursor-pointer transition-colors"
                    >
                      Reserve at This Overflow Yard
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
