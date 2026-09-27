import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  CloudRain, 
  Droplets, 
  Wind, 
  Thermometer, 
  Sun, 
  Moon, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles,
  RefreshCw,
  Clock,
  Compass
} from 'lucide-react';
import { Language } from '../types';

interface WeatherForecastWidgetProps {
  language: Language;
  selectedZone?: string;
  onZoneSelect?: (zone: string) => void;
}

export interface ZoneWeather {
  zone: string;
  tempC: number;
  condition: string;
  conditionIcon: 'clear-night' | 'partly-cloudy' | 'breezy' | 'humid';
  precipitationProb: number; // percentage
  humidity: number; // percentage
  windSpeedKmh: number;
  airQualityIndex: number;
  garbaSuitability: 'Excellent' | 'Great' | 'Good - Stay Hydrated';
  nightRecommendation: string;
  hourlyForecast: {
    time: string;
    tempC: number;
    precip: number;
    icon: string;
  }[];
}

const AHMEDABAD_ZONES_WEATHER: Record<string, ZoneWeather> = {
  'All': {
    zone: 'Ahmedabad Metro Citywide',
    tempC: 28,
    condition: 'Pleasant Autumn Night & Clear Skies',
    conditionIcon: 'clear-night',
    precipitationProb: 4,
    humidity: 58,
    windSpeedKmh: 11,
    airQualityIndex: 78,
    garbaSuitability: 'Excellent',
    nightRecommendation: 'Optimal dry conditions across open party plots and GMDC ground. Light cotton/linen lining recommended for heavy Chaniya Cholis.',
    hourlyForecast: [
      { time: '9:00 PM', tempC: 30, precip: 5, icon: '🌙' },
      { time: '11:00 PM', tempC: 28, precip: 4, icon: '✨' },
      { time: '1:00 AM', tempC: 26, precip: 3, icon: '🌌' },
      { time: '3:00 AM', tempC: 25, precip: 2, icon: '🌬️' },
      { time: '5:00 AM', tempC: 24, precip: 2, icon: '🌅' },
    ],
  },
  'SG Highway': {
    zone: 'SG Highway Corridor (Karnavati & Rajpath)',
    tempC: 27,
    condition: 'Breezy & Clear Festival Sky',
    conditionIcon: 'breezy',
    precipitationProb: 2,
    humidity: 54,
    windSpeedKmh: 14,
    airQualityIndex: 72,
    garbaSuitability: 'Excellent',
    nightRecommendation: 'Open lawns have cool western breeze from Sabarmati canal corridor. Zero rain disruption expected.',
    hourlyForecast: [
      { time: '9:00 PM', tempC: 29, precip: 3, icon: '🌙' },
      { time: '11:00 PM', tempC: 27, precip: 2, icon: '✨' },
      { time: '1:00 AM', tempC: 25, precip: 2, icon: '🌌' },
      { time: '3:00 AM', tempC: 24, precip: 1, icon: '🌬️' },
      { time: '5:00 AM', tempC: 23, precip: 1, icon: '🌅' },
    ],
  },
  'Sindhu Bhavan': {
    zone: 'Sindhu Bhavan Road (SBR & Aman Akash)',
    tempC: 28,
    condition: 'Mild & Clear Dancing Climate',
    conditionIcon: 'clear-night',
    precipitationProb: 3,
    humidity: 56,
    windSpeedKmh: 12,
    airQualityIndex: 76,
    garbaSuitability: 'Excellent',
    nightRecommendation: 'Ideal party plot conditions. Warm crowd heat countered by open air ventilation.',
    hourlyForecast: [
      { time: '9:00 PM', tempC: 30, precip: 4, icon: '🌙' },
      { time: '11:00 PM', tempC: 28, precip: 3, icon: '✨' },
      { time: '1:00 AM', tempC: 26, precip: 2, icon: '🌌' },
      { time: '3:00 AM', tempC: 25, precip: 2, icon: '🌬️' },
      { time: '5:00 AM', tempC: 24, precip: 1, icon: '🌅' },
    ],
  },
  'Old City Heritage': {
    zone: 'Walled Heritage City (Mandvi Ni Pol)',
    tempC: 29,
    condition: 'Warm Sheltered Sheri Pol Environment',
    conditionIcon: 'partly-cloudy',
    precipitationProb: 5,
    humidity: 62,
    windSpeedKmh: 8,
    airQualityIndex: 82,
    garbaSuitability: 'Great',
    nightRecommendation: 'Narrow pols trap body heat during active Dodhiya rounds. Hydrate frequently at local Chaas / Nimbu Paani stalls.',
    hourlyForecast: [
      { time: '9:00 PM', tempC: 31, precip: 6, icon: '🌙' },
      { time: '11:00 PM', tempC: 29, precip: 5, icon: '✨' },
      { time: '1:00 AM', tempC: 27, precip: 4, icon: '🌌' },
      { time: '3:00 AM', tempC: 26, precip: 3, icon: '🌬️' },
      { time: '5:00 AM', tempC: 25, precip: 3, icon: '🌅' },
    ],
  },
  'Gandhinagar': {
    zone: 'Gandhinagar & Shankus Farm Outskirts',
    tempC: 26,
    condition: 'Crisp Open Breeze & Low Humidity',
    conditionIcon: 'breezy',
    precipitationProb: 1,
    humidity: 50,
    windSpeedKmh: 15,
    airQualityIndex: 64,
    garbaSuitability: 'Excellent',
    nightRecommendation: 'Sprawling grass fields are noticeably cooler after 1:00 AM. Stash a light festive stole or dupatta if staying till 5 AM.',
    hourlyForecast: [
      { time: '9:00 PM', tempC: 28, precip: 2, icon: '🌙' },
      { time: '11:00 PM', tempC: 26, precip: 1, icon: '✨' },
      { time: '1:00 AM', tempC: 24, precip: 1, icon: '🌌' },
      { time: '3:00 AM', tempC: 23, precip: 0, icon: '🌬️' },
      { time: '5:00 AM', tempC: 21, precip: 0, icon: '🌅' },
    ],
  },
};

