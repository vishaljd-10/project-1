import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Ticket, 
  Utensils, 
  ShieldAlert, 
  Download, 
  Send, 
  Activity, 
  Server, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  Bell,
  Car,
  Key,
  Radio
} from 'lucide-react';
import { GarbaVenue, PushNotification } from '../types';
import { VENUE_PARKING_LOTS } from '../data/parkingData';

interface AdminDashboardViewProps {
  venues: GarbaVenue[];
  onBroadcastNotification: (notif: PushNotification) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  venues,
  onBroadcastNotification,
}) => {
  const [stats, setStats] = useState({
    totalVisitors: 284920,
    activeDancersLive: 142680,
    passesBooked: 38450,
    diningReservations: 12890,
    sosAlertsResolved: 14,
    networkSyncRate: '99.8%',
    serverLatencyMs: 42,
    lastBackupTimestamp: new Date().toLocaleTimeString(),
  });

  const [broadcastTitle, setBroadcastTitle] = useState('Ahmedabad Metro Navratri Special Extended');
  const [broadcastMessage, setBroadcastMessage] = useState('Ahmedabad Metro services extended till 4:30 AM tonight between Thaltej, Old City, and Vastral Gam for Garba attendees.');
  const [broadcastType, setBroadcastType] = useState<'milestone' | 'traffic' | 'alert'>('traffic');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Poll system stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/system/stats');
        if (res.ok) {
          const data = await res.json();
          setStats((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        // Keep simulated fallbacks
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;

    const notif: PushNotification = {
      id: 'admin-broadcast-' + Date.now(),
      title: broadcastTitle.trim(),
      message: broadcastMessage.trim(),
      type: broadcastType as any,
      timestamp: 'Just now',
      read: false,
    };

    onBroadcastNotification(notif);
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 2000);
  };

  const handleExportCSV = () => {
    const headers = 'Venue ID,Venue Name,Zone,Capacity,Current Footfall %,Rating,Parking Spots,SHE-Team Booth\n';
    const rows = venues
      .map(
        (v) =>
          `"${v.id}","${v.name}","${v.zone}",${Math.round(v.parkingSpots * 8)},${v.crowdPercent}%,${v.rating},${v.parkingSpots},${v.sheTeamBoothNearby ? 'YES' : 'NO'}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `navratri-ahmedabad-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-5 pb-20 max-w-4xl mx-auto">
      
      {/* Admin Title Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h2 className="font-extrabold text-base sm:text-lg text-white">
              Ahmedabad Navratri Stakeholder Command Center
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Real-time crowd tracking, ticket pass transactions, and police SHE-team monitors.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span>Export Analytics (CSV)</span>
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Live Dancers</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
            {stats.activeDancersLive.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">
            ↑ 18% vs yesterday peak
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Passes Issued</span>
            <Ticket className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            {stats.passesBooked.toLocaleString()}
          </div>
          <span className="text-[10px] text-purple-300 font-medium">
            ₹3.84 Cr gross revenue
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Dining Reserved</span>
            <Utensils className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            {stats.diningReservations.toLocaleString()}
          </div>
          <span className="text-[10px] text-sky-300 font-medium">
            Manek Chowk & SBR hubs
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Police SHE Alerts</span>
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
            {stats.sosAlertsResolved} Resolved
          </div>
          <span className="text-[10px] text-emerald-300 font-medium">
            Zero critical incidents
          </span>
        </div>

      </div>

      {/* Real-time Venue Crowd Meter Bar Chart */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-amber-400" /> Venue-by-Venue Real-Time Crowd Density
          </h3>
          <span className="text-xs text-slate-400">Live GPS & Gate Turnstile Telemetry</span>
        </div>

        <div className="space-y-3">
          {venues.map((v) => (
            <div key={v.id} className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="font-semibold text-white">{v.name}</span>
                <span className="font-mono font-bold text-amber-300">{v.crowdPercent}% Capacity</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-950 overflow-hidden flex">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    v.crowdPercent >= 90
                      ? 'bg-rose-500'
                      : v.crowdPercent >= 75
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                  }`}
                  style={{ width: `${v.crowdPercent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Parking Lot Capacity & Overflow Management Console */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-1.5">
              <Car className="w-4 h-4 text-amber-400" />
              Ahmedabad Traffic Police & AMC Parking Control Console
            </h3>
            <p className="text-xs text-slate-400">
              Live 2-wheeler, 4-wheeler occupancy telemetry & overflow diversion feeder yards
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            ANPR Boom Barriers Synced
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {VENUE_PARKING_LOTS.map((lot) => {
            const occ4W = lot.totalSpots4W > 0 ? Math.round((lot.occupiedSpots4W / lot.totalSpots4W) * 100) : 0;
            const occ2W = Math.round((lot.occupiedSpots2W / lot.totalSpots2W) * 100);
            const isOverflow = lot.isOverflowTriggered;

            return (
              <div
                key={lot.venueId}
                className={`p-3.5 rounded-xl border text-xs space-y-2.5 transition-all ${
                  isOverflow 
                    ? 'bg-rose-950/20 border-rose-500/50' 
                    : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="font-bold text-white truncate text-xs">{lot.venueName.split(' - ')[0]}</span>
                  {isOverflow ? (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-500 text-white shrink-0 animate-pulse">
                      OVERFLOW
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                      Normal
                    </span>
                  )}
                </div>

                {/* 4W Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Car className="w-3 h-3 text-sky-400" /> 4-Wheeler
                    </span>
                    <span className="font-mono text-slate-200">
                      {lot.totalSpots4W > 0 ? `${lot.occupiedSpots4W}/${lot.totalSpots4W} (${occ4W}%)` : 'Restricted (2W Only)'}
                    </span>
                  </div>
                  {lot.totalSpots4W > 0 && (
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${occ4W >= 90 ? 'bg-rose-500' : 'bg-sky-400'}`}
                        style={{ width: `${occ4W}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* 2W Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Radio className="w-3 h-3 text-emerald-400" /> 2-Wheeler
                    </span>
                    <span className="font-mono text-slate-200">
                      {lot.occupiedSpots2W}/{lot.totalSpots2W} ({occ2W}%)
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-400"
                      style={{ width: `${occ2W}%` }}
                    />
                  </div>
                </div>

                {/* Overflow Lot status if triggered */}
                {lot.overflowLot && (
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[10px] space-y-1">
                    <div className="text-amber-300 font-semibold truncate">
                      ↳ Feeder Yard: {lot.overflowLot.name.split(' (')[0]}
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Shuttle: {lot.overflowLot.shuttleFrequencyMinutes}m</span>
                      <span>Avail: {lot.overflowLot.availableSlots4W} 4W</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* System Health & Automated Push Notification Broadcaster */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* System & Encryption Status */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
            <Server className="w-4 h-4 text-sky-400" /> Infrastructure & Encryption Health
          </h3>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">End-to-End Encryption:</span>
              <span className="text-emerald-400 font-bold">AES-256-GCM Active</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Offline Sync Protocol:</span>
              <span className="text-emerald-400 font-bold">PWA Cache Storage v2</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Sync Delivery Reliability:</span>
              <span className="font-mono text-white">{stats.networkSyncRate}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Server Edge Latency:</span>
              <span className="font-mono text-amber-300">{stats.serverLatencyMs} ms</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Automated Cloud Backup:</span>
              <span className="font-mono text-slate-300">{stats.lastBackupTimestamp}</span>
            </div>
          </div>
        </div>

        {/* Milestone Push Notification Broadcaster */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-amber-400" /> Automated Milestone Push Engine
            </h3>
            {broadcastSuccess && (
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Dispatched!
              </span>
            )}
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-2 text-xs">
            <div>
              <label className="text-slate-400 block mb-0.5">Notification Title</label>
              <input
                type="text"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-0.5">Message Content</label>
              <textarea
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                rows={2}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex gap-1.5">
                {(['traffic', 'milestone', 'alert'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setBroadcastType(t)}
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold cursor-pointer ${
                      broadcastType === t
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
              >
                <Send className="w-3 h-3" /> Broadcast
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
};
