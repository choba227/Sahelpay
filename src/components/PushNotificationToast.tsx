import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, ArrowUpRight, ArrowDownLeft, ShieldCheck, X } from 'lucide-react';
import { PushNotification } from '../types';

interface PushNotificationToastProps {
  notification: PushNotification | null;
  onDismiss: () => void;
  onClick?: () => void;
}

export const PushNotificationToast: React.FC<PushNotificationToastProps> = ({
  notification,
  onDismiss,
  onClick,
}) => {
  if (!notification) return null;

  return (
    <AnimatePresence>
      <div className="fixed top-3 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
          className="pointer-events-auto max-w-sm w-full bg-gray-900/95 backdrop-blur-xl text-white rounded-3xl p-3.5 shadow-2xl border border-white/15 flex items-start gap-3 cursor-pointer select-none"
          onClick={onClick}
        >
          {/* Leading Icon */}
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/10">
            {notification.type === 'transfer' ? (
              notification.title.includes('Envoyé') || notification.title.includes('Envoie') ? (
                <ArrowUpRight className="w-5 h-5 text-orange-400" />
              ) : (
                <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
              )
            ) : notification.type === 'security' ? (
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            ) : (
              <Bell className="w-5 h-5 text-amber-400" />
            )}
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[11px] font-bold tracking-wider text-emerald-400 uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Sahel Pay Push
              </span>
              <span className="text-[10px] text-gray-400">À l'instant</span>
            </div>
            <h4 className="text-sm font-bold text-white truncate leading-tight">{notification.title}</h4>
            <p className="text-xs text-gray-300 leading-snug line-clamp-2 mt-0.5">{notification.body}</p>
          </div>

          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
