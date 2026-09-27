import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Users, 
  Compass, 
  Battery, 
  WifiOff, 
  Share2, 
  Check, 
  QrCode, 
  Sparkles, 
  X, 
  MapPin, 
  Navigation2, 
  ShieldCheck,
  Vibrate,
  UserPlus
} from 'lucide-react';
import { FriendBeacon, RaasCircle, Language } from '../types';

interface CircleMeshRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  groundName?: string;
}

export const SAMPLE_FRIENDS: FriendBeacon[] = [
  {
    id: 'f-1',
    name: 'Pooja Bhatt',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    batteryPercent: 82,
    rssiSignalDbm: -56,
    estimatedDistanceMeters: 14,
    relativeBearingDegrees: 340,
    stageDirection: 'North Stage • Dodhiya Circle #2',
    lastSeenSecsAgo: 2,
    status: 'Dancing in Dodhiya Ring',
  },
  {
    id: 'f-2',
    name: 'Jignesh Shah',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    batteryPercent: 64,
    rssiSignalDbm: -68,
    estimatedDistanceMeters: 28,
    relativeBearingDegrees: 110,
    stageDirection: 'East Gate 3 • Chaas & Water Booth',
    lastSeenSecsAgo: 5,
    status: 'Water Booth',
  },
  {
    id: 'f-3',
    name: 'Aneri Patel',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    batteryPercent: 91,
    rssiSignalDbm: -78,
    estimatedDistanceMeters: 45,
    relativeBearingDegrees: 220,
    stageDirection: 'VIP Lounge Entry • Photobooth',
    lastSeenSecsAgo: 8,
    status: 'Food Court',
  },
  {
    id: 'f-4',
    name: 'Devansh Joshi',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    batteryPercent: 49,
    rssiSignalDbm: -85,
    estimatedDistanceMeters: 62,
    relativeBearingDegrees: 45,
    stageDirection: 'West Lawn • Dhol Stage Soundboard',
    lastSeenSecsAgo: 14,
    status: 'Dancing in Dodhiya Ring',
  },
];

