import React, { useState } from 'react';
import { 
  Utensils, 
  Clock, 
  MapPin, 
  Star, 
  Phone, 
  CheckCircle2, 
  Calendar, 
  Users, 
  Sparkles, 
  Flame,
  Search
} from 'lucide-react';
import { Restaurant, DineoutBooking, Language } from '../types';
import { TRANSLATIONS } from '../services/localization';

interface DineoutViewProps {
  restaurants: Restaurant[];
  language: Language;
  onBookTable: (booking: DineoutBooking) => void;
  onNavigateToResto: (resto: Restaurant) => void;
}

export const DineoutView: React.FC<DineoutViewProps> = ({
  restaurants,
  language,
  onBookTable,
  onNavigateToResto,
}) => {
  const t = TRANSLATIONS[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResto, setSelectedResto] = useState<Restaurant | null>(null);
  const [guestCount, setGuestCount] = useState(4);
  const [selectedSlot, setSelectedSlot] = useState('1:30 AM (Post-Garba)');
  const [guestName, setGuestName] = useState('Aarav Mehta');
  const [guestPhone, setGuestPhone] = useState('+91 98251 44556');
  const [specialRequest, setSpecialRequest] = useState('Hot Jalebi Rabdi ready on arrival, outdoor seating');
  const [justConfirmedBooking, setJustConfirmedBooking] = useState<DineoutBooking | null>(null);

  const filteredRestos = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.signatureDishes.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleConfirmReservation = () => {
    if (!selectedResto) return;

    const bookingId = 'DINE-AMD-' + Math.floor(1000 + Math.random() * 9000);
    const newBooking: DineoutBooking = {
      id: bookingId,
      restaurantId: selectedResto.id,
      restaurantName: selectedResto.name,
      date: 'Tonight (Post-Garba Midnight)',
      timeSlot: selectedSlot,
      guests: guestCount,
      customerName: guestName || 'Navratri Foodie',
      customerPhone: guestPhone || '+91 98000 00000',
      specialRequest,
      bookedAt: new Date().toLocaleString(),
      status: 'Confirmed',
    };

    onBookTable(newBooking);
    setJustConfirmedBooking(newBooking);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-20">
      
      {/* Late Night Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-rose-950/70 border border-amber-500/30 flex items-center justify-between gap-3 shadow-lg">
        <div className="space-y-1">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Ahmedabad Midnight Culture (11 PM - 5 AM)
          </span>
          <h2 className="font-extrabold text-base sm:text-lg text-white">
            {t.postGarbaSnacks}
          </h2>
          <p className="text-xs text-slate-300">
            Direct table reservations & walk-in availability at Manek Chowk, SBR, and Law Garden.
          </p>
        </div>
        <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-400/30 items-center justify-center text-3xl">
          🍲
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search midnight Gwalior Dosa, Jalebi Fafda, Thali, or SBR cafes..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-all"
        />
      </div>

      {/* Restaurant List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {filteredRestos.map((resto) => (
          <div
            key={resto.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl overflow-hidden shadow-xl transition-all duration-200 flex flex-col justify-between"
          >
            {/* Header Image */}
            <div className="relative h-40 overflow-hidden bg-slate-950">
              <img
                src={resto.image}
                alt={resto.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>

              {/* Status Badges */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" /> Open till {resto.openTill}
                </span>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
                  {resto.crowdStatus}
                </span>
              </div>

              {/* Bottom Title on Image */}
              <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between">
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white drop-shadow">
                    {language === 'gu' ? resto.gujaratiName : resto.name}
                  </h3>
                  <span className="text-[11px] text-amber-300 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {resto.rating} ({resto.reviewsCount}+ midnight reviews)
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-200 bg-slate-950/70 px-2 py-0.5 rounded-lg border border-slate-700">
                  {resto.distanceKm} km away
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-3.5 sm:p-4 space-y-3 flex-1 flex flex-col justify-between">
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                  <span className="truncate">{resto.address}</span>
                </div>

                <div className="text-slate-300">
                  <span className="text-amber-400 font-medium">Cuisine: </span>
                  <span>{resto.cuisine}</span>
                </div>

                {/* Signature Dishes Tags */}
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1 font-semibold uppercase tracking-wider">
                    Signature Midnight Bites:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {resto.signatureDishes.map((dish, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-200 border border-amber-500/20 text-[10px] font-medium"
                      >
                        {dish}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer with Cost and Booking CTA */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block">Avg. for Two</span>
                  <span className="text-sm font-extrabold text-amber-300">₹{resto.priceForTwo}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigateToResto(resto)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 transition-colors cursor-pointer"
                    title="Get Directions"
                  >
                    <MapPin className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedResto(resto);
                      setJustConfirmedBooking(null);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                  >
                    <Utensils className="w-3.5 h-3.5" />
                    <span>{t.reserveTable}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Table Reservation Modal */}
      {selectedResto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-800 bg-gradient-to-r from-amber-950/80 to-slate-900 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-amber-400" /> Reserve Midnight Table
                </h3>
                <p className="text-xs text-amber-200/80 truncate">
                  {selectedResto.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedResto(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
              {justConfirmedBooking ? (
                /* Confirmed Voucher */
                <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3.5 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>

                  <div>
                    <h4 className="font-bold text-base text-white">Table Reserved Successfully!</h4>
                    <p className="text-xs text-slate-400">
                      Show your reservation ID upon arrival. Table held for 15 minutes.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-left space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Token ID:</span>
                      <span className="font-bold text-amber-300">{justConfirmedBooking.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Restaurant:</span>
                      <span className="font-bold text-white">{justConfirmedBooking.restaurantName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Time Slot:</span>
                      <span className="font-bold text-amber-300">{justConfirmedBooking.timeSlot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Party Size:</span>
                      <span className="font-bold text-white">{justConfirmedBooking.guests} Guests</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Name:</span>
                      <span className="font-bold text-white">{justConfirmedBooking.customerName}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedResto(null);
                      setJustConfirmedBooking(null);
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                /* Form */
                <>
                  {/* Midnight Slots */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1.5 block">
                      Select Midnight Arrival Time Slot:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {selectedResto.tableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            selectedSlot === slot
                              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                              : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-850'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Number of Guests */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-xs font-medium text-slate-300">Party Size (Dancers):</span>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                        className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold flex items-center justify-center hover:bg-slate-700"
                      >
                        -
                      </button>
                      <span className="font-bold text-sm text-amber-300 min-w-[20px] text-center">
                        {guestCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => setGuestCount(Math.min(16, guestCount + 1))}
                        className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold flex items-center justify-center hover:bg-slate-700"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Contact info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Reservation Name
                      </label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Mobile Number (For Table SMS)
                      </label>
                      <input
                        type="text"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100"
                      />
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Festival Food Preference / Special Notes:
                    </label>
                    <input
                      type="text"
                      value={specialRequest}
                      onChange={(e) => setSpecialRequest(e.target.value)}
                      placeholder="e.g. Navratri Upvas/Fasting meal, Jain preparation, Outdoor seating..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleConfirmReservation}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95 transition-all mt-2"
                  >
                    Confirm Table Reservation
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
