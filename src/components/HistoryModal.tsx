import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, History, ArrowUpRight, ArrowDownLeft, ShieldCheck, Download, Search } from 'lucide-react';
import { Transaction } from '../types';
import { TransactionBadge } from './Logos';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  transactions,
  onSelectTransaction,
}) => {
  const [filter, setFilter] = useState<'all' | 'envoi' | 'reception' | 'amana' | 'nita'>('all');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = transactions.filter((t) => {
    if (filter === 'envoi' && t.type !== 'envoi') return false;
    if (filter === 'reception' && t.type !== 'reception') return false;
    if (filter === 'amana' && t.provider !== 'amana') return false;
    if (filter === 'nita' && t.provider !== 'nita') return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        t.recipientOrSender.toLowerCase().includes(q) ||
        t.referenceCode.toLowerCase().includes(q) ||
        t.providerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

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
                <History className="w-5 h-5 text-gray-900" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-950">Historiques des transactions</h3>
                <p className="text-xs text-gray-500">Mouvements de compte chiffrés de bout en bout</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Filters */}
          <div className="p-4 bg-gray-50 border-b border-gray-100 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher par nom, référence..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold bg-white focus:outline-none focus:border-gray-900"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              {[
                { id: 'all', label: 'Tout' },
                { id: 'envoi', label: 'Envois' },
                { id: 'reception', label: 'Réceptions' },
                { id: 'amana', label: 'AMANA' },
                { id: 'nita', label: 'My NITA' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as typeof filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    filter === tab.id
                      ? 'bg-gray-900 text-white shadow-xs'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <p className="text-sm font-semibold">Aucune transaction trouvée</p>
              </div>
            ) : (
              filtered.map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => onSelectTransaction(tx)}
                  className="p-3.5 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 flex items-center justify-between transition-all cursor-pointer shadow-2xs group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <TransactionBadge provider={tx.provider} size={42} />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-gray-900 truncate">
                        <span className="font-bold">
                          {tx.type === 'envoi' ? 'Envoie' : tx.type === 'reception' ? 'Reçu de' : 'Recharge'} :{' '}
                        </span>
                        {tx.recipientOrSender}
                      </div>
                      <div className="text-[10px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                        <span>{tx.date}</span>
                        <span>•</span>
                        <span>{tx.time}</span>
                        <span>•</span>
                        <span className="font-mono text-gray-400">{tx.referenceCode}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 pl-3">
                    <span
                      className={`text-sm font-black block tracking-tight ${
                        tx.type === 'envoi' ? 'text-gray-950' : 'text-emerald-600'
                      }`}
                    >
                      {tx.type === 'envoi' ? '' : '+ '}
                      {tx.amount.toLocaleString('fr-FR')} F
                    </span>
                    <span className="text-[9.5px] font-bold text-emerald-600 uppercase">
                      Confirmé
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
