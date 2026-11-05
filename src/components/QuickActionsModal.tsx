import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, ShieldCheck } from 'lucide-react';
import { TransportCompanyId } from '../types';
import { MyNitaLogo, AmanaLogo, SahelPayLogo } from './Logos';
import { TRANSPORT_LOGOS } from '../utils/transportLogos';

interface QuickActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNitaToAmana: () => void;
  onSelectAmanaToNita: () => void;
  onSelectDeposit: () => void;
  onSelectWithdraw: () => void;
  onSelectTransport: (companyId: TransportCompanyId) => void;
}

export const QuickActionsModal: React.FC<QuickActionsModalProps> = ({
  isOpen,
  onClose,
  onSelectNitaToAmana,
  onSelectAmanaToNita,
  onSelectDeposit,
  onSelectWithdraw,
  onSelectTransport,
}) => {
  if (!isOpen) return null;

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
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-gray-900" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-950">Toutes les actions rapides</h3>
                <p className="text-xs text-gray-500">Raccourcis stylisés Sahel Pay, NITA & AMANA</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-6">
            {/* 1. Transferts Inter-Opérateurs */}
            <div>
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-3">
                Inter-Transferts & Portefeuille
              </span>

              {/* Grid 2:2 styled with textured bag cards */}
              <div className="grid grid-cols-2 gap-4 place-items-center">
                {/* NITA vers AMANA */}
                <div
                  onClick={() => {
                    onSelectNitaToAmana();
                    onClose();
                  }}
                  className="w-full flex flex-col items-center cursor-pointer group"
                >
                  <div className="relative w-full max-w-[160px] h-[148px] rounded-[30px] pt-1.5 pb-2 px-2 flex flex-col items-center justify-end shadow-sm group-hover:scale-102 transition-transform active:scale-95 bg-[#ff8359]">
                    <div className="absolute top-[5px] w-[96px] h-[30px] rounded-t-[22px] border-[4px] border-[#ffb194] bg-transparent pointer-events-none" />
                    <div className="relative z-10 w-full h-[116px] rounded-[24px] flex items-center justify-center bg-[#e24d15] shadow-inner">
                      <div className="w-[76px] h-[76px] rounded-full bg-white flex items-center justify-center shadow-xs">
                        <MyNitaLogo size={68} />
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-900 mt-2 text-center">NITA ➔ AMANA</span>
                </div>

                {/* AMANA vers NITA */}
                <div
                  onClick={() => {
                    onSelectAmanaToNita();
                    onClose();
                  }}
                  className="w-full flex flex-col items-center cursor-pointer group"
                >
                  <div className="relative w-full max-w-[160px] h-[148px] rounded-[30px] pt-1.5 pb-2 px-2 flex flex-col items-center justify-end shadow-sm group-hover:scale-102 transition-transform active:scale-95 bg-[#22c55e]">
                    <div className="absolute top-[5px] w-[96px] h-[30px] rounded-t-[22px] border-[4px] border-[#bbf7d0] bg-transparent pointer-events-none" />
                    <div className="relative z-10 w-full h-[116px] rounded-[24px] flex items-center justify-center bg-[#008736] shadow-inner">
                      <div className="w-[76px] h-[76px] rounded-full bg-white flex items-center justify-center shadow-xs">
                        <AmanaLogo size={68} />
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-900 mt-2 text-center">AMANA ➔ NITA</span>
                </div>

                {/* Recharger Portefeuille */}
                <div
                  onClick={() => {
                    onSelectDeposit();
                    onClose();
                  }}
                  className="w-full flex flex-col items-center cursor-pointer group"
                >
                  <div className="relative w-full max-w-[160px] h-[148px] rounded-[30px] pt-1.5 pb-2 px-2 flex flex-col items-center justify-end shadow-sm group-hover:scale-102 transition-transform active:scale-95 bg-gray-900">
                    <div className="absolute top-[5px] w-[96px] h-[30px] rounded-t-[22px] border-[4px] border-gray-700 bg-transparent pointer-events-none" />
                    <div className="relative z-10 w-full h-[116px] rounded-[24px] flex items-center justify-center bg-black shadow-inner">
                      <div className="w-[76px] h-[76px] rounded-full bg-white flex items-center justify-center shadow-xs">
                        <SahelPayLogo size="md" showText={false} />
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-900 mt-2 text-center">Recharger Solde</span>
                </div>

                {/* Retrait Portefeuille */}
                <div
                  onClick={() => {
                    onSelectWithdraw();
                    onClose();
                  }}
                  className="w-full flex flex-col items-center cursor-pointer group"
                >
                  <div className="relative w-full max-w-[160px] h-[148px] rounded-[30px] pt-1.5 pb-2 px-2 flex flex-col items-center justify-end shadow-sm group-hover:scale-102 transition-transform active:scale-95 bg-blue-600">
                    <div className="absolute top-[5px] w-[96px] h-[30px] rounded-t-[22px] border-[4px] border-blue-300 bg-transparent pointer-events-none" />
                    <div className="relative z-10 w-full h-[116px] rounded-[24px] flex items-center justify-center bg-blue-800 shadow-inner">
                      <div className="w-[76px] h-[76px] rounded-full bg-white flex flex-col items-center justify-center shadow-xs text-blue-900 font-black">
                        <span className="text-lg">ATM</span>
                        <span className="text-[8px] uppercase">Retrait</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-900 mt-2 text-center">Retirer Espèces</span>
                </div>
              </div>
            </div>

            {/* 2. Billets de Bus des 4 Compagnies */}
            <div>
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-3">
                Réservation Billets de Voyage
              </span>

              <div className="grid grid-cols-2 gap-4 place-items-center">
                {/* Salim */}
                <div
                  onClick={() => {
                    onSelectTransport('salim');
                    onClose();
                  }}
                  className="w-full flex flex-col items-center cursor-pointer group"
                >
                  <div className="relative w-full max-w-[160px] h-[148px] rounded-[30px] pt-1.5 pb-2 px-2 flex flex-col items-center justify-end shadow-sm group-hover:scale-102 transition-transform active:scale-95 bg-sky-500">
                    <div className="absolute top-[5px] w-[96px] h-[30px] rounded-t-[22px] border-[4px] border-sky-200 bg-transparent pointer-events-none" />
                    <div className="relative z-10 w-full h-[116px] rounded-[24px] flex items-center justify-center bg-[#0d3b8e] shadow-inner">
                      <div className="w-[76px] h-[76px] rounded-full bg-white flex items-center justify-center p-1.5 shadow-xs overflow-hidden">
                        <img src={TRANSPORT_LOGOS.salim} alt="Salim" className="w-full h-full object-contain" loading="eager" decoding="sync" />
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-900 mt-2 text-center">Salim Transport</span>
                </div>

                {/* STM */}
                <div
                  onClick={() => {
                    onSelectTransport('stm');
                    onClose();
                  }}
                  className="w-full flex flex-col items-center cursor-pointer group"
                >
                  <div className="relative w-full max-w-[160px] h-[148px] rounded-[30px] pt-1.5 pb-2 px-2 flex flex-col items-center justify-end shadow-sm group-hover:scale-102 transition-transform active:scale-95 bg-blue-500">
                    <div className="absolute top-[5px] w-[96px] h-[30px] rounded-t-[22px] border-[4px] border-blue-200 bg-transparent pointer-events-none" />
                    <div className="relative z-10 w-full h-[116px] rounded-[24px] flex items-center justify-center bg-[#008cc9] shadow-inner">
                      <div className="w-[76px] h-[76px] rounded-full bg-white flex items-center justify-center p-1.5 shadow-xs overflow-hidden">
                        <img src={TRANSPORT_LOGOS.stm} alt="STM" className="w-full h-full object-contain" loading="eager" decoding="sync" />
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-900 mt-2 text-center">STM</span>
                </div>

                {/* Amana Transport */}
                <div
                  onClick={() => {
                    onSelectTransport('amana_transport');
                    onClose();
                  }}
                  className="w-full flex flex-col items-center cursor-pointer group"
                >
                  <div className="relative w-full max-w-[160px] h-[148px] rounded-[30px] pt-1.5 pb-2 px-2 flex flex-col items-center justify-end shadow-sm group-hover:scale-102 transition-transform active:scale-95 bg-teal-500">
                    <div className="absolute top-[5px] w-[96px] h-[30px] rounded-t-[22px] border-[4px] border-teal-200 bg-transparent pointer-events-none" />
                    <div className="relative z-10 w-full h-[116px] rounded-[24px] flex items-center justify-center bg-[#009696] shadow-inner">
                      <div className="w-[76px] h-[76px] rounded-full bg-white flex items-center justify-center p-1.5 shadow-xs overflow-hidden">
                        <img src={TRANSPORT_LOGOS.amana_transport} alt="Amana Transport" className="w-full h-full object-contain" loading="eager" decoding="sync" />
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-900 mt-2 text-center">Amana Transport</span>
                </div>

                {/* EMA */}
                <div
                  onClick={() => {
                    onSelectTransport('ema');
                    onClose();
                  }}
                  className="w-full flex flex-col items-center cursor-pointer group"
                >
                  <div className="relative w-full max-w-[160px] h-[148px] rounded-[30px] pt-1.5 pb-2 px-2 flex flex-col items-center justify-end shadow-sm group-hover:scale-102 transition-transform active:scale-95 bg-orange-400">
                    <div className="absolute top-[5px] w-[96px] h-[30px] rounded-t-[22px] border-[4px] border-orange-200 bg-transparent pointer-events-none" />
                    <div className="relative z-10 w-full h-[116px] rounded-[24px] flex items-center justify-center bg-[#ea580c] shadow-inner">
                      <div className="w-[76px] h-[76px] rounded-full bg-white flex items-center justify-center p-1.5 shadow-xs overflow-hidden">
                        <img src={TRANSPORT_LOGOS.ema} alt="EMA" className="w-full h-full object-contain" loading="eager" decoding="sync" />
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-900 mt-2 text-center">EMA Transport</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-2 text-xs text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Chiffrement de bout en bout et interopérabilité directe Sahel Pay.</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
