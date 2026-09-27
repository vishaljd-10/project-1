import React, { useState } from 'react';
import { 
  Ticket, 
  QrCode, 
  ShieldCheck, 
  Download, 
  Share2, 
  Calendar, 
  MapPin, 
  Fingerprint, 
  Sparkles,
  Car,
  Key,
  CheckCircle2
} from 'lucide-react';
import { GarbaPass, ParkingReservation, Language } from '../types';

interface PassesViewProps {
  passes: GarbaPass[];
  parkingReservations?: ParkingReservation[];
  onOpenVault: () => void;
  onOpenParkingModal?: () => void;
  onRequestValetRetrieval?: (id: string) => void;
  language: Language;
}

export const PassesView: React.FC<PassesViewProps> = ({ 
  passes, 
  parkingReservations = [], 
  onOpenVault, 
  onOpenParkingModal,
  onRequestValetRetrieval 
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'garba' | 'parking'>('all');
  const [retrievalNotice, setRetrievalNotice] = useState<string | null>(null);

  const handleRetrieval = (id: string) => {
    if (onRequestValetRetrieval) {
      onRequestValetRetrieval(id);
      setRetrievalNotice('Valet runner dispatched! Your vehicle will be brought to Gate 1 Valet Bay in ~6 mins.');
      setTimeout(() => setRetrievalNotice(null), 7000);
    }
  };

  const showGarba = activeFilter === 'all' || activeFilter === 'garba';
  const showParking = activeFilter === 'all' || activeFilter === 'parking';

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 max-w-2xl mx-auto">
      
      {/* Offline Vault Security Notice */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-amber-950/60 border border-emerald-500/30 flex items-center justify-between gap-3 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>End-to-End Encrypted & Cached Offline</span>
          </div>
          <p className="text-xs text-slate-300">
            Event & Parking passes work without cellular network at packed Ahmedabad grounds.
          </p>
        </div>

        <button
          onClick={onOpenVault}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <Fingerprint className="w-4 h-4" />
          <span>Biometric Vault</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeFilter === 'all' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Passes ({passes.length + parkingReservations.length})
          </button>
          <button
            onClick={() => setActiveFilter('garba')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeFilter === 'garba' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Garba Passes ({passes.length})
          </button>
          <button
            onClick={() => setActiveFilter('parking')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeFilter === 'parking' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Parking & Valet ({parkingReservations.length})
          </button>
        </div>

        {onOpenParkingModal && (
          <button
            onClick={onOpenParkingModal}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Car className="w-3.5 h-3.5 text-amber-400" />
            <span>Book Parking</span>
          </button>
        )}
      </div>

      {/* Valet dispatch notice */}
      {retrievalNotice && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 flex items-center gap-2.5 animate-bounce text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{retrievalNotice}</span>
        </div>
      )}

      {/* Passes List */}
      {passes.length === 0 && parkingReservations.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-bold text-base text-slate-200">No Passes Booked Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Book passes for GMDC Ground, Karnavati Club, or Rajpath Club to view holographic entry barcodes here.
          </p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-5">

          {/* Parking Passes */}
          {showParking && parkingReservations.map((res) => {
            const isValet = res.serviceType === 'Royal Valet';
            return (
              <div
                key={res.id}
                className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-sky-500/40 p-4 sm:p-5 shadow-2xl relative overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-sky-500/20 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{isValet ? '👑' : '🅿️'}</span>
                    <span className="font-extrabold text-sky-300 tracking-wider">
                      {isValet ? 'ROYAL VALET PASS & KEY TAG' : 'SMART BOOM BARRIER PARKING TOKEN'}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {res.status}
                  </span>
                </div>

                {/* Central Pass Body */}
                <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  
                  {/* QR Section */}
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white text-slate-950 shadow-lg border border-sky-400/40">
                    <QrCode className="w-28 h-28" />
                    <span className="font-mono text-[9px] text-slate-600 mt-1 font-bold">
                      {res.id}
                    </span>
                    <span className="text-[8px] text-slate-400 uppercase tracking-widest mt-0.5">
                      ANPR Scanner Ready
                    </span>
                  </div>

                  {/* Details Section */}
                  <div className="sm:col-span-2 space-y-2.5 text-xs">
                    <div>
                      <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider block">
                        Venue & Parking Bay
                      </span>
                      <h3 className="font-black text-sm sm:text-base text-white">
                        {res.venueName}
                      </h3>
                      <p className="text-amber-300 font-bold text-xs mt-0.5">
                        {res.slotNumber} • {res.zoneName}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-slate-300">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Vehicle Reg.</span>
                        <span className="font-mono font-bold text-white">{res.vehicleNumber}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Service Type</span>
                        <span className="font-bold text-white">{res.serviceType}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Driver / Holder</span>
                        <span className="font-bold text-white">{res.driverName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Valid Window</span>
                        <span className="font-bold text-white">{res.entryTime} - {res.validUntil}</span>
                      </div>
                    </div>

                    {isValet && (
                      <div className="pt-1">
                        <button
                          onClick={() => handleRetrieval(res.id)}
                          className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <Key className="w-3.5 h-3.5" />
                          <span>Request Car Retrieval at Gate 1</span>
                        </button>
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-[11px]">
                      <span className="text-slate-400">Total Paid:</span>
                      <span className="font-extrabold text-amber-300 text-sm">₹{res.totalAmount}</span>
                    </div>
                  </div>

                </div>

                {/* Bottom Holographic Seal */}
                <div className="pt-3 border-t border-sky-500/20 flex items-center justify-between text-[10px] text-slate-400 flex-wrap gap-2">
                  <span className="font-mono">
                    Token: {res.valetClaimToken || res.id}
                  </span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Offline Verified Boom Barrier Access
                  </span>
                </div>

              </div>
            );
          })}

          {/* Garba Passes */}
          {showGarba && passes.map((pass) => (
            <div
              key={pass.id}
              className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/40 p-4 sm:p-5 shadow-2xl relative overflow-hidden garba-glow"
            >
              {/* Holographic Watermark Header */}
              <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">🪔</span>
                  <span className="font-extrabold text-amber-300 tracking-wider">
                    GUJARAT TOURISM • AHMEDABAD NAVRATRI 2026
                  </span>
                </div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {pass.status}
                </span>
              </div>

              {/* Central Pass Body */}
              <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                
                {/* QR Section */}
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white text-slate-950 shadow-lg border border-amber-400/40">
                  <QrCode className="w-28 h-28" />
                  <span className="font-mono text-[9px] text-slate-600 mt-1 font-bold">
                    {pass.id}
                  </span>
                  <span className="text-[8px] text-slate-400 uppercase tracking-widest mt-0.5">
                    Gate 2 Scanner Ready
                  </span>
                </div>

                {/* Details Section */}
                <div className="sm:col-span-2 space-y-2.5 text-xs">
                  <div>
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                      Ground / Venue
                    </span>
                    <h3 className="font-black text-sm sm:text-base text-white">
                      {pass.venueName}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Festive Night</span>
                      <span className="font-bold text-amber-200">{pass.date}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Pass Category</span>
                      <span className="font-bold text-white">{pass.tier}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Attendee Name</span>
                      <span className="font-bold text-white">{pass.attendeeName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Dancers</span>
                      <span className="font-bold text-white">{pass.quantity} Person(s)</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-[11px]">
                    <span className="text-slate-400">Total Paid:</span>
                    <span className="font-extrabold text-amber-300 text-sm">₹{pass.totalAmount}</span>
                  </div>
                </div>

              </div>

              {/* Bottom Holographic Seal */}
              <div className="pt-3 border-t border-amber-500/20 flex items-center justify-between text-[10px] text-slate-400 flex-wrap gap-2">
                <span className="font-mono truncate max-w-[240px]">
                  Encrypted Hash: {pass.encryptedHash}
                </span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Anti-Screenshot Dynamic Security
                </span>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
