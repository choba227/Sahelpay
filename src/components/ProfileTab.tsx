import React from 'react';
import {
  ShieldCheck,
  ScanFace,
  Fingerprint,
  Lock,
  Bell,
  Smartphone,
  ChevronRight,
  Database,
  HelpCircle,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileTabProps {
  userProfile: UserProfile;
  onToggleBiometrics: () => void;
  onTogglePush: () => void;
  onOpenSecurityModal: () => void;
  onTriggerLock: () => void;
  onTestBiometrics: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  userProfile,
  onToggleBiometrics,
  onTogglePush,
  onOpenSecurityModal,
  onTriggerLock,
  onTestBiometrics,
}) => {
  return (
    <div className="space-y-6 pb-24">
      <div className="pt-2">
        <h2 className="text-2xl font-black text-gray-950 tracking-tight">Mon Profil & Sécurité</h2>
        <p className="text-xs text-gray-500 mt-0.5">Paramètres d'accès biométrique et RGPD</p>
      </div>

      {/* User Card */}
      <div className="p-5 rounded-3xl bg-white border border-gray-200/80 shadow-xs flex items-center gap-4">
        <img
          src={userProfile.avatarUrl}
          alt={userProfile.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 shadow-sm"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-gray-950 truncate">{userProfile.name}</h3>
          <p className="text-xs text-gray-500 font-mono mt-0.5">{userProfile.phone}</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-semibold text-emerald-700">Compte Sahel Pay Vérifié</span>
          </div>
        </div>
      </div>

      {/* Biométrie & Sécurité */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          Sécurité Biométrique & Authentification
        </h3>

        <div className="space-y-2">
          {/* Face ID / Fingerprint Toggle */}
          <div className="p-4 rounded-2xl bg-white border border-gray-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center">
                <ScanFace className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Reconnaissance Biométrique</h4>
                <p className="text-[10px] text-gray-400">Face ID & Empreinte digitale active</p>
              </div>
            </div>
            <button
              onClick={onToggleBiometrics}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                userProfile.biometricEnabled ? 'bg-emerald-500 justify-end' : 'bg-gray-300 justify-start'
              }`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-md" />
            </button>
          </div>

          {/* Test Biometrics Button */}
          <button
            onClick={onTestBiometrics}
            className="w-full p-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-bold text-gray-800 flex items-center justify-between cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Fingerprint className="w-4 h-4 text-emerald-600" />
              <span>Tester la reconnaissance Face ID / Digitale</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          {/* Push Notifications Toggle */}
          <div className="p-4 rounded-2xl bg-white border border-gray-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Notifications Push Instantanées</h4>
                <p className="text-[10px] text-gray-400">Alertes temps réel à chaque mouvement</p>
              </div>
            </div>
            <button
              onClick={onTogglePush}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                userProfile.pushNotificationsEnabled ? 'bg-emerald-500 justify-end' : 'bg-gray-300 justify-start'
              }`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-md" />
            </button>
          </div>

          {/* Banking RGPD & Encryption Center */}
          <button
            onClick={onOpenSecurityModal}
            className="w-full p-4 rounded-2xl bg-emerald-50/70 hover:bg-emerald-50 border border-emerald-200/80 flex items-center justify-between cursor-pointer transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-950">Chiffrement AES-256 & RGPD</h4>
                <p className="text-[10px] text-emerald-700">Audit de conformité & gestion des clés</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-emerald-700" />
          </button>
        </div>
      </div>

      {/* Verrouiller l'application */}
      <div className="pt-2">
        <button
          onClick={onTriggerLock}
          className="w-full py-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Lock className="w-4 h-4 text-gray-600" />
          <span>Verrouiller Sahel Pay maintenant</span>
        </button>
      </div>
    </div>
  );
};
