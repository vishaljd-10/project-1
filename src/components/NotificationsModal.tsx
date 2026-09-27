import React from 'react';
import { X, Bell, Check, Ticket, AlertTriangle, Sparkles, Navigation } from 'lucide-react';
import { PushNotification } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: PushNotification[];
  onMarkAllAsRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-base text-white">Live Push Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-4 overflow-y-auto space-y-3 text-xs flex-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 rounded-xl border transition-all ${
                n.read
                  ? 'bg-slate-950 border-slate-800 text-slate-300'
                  : 'bg-amber-950/20 border-amber-500/30 text-white shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                  {n.type === 'booking' && <Ticket className="w-3.5 h-3.5 text-purple-400" />}
                  {n.type === 'traffic' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                  {n.type === 'milestone' && <Sparkles className="w-3.5 h-3.5 text-rose-400" />}
                  {n.title}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{n.timestamp}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{n.message}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
