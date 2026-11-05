import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeftRight, QrCode, Banknote, ShieldCheck, Copy, Check } from 'lucide-react';

interface ExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
}

export const ExchangeModal: React.FC<ExchangeModalProps> = ({
  isOpen,
  onClose,
  balance,
}) => {
  const [activeTab, setActiveTab] = useState<'retrait' | 'convert'>('retrait');
  const [retraitAmount, setRetraitAmount] = useState('10000');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerateCode = () => {
    const code = `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedCode(code);
  };

  const copyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
                <ArrowLeftRight className="w-5 h-5 text-gray-900" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-950">Retrait & Échange</h3>
                <p className="text-xs text-gray-500">Guichet Express ou Conversion devises</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Tabs */}
            <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-2xl">
              <button
                onClick={() => setActiveTab('retrait')}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'retrait' ? 'bg-white text-gray-950 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Retrait Guichet AMANA / NITA
              </button>
              <button
                onClick={() => setActiveTab('convert')}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'convert' ? 'bg-white text-gray-950 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Conversion Devise
              </button>
            </div>

            {activeTab === 'retrait' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Montant du retrait en agence
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={retraitAmount}
                      onChange={(e) => {
                        setRetraitAmount(e.target.value);
                        setGeneratedCode(null);
                      }}
                      className="w-full pl-4 pr-16 py-3.5 rounded-2xl border border-gray-200 focus:border-gray-900 text-xl font-black text-gray-900 bg-gray-50/50"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">
                      FCFA
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-500 block mt-1">
                    Solde disponible : {balance.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>

                {!generatedCode ? (
                  <button
                    onClick={handleGenerateCode}
                    className="w-full py-4 rounded-2xl bg-gray-950 hover:bg-black text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-transform active:scale-[0.98]"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Générer le Code Retrait Sécurisé</span>
                  </button>
                ) : (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                      Code de retrait instantané (valable 15 min)
                    </span>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-3xl font-mono font-black text-emerald-950 tracking-wider">
                        {generatedCode}
                      </span>
                      <button
                        onClick={copyToClipboard}
                        className="p-2 rounded-xl bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                        title="Copier le code"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-emerald-700 leading-tight">
                      Présentez ce code à n'importe quel guichet AMANA ou My NITA avec votre pièce d'identité pour retirer vos espèces immédiatement.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 py-2">
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block">DE</span>
                    <span className="text-base font-black text-gray-900">FCFA (Franc CFA XOF)</span>
                  </div>
                  <span className="text-lg font-black text-gray-900">10 000</span>
                </div>

                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block">VERS</span>
                    <span className="text-base font-black text-gray-900">EUR (Euro)</span>
                  </div>
                  <span className="text-lg font-black text-emerald-600">15.24 €</span>
                </div>

                <div className="text-[11px] text-gray-500 text-center font-medium">
                  Taux officiel garanti BCEAO : 1 EUR = 655.957 FCFA
                </div>
              </div>
            )}

            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-xs text-gray-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Chiffrement AES-GCM 256 bits et audit de conformité bancaire actif.</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
