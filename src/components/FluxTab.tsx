import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, TrendingUp, RefreshCw, Filter } from 'lucide-react';
import { Transaction } from '../types';
import { TransactionBadge } from './Logos';

interface FluxTabProps {
  balance: number;
  transactions: Transaction[];
  userName?: string;
  accountNumber?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onSelectTransaction?: (tx: Transaction) => void;
}

export const FluxTab: React.FC<FluxTabProps> = ({
  balance,
  transactions,
  userName = 'Elhadji Mahamane',
  accountNumber = '5402 2270 9045 8812',
  onRefresh,
  isRefreshing = false,
  onSelectTransaction,
}) => {
  const [filter, setFilter] = useState<'all' | 'in' | 'out'>('all');

  const totalSent = transactions
    .filter(t => t.type === 'envoi' || t.type === 'paiement')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalReceived = transactions
    .filter(t => t.type === 'reception' || t.type === 'depot')
    .reduce((acc, t) => acc + t.amount, 0);

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'in') return t.type === 'reception' || t.type === 'depot';
    if (filter === 'out') return t.type === 'envoi' || t.type === 'paiement';
    return true;
  });

  return (
    <div className="w-full flex flex-col bg-white select-none pt-1 pb-16 space-y-6">
      {/* Header with Title and Sync Button */}
      <div className="pt-2 flex items-center justify-between">
        <div>
          <h2 className="text-[22px] font-bold text-black tracking-normal leading-tight">
            Flux & Statistiques
          </h2>
          <p className="text-[14px] text-gray-500 mt-0.5 font-medium">
            Suivi des entrées, sorties et mouvements financiers
          </p>
        </div>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="p-2 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
            title="Actualiser les données"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-black' : ''}`} />
          </button>
        )}
      </div>

      {/* Entrées & Sorties Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-3xl bg-gray-50 border border-gray-100 shadow-2xs">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
            <ArrowDownLeft className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">Total Entrées</span>
          <span className="text-base sm:text-lg font-black text-emerald-600 tracking-tight">
            +{totalReceived.toLocaleString('fr-FR')} F
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-gray-50 border border-gray-100 shadow-2xs">
          <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center mb-2">
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">Total Sorties</span>
          <span className="text-base sm:text-lg font-black text-gray-950 tracking-tight">
            -{totalSent.toLocaleString('fr-FR')} F
          </span>
        </div>
      </div>

      {/* Monthly Bar Chart */}
      <div className="p-5 rounded-3xl bg-gray-50 border border-gray-100 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">Activité mensuelle</span>
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +18% en Nov
          </span>
        </div>

        <div className="flex items-end justify-between h-28 pt-2 gap-2 border-b border-gray-200 pb-2">
          {[
            { month: 'Juil', height: '40%' },
            { month: 'Août', height: '65%' },
            { month: 'Sept', height: '50%' },
            { month: 'Oct', height: '80%' },
            { month: 'Nov', height: '100%' },
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <div
                className={`w-full rounded-t-xl transition-all duration-300 ${
                  i === 4 ? 'bg-black' : 'bg-gray-300'
                }`}
                style={{ height: bar.height }}
              />
              <span className="text-[10px] font-bold text-gray-500">{bar.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filterable Transactions List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-black tracking-tight">
            Derniers Mouvements
          </h3>

          <div className="flex gap-1 bg-gray-100 p-0.5 rounded-xl text-[11px] font-bold">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filter === 'all' ? 'bg-white text-black shadow-xs' : 'text-gray-500'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilter('in')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filter === 'in' ? 'bg-white text-black shadow-xs' : 'text-gray-500'
              }`}
            >
              Entrées
            </button>
            <button
              onClick={() => setFilter('out')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filter === 'out' ? 'bg-white text-black shadow-xs' : 'text-gray-500'
              }`}
            >
              Sorties
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {filteredTransactions.slice(0, 6).map((tx) => (
            <div
              key={tx.id}
              onClick={() => onSelectTransaction && onSelectTransaction(tx)}
              className="p-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-100 flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <TransactionBadge provider={tx.provider} size={38} />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-gray-950 truncate">
                    {tx.recipientOrSender}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {tx.date} à {tx.time} • {tx.providerName}
                  </div>
                </div>
              </div>

              <div className="text-right flex-shrink-0 pl-2">
                <span
                  className={`text-xs font-black block tracking-tight ${
                    tx.type === 'envoi' || tx.type === 'paiement' ? 'text-gray-950' : 'text-emerald-600'
                  }`}
                >
                  {tx.type === 'envoi' || tx.type === 'paiement' ? '- ' : '+ '}
                  {tx.amount.toLocaleString('fr-FR')} F
                </span>
                <span className="text-[9px] font-semibold text-gray-400">
                  {tx.status === 'completed' ? 'Confirmé' : 'En attente'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
