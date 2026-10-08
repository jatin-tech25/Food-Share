import React from 'react';
import { Notification } from '../types';
import { Bell, CheckCheck, Clock, ExternalLink, X, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onNavigate: (path: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onNavigate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-2xs transition-opacity">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-[#D6E4DC] flex items-center justify-between bg-[#F5F9F6]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#EDF9F1] flex items-center justify-center text-[#168052]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-[#183B2C]">Notifications</h2>
              <p className="text-[11px] text-[#61766D]">Live platform activity & updates</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {notifications.some((n) => !n.isRead) && (
              <button
                onClick={onMarkAllRead}
                className="text-xs text-[#168052] hover:text-[#075C3C] font-semibold flex items-center gap-1 px-2 py-1 rounded-md hover:bg-white"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mark read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-[#D6E4DC]/60">
          {notifications.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-[#EDF9F1] text-[#168052] flex items-center justify-center mx-auto mb-3">
                <Bell className="w-6 h-6 opacity-40" />
              </div>
              <p className="text-sm font-semibold text-[#183B2C]">No notifications yet</p>
              <p className="text-xs text-[#61766D] mt-1">
                You'll receive alerts when requests, pickups, or deliveries are made.
              </p>
            </div>
          ) : (
            notifications.map((notif) => {
              const date = new Date(notif.createdAt);
              const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (!notif.isRead) onMarkRead(notif.id);
                    if (notif.linkUrl) {
                      onNavigate(notif.linkUrl);
                      onClose();
                    }
                  }}
                  className={`py-3.5 px-3 rounded-xl transition-all cursor-pointer flex gap-3 ${
                    notif.isRead
                      ? 'bg-transparent opacity-80 hover:bg-slate-50'
                      : 'bg-[#EDF9F1]/60 hover:bg-[#EDF9F1] font-medium'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {notif.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : notif.type === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    ) : (
                      <Info className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <p className="text-xs font-bold text-[#183B2C]">{notif.title}</p>
                      <span className="text-[10px] text-[#61766D] flex items-center gap-0.5 shrink-0">
                        <Clock className="w-2.5 h-2.5" /> {formattedTime}
                      </span>
                    </div>
                    <p className="text-xs text-[#61766D] leading-relaxed mb-2">{notif.message}</p>
                    {notif.linkUrl && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#168052] hover:underline">
                        View Details <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#F5F9F6] border-t border-[#D6E4DC] text-center text-[11px] text-[#61766D]">
          Notifications persist in local database storage
        </div>
      </div>
    </div>
  );
};