export const CircleMeshRadarModal: React.FC<CircleMeshRadarModalProps> = ({
  isOpen,
  onClose,
  language,
  groundName = 'Karnavati Club Arena',
}) => {
  const [circleCode, setCircleCode] = useState('GARBA-779');
  const [friends, setFriends] = useState<FriendBeacon[]>(SAMPLE_FRIENDS);
  const [selectedFriend, setSelectedFriend] = useState<FriendBeacon>(SAMPLE_FRIENDS[0]);
  const [hapticSimulated, setHapticSimulated] = useState(false);
  const [isBeaconActive, setIsBeaconActive] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [compassHeading, setCompassHeading] = useState(15);
  const [newFriendName, setNewFriendName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Smooth RSSI jitter simulation (mimicking Kalman filtered RF fluctuations in dense crowds)
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setFriends((prev) =>
        prev.map((f) => {
          const deltaMeters = (Math.random() - 0.5) * 2;
          const newDist = Math.max(3, Math.min(90, Math.round(f.estimatedDistanceMeters + deltaMeters)));
          return {
            ...f,
            estimatedDistanceMeters: newDist,
            rssiSignalDbm: -Math.round(40 + newDist * 0.7),
            lastSeenSecsAgo: Math.floor(Math.random() * 4),
          };
        })
      );
      setCompassHeading((prev) => (prev + (Math.random() - 0.5) * 6) % 360);
    }, 2000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTriggerHaptic = () => {
    setHapticSimulated(true);
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
    setTimeout(() => setHapticSimulated(false), 1200);
  };

  const handleCopyCode = () => {
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendName.trim()) return;

    const newBeacon: FriendBeacon = {
      id: 'f-' + Date.now(),
      name: newFriendName.trim(),
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      batteryPercent: 88,
      rssiSignalDbm: -60,
      estimatedDistanceMeters: 18,
      relativeBearingDegrees: Math.floor(Math.random() * 360),
      stageDirection: 'Dodhiya Circle • Near Centre Garbi',
      lastSeenSecsAgo: 1,
      status: 'Dancing in Dodhiya Ring',
    };

    setFriends([newBeacon, ...friends]);
    setSelectedFriend(newBeacon);
    setNewFriendName('');
    setShowAddModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-amber-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Find My Dandiya Circle (P2P Mesh Radar)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  100% Offline BLE
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/80">
                Low-Power Bluetooth LE / UWB Locator • Locates friends inside {groundName} without cellular data
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
          
          {/* Top Bar: Circle Code & Network Status */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-medium">Your Circle Code:</span>
              <span className="font-mono font-black text-amber-300 text-sm tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-amber-500/30">
                {circleCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer flex items-center gap-1"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-amber-400" />}
                <span className="text-[10px]">{copiedCode ? 'Copied' : 'Share'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                <span>Zero Cellular Needed</span>
              </div>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 font-mono">{friends.length} Friends in Range</span>
            </div>
          </div>

          {/* Interactive Radar Screen Canvas */}
          <div className="relative rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-emerald-500/30 p-6 flex flex-col items-center justify-center min-h-[320px] overflow-hidden">
            
            {/* Concentric Radar Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 rounded-full border border-emerald-500/20"></div>
              <div className="w-48 h-48 rounded-full border border-emerald-500/25"></div>
              <div className="w-32 h-32 rounded-full border border-emerald-500/30"></div>
              <div className="w-16 h-16 rounded-full border border-emerald-500/40"></div>
              {/* Sweeping Radar beam */}
              <div className="absolute w-64 h-64 rounded-full border-r border-emerald-400/40 animate-spin opacity-40"></div>
            </div>

            {/* Compass Coordinates Overlay */}
            <div className="absolute top-3 left-4 text-[10px] font-mono text-emerald-400/80">
              HEADING: {Math.round(compassHeading)}° N
            </div>
            <div className="absolute top-3 right-4 text-[10px] font-mono text-slate-400">
              KALMAN FILTER: ACTIVE
            </div>

            {/* Center Beacon (YOU) */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center border-4 border-slate-950 shadow-xl shadow-amber-500/30 z-20">
                <span>YOU</span>
              </div>
              <span className="text-[10px] text-amber-300 font-bold mt-1 bg-slate-950/80 px-2 py-0.5 rounded-full border border-amber-500/30">
                Ground Center
              </span>
            </div>

            {/* Friend Blips Placed Around Radar by relative bearing and distance */}
            {friends.map((friend, idx) => {
              const rad = ((friend.relativeBearingDegrees - 90) * Math.PI) / 180;
              // Map distance (0-90m) to radius pixels (40 to 120px)
              const rPx = 40 + (friend.estimatedDistanceMeters / 90) * 80;
              const x = Math.cos(rad) * rPx;
              const y = Math.sin(rad) * rPx;
              const isSelected = selectedFriend.id === friend.id;

              return (
                <button
                  key={friend.id}
                  onClick={() => setSelectedFriend(friend)}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                  className={`absolute z-20 transition-all duration-700 cursor-pointer flex flex-col items-center group ${
                    isSelected ? 'scale-115' : 'hover:scale-110'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className={`w-9 h-9 rounded-full object-cover border-2 shadow-lg ${
                        isSelected
                          ? 'border-amber-400 ring-2 ring-emerald-400'
                          : 'border-emerald-400/80'
                      }`}
                    />
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border border-slate-950"></span>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded mt-0.5 whitespace-nowrap shadow-sm ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-slate-950/90 text-white border border-slate-800'
                    }`}
                  >
                    {friend.name.split(' ')[0]} ({friend.estimatedDistanceMeters}m)
                  </span>
                </button>
              );
            })}

          </div>

          {/* Selected Friend Proximity & Compass Guidance Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedFriend.avatar}
                  alt={selectedFriend.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-amber-400"
                />
                <div>
                  <h4 className="font-extrabold text-sm text-white">
                    {selectedFriend.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Battery className="w-3.5 h-3.5 text-emerald-400" />
                      {selectedFriend.batteryPercent}%
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 font-mono">
                      RSSI {selectedFriend.rssiSignalDbm} dBm
                    </span>
                  </div>
                </div>
              </div>

              {/* Big Distance & Direction Gauge */}
              <div className="text-right">
                <div className="flex items-center gap-1.5 justify-end">
                  <Navigation2
                    className="w-4 h-4 text-amber-400"
                    style={{ transform: `rotate(${selectedFriend.relativeBearingDegrees}deg)` }}
                  />
                  <span className="text-base sm:text-lg font-black text-amber-300 font-mono">
                    ~{selectedFriend.estimatedDistanceMeters} METERS
                  </span>
                </div>
                <span className="text-[10px] text-emerald-300 font-semibold block">
                  Heading {selectedFriend.relativeBearingDegrees}°
                </span>
              </div>
            </div>

            {/* Current Stage Landmark */}
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                <span>Last Detected At: <strong>{selectedFriend.stageDirection}</strong></span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {selectedFriend.lastSeenSecsAgo}s ago
              </span>
            </div>

            {/* Haptic Guidance Button (vibrate phone as you walk closer) */}
            <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
              <span className="text-[11px] text-slate-400">
                Audible & Haptic Beacon enables finding friends over loud dhol beats.
              </span>

              <button
                onClick={handleTriggerHaptic}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                  hapticSimulated
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 hover:bg-slate-750 text-amber-300 border-slate-700'
                }`}
              >
                <Vibrate className="w-3.5 h-3.5" />
                <span>{hapticSimulated ? 'Vibrating Compass...' : 'Trigger Proximity Pulse'}</span>
              </button>
            </div>
          </div>

          {/* Circle Members Quick Strip */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Circle Members Inside Ground ({friends.length}):
              </span>
              <button
                onClick={() => setShowAddModal(!showAddModal)}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" /> Add Friend
              </button>
            </div>

            {showAddModal && (
              <form onSubmit={handleAddFriend} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={newFriendName}
                  onChange={(e) => setNewFriendName(e.target.value)}
                  placeholder="Friend name or Raas beacon ID..."
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Join Radar
                </button>
              </form>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {friends.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFriend(f)}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    selectedFriend.id === f.id
                      ? 'bg-amber-500/20 border-amber-400 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold text-xs truncate text-white">{f.name}</div>
                  <div className="text-[10px] text-amber-300 font-mono mt-0.5">
                    {f.estimatedDistanceMeters}m away
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
