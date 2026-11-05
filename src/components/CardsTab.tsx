import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, TrendingUp, QrCode, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface CardsTabProps {
  balance: number;
  onNavigateToStats: () => void;
  onOpenDeposit?: () => void;
}

export const CardsTab: React.FC<CardsTabProps> = ({
  balance,
  onNavigateToStats,
  onOpenDeposit,
}) => {
  const [showId, setShowId] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const accountId = 'SP-227-9045-8812';
  const fullIban = 'NE24 0019 9842 8812 90';

  const copyAccountId = () => {
    navigator.clipboard.writeText(accountId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col bg-white select-none pt-1 pb-16 space-y-6">
      {/* Title matching Home page style */}
      <div className="pt-2">
        <h2 className="text-[22px] font-bold text-black tracking-normal leading-tight">
          Portefeuille Sahel Pay
        </h2>
        <p className="text-[14px] text-gray-500 mt-1 font-medium">
          Compte numérique chiffré et sécurisé
        </p>
      </div>

      {/* The Portefeuille Pass Card - Same design, same fonts, same proportions as before, but for Portefeuille Sahel Pay */}
      <div className="relative w-full aspect-[1.58/1] rounded-[28px] p-6 text-white overflow-hidden shadow-2xl bg-gradient-to-br from-neutral-900 via-zinc-900 to-black border border-white/10">
        {/* Subtle holographic security grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Card Top */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-white">Sahel Pay</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
                Portefeuille
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Actif & Chiffré</span>
            </div>
          </div>

          {/* Account ID / Balance in card center */}
          <div className="my-auto pt-2">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 block font-semibold mb-1">
              Solde Disponible
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {balance.toLocaleString('fr-FR')} FCFA
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-xs sm:text-sm text-gray-300 font-semibold tracking-wider">
                {showId ? accountId : 'SP-•••-••••-••••'}
              </span>
              <button
                onClick={() => setShowId(!showId)}
                className="text-gray-400 hover:text-white transition-colors"
                title={showId ? 'Masquer' : 'Afficher'}
              >
                {showId ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Card Bottom */}
          <div className="flex items-end justify-between pt-2">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-semibold">Titulaire</span>
              <span className="text-xs font-bold tracking-wide">ELHADJI MAHAMANE</span>
            </div>

            <div>
              <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-semibold">Réseau</span>
              <span className="text-xs font-mono font-bold text-gray-200">UEMOA / NIGER</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions for Portefeuille */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={copyAccountId}
          className="p-3.5 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2 text-xs font-bold text-gray-900 transition-colors shadow-2xs cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
          <span>{copied ? 'Identifiant copié !' : 'Copier Identifiant'}</span>
        </button>

        <button
          onClick={() => setShowQrModal(!showQrModal)}
          className="p-3.5 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2 text-xs font-bold text-gray-900 transition-colors shadow-2xs cursor-pointer"
        >
          <QrCode className="w-4 h-4 text-gray-600" />
          <span>QR Code Réception</span>
        </button>
      </div>

      {/* QR Code Modal Display if clicked */}
      {showQrModal && (
        <div className="p-4 rounded-3xl bg-gray-50 border border-gray-200 text-center space-y-2">
          <span className="text-xs font-bold text-gray-900 block">Mon QR Code Sahel Pay</span>
          <div className="w-28 h-28 mx-auto bg-white p-2 rounded-2xl border border-gray-200 flex items-center justify-center">
            <QrCode className="w-24 h-24 text-gray-900" />
          </div>
          <span className="text-[11px] font-mono text-gray-500 block">{accountId}</span>
          <p className="text-[11px] text-gray-400">Présentez ce QR Code pour recevoir des fonds ou payer en agence</p>
        </div>
      )}

      {/* REQUIREMENT 5: Shortcut to Statistiques & Flux */}
      <div className="pt-2">
        <button
          onClick={onNavigateToStats}
          className="w-full p-4 rounded-3xl bg-[#f0f2f5] hover:bg-[#e4e6ea] flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] border border-gray-200/60 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h4 className="text-[15px] font-bold text-black leading-tight">
                Statistiques & Flux
              </h4>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Consulter les analyses, entrées et sorties en FCFA
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-2xs text-black">
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* Security Info */}
      <div className="p-4 rounded-3xl bg-[#f0f2f5] border border-gray-200/60 space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-bold text-black">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Protection Bancaire AES-GCM 256 bits</span>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          Votre portefeuille numérique est utilisable pour toutes les transactions locales et réservations de bus (Salim, STM, Amana Transport, EMA) sans intermédiaire ni commission cachée.
        </p>
      </div>
    </div>
  );
};
