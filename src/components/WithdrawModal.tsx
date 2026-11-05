import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowDownRight, QrCode, Copy, Check, ShieldCheck, ArrowRight } from 'lucide-react';
import { MyNitaLogo, AmanaLogo } from './Logos';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onConfirmWithdraw: (data: {
    destination: 'nita' | 'amana';
    amount: number;
    withdrawalCode: string;
    agentName: string;
  }) => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  balance,
  onConfirmWithdraw,
}) => {
  const [destination, setDestination] = useState<'nita' | 'amana'>('amana');
  const [amount, setAmount] = useState<string>('10000');
  const [phoneNumber, setPhoneNumber] = useState<string>('+227 90 45 88 12');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickAmounts = [5000, 10000, 25000, 50000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(amount.replace(/\s+/g, ''), 10);
    if (isNaN(num) || num <= 0) {
      setError('Veuillez saisir un montant valide');
      return;
    }
    if (num > balance) {
      setError(`Solde insuffisant (${balance.toLocaleString('fr-FR')} FCFA disponible)`);
      return;
    }

    const generatedCode = `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const agentName = destination === 'amana' ? 'Agence AMANA' : 'Agence My NITA';

    onConfirmWithdraw({
      destination,
      amount: num,
      withdrawalCode: generatedCode,
      agentName,
    });
    onClose();
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
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-900">
                <ArrowDownRight className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-950">Retirer des Espèces</h3>
                <p className="text-xs text-gray-500">Du portefeuille Sahel Pay vers NITA ou AMANA</p>
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
            {/* Opérateur de Retrait */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                1. Opérateur de Retrait
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setDestination('amana')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    destination === 'amana'
                      ? 'border-gray-950 bg-gray-900 text-white shadow-xs'
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <AmanaLogo size={28} />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">AMANA</span>
                    <span className={`text-[10px] block ${destination === 'amana' ? 'text-gray-300' : 'text-gray-500'}`}>
                      Guichet & Agences
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDestination('nita')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    destination === 'nita'
                      ? 'border-gray-950 bg-gray-900 text-white shadow-xs'
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <MyNitaLogo size={28} />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">My NITA</span>
                    <span className={`text-[10px] block ${destination === 'nita' ? 'text-gray-300' : 'text-gray-500'}`}>
                      Guichet & Agences
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Montant */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  2. Montant à retirer
                </label>
                <span className="text-xs text-gray-500">
                  Solde dispo : <strong className="text-gray-950">{balance.toLocaleString('fr-FR')} F</strong>
                </span>
              </div>

              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError(null);
                  }}
                  className="w-full pl-4 pr-16 py-3.5 rounded-2xl border border-gray-200 focus:border-gray-900 text-2xl font-black text-gray-900 bg-gray-50"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">
                  FCFA
                </span>
              </div>

              <div className="flex gap-2 mt-2">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      setAmount(q.toString());
                      setError(null);
                    }}
                    className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-800 transition-colors"
                  >
                    {q.toLocaleString('fr-FR')} F
                  </button>
                ))}
              </div>
            </div>

            {/* Numéro récepteur */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                3. Numéro de téléphone bénéficiaire
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 font-mono text-xs font-bold text-gray-900 bg-gray-50 focus:border-gray-900"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                Un code de retrait sécurisé sera généré pour retrait direct en agence {destination === 'amana' ? 'AMANA' : 'My NITA'}.
              </span>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-xs font-semibold">
                {error}
              </div>
            )}

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-2 text-xs text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Frais de retrait : 0 FCFA (Offre promotionnelle Sahel Pay).</span>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gray-950 hover:bg-black text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98] cursor-pointer"
            >
              <span>Valider le Retrait ({parseInt(amount || '0', 10).toLocaleString('fr-FR')} FCFA)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
