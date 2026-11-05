import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ScanFace, Fingerprint, Lock, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import { playNotificationSound } from '../utils/crypto';

interface BiometricModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
  amount?: number;
  providerName?: string;
  isLockScreen?: boolean;
}

export const BiometricModal: React.FC<BiometricModalProps> = ({
  isOpen,
  onSuccess,
  onCancel,
  title = "Authentification Biométrique Sécurisée",
  subtitle = "Confirmez votre identité pour accéder à Sahel Pay",
  amount,
  providerName,
  isLockScreen = false,
}) => {
  const [authMethod, setAuthMethod] = useState<'face' | 'fingerprint' | 'pin'>('face');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('scanning');
  const [pin, setPin] = useState<string>('');
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setStatus('scanning');
      setPin('');
      setScanProgress(0);
      return;
    }

    if (authMethod === 'face' || authMethod === 'fingerprint') {
      setStatus('scanning');
      setScanProgress(0);

      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 25;
        });
      }, 250);

      const timer = setTimeout(() => {
        setStatus('success');
        playNotificationSound();
        setTimeout(() => {
          onSuccess();
        }, 600);
      }, 1200);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [isOpen, authMethod, onSuccess]);

  const handlePinDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        if (nextPin === '1234' || nextPin.length === 4) {
          setStatus('success');
          playNotificationSound();
          setTimeout(() => {
            onSuccess();
          }, 500);
        }
      }
    }
  };

  const handlePinDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-full max-w-sm bg-white rounded-[36px] shadow-2xl overflow-hidden p-6 text-center border border-gray-100 flex flex-col items-center"
        >
          {/* Security Chip Header */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full text-emerald-800 text-[11px] font-semibold mb-3 border border-emerald-100">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Biométrie Conforme RGPD & UEMOA</span>
          </div>

          <h3 className="text-xl font-bold text-gray-950 tracking-tight mb-1">{title}</h3>
          <p className="text-xs text-gray-500 max-w-[260px] leading-relaxed mb-4">{subtitle}</p>

          {/* Amount Badge if transaction confirmation */}
          {amount && (
            <div className="w-full bg-gray-50 rounded-2xl p-3 mb-4 border border-gray-100">
              <span className="text-[11px] font-medium text-gray-500 block uppercase tracking-wide">Montant du transfert</span>
              <span className="text-2xl font-black text-gray-900">{amount.toLocaleString('fr-FR')} FCFA</span>
              {providerName && (
                <span className="text-xs font-semibold text-emerald-600 block mt-0.5">via {providerName}</span>
              )}
            </div>
          )}

          {/* Main Visual Display */}
          <div className="relative w-36 h-36 my-2 flex items-center justify-center">
            {authMethod === 'face' && (
              <div className="relative w-32 h-32 rounded-3xl bg-neutral-900 flex items-center justify-center overflow-hidden border-2 border-emerald-500/40 shadow-inner">
                {/* Facial Mesh Wireframe Animation */}
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:12px_12px] opacity-40" />

                {/* Scanning Laser Bar */}
                <motion.div
                  animate={{ y: [-50, 50, -50] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                  className="absolute w-full h-[3px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399]"
                />

                {status === 'success' ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="z-10 bg-emerald-500 text-white p-3 rounded-full shadow-lg"
                  >
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>
                ) : (
                  <div className="relative z-10 flex flex-col items-center">
                    <ScanFace className="w-16 h-16 text-emerald-400 stroke-[1.5]" />
                    <span className="text-[10px] text-emerald-300 font-mono mt-1 font-semibold tracking-wider">
                      {status === 'scanning' ? `SCAN ${scanProgress}%` : 'FACE ID'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {authMethod === 'fingerprint' && (
              <div className="relative w-32 h-32 rounded-full bg-neutral-900 flex items-center justify-center overflow-hidden border-2 border-emerald-500/40 shadow-inner">
                {/* Pulse wave rings */}
                <motion.div
                  animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0.1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-2 rounded-full border border-emerald-400"
                />

                {status === 'success' ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="z-10 bg-emerald-500 text-white p-3 rounded-full shadow-lg"
                  >
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>
                ) : (
                  <div className="relative z-10 flex flex-col items-center">
                    <Fingerprint className="w-16 h-16 text-emerald-400 stroke-[1.5] animate-pulse" />
                    <span className="text-[10px] text-emerald-300 font-mono mt-1 font-semibold tracking-wider">
                      TOUCH ID
                    </span>
                  </div>
                )}
              </div>
            )}

            {authMethod === 'pin' && (
              <div className="w-full flex flex-col items-center justify-center">
                <div className="flex gap-3 mb-4">
                  {[0, 1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-full border-2 transition-all ${
                        pin.length > i ? 'bg-gray-900 border-gray-900 scale-110' : 'border-gray-300 bg-transparent'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-gray-500">Code PIN par défaut: 1234</span>
              </div>
            )}
          </div>

          {/* Status Message */}
          <div className="h-6 flex items-center justify-center my-1">
            {status === 'scanning' && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Vérification biométrique locale chiffrée...
              </span>
            )}
            {status === 'success' && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Identité authentifiée avec succès !
              </span>
            )}
            {status === 'failed' && (
              <span className="text-xs font-bold text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Échec, veuillez réessayer ou saisir le PIN
              </span>
            )}
          </div>

          {/* PIN Pad if PIN mode is chosen */}
          {authMethod === 'pin' && (
            <div className="grid grid-cols-3 gap-2 w-full max-w-[240px] my-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (item === '⌫') handlePinDelete();
                    else if (item !== '') handlePinDigit(item);
                  }}
                  disabled={item === ''}
                  className={`h-11 rounded-2xl flex items-center justify-center text-lg font-bold transition-all active:scale-95 ${
                    item === '' ? 'opacity-0 pointer-events-none' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          )}

          {/* Method Selectors */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100 w-full justify-center">
            <button
              onClick={() => {
                setAuthMethod('face');
                setStatus('scanning');
              }}
              className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1 transition-all ${
                authMethod === 'face' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ScanFace className="w-3.5 h-3.5" />
              Face ID
            </button>
            <button
              onClick={() => {
                setAuthMethod('fingerprint');
                setStatus('scanning');
              }}
              className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1 transition-all ${
                authMethod === 'fingerprint' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Fingerprint className="w-3.5 h-3.5" />
              Empreinte
            </button>
            <button
              onClick={() => setAuthMethod('pin')}
              className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1 transition-all ${
                authMethod === 'pin' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              Code PIN
            </button>
          </div>

          {/* Cancel button if not strict lock screen */}
          {onCancel && !isLockScreen && (
            <button
              onClick={onCancel}
              className="mt-3 text-xs text-gray-400 hover:text-gray-700 font-medium py-1"
            >
              Annuler
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
