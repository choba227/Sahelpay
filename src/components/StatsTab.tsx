import { ArrowUpRight, ArrowDownLeft, TrendingUp, PieChart, Shield, ArrowLeft } from 'lucide-react';
import { Transaction } from '../types';

export const StatsTab: React.FC<{
  transactions: Transaction[];
  balance: number;
  onBack?: () => void;
}> = ({
  transactions,
  balance,
  onBack,
}) => {
  const totalSent = transactions
    .filter(t => t.type === 'envoi')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalReceived = transactions
    .filter(t => t.type === 'reception' || t.type === 'depot')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6 pb-24">
      <div className="pt-2 flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors cursor-pointer"
            title="Retour au Portefeuille"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div>
          <h2 className="text-2xl font-black text-gray-950 tracking-tight">Statistiques & Flux</h2>
          <p className="text-xs text-gray-500 mt-0.5">Suivi de vos dépenses et transferts en FCFA</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-3xl bg-white border border-gray-200/80 shadow-xs">
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <ArrowDownLeft className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide block">Entrées</span>
          <span className="text-lg font-black text-emerald-600 tracking-tight">
            +{totalReceived.toLocaleString('fr-FR')} F
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-gray-200/80 shadow-xs">
          <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-2">
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide block">Sorties</span>
          <span className="text-lg font-black text-gray-950 tracking-tight">
            -{totalSent.toLocaleString('fr-FR')} F
          </span>
        </div>
      </div>

      {/* Monthly Bar Chart Simulation */}
      <div className="p-5 rounded-3xl bg-white border border-gray-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">Activité mensuelle</span>
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +14% ce mois
          </span>
        </div>

        <div className="flex items-end justify-between h-36 pt-4 gap-2 border-b border-gray-100 pb-2">
          {[
            { month: 'Juil', amount: 45000, height: '40%' },
            { month: 'Août', amount: 75000, height: '65%' },
            { month: 'Sept', amount: 60000, height: '55%' },
            { month: 'Oct', amount: 95000, height: '85%' },
            { month: 'Nov', amount: 120000, height: '100%' },
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <div
                className={`w-full rounded-t-xl transition-all duration-500 ${
                  i === 4 ? 'bg-gray-950' : 'bg-gray-200'
                }`}
                style={{ height: bar.height }}
              />
              <span className="text-[10px] font-bold text-gray-500">{bar.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Provider Split */}
      <div className="p-5 rounded-3xl bg-white border border-gray-200/80 shadow-xs space-y-3">
        <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
          Répartition par Opérateur
        </span>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-emerald-700">AMANA Transfert</span>
              <span className="text-gray-900">62%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: '62%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-orange-600">My NITA</span>
              <span className="text-gray-900">38%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full" style={{ width: '38%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
