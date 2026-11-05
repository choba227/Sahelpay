import React from 'react';

/**
 * Logo officiel Sahel Pay (exact fourni par l'utilisateur: IMG_4625_d1540dc1.jpeg)
 */
export const SahelPayLogo: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg'; showText?: boolean }> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconSizes = { sm: 26, md: 36, lg: 48 };
  const s = iconSizes[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div
        style={{ width: s, height: s }}
        className="flex items-center justify-center flex-shrink-0"
      >
        <img
          src="/assets/aistudio/sahel_pay_logo_clean.png"
          alt="Sahel Pay"
          className="w-full h-full object-contain filter drop-shadow-2xs"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/IMG_4625_d1540dc1.jpeg';
          }}
        />
      </div>

      {showText && (
        <div className="flex items-center text-black font-black tracking-tight text-[18px] sm:text-[20px] leading-none">
          <span>Sahel</span>
          <span className="text-[#0d3b82] ml-1">Pay</span>
        </div>
      )}
    </div>
  );
};

/**
 * Holder circulaire coloré pour la sélection d'opérateur (Portefeuille, Nita, Amana)
 */
export const OperatorCircleHolder: React.FC<{
  operator: 'wallet' | 'nita' | 'amana';
  isSelected?: boolean;
  onClick?: () => void;
  size?: number;
}> = ({ operator, isSelected = false, onClick, size = 76 }) => {
  const configs = {
    wallet: {
      bg: '#0a3a82',
      borderColor: '#0a3a82',
      ringColor: 'ring-blue-800',
      label: 'Portefeuille',
      content: (
        <div className="flex flex-col items-center justify-center">
          <div className="w-[42px] h-[42px] rounded-full bg-white flex items-center justify-center p-1 shadow-2xs">
            <img
              src="/assets/aistudio/sahel_pay_logo_clean.png"
              alt="Sahel Pay"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-[10px] font-black text-white mt-1 uppercase tracking-tight">Portefeuille</span>
        </div>
      ),
    },
    nita: {
      bg: '#ff8359',
      borderColor: '#ea580c',
      ringColor: 'ring-orange-500',
      label: 'My NITA',
      content: (
        <div className="w-[62px] h-[62px] rounded-full bg-white flex items-center justify-center shadow-xs">
          <MyNitaLogo size={54} />
        </div>
      ),
    },
    amana: {
      bg: '#22c55e',
      borderColor: '#008736',
      ringColor: 'ring-emerald-500',
      label: 'AMANA',
      content: (
        <div className="w-[62px] h-[62px] rounded-full bg-white flex items-center justify-center shadow-xs">
          <AmanaLogo size={54} />
        </div>
      ),
    },
  }[operator];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer shadow-md focus:outline-none ${
        isSelected
          ? `ring-4 ${configs.ringColor} ring-offset-2 scale-105 shadow-lg`
          : 'opacity-85 hover:opacity-100 hover:scale-102'
      }`}
      style={{
        width: size,
        height: size,
        backgroundColor: configs.bg,
      }}
    >
      {configs.content}
    </button>
  );
};

/**
 * Logo officiel My NITA Transfert d'Argent
 */
export const MyNitaLogo: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 100 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Curved orange arrow at top */}
      <path
        d="M 68 28 C 55 24 45 28 42 34"
        stroke="#ea580c"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <polygon points="41,29 39,36 47,36" fill="#ea580c" />

      {/* "my" in vibrant orange */}
      <text
        x="24"
        y="65"
        fill="#ea580c"
        fontSize="24"
        fontWeight="800"
        fontFamily="sans-serif"
      >
        my
      </text>

      {/* Phone graphic in orange & blue */}
      <g transform="translate(56, 45) rotate(15)">
        <rect x="0" y="0" width="13" height="21" rx="2.5" fill="#ea580c" />
        <rect x="1.8" y="2.5" width="9.4" height="14" rx="1.2" fill="#ffffff" />
        <circle cx="6.5" cy="18.5" r="1.1" fill="#ffffff" />
      </g>

      {/* "NITA" in bold royal blue */}
      <text
        x="24"
        y="87"
        fill="#1e3a8a"
        fontSize="24"
        fontWeight="900"
        fontFamily="sans-serif"
        letterSpacing="0.5"
      >
        NITA
      </text>

      {/* Arrow pointing up-right from the 'A' */}
      <path
        d="M 85 86 L 94 72"
        stroke="#1e3a8a"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <polygon points="87,70 96,70 95,78" fill="#1e3a8a" />

      {/* "TRANSFERT D'ARGENT" subtitle */}
      <text
        x="60"
        y="99"
        fill="#1e3a8a"
        fontSize="7.8"
        fontWeight="700"
        fontFamily="sans-serif"
        textAnchor="middle"
        letterSpacing="0.4"
      >
        TRANSFERT D'ARGENT
      </text>
    </svg>
  );
};

/**
 * Logo officiel AMANA Transfert d'Argent
 */
export const AmanaLogo: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 100 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Green circular transfer loop oval */}
      <ellipse
        cx="60"
        cy="58"
        rx="40"
        ry="21"
        stroke="#008736"
        strokeWidth="3.2"
        fill="#ffffff"
      />

      {/* Top transfer arrow pointing right */}
      <path
        d="M 45 40 Q 60 36 75 40"
        stroke="#008736"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
      <polygon points="73,36 80,41 74,45" fill="#008736" />

      {/* Bottom transfer arrow pointing left */}
      <path
        d="M 75 76 Q 60 80 45 76"
        stroke="#008736"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
      <polygon points="47,72 40,77 46,81" fill="#008736" />

      {/* "AMANA" in bold orange/red */}
      <text
        x="60"
        y="65"
        fill="#ea580c"
        fontSize="17"
        fontWeight="900"
        fontFamily="sans-serif"
        textAnchor="middle"
        letterSpacing="0.8"
      >
        AMANA
      </text>

      {/* "TRANSFERT D'ARGENT" text beneath */}
      <text
        x="60"
        y="90"
        fill="#ea580c"
        fontSize="7.5"
        fontWeight="700"
        fontFamily="sans-serif"
        fontStyle="italic"
        textAnchor="middle"
        letterSpacing="0.3"
      >
        TRANSFERT D'ARGENT
      </text>
    </svg>
  );
};

/**
 * Logo Salim Transport
 */
export const SalimLogo: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" fill="#0284c7" />
    {/* Stylized bus & road dynamic arc */}
    <path d="M22 62 C34 52, 66 52, 78 62" stroke="#fbbf24" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M28 44 H72 L66 32 H34 Z" fill="#ffffff" rx="2" />
    <circle cx="36" cy="44" r="3.5" fill="#0284c7" />
    <circle cx="64" cy="44" r="3.5" fill="#0284c7" />
    <text x="50" y="78" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">
      SALIM
    </text>
    <text x="50" y="88" textAnchor="middle" fill="#fbbf24" fontSize="6.5" fontWeight="700" fontFamily="sans-serif">
      TRANSPORT
    </text>
  </svg>
);

/**
 * Logo STM (Société de Transport Moderne)
 */
export const StmLogo: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" fill="#1e3a8a" />
    {/* Orange accent wave */}
    <path d="M18 56 Q50 36 82 56" stroke="#f97316" strokeWidth="6" strokeLinecap="round" />
    <text x="50" y="52" textAnchor="middle" fill="#ffffff" fontSize="24" fontWeight="900" fontFamily="sans-serif" letterSpacing="2">
      STM
    </text>
    <text x="50" y="78" textAnchor="middle" fill="#f97316" fontSize="6.2" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.4">
      TRANSPORT MODERNE
    </text>
  </svg>
);

/**
 * Logo Amana Transport (VIP)
 */
export const AmanaTransportLogo: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" fill="#008736" />
    <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
    <text x="50" y="44" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">
      AMANA
    </text>
    <rect x="33" y="49" width="34" height="11" rx="3" fill="#f59e0b" />
    <text x="50" y="58" textAnchor="middle" fill="#008736" fontSize="7.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="1.2">
      VIP BUS
    </text>
    <text x="50" y="76" textAnchor="middle" fill="#ffffff" fontSize="6.2" fontWeight="700" fontFamily="sans-serif">
      VOYAGEURS NIGER
    </text>
  </svg>
);

/**
 * Logo EMA Transport
 */
export const EmaLogo: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" fill="#ea580c" />
    <circle cx="50" cy="50" r="39" stroke="#ffffff" strokeWidth="2" />
    <text x="50" y="48" textAnchor="middle" fill="#ffffff" fontSize="21" fontWeight="900" fontFamily="sans-serif" letterSpacing="1.5">
      EMA
    </text>
    <rect x="25" y="56" width="50" height="13" rx="4" fill="#0f172a" />
    <text x="50" y="66" textAnchor="middle" fill="#ffffff" fontSize="7.2" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.8">
      TRANSPORT
    </text>
  </svg>
);

/**
 * Stylized Bag / Card Container for Quick Actions (My NITA & AMANA only)
 */
export const QuickActionBagCard: React.FC<{
  type: 'nita' | 'amana';
  onClick: () => void;
}> = ({ type, onClick }) => {
  if (type === 'nita') {
    return (
      <button
        onClick={onClick}
        type="button"
        className="group relative flex flex-col items-center justify-end w-full max-w-[175px] h-[160px] sm:h-[168px] rounded-[34px] pt-2 pb-2.5 px-2.5 transition-transform active:scale-95 cursor-pointer shadow-sm focus:outline-none"
        style={{
          backgroundColor: '#ff8359',
        }}
      >
        <div className="absolute top-[6px] w-[110px] h-[36px] rounded-t-[26px] border-[5px] border-[#ffb194] bg-transparent pointer-events-none" />
        <div
          className="relative z-10 w-full h-[126px] rounded-[28px] flex items-center justify-center shadow-inner"
          style={{ backgroundColor: '#e24d15' }}
        >
          <div className="w-[88px] h-[88px] rounded-full bg-white flex items-center justify-center shadow-sm">
            <MyNitaLogo size={80} />
          </div>
        </div>
      </button>
    );
  }

  if (type === 'amana') {
    return (
      <button
        onClick={onClick}
        type="button"
        className="group relative flex flex-col items-center justify-end w-full max-w-[175px] h-[160px] sm:h-[168px] rounded-[34px] pt-2 pb-2.5 px-2.5 transition-transform active:scale-95 cursor-pointer shadow-sm focus:outline-none"
        style={{
          backgroundColor: '#22c55e',
        }}
      >
        <div className="absolute top-[6px] w-[110px] h-[36px] rounded-t-[26px] border-[5px] border-[#bbf7d0] bg-transparent pointer-events-none" />
        <div
          className="relative z-10 w-full h-[126px] rounded-[28px] flex items-center justify-center shadow-inner"
          style={{ backgroundColor: '#008736' }}
        >
          <div className="w-[88px] h-[88px] rounded-full bg-white flex items-center justify-center shadow-sm">
            <AmanaLogo size={80} />
          </div>
        </div>
      </button>
    );
  }

  return null;
};

/**
 * Badge circulaire pour l'historique des transactions
 */
export const TransactionBadge: React.FC<{ provider: string; size?: number }> = ({ provider, size = 36 }) => {
  if (provider === 'amana') {
    return (
      <div
        className="rounded-full bg-white border border-[#22c55e] flex items-center justify-center p-0.5 overflow-hidden flex-shrink-0 shadow-xs"
        style={{ width: size, height: size }}
      >
        <AmanaLogo size={size - 4} />
      </div>
    );
  }

  if (provider === 'nita') {
    return (
      <div
        className="rounded-full bg-white border border-[#ea580c] flex items-center justify-center p-0.5 overflow-hidden flex-shrink-0 shadow-xs"
        style={{ width: size, height: size }}
      >
        <MyNitaLogo size={size - 4} />
      </div>
    );
  }

  return (
    <div
      className="rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center font-bold text-xs text-gray-700 flex-shrink-0"
      style={{ width: size, height: size }}
    >
      SP
    </div>
  );
};
