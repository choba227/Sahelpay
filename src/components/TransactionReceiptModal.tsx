import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, ShieldCheck, Download, Share2, Copy, Check } from 'lucide-react';
import { Transaction } from '../types';
import { MyNitaLogo, AmanaLogo } from './Logos';

interface TransactionReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const TransactionReceiptModal: React.FC<TransactionReceiptModalProps> = ({
  transaction,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!transaction) return null;

  const copyRef = () => {
    navigator.clipboard.writeText(transaction.referenceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-sm bg-white rounded-[36px] shadow-2xl overflow-hidden p-6 border border-gray-100 flex flex-col items-center"
        >
          {/* Top Success Badge */}
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-bold tracking-wider text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 mb-1">
            Transaction Validée
          </span>

          <h3 className="text-2xl font-black text-gray-950 mt-1">
            {transaction.amount.toLocaleString('fr-FR')} FCFA
          </h3>
          <p className="text-xs text-gray-500 mb-5">
            {transaction.type === 'envoi' ? 'Envoyé avec succès via' : 'Reçu via'}{' '}
            <strong className="text-gray-800">{transaction.providerName}</strong>
          </p>

          {/* Receipt Card */}
          <div className="w-full bg-gray-50 rounded-2xl p-4 border border-gray-200/80 space-y-2.5 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
              <span className="text-gray-500">Bénéficiaire / Émetteur</span>
              <span className="font-bold text-gray-900">{transaction.recipientOrSender}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
              <span className="text-gray-500">Numéro Mobile</span>
              <span className="font-mono font-semibold text-gray-800">{transaction.phoneNumber}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
              <span className="text-gray-500">Date & Heure</span>
              <span className="font-medium text-gray-800">{transaction.date} à {transaction.time}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
              <span className="text-gray-500">Frais Sahel Pay</span>
              <span className="font-bold text-emerald-600">0 FCFA (Gratuit)</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
              <span className="text-gray-500">Référence Unique</span>
              <button
                onClick={copyRef}
                className="font-mono font-bold text-gray-900 flex items-center gap-1 hover:text-emerald-700"
              >
                <span>{transaction.referenceCode}</span>
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-gray-400" />}
              </button>
            </div>

            <div className="pt-1">
              <span className="text-[10px] text-gray-400 block font-mono">
                Empreinte Cryptographique SHA-256 :
              </span>
              <span className="text-[10px] text-gray-600 font-mono break-all font-semibold">
                {transaction.encryptedHash}
              </span>
            </div>
          </div>

          {/* Security stamp */}
          <div className="flex items-center gap-2 mt-4 text-[11px] text-gray-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Chiffrement Bancaire AES-GCM & RGPD</span>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-gray-950 hover:bg-black text-white font-bold text-sm rounded-2xl mt-4 transition-all shadow-md cursor-pointer"
          >
            Fermer le reçu
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
