import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Copy, Check, Plus } from 'lucide-react';

interface WalletFolderCardProps {
  balance: number;
  userName?: string;
  accountNumber?: string;
  onOpenDeposit?: () => void;
}

export const WalletFolderCard: React.FC<WalletFolderCardProps> = ({
  balance,
  userName = 'Elhadji Mahamane',
  accountNumber = '5402 2270 9045 8812',
  onOpenDeposit,
}) => {
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(accountNumber.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mask the entire sum cleanly without any comma
  const formattedBalance = showBalance
    ? `${balance.toLocaleString('fr-FR')} FCFA`
    : `•••••••• FCFA`;

  const formattedAccount = showBalance
    ? accountNumber
    : `•••• •••• •••• ••••`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.985 }}
      className="relative w-full max-w-[390px] mx-auto select-none"
    >
      {/* Subtle radiant ambient back-glow for vibrant presence */}
      <div className="absolute -inset-0.5 rounded-[34px] bg-gradient-to-r from-violet-400/30 via-indigo-300/30 to-purple-400/30 blur-sm pointer-events-none -z-10" />

      {/* 
        Custom Asymmetric Folder-Tab Card Container matching IMG_4627_e05e7dd8.jpeg:
        - Higher rounded top-left shoulder
        - Smooth transition to a lower top-right tab
        - Ravished, luminous lavender-violet gradient (#ded7ff -> #d4c8ff -> #c4b4fe)
        - Flowing subtle circuit wave traces
        - Recessed bottom-right notch housing the black pill "Actif & Chiffré"
      */}
      <div className="relative w-full overflow-hidden rounded-[32px] bg-gradient-to-br from-[#e0d9ff] via-[#d6ccfe] to-[#c7b7fe] p-6 shadow-[0_10px_25px_rgba(139,92,246,0.18)] border border-[#bfaefe]/90">
        {/* Asymmetric top folder shoulder accent */}
        <div className="absolute top-0 right-0 w-[48%] h-4 bg-white rounded-bl-[20px] pointer-events-none" />

        {/* Subtle decorative flowing circuit/wave lines from reference image */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
          viewBox="0 0 360 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 170 85 H 280 C 295 85, 295 110, 310 110 H 360"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 190 120 H 260 C 275 120, 275 145, 290 145 H 360"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Card Header: Recharge button & Titulaire (Date removed per request) */}
        <div className="relative z-10 flex items-center justify-between text-black font-semibold text-xs mb-3">
          {onOpenDeposit ? (
            <button
              type="button"
              onClick={onOpenDeposit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-gray-950 font-bold text-[11px] shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer border border-white/60"
              title="Recharger le portefeuille"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Recharger</span>
            </button>
          ) : (
            <span className="text-[11px] font-bold text-gray-700 tracking-wide">
              Portefeuille Sahel
            </span>
          )}

          <span className="text-[11px] font-bold text-gray-900 uppercase tracking-wider pr-1">
            {userName}
          </span>
        </div>

        {/* Card Main: Balance with eye toggle */}
        <div className="relative z-10 flex items-center gap-3 my-2">
          <span className="text-[26px] sm:text-[30px] font-black text-black tracking-tight leading-none">
            {formattedBalance}
          </span>
          <button
            type="button"
            onClick={() => setShowBalance(!showBalance)}
            className="w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-800 shadow-2xs transition-all active:scale-95 cursor-pointer"
            title={showBalance ? 'Masquer le montant' : 'Afficher le montant'}
          >
            {showBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Card Sub: Account Number */}
        <div className="relative z-10 mt-3 pt-1">
          <span className="text-[10px] font-bold text-gray-700 block uppercase tracking-wider mb-0.5">
            Account No
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm sm:text-base font-black text-black tracking-wider">
              {formattedAccount}
            </span>
            <button
              type="button"
              onClick={handleCopyAccount}
              className="text-gray-600 hover:text-black transition-colors"
              title="Copier le numéro de compte"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Bottom-right Notched Pill: "Actif & Chiffré" matching the black pill in reference image */}
        <div className="relative z-10 flex justify-end mt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black text-white shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold tracking-tight">Actif & Chiffré</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