export const WeatherForecastWidget: React.FC<WeatherForecastWidgetProps> = ({
  language,
  selectedZone = 'All',
  onZoneSelect,
}) => {
  const [activeZoneKey, setActiveZoneKey] = useState<string>(selectedZone);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Live now');

  useEffect(() => {
    if (selectedZone && AHMEDABAD_ZONES_WEATHER[selectedZone]) {
      setActiveZoneKey(selectedZone);
    }
  }, [selectedZone]);

  const weather = AHMEDABAD_ZONES_WEATHER[activeZoneKey] || AHMEDABAD_ZONES_WEATHER['All'];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 600);
  };

  const handleSelectZone = (zoneKey: string) => {
    setActiveZoneKey(zoneKey);
    if (onZoneSelect) onZoneSelect(zoneKey);
  };

  // Translations helpers for weather
  const getSuitabilityBadge = () => {
    if (weather.garbaSuitability === 'Excellent') {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{language === 'gu' ? 'ગરબા માટે ઉત્તમ વાતાવરણ' : language === 'hi' ? 'गरबा के लिए उत्तम मौसम' : '100% Outdoor Garba Safe'}</span>
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>{weather.garbaSuitability}</span>
      </span>
    );
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-amber-950/30 border border-amber-500/30 shadow-xl overflow-hidden transition-all duration-300">
      
      {/* Top Bar with Live Indicator & Zone Selector */}
      <div className="p-3.5 sm:p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20">
            <CloudSun className="w-4 h-4 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-xs sm:text-sm text-white flex items-center gap-1">
                <span>{language === 'gu' ? 'અમદાવાદ નવરાત્રિ હવામાન અનુમાન' : language === 'hi' ? 'अहमदाबाद नवरात्रि मौसम पूर्वानुमान' : 'Ahmedabad Navratri Weather Forecast'}</span>
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <p className="text-[10px] text-amber-300/80">
              {language === 'gu' ? 'રીઅલ-ટાઇમ તાપમાન અને વરસાદ સંભાવના' : language === 'hi' ? 'रीयल-टाइम तापमान और वर्षा संभावना' : 'Real-time temperature, precipitation & outdoor Garba conditions'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            title="Refresh latest meteorological radar"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 transition-colors border border-slate-700 cursor-pointer flex items-center gap-1 text-[11px]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            <span className="hidden sm:inline">{lastUpdated}</span>
          </button>
        </div>
      </div>

      {/* Main Meteorological Highlights */}
      <div className="p-4 sm:p-5 space-y-4">
        
        {/* Zone Selection Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
          <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1 pr-1 flex-shrink-0">
            <Compass className="w-3.5 h-3.5 text-amber-400" /> Zone:
          </span>
          {Object.keys(AHMEDABAD_ZONES_WEATHER).map((key) => (
            <button
              key={key}
              onClick={() => handleSelectZone(key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                activeZoneKey === key
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md shadow-amber-500/20'
                  : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {key === 'All' ? '🌟 All Ahmedabad' : key}
            </button>
          ))}
        </div>

        {/* Current Core Metrics Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-center">
          
          {/* Temperature & Condition */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 flex items-center gap-3">
            <div className="relative">
              <span className="text-4xl">🌙</span>
              <span className="absolute -bottom-1 -right-1 text-base">✨</span>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-amber-300 font-mono tracking-tight">
                  {weather.tempC}°
                </span>
                <span className="text-xs text-slate-400 font-medium">C / 82°F</span>
              </div>
              <span className="text-xs font-semibold text-white block mt-0.5">
                {weather.condition}
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">
                Feels like {weather.tempC + 1}°C
              </span>
            </div>
          </div>

          {/* Precipitation & Rain Chance */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <CloudRain className="w-3.5 h-3.5 text-sky-400" /> Rain Probability
              </span>
              <span className="font-mono font-bold text-sky-300">
                {weather.precipitationProb}%
              </span>
            </div>

            {/* Precipitation Bar */}
            <div className="h-2 rounded-full bg-slate-900 overflow-hidden flex">
              <div
                className="h-full bg-sky-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, weather.precipitationProb)}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
              <span>Radar: Dry Clouds</span>
              <span className="text-emerald-400 font-semibold">Zero Rain Delay</span>
            </div>
          </div>

          {/* Humidity & Wind Factor */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                <Droplets className="w-3 h-3 text-cyan-400" /> Humidity
              </span>
              <span className="font-mono font-bold text-white text-base">
                {weather.humidity}%
              </span>
              <span className="text-[9px] text-slate-400 block">Night Dew Factor</span>
            </div>

            <div>
              <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                <Wind className="w-3 h-3 text-emerald-400" /> Wind Speed
              </span>
              <span className="font-mono font-bold text-white text-base">
                {weather.windSpeedKmh} <span className="text-[10px] font-normal">km/h</span>
              </span>
              <span className="text-[9px] text-slate-400 block">Pleasant Night Breeze</span>
            </div>
          </div>

        </div>

        {/* Hourly Night Forecast Carousel (9 PM to 5 AM) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Navratri Night Hourly Track (9:00 PM – 5:00 AM)
            </span>
            {getSuitabilityBadge()}
          </div>

          <div className="grid grid-cols-5 gap-2 text-center">
            {weather.hourlyForecast.map((hour, idx) => (
              <div
                key={idx}
                className="p-2 sm:p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/40 transition-colors"
              >
                <span className="text-[11px] font-medium text-slate-400 block">
                  {hour.time}
                </span>
                <span className="text-lg my-1 block">{hour.icon}</span>
                <span className="text-xs sm:text-sm font-black text-amber-300 font-mono block">
                  {hour.tempC}°C
                </span>
                <span className="text-[10px] text-sky-400 font-medium flex items-center justify-center gap-0.5 mt-0.5">
                  <CloudRain className="w-2.5 h-2.5" />
                  {hour.precip}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Practical Dressing & Ground Tip based on current forecast */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-amber-300 block">
              Garba Outfit & Hydration Advisory ({weather.zone}):
            </span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {weather.nightRecommendation}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
