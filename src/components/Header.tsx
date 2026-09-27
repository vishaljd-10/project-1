import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldAlert, 
  Wifi, 
  WifiOff, 
  Moon, 
  Sun, 
  Bell, 
  Fingerprint, 
  Smartphone, 
  Languages, 
  Bot, 
  Camera, 
  RefreshCw, 
  Train, 
  Radio,
  Car
} from 'lucide-react';
import { Language, PushNotification } from '../types';
import { TRANSLATIONS } from '../services/localization';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  isOfflineMode: boolean;
  onToggleOfflineMode: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  onOpenSOS: () => void;
  onOpenVault: () => void;
  onOpenAIStudio: () => void;
  onOpenAIChat: () => void;
  notifications: PushNotification[];
  onOpenNotifications: () => void;
  pendingSyncCount: number;
  onSyncNow: () => void;
  onOpenTransit?: () => void;
  onOpenRadar?: () => void;
  onOpenParking?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  darkMode,
  onToggleDarkMode,
  isOfflineMode,
  onToggleOfflineMode,
  isMobileFrame,
  onToggleMobileFrame,
  onOpenSOS,
  onOpenVault,
  onOpenAIStudio,
  onOpenAIChat,
  notifications,
  onOpenNotifications,
  pendingSyncCount,
  onSyncNow,
  onOpenTransit,
  onOpenRadar,
  onOpenParking,
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const t = TRANSLATIONS[language];
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/85 border-b border-amber-500/20 text-white transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5">
        <div className="flex items-center justify-between gap-2">
          
          {/* Brand Logo & Amdavad Emblem */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-rose-600 to-purple-700 flex items-center justify-center shadow-lg shadow-amber-500/20 garba-glow border border-amber-300/30">
                <span className="text-xl">🪔</span>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-amber-300 via-rose-300 to-amber-100 bg-clip-text text-transparent truncate">
                  {t.appTitle}
                </h1>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 hidden xs:inline-block">
                  AMD 2026
                </span>
              </div>
              <p className="text-[11px] text-amber-200/70 truncate hidden sm:block">
                {t.tagline} • અમદાવાદ રાસોત્સવ
              </p>
            </div>
          </div>

          {/* Quick Action Badges & AI Triggers */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* AI Festive Studio Button */}
            <button
              onClick={onOpenAIStudio}
              title="AI Festive Studio (Gemini 3 Pro Image)"
              className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-500/20 border border-purple-400/30 transition-all active:scale-95 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">{t.aiStudioBtn}</span>
              <span className="md:hidden">AI Studio</span>
            </button>

            {/* RaasGuru AI Chatbot Button */}
            <button
              onClick={onOpenAIChat}
              title="Ask RaasGuru Navratri AI Concierge"
              className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-amber-600/20 border border-amber-400/30 transition-all active:scale-95 cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5 text-yellow-200" />
              <span className="hidden md:inline">{t.aiChatBtn}</span>
              <span className="md:hidden">AI Guru</span>
            </button>

            {/* Find My Circle Mesh Radar Button */}
            {onOpenRadar && (
              <button
                onClick={onOpenRadar}
                title="Find My Dandiya Circle (P2P Radar - Offline BLE)"
                className="px-2 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
              >
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="hidden xl:inline text-[11px]">Circle Radar</span>
              </button>
            )}

            {/* Night Transit & Metro Button */}
            {onOpenTransit && (
              <button
                onClick={onOpenTransit}
                title="GMRC Night Metro & Feeder Bus Tracker"
                className="px-2 py-1.5 rounded-lg bg-sky-950/70 hover:bg-sky-900/80 text-sky-300 border border-sky-500/40 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
              >
                <Train className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden xl:inline text-[11px]">Night Transit</span>
              </button>
            )}

            {/* Smart Parking & Valet Button */}
            {onOpenParking && (
              <button
                onClick={onOpenParking}
                title="Ground Parking & Royal Valet Reservations"
                className="px-2 py-1.5 rounded-lg bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
              >
                <Car className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden xl:inline text-[11px]">Valet & Park</span>
              </button>
            )}

            {/* Offline Network Simulator Switch */}
            <button
              onClick={onToggleOfflineMode}
              title={isOfflineMode ? t.offlineStatus : t.onlineStatus}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all cursor-pointer ${
                isOfflineMode
                  ? 'bg-rose-950/80 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {isOfflineMode ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden lg:inline text-[11px]">{t.offlineStatus}</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden lg:inline text-[11px]">{t.onlineStatus}</span>
                </>
              )}
            </button>

            {/* Offline Sync Queue indicator if pending */}
            {pendingSyncCount > 0 && (
              <button
                onClick={onSyncNow}
                title="Sync offline queue now"
                className="px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-1 hover:bg-amber-500/30 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
                <span className="text-[10px] font-bold">{pendingSyncCount} Sync</span>
              </button>
            )}

            {/* Biometric Encrypted Vault */}
            <button
              onClick={onOpenVault}
              title={t.biometricVault}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700/60 transition-all active:scale-95 cursor-pointer relative"
            >
              <Fingerprint className="w-4 h-4" />
            </button>

            {/* Emergency SOS Button */}
            <button
              onClick={onOpenSOS}
              title={t.emergencySOS}
              className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold border border-rose-400/50 shadow-md shadow-rose-600/30 transition-all active:scale-95 cursor-pointer flex items-center gap-1"
            >
              <ShieldAlert className="w-4 h-4 text-white animate-bounce" />
              <span className="text-xs font-black hidden xl:inline">SOS</span>
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="p-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/60 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Languages className="w-3.5 h-3.5 text-amber-400" />
                <span className="uppercase text-[11px]">{language}</span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-32 rounded-xl bg-slate-900/95 border border-amber-500/30 shadow-2xl p-1 z-50 text-xs backdrop-blur-xl">
                  <button
                    onClick={() => { onLanguageChange('en'); setShowLangMenu(false); }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                      language === 'en' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <span>English</span>
                    <span className="text-[10px] text-slate-400">EN</span>
                  </button>
                  <button
                    onClick={() => { onLanguageChange('gu'); setShowLangMenu(false); }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                      language === 'gu' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <span>ગુજરાતી</span>
                    <span className="text-[10px] text-slate-400">GU</span>
                  </button>
                  <button
                    onClick={() => { onLanguageChange('hi'); setShowLangMenu(false); }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                      language === 'hi' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <span>हिन्दी</span>
                    <span className="text-[10px] text-slate-400">HI</span>
                  </button>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/60 transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4 text-amber-300" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-black text-white flex items-center justify-center">
                  {unreadNotifs}
                </span>
              )}
            </button>

            {/* Mobile / Desktop frame viewport switcher */}
            <button
              onClick={onToggleMobileFrame}
              title={isMobileFrame ? 'Switch to Full Dashboard' : 'Preview in Mobile Device Shell'}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-all cursor-pointer hidden md:flex items-center gap-1"
            >
              <Smartphone className={`w-4 h-4 ${isMobileFrame ? 'text-amber-400' : 'text-slate-400'}`} />
            </button>

            {/* Dark Mode toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700/60 transition-all cursor-pointer"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
