import React from 'react';

interface BottomNavProps {
  activeTab: number;
  onTabChange: (tabIndex: number) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="w-full bg-white border-t border-gray-100/90 px-6 py-3.5 flex items-center justify-between select-none">
      {/* 1. Home (Filled house icon) */}
      <button
        onClick={() => onTabChange(0)}
        type="button"
        aria-label="Accueil"
        className={`p-2 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
          activeTab === 0 ? 'text-black scale-105' : 'text-gray-400 hover:text-gray-700'
        }`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill={activeTab === 0 ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={activeTab === 0 ? '0' : '2'}
        >
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      </button>

      {/* 2. Services / Transport interurbain bag */}
      <button
        onClick={() => onTabChange(1)}
        type="button"
        aria-label="Transport & Billets"
        className={`p-2 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
          activeTab === 1 ? 'text-black scale-105' : 'text-gray-800 hover:text-black'
        }`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </button>

      {/* 3. Flux & Statistiques */}
      <button
        onClick={() => onTabChange(2)}
        type="button"
        aria-label="Flux & Statistiques"
        className={`p-2 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
          activeTab === 2 ? 'text-black scale-105' : 'text-gray-800 hover:text-black'
        }`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Vertical flux bars */}
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
          {/* Upward dynamic flux trend curve */}
          <polyline points="4 14 9 9 13 13 19 6" />
          <polyline points="15 6 19 6 19 10" />
        </svg>
      </button>

      {/* 4. Profil & Sécurité (Stats button has been removed from bottom bar per requirement #5) */}
      <button
        onClick={() => onTabChange(3)}
        type="button"
        aria-label="Profil"
        className={`p-2 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
          activeTab === 3 ? 'text-black scale-105' : 'text-gray-800 hover:text-black'
        }`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>
    </nav>
  );
};
