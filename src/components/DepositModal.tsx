import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, CreditCard, Building2, Smartphone, ShieldCheck, ArrowRight } from 'lucide-react';
import { MyNitaLogo, AmanaLogo } from './Logos';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDepositSuccess: (amount: number, method: string) => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  onDepositSuccess,
}) => {
  const [method, setMethod] = useState<'amana' | 'nita' | 'card' | 'mobile'>('amana');
  const [amount, setAmount] = useState('20000');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const quickAmounts = [10000, 20000, 50000, 100000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(amount, 10);
    if (isNaN(val) || val <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const methodName = method === 'amana' ? 'Agence AMANA' : method === 'nita' ? 'Agence My NITA' : method === 'card' ? 'Carte Bancaire' : 'Mobile Money';
      onDepositSuccess(val, methodName);
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="w-full max-w-md bg-white rounded-t-[36px] sm:rounded-[36px] shadow-2xl overflow-hidden flex flex-col border border-gray-100"
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Plus className="w-6 h-6 text-gray-900" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-950">Recharger le Solde</h3>
                <p className="text-xs text-gray-500">Approvisionner votre compte Sahel Pay</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Moyen de rechargement
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setMethod('amana')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    method === 'amana' ? 'border-gray-950 bg-gray-900 text-white shadow-xs' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <AmanaLogo size={28} />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Agence AMANA</span>
                    <span className={`text-[10px] block ${method === 'amana' ? 'text-gray-300' : 'text-gray-500'}`}>Guichet direct</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('nita')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    method === 'nita' ? 'border-gray-950 bg-gray-900 text-white shadow-xs' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <MyNitaLogo size={28} />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Agence My NITA</span>
                    <span className={`text-[10px] block ${method === 'nita' ? 'text-gray-300' : 'text-gray-500'}`}>Guichet direct</span>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Montant à recharger
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-4 pr-16 py-3.5 rounded-2xl border border-gray-200 focus:border-gray-900 text-xl font-black text-gray-900 bg-gray-50/50"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">
                  FCFA
                </span>
              </div>
              <div className="flex gap-2 mt-2">
                {quickAmounts.map(q => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setAmount(q.toString())}
                    className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-800 transition-colors"
                  >
                    +{q.toLocaleString('fr-FR')} F
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Dépôt instantané sécurisé par token cryptographique AES-256.</span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-gray-950 hover:bg-black text-white font-bold text-base flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-lg cursor-pointer"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Traitement du dépôt en cours...
                </span>
              ) : (
                <>
                  <span>Confirmer la recharge</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
