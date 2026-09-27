import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Phone, 
  ChevronDown, 
  ChevronUp,
  Headphones
} from 'lucide-react';
import { Language } from '../types';

interface CustomerSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const CustomerSupportModal: React.FC<CustomerSupportModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [ticketSubject, setTicketSubject] = useState('Pass entry query for Karnavati Club');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSent, setTicketSent] = useState(false);

  if (!isOpen) return null;

  const FAQS = [
    {
      q: 'How does GMRC Night Metro and the 2:00 AM last train extension operate?',
      a: 'During Navratri, GMRC extends Metro Phase-1 lines (Thaltej Gam ↔ Vastral Gam and APMC ↔ Motera) until 2:00 AM. Electric AMTS/BRTS feeder shuttles run every 5-7 minutes connecting stations to SG Highway & SBR party plots. You can generate fast QR transit tokens directly inside this app to bypass station ticket queues.',
    },
    {
      q: 'How does "Find My Circle" radar locate friends without cellular network?',
      a: 'Inside crowded 30,000+ attendee grounds like Karnavati or GMDC, mobile towers get jammed. Our P2P Mesh Radar uses low-power Bluetooth Low Energy (BLE) advertisements and on-device Kalman filtering to measure distance in meters and directional compass bearing with zero cellular data required.',
    },
    {
      q: 'Can I show the Garba pass on my mobile phone offline?',
      a: 'Yes! All digital passes issued by this app feature cryptographic holographic validation and are cached locally in your Biometric Vault. Security turnstiles scan your QR without needing cellular signal.',
    },
    {
      q: 'What is the mandatory dress code for Ahmedabad Garba grounds?',
      a: 'Strict traditional attire is required at all major venues. Women: Chaniya Choli (traditional embroidery or mirror work). Men: Traditional Kedia & Dhoti or Kurta with Paghdi. Western clothing (jeans/t-shirts) is not permitted inside the dance ring.',
    },
    {
      q: 'What happens if a restaurant table is delayed post-garba?',
      a: 'Tables booked through this app are held for 15 minutes past the chosen midnight slot. Most venues like Gwalia and Manek Chowk prioritize app tokens with expedited line access.',
    },
    {
      q: 'How does the Ahmedabad Police SHE-Team assist female attendees?',
      a: 'Trained female police officers are stationed at dedicated booths near all entry gates, armed with direct radio links, phone charging stations, first aid kits, and safe cab escorts.',
    },
  ];

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMessage.trim()) return;
    setTicketSent(true);
    setTimeout(() => {
      setTicketSent(false);
      setTicketMessage('');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                Ahmedabad Navratri Help Desk
              </h3>
              <p className="text-[11px] text-slate-400">
                24/7 Attendee Support & Localized Helpline
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

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          
          {/* Quick Helpline banner */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Official Festival Helpline
              </span>
              <div className="font-mono font-bold text-amber-300 text-sm">
                +91 79 2658 0000 / 1800 200 3000
              </div>
            </div>
            <a
              href="tel:18002003000"
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5" /> Call
            </a>
          </div>

          {/* FAQs */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Frequently Asked Questions:
            </h4>
            <div className="space-y-1.5">
              {FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-slate-950 border border-slate-800/80 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-2.5 text-left font-semibold text-xs text-slate-200 flex items-center justify-between cursor-pointer hover:text-amber-300"
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? (
                      <ChevronUp className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === idx && (
                    <div className="p-2.5 pt-0 text-[11px] text-slate-400 leading-relaxed border-t border-slate-900">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Support Ticket */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Submit Live Support Inquiry:
            </h4>

            {ticketSent ? (
              <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Ticket registered! Amdavad help desk response within 5 minutes.</span>
              </div>
            ) : (
              <form onSubmit={handleSendTicket} className="space-y-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Topic</label>
                  <select
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                  >
                    <option>Pass entry query for Karnavati Club</option>
                    <option>Late night restaurant table modification</option>
                    <option>Lost & Found item report (GMDC / Rajpath)</option>
                    <option>Parking assistance / Shuttle routes</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Describe your issue</label>
                  <textarea
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    rows={2}
                    placeholder="Provide pass ID or table token..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-all"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Ticket
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
