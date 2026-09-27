/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Utensils, 
  Ticket, 
  Camera, 
  MapPin, 
  BarChart3, 
  ShieldAlert, 
  HelpCircle, 
  Sparkles, 
  WifiOff, 
  Wifi, 
  CheckCircle,
  Smartphone,
  Bot
} from 'lucide-react';
import { 
  GarbaVenue, 
  Restaurant, 
  GarbaPass, 
  DineoutBooking, 
  SocialPost, 
  PushNotification, 
  Language,
  ParkingReservation 
} from './types';
import { 
  AHMEDABAD_GARBA_VENUES, 
  AHMEDABAD_RESTAURANTS, 
  INITIAL_SOCIAL_FEED, 
  INITIAL_NOTIFICATIONS 
} from './data/mockData';
import { TRANSLATIONS } from './services/localization';
import { 
  getCachedPasses, 
  saveCachedPass, 
  getCachedReservations, 
  saveCachedReservation, 
  getCachedParkingReservations,
  saveCachedParkingReservation,
  updateParkingReservationStatus,
  getSyncQueue, 
  flushSyncQueue, 
  addToSyncQueue 
} from './services/offlineSync';
import { Header } from './components/Header';
import { GarbaVenuesView } from './components/GarbaVenuesView';
import { DineoutView } from './components/DineoutView';
import { NavigationMapView } from './components/NavigationMapView';
import { PassesView } from './components/PassesView';
import { SocialFeedView } from './components/SocialFeedView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AIFestiveStudioModal } from './components/AIFestiveStudioModal';
import { AIChatbotModal } from './components/AIChatbotModal';
import { OfflineVaultModal } from './components/OfflineVaultModal';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { NotificationsModal } from './components/NotificationsModal';
import { CustomerSupportModal } from './components/CustomerSupportModal';
import { NightTransitTrackerModal } from './components/NightTransitTrackerModal';
import { CircleMeshRadarModal } from './components/CircleMeshRadarModal';
import { ParkingValetModal } from './components/ParkingValetModal';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [darkMode, setDarkMode] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [activeTab, setActiveTab] = useState<'venues' | 'dineout' | 'nav' | 'passes' | 'feed' | 'admin'>('venues');

  // Modals state
  const [showAIStudio, setShowAIStudio] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [showSOS, setShowSOS] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showTransit, setShowTransit] = useState(false);
  const [showRadar, setShowRadar] = useState(false);
  const [showParkingModal, setShowParkingModal] = useState(false);
  const [activeVenueForModal, setActiveVenueForModal] = useState<string>('GMDC Ground Vibrant Navratri');

  // App dataset state
  const [venues, setVenues] = useState<GarbaVenue[]>(AHMEDABAD_GARBA_VENUES);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(AHMEDABAD_RESTAURANTS);
  const [passes, setPasses] = useState<GarbaPass[]>(getCachedPasses());
  const [reservations, setReservations] = useState<DineoutBooking[]>(getCachedReservations());
  const [parkingReservations, setParkingReservations] = useState<ParkingReservation[]>(getCachedParkingReservations());
  const [socialFeed, setSocialFeed] = useState<SocialPost[]>(INITIAL_SOCIAL_FEED);
  const [notifications, setNotifications] = useState<PushNotification[]>(INITIAL_NOTIFICATIONS);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [navTarget, setNavTarget] = useState<GarbaVenue | Restaurant | null>(null);

  // Toast alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = TRANSLATIONS[language];

  // Check sync queue length
  useEffect(() => {
    const queue = getSyncQueue();
    setPendingSyncCount(queue.filter((a) => a.status === 'PENDING').length);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleBookPass = (pass: GarbaPass) => {
    saveCachedPass(pass);
    setPasses([pass, ...passes]);

    // If in offline mode, add to sync queue
    if (isOfflineMode) {
      addToSyncQueue({
        type: 'PASS_BOOKING',
        payload: pass,
        timestamp: new Date().toISOString(),
      });
      setPendingSyncCount((prev) => prev + 1);
      triggerToast('Pass encrypted & saved locally in Biometric Vault! (Will sync when online)');
    } else {
      triggerToast(`Pass confirmed for ${pass.venueName}! QR ready.`);
    }

    // Add push notification
    const notif: PushNotification = {
      id: 'notif-pass-' + Date.now(),
      title: 'Pass Issued: ' + pass.venueName,
      message: `${pass.tier} pass for ${pass.quantity} person(s) is ready with dynamic anti-screenshot barcode.`,
      type: 'booking',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications([notif, ...notifications]);
  };

  const handleBookTable = (booking: DineoutBooking) => {
    saveCachedReservation(booking);
    setReservations([booking, ...reservations]);

    if (isOfflineMode) {
      addToSyncQueue({
        type: 'DINEOUT_RESERVATION',
        payload: booking,
        timestamp: new Date().toISOString(),
      });
      setPendingSyncCount((prev) => prev + 1);
      triggerToast('Table reservation token saved offline! (Queued for sync)');
    } else {
      triggerToast(`Table reserved at ${booking.restaurantName} for ${booking.timeSlot}!`);
    }

    const notif: PushNotification = {
      id: 'notif-dine-' + Date.now(),
      title: 'Table Reserved: ' + booking.restaurantName,
      message: `Table for ${booking.guests} dancers confirmed for ${booking.timeSlot} midnight slot. Token: ${booking.id}.`,
      type: 'booking',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications([notif, ...notifications]);
  };

  const handleReserveParking = (res: ParkingReservation) => {
    saveCachedParkingReservation(res);
    setParkingReservations([res, ...parkingReservations]);

    if (isOfflineMode) {
      addToSyncQueue({
        type: 'PARKING_RESERVATION',
        payload: res,
        timestamp: new Date().toISOString(),
      });
      setPendingSyncCount((prev) => prev + 1);
      triggerToast('Parking pass encrypted & saved locally in Biometric Vault! (Will sync when online)');
    } else {
      triggerToast(`Reserved ${res.slotNumber} for ${res.vehicleNumber} at ${res.venueName}!`);
    }

    const notif: PushNotification = {
      id: 'notif-park-' + Date.now(),
      title: '🅿️ Parking Confirmed: ' + res.venueName,
      message: `${res.serviceType} token for ${res.vehicleNumber} (${res.slotNumber}) active. Boom barrier QR ready.`,
      type: 'booking',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications([notif, ...notifications]);
  };

  const handleRequestValetRetrieval = (resId: string) => {
    updateParkingReservationStatus(resId, 'Retrieval_Requested');
    setParkingReservations(prev => 
      prev.map(r => r.id === resId ? { ...r, status: 'Retrieval_Requested' as const } : r)
    );
    triggerToast('Valet retrieval dispatched! Vehicle arriving at Gate 1 VIP Bay in ~6 mins.');

    const notif: PushNotification = {
      id: 'notif-valet-' + Date.now(),
      title: '👑 Royal Valet Retrieval Active',
      message: 'Valet runner dispatched. Your car will be parked at Gate 1 VIP Drop Bay in approx. 6 minutes.',
      type: 'booking',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications([notif, ...notifications]);
  };

  const handleAddSocialPost = (post: SocialPost) => {
    setSocialFeed([post, ...socialFeed]);
    triggerToast('Shared to RaasGram Live Feed!');
  };

  const handleBroadcastNotification = (notif: PushNotification) => {
    setNotifications([notif, ...notifications]);
    triggerToast(`Broadcast sent: "${notif.title}"`);
  };

  const handleSyncNow = () => {
    const synced = flushSyncQueue();
    setPendingSyncCount(0);
    triggerToast(`Offline sync complete! ${synced} record(s) synchronized with Ahmedabad servers.`);
  };

  const handleNavigateToVenue = (venue: GarbaVenue) => {
    setNavTarget(venue);
    setActiveTab('nav');
  };

  const handleNavigateToResto = (resto: Restaurant) => {
    setNavTarget(resto);
    setActiveTab('nav');
  };

  const contentComponent = (
    <div className="space-y-4">
      {/* Offline Mode Alert Banner if active */}
      {isOfflineMode && (
        <div className="p-3 rounded-2xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between gap-2 shadow-lg animate-pulse">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>
              <strong>Simulated Offline Mode Active:</strong> Low cellular network simulated. Passes & maps remain accessible from local encrypted vault.
            </span>
          </div>
          <button
            onClick={() => setIsOfflineMode(false)}
            className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] cursor-pointer whitespace-nowrap"
          >
            Go Online
          </button>
        </div>
      )}

      {/* Main Tabs */}
      {activeTab === 'venues' && (
        <GarbaVenuesView
          venues={venues}
          language={language}
          onBookPass={handleBookPass}
          onNavigateToVenue={handleNavigateToVenue}
          onOpenTransitTracker={(venue) => {
            setActiveVenueForModal(venue.name);
            setShowTransit(true);
          }}
          onOpenCircleRadar={(venue) => {
            setActiveVenueForModal(venue.name);
            setShowRadar(true);
          }}
          onOpenParkingModal={(venue) => {
            setActiveVenueForModal(venue.name);
            setShowParkingModal(true);
          }}
        />
      )}

      {activeTab === 'dineout' && (
        <DineoutView
          restaurants={restaurants}
          language={language}
          onBookTable={handleBookTable}
          onNavigateToResto={handleNavigateToResto}
        />
      )}

      {activeTab === 'nav' && (
        <NavigationMapView
          venues={venues}
          restaurants={restaurants}
          selectedTarget={navTarget}
          onSelectTarget={(target) => setNavTarget(target)}
          language={language}
          onOpenParkingModal={(venue) => {
            setActiveVenueForModal(venue.name);
            setShowParkingModal(true);
          }}
        />
      )}

      {activeTab === 'passes' && (
        <PassesView
          passes={passes}
          parkingReservations={parkingReservations}
          onOpenVault={() => setShowVault(true)}
          onOpenParkingModal={() => setShowParkingModal(true)}
          onRequestValetRetrieval={handleRequestValetRetrieval}
          language={language}
        />
      )}

      {activeTab === 'feed' && (
        <SocialFeedView
          posts={socialFeed}
          onAddPost={handleAddSocialPost}
          onOpenAIStudio={() => setShowAIStudio(true)}
        />
      )}

      {activeTab === 'admin' && (
        <AdminDashboardView
          venues={venues}
          onBroadcastNotification={handleBroadcastNotification}
        />
      )}
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-900 text-slate-100'}`}>
      
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-2xl flex items-center gap-2 border border-amber-300 animate-bounce">
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Frame Simulation Container vs Responsive Dashboard */}
      {isMobileFrame ? (
        /* Sleek Smartphone Simulator Shell */
        <div className="min-h-screen flex items-center justify-center p-2 sm:p-6 bg-slate-950">
          <div className="relative w-full max-w-[420px] h-[92vh] max-h-[880px] bg-slate-900 rounded-[44px] border-[10px] border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
            
            {/* Phone Top Notch / Dynamic Island */}
            <div className="pt-2 px-6 pb-1 bg-slate-950 flex items-center justify-between text-[11px] text-slate-400 select-none border-b border-slate-800/60 z-50">
              <span className="font-bold text-slate-200">10:45 PM</span>
              <div className="w-24 h-4 rounded-full bg-slate-900 mx-auto flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-slate-800"></span>
              </div>
              <div className="flex items-center gap-1">
                <span>5G AMD</span>
                <div className="w-5 h-2.5 rounded-sm border border-slate-400 p-0.5 flex items-center">
                  <div className="h-full w-full bg-emerald-400 rounded-2xs"></div>
                </div>
              </div>
            </div>

            {/* Inner Header */}
            <Header
              language={language}
              onLanguageChange={setLanguage}
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode(!darkMode)}
              isOfflineMode={isOfflineMode}
              onToggleOfflineMode={() => setIsOfflineMode(!isOfflineMode)}
              isMobileFrame={isMobileFrame}
              onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
              onOpenSOS={() => setShowSOS(true)}
              onOpenVault={() => setShowVault(true)}
              onOpenAIStudio={() => setShowAIStudio(true)}
              onOpenAIChat={() => setShowAIChat(true)}
              notifications={notifications}
              onOpenNotifications={() => setShowNotifications(true)}
              pendingSyncCount={pendingSyncCount}
              onSyncNow={handleSyncNow}
              onOpenTransit={() => setShowTransit(true)}
              onOpenRadar={() => setShowRadar(true)}
              onOpenParking={() => setShowParkingModal(true)}
            />

            {/* Scrollable Viewport */}
            <main className="flex-1 overflow-y-auto p-3.5 space-y-4">
              {contentComponent}
            </main>

            {/* Mobile Bottom Navigation Bar */}
            <nav className="border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-2 py-2 flex items-center justify-around z-40">
              {[
                { id: 'venues', label: 'Garba', icon: Compass },
                { id: 'dineout', label: 'Dineout', icon: Utensils },
                { id: 'nav', label: 'GPS', icon: MapPin },
                { id: 'passes', label: 'Passes', icon: Ticket },
                { id: 'feed', label: 'Live Vibe', icon: Camera },
                { id: 'admin', label: 'Admin', icon: BarChart3 },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      active ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px]">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Phone Home Swipe Bar */}
            <div className="py-1 bg-slate-950 flex justify-center">
              <div className="w-28 h-1 rounded-full bg-slate-700"></div>
            </div>

          </div>
        </div>
      ) : (
        /* Full Desktop / Responsive Tablet & Mobile Mode */
        <div className="min-h-screen flex flex-col">
          <Header
            language={language}
            onLanguageChange={setLanguage}
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
            isOfflineMode={isOfflineMode}
            onToggleOfflineMode={() => setIsOfflineMode(!isOfflineMode)}
            isMobileFrame={isMobileFrame}
            onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
            onOpenSOS={() => setShowSOS(true)}
            onOpenVault={() => setShowVault(true)}
            onOpenAIStudio={() => setShowAIStudio(true)}
            onOpenAIChat={() => setShowAIChat(true)}
            notifications={notifications}
            onOpenNotifications={() => setShowNotifications(true)}
            pendingSyncCount={pendingSyncCount}
            onSyncNow={handleSyncNow}
            onOpenTransit={() => setShowTransit(true)}
            onOpenRadar={() => setShowRadar(true)}
            onOpenParking={() => setShowParkingModal(true)}
          />

          {/* Navigation Bar Pills */}
          <div className="bg-slate-900/80 border-b border-slate-800/80 sticky top-[53px] z-30 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2">
              <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
                
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {[
                    { id: 'venues', label: t.venuesTab, icon: Compass },
                    { id: 'dineout', label: t.dineoutTab, icon: Utensils },
                    { id: 'nav', label: t.navMapTab, icon: MapPin },
                    { id: 'passes', label: t.passesTab, icon: Ticket },
                    { id: 'feed', label: t.liveFeedTab, icon: Camera },
                    { id: 'admin', label: t.adminTab, icon: BarChart3 },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                          active
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                            : 'bg-slate-800/70 text-slate-300 border-slate-700/60 hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Right quick help desk */}
                <button
                  onClick={() => setShowSupport(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 border border-slate-700 whitespace-nowrap cursor-pointer transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Help & FAQs</span>
                </button>

              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6">
            {contentComponent}
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-800 bg-slate-950/90 py-6 text-center text-xs text-slate-400">
            <div className="max-w-7xl mx-auto px-4 space-y-2">
              <div className="flex items-center justify-center gap-2 text-amber-300 font-bold">
                <span>🪔</span>
                <span>Ahmedabad Navratri Mahotsav 2026</span>
                <span>🪔</span>
              </div>
              <p className="text-[11px] text-slate-400">
                End-to-End Encrypted Pass Verification • Ahmedabad Police SHE-Team Integrated • Offline Sync Engine
              </p>
              <p className="text-[10px] text-slate-400">
                Built with Gemini AI 3 Series & Modern Full-Stack Architecture
              </p>
            </div>
          </footer>
        </div>
      )}

      {/* Floating Action Buttons (AIChat & AIStudio on Mobile) */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2.5">
        <button
          onClick={() => setShowAIChat(true)}
          title="Ask RaasGuru AI"
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-bold flex items-center justify-center shadow-xl shadow-amber-500/30 border-2 border-amber-300 transition-all hover:scale-110 active:scale-95 cursor-pointer garba-glow"
        >
          <Bot className="w-6 h-6" />
        </button>
      </div>

      {/* Modals */}
      <AIFestiveStudioModal
        isOpen={showAIStudio}
        onClose={() => setShowAIStudio(false)}
        onShareToFeed={handleAddSocialPost}
      />

      <AIChatbotModal
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
      />

      <OfflineVaultModal
        isOpen={showVault}
        onClose={() => setShowVault(false)}
        onSyncComplete={handleSyncNow}
      />

      <EmergencySOSModal
        isOpen={showSOS}
        onClose={() => setShowSOS(false)}
        venues={venues}
      />

      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onMarkAllAsRead={() =>
          setNotifications(notifications.map((n) => ({ ...n, read: true })))
        }
      />

      <CustomerSupportModal
        isOpen={showSupport}
        onClose={() => setShowSupport(false)}
        language={language}
      />

      <NightTransitTrackerModal
        isOpen={showTransit}
        onClose={() => setShowTransit(false)}
        language={language}
        venueName={activeVenueForModal}
      />

      <CircleMeshRadarModal
        isOpen={showRadar}
        onClose={() => setShowRadar(false)}
        language={language}
        groundName={activeVenueForModal}
      />

      <ParkingValetModal
        isOpen={showParkingModal}
        onClose={() => setShowParkingModal(false)}
        language={language}
        initialVenueName={activeVenueForModal}
        venues={venues}
        activeReservations={parkingReservations}
        onReserveSlot={handleReserveParking}
        onRequestValetRetrieval={handleRequestValetRetrieval}
      />

    </div>
  );
}
