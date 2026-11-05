import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, CheckCheck, Trash2, ArrowUpRight, ArrowDownLeft, ShieldAlert, Sparkles } from 'lucide-react';
import { PushNotification } from '../types';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: PushNotification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onSelectNotification?: (notif: PushNotification) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
  onSelectNotification,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-white rounded-t-[36px] sm:rounded-[36px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-gray-100"
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Bell className="w-5 h-5 text-gray-800" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight">Notifications Push</h3>
                <p className="text-xs text-gray-500">
                  {unreadCount > 0 ? `${unreadCount} nouveau(x) mouvement(s)` : 'Historique à jour'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Bar */}
          {notifications.length > 0 && (
            <div className="px-6 py-2.5 bg-gray-50 flex items-center justify-between text-xs border-b border-gray-100">
              <button
                onClick={onMarkAllAsRead}
                className="flex items-center gap-1.5 font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Tout marquer lu
              </button>
              <button
                onClick={onClearAll}
                className="flex items-center gap-1.5 font-semibold text-gray-500 hover:text-rose-600 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Effacer l'historique
              </button>
            </div>
          )}

          {/* List of Notifications */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-gray-400 flex flex-col items-center">
                <Bell className="w-12 h-12 stroke-[1.2] mb-2 text-gray-300" />
                <p className="text-sm font-semibold text-gray-600">Aucune notification</p>
                <p className="text-xs text-gray-400 mt-1 max-w-[220px]">
                  Chaque mouvement de compte (transfert, recharge, alerte de sécurité) apparaîtra ici en temps réel.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => onSelectNotification && onSelectNotification(notif)}
                  className={`pt-2.5 first:pt-0 p-3 rounded-2xl transition-all cursor-pointer flex items-start gap-3 ${
                    notif.read ? 'bg-transparent hover:bg-gray-50' : 'bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100/60'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    notif.type === 'transfer' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {notif.type === 'transfer' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : notif.type === 'security' ? (
                      <ShieldAlert className="w-4 h-4" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="text-xs font-bold text-gray-900 truncate">{notif.title}</h4>
                      <span className="text-[10px] text-gray-400">{notif.timeAgo}</span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{notif.body}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
