import React from 'react';
import { TransportCompanyId, BusTicket } from '../types';
import { QrCode, Ticket } from 'lucide-react';
import { TRANSPORT_LOGOS } from '../utils/transportLogos';

interface ServicesTabProps {
  onSelectTransport: (companyId: TransportCompanyId) => void;
  tickets?: BusTicket[];
  onViewTicket?: (ticket: BusTicket) => void;
}

export const ServicesTab: React.FC<ServicesTabProps> = ({
  onSelectTransport,
  tickets = [],
  onViewTicket,
}) => {
  const companies: {
    id: TransportCompanyId;
    name: string;
    logoImage: string;
  }[] = [
    {
      id: 'salim',
      name: 'Salim Transport',
      logoImage: TRANSPORT_LOGOS.salim,
    },
    {
      id: 'stm',
      name: 'STM',
      logoImage: TRANSPORT_LOGOS.stm,
    },
    {
      id: 'amana_transport',
      name: 'Amana Transport',
      logoImage: TRANSPORT_LOGOS.amana_transport,
    },
    {
      id: 'ema',
      name: 'EMA Transport',
      logoImage: TRANSPORT_LOGOS.ema,
    },
  ];

  return (
    <div className="w-full flex flex-col bg-white select-none pt-1 pb-16 space-y-6">
      {/* Title in exact Home page style */}
      <div className="pt-2">
        <h2 className="text-[22px] font-bold text-black tracking-normal leading-tight">
          Transport Interurbain
        </h2>
        <p className="text-[14px] text-gray-500 mt-1 font-medium">
          Réservation de billets de voyage en bus
        </p>
      </div>

      {/* Spacious, airy 2:2 grid of enlarged circular holders with exact provided logos */}
      <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:gap-x-10 place-items-center py-4 w-full">
        {companies.map((company) => (
          <div
            key={company.id}
            onClick={() => onSelectTransport(company.id)}
            className="flex flex-col items-center text-center cursor-pointer group w-full"
          >
            {/* Enlarged, airy circular holder matching home screen design */}
            <div className="w-[104px] h-[104px] sm:w-[118px] sm:h-[118px] rounded-full bg-[#f0f2f5] hover:bg-[#e4e6ea] flex items-center justify-center transition-all duration-200 active:scale-95 shadow-2xs group-hover:shadow-md border border-gray-100 p-3.5 overflow-hidden">
              <img
                src={company.logoImage}
                alt={company.name}
                className="w-full h-full object-contain filter drop-shadow-xs group-hover:scale-105 transition-transform duration-200"
                loading="eager"
                decoding="sync"
              />
            </div>

            {/* ONLY the company name beneath the holder */}
            <h3 className="text-[16px] sm:text-[17px] font-bold text-black mt-3.5 tracking-tight text-center leading-tight">
              {company.name}
            </h3>
          </div>
        ))}
      </div>

      {/* REQUIREMENT 2: Section Historique des Voyages / Mes Billets en bas */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between pb-3">
          <h3 className="text-[19px] font-bold text-black tracking-tight">
            Mes Billets & Historique
          </h3>
          <span className="text-xs font-semibold text-gray-500">
            {tickets.length} réservation(s)
          </span>
        </div>

        {tickets.length === 0 ? (
          <div className="p-6 bg-gray-50 rounded-3xl text-center text-gray-400 space-y-1">
            <Ticket className="w-8 h-8 text-gray-300 mx-auto mb-1" />
            <p className="text-xs font-bold text-gray-700">Aucun billet dans l'historique</p>
            <p className="text-[11px] text-gray-500">
              Choisissez l'une des 4 compagnies ci-dessus pour effectuer votre première réservation.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {tickets.map((tkt) => (
              <div
                key={tkt.id}
                onClick={() => onViewTicket && onViewTicket(tkt)}
                className="p-3.5 rounded-3xl bg-gray-50 hover:bg-gray-100 border border-gray-200/70 flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-white p-1 border border-gray-200 shadow-2xs flex items-center justify-center flex-shrink-0">
                    <img
                      src={TRANSPORT_LOGOS[tkt.companyId] || TRANSPORT_LOGOS.stm}
                      alt={tkt.companyName}
                      className="w-full h-full object-contain"
                      loading="eager"
                      decoding="sync"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-gray-950 truncate">
                      {tkt.departureCity} ➔ {tkt.arrivalCity}
                    </div>
                    <div className="text-[10px] text-gray-500 font-medium truncate mt-0.5">
                      {tkt.companyName} • Siège N° {tkt.seatNumber} • {tkt.travelDate}
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 pl-2">
                  <span className="text-xs font-black text-gray-950 block">
                    {tkt.price.toLocaleString('fr-FR')} F
                  </span>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                    Voir Billet
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
