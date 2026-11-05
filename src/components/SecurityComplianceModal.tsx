import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Lock, Key, RefreshCw, FileText, Trash2, CheckCircle, Database } from 'lucide-react';
import { UserProfile } from '../types';

interface SecurityComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onRotateKeys: () => void;
  onExportData: () => void;
  onClearLocalData: () => void;
}

export const SecurityComplianceModal: React.FC<SecurityComplianceModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onRotateKeys,
  onExportData,
  onClearLocalData,
}) => {
  const [rotatedMessage, setRotatedMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRotate = () => {
    onRotateKeys();
    setRotatedMessage('Clés de chiffrement AES-256 régénérées avec succès !');
    setTimeout(() => setRotatedMessage(null), 3000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="w-full max-w-lg bg-white rounded-t-[36px] sm:rounded-[36px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-100"
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-950">Sécurité & Conformité RGPD</h3>
                <p className="text-xs text-gray-500">Chiffrement bancaire de bout en bout</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-4">
            {/* Status Card */}
            <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Protection Active & Conforme
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                  Niveau 4 Bancaire
                </span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                Toutes vos données financières (soldes, coordonnées, bénéficiaires) sont systématiquement chiffrées localement et en transit avec l'algorithme <strong>AES-GCM 256 bits</strong> couplé à une dérivation <strong>PBKDF2 à 100 000 itérations</strong>.
              </p>
            </div>

            {/* Cryptographic Specifications */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Paramètres Cryptographiques
              </span>

              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-gray-700" />
                    Chiffrement local
                  </span>
                  <span className="font-mono font-bold text-gray-900">AES-256-GCM Authenticated</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-gray-700" />
                    Empreinte de clé
                  </span>
                  <span className="font-mono font-bold text-emerald-700">
                    {userProfile.encryptionKeyFingerprint}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-gray-700" />
                    Stockage Zéro-Connaissance
                  </span>
                  <span className="font-bold text-emerald-600">Actif (Client-Side Only)</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Dernier audit de sécurité</span>
                  <span className="font-medium text-gray-800">{userProfile.lastAuditDate}</span>
                </div>
              </div>
            </div>

            {/* Rotation Notification */}
            {rotatedMessage && (
              <div className="p-3 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                {rotatedMessage}
              </div>
            )}

            {/* RGPD Actions */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Droits RGPD & Vie Privée
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleRotate}
                  className="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl flex items-center gap-2.5 text-left text-xs font-bold text-gray-800 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-gray-600" />
                  <div>
                    <div>Rotation des Clés</div>
                    <div className="text-[10px] text-gray-400 font-normal">Renouveler la clé AES-256</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={onExportData}
                  className="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl flex items-center gap-2.5 text-left text-xs font-bold text-gray-800 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-gray-600" />
                  <div>
                    <div>Droit à la Portabilité</div>
                    <div className="text-[10px] text-gray-400 font-normal">Exporter données en JSON</div>
                  </div>
                </button>
              </div>

              <button
                type="button"
                onClick={onClearLocalData}
                className="w-full p-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-rose-700 transition-colors cursor-pointer mt-1"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Droit à l'Oubli : Purger les données locales chiffrées</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
