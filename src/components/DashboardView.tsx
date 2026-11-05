import React from 'react';
import { Bell } from 'lucide-react';
import { Transaction, ProviderType } from '../types';
import { QuickActionBagCard, TransactionBadge, SahelPayLogo } from './Logos';
import { WalletFolderCard } from './WalletFolderCard';

interface DashboardViewProps {
  balance: number;
  userName?: string;
  accountNumber?: string;
  transactions: Transaction[];
  unreadNotifCount: number;
  userAvatar: string;
  onOpenNotifications: () => void;
  onOpenDeposit: () => void;
  onOpenSend: () => void;
  onOpenWithdraw: () => void;
  onOpenNitaToAmana: () => void;
  onOpenAmanaToNita: () => void;
  onOpenQuickActions: () => void;
  onOpenHistory: () => void;
  onSelectTransaction: (tx: Transaction) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  balance,
  userName = 'Elhadji Mahamane',
  accountNumber = '5402 2270 9045 8812',
  transactions,
  unreadNotifCount,
  userAvatar,
  onOpenNotifications,
  onOpenDeposit,
  onOpenSend,
  onOpenWithdraw,
  onOpenNitaToAmana,
  onOpenAmanaToNita,
  onOpenQuickActions,
  onOpenHistory,
  onSelectTransaction,
}) => {
  return (
    <div className="flex flex-col w-full bg-white select-none">
      {/* 1. Header Bar: Profile avatar on left, Sahel Pay Logo in the middle, Notification Bell on right */}
      <div className="flex items-center justify-between pt-3 pb-6">
        {/* User Avatar */}
        <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200/60 shadow-xs flex-shrink-0 cursor-pointer">
          <img
            src={userAvatar}
            alt="Profil"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Sahel Pay Logo in the Top Middle */}
        <SahelPayLogo size="md" />

        {/* Bell Button */}
        <button
          onClick={onOpenNotifications}
          type="button"
          aria-label="Notifications"
          className="relative w-12 h-12 rounded-full bg-[#f0f2f5] hover:bg-[#e4e6ea] flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-2xs"
        >
          {/* Solid bell icon matching image */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-black"
          >
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
          </svg>
          {unreadNotifCount > 0 && (
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
          )}
        </button>
      </div>

      {/* 2. Carte Portefeuille Sahel Pay à l'accueil (à la place de la section solde texte) */}
      <div className="pt-0 pb-7">
        <WalletFolderCard
          balance={balance}
          userName={userName}
          accountNumber={accountNumber}
          onOpenDeposit={onOpenDeposit}
        />
      </div>

      {/* 3. Three Large Circular Action Buttons */}
      <div className="flex items-center justify-between gap-4 pb-9">
        {/* Button 1: Plus (Recharger / Déposer) */}
        <button
          onClick={onOpenDeposit}
          type="button"
          aria-label="Recharger le compte"
          className="w-[78px] h-[78px] sm:w-[84px] sm:h-[84px] rounded-full bg-[#f0f2f5] hover:bg-[#e4e6ea] flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-2xs group"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth="3.2"
            strokeLinecap="round"
            className="transition-transform group-active:scale-95"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        {/* Button 2: Paper Airplane / Send (Envoyer de l'argent) */}
        <button
          onClick={onOpenSend}
          type="button"
          aria-label="Envoyer de l'argent"
          className="w-[78px] h-[78px] sm:w-[84px] sm:h-[84px] rounded-full bg-[#f0f2f5] hover:bg-[#e4e6ea] flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-2xs group"
        >
          {/* Exact paper plane angle and shape from screenshot */}
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="black"
            className="translate-x-0.5 -translate-y-0.5 transition-transform group-active:scale-95"
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>

        {/* Button 3: Retrait Portefeuille vers NITA ou AMANA */}
        <button
          onClick={onOpenWithdraw}
          type="button"
          aria-label="Retirer de l'argent"
          className="w-[78px] h-[78px] sm:w-[84px] sm:h-[84px] rounded-full bg-[#f0f2f5] hover:bg-[#e4e6ea] flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-2xs group"
        >
          {/* Exact horizontal dual arrows matching screenshot */}
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-active:scale-95"
          >
            <path d="M 5 8 L 19 8 M 15 4 L 19 8 L 15 12" />
            <path d="M 19 16 L 5 16 M 9 12 L 5 16 L 9 20" />
          </svg>
        </button>
      </div>

      {/* 4. "Actions rapides" Section */}
      <div className="pb-8">
        <div className="flex items-center justify-between pb-4">
          <h3 className="text-[20px] font-bold text-black tracking-tight">
            Actions rapides
          </h3>
          <button
            onClick={onOpenQuickActions}
            type="button"
            className="text-[16px] font-bold text-black underline underline-offset-3 hover:opacity-80 cursor-pointer"
          >
            Voir plus
          </button>
        </div>

        {/* Balanced and airy 2-column layout for My NITA and AMANA */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full place-items-center py-1">
          {/* Card 1: My NITA (clic = envoi vers AMANA) */}
          <QuickActionBagCard
            type="nita"
            onClick={onOpenNitaToAmana}
          />

          {/* Card 2: AMANA (clic = envoi vers My NITA) */}
          <QuickActionBagCard
            type="amana"
            onClick={onOpenAmanaToNita}
          />
        </div>
      </div>

      {/* 5. "Historiques" Section */}
      <div className="pb-6">
        <div className="flex items-center justify-between pb-4">
          <h3 className="text-[20px] font-bold text-black tracking-tight">
            Historiques
          </h3>
          <button
            onClick={onOpenHistory}
            type="button"
            className="text-[16px] font-bold text-black underline underline-offset-3 hover:opacity-80 cursor-pointer"
          >
            Voir plus
          </button>
        </div>

        {/* Transaction list starting with the exact item in the screenshot */}
        <div className="space-y-3">
          {transactions.slice(0, 3).map((tx) => (
            <div
              key={tx.id}
              onClick={() => onSelectTransaction(tx)}
              className="flex items-center justify-between py-1 px-1 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              {/* Left side: circular badge with AMANA / NITA logo + Text */}
              <div className="flex items-center gap-3 min-w-0">
                <TransactionBadge provider={tx.provider} size={40} />
                <div className="text-[15px] sm:text-[16px] text-black truncate">
                  <span className="font-bold">
                    {tx.type === 'envoi' ? 'Envoie' : 'Reçu'} :{' '}
                  </span>
                  <span className="font-normal">{tx.recipientOrSender}</span>
                </div>
              </div>

              {/* Right side: Amount matching format "35 000 F" */}
              <div className="text-right flex-shrink-0 pl-3">
                <span className="text-[16px] font-bold text-black tracking-tight whitespace-nowrap">
                  {tx.formattedAmount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
