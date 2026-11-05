import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  QrCode,
  Check,
  Banknote,
  ShieldCheck,
  Bus as BusIcon,
  CircleDot,
} from 'lucide-react';
import { TransportCompanyId, BusTicket } from '../types';
import { MyNitaLogo, AmanaLogo } from './Logos';
import { TRANSPORT_LOGOS } from '../utils/transportLogos';

interface BusBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: TransportCompanyId | null;
  walletBalance: number;
  onConfirmBooking: (ticket: BusTicket) => void;
}

export const BusBookingModal: React.FC<BusBookingModalProps> = ({
  isOpen,
  onClose,
  companyId,
  walletBalance,
  onConfirmBooking,
}) => {
  // Wizard Step: 1 = Voyageur, 2 = Trajet & Bus, 3 = Siège, 4 = Paiement
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Voyageur
  const [passengerType, setPassengerType] = useState<'self' | 'other'>('self');
  const [selfName] = useState('Elhadji Mahamane');
  const [selfPhone] = useState('+227 90 45 88 12');
  const [otherName, setOtherName] = useState('');
  const [otherPhone, setOtherPhone] = useState('');

  // Step 2: Trajet & Horaires
  const [departureCity, setDepartureCity] = useState('Niamey');
  const [arrivalCity, setArrivalCity] = useState('Maradi');
  const [travelDate, setTravelDate] = useState('Aujourd\'hui');
  const [selectedBusId, setSelectedBusId] = useState<string>('bus-1');

  // Step 3: Siège
  const [selectedSeat, setSelectedSeat] = useState<string>('12');

  // Step 4: Paiement
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'nita' | 'amana' | 'cash_station'>('wallet');

  // Success Confirmation State
  const [ticketConfirmed, setTicketConfirmed] = useState<BusTicket | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset booking wizard state whenever a new company or modal is opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setTicketConfirmed(null);
      setError(null);
      setSelectedSeat('12');
      setPaymentMethod('wallet');
    }
  }, [isOpen, companyId]);

  if (!isOpen || !companyId) return null;

  // Company Brand Theming & Config
  const companiesTheme: Record<TransportCompanyId, {
    name: string;
    logoImage: string;
    primaryColor: string;
    accentColor: string;
    bgAccent: string;
    badgeColor: string;
    allowedMobilePayments: ('wallet' | 'nita' | 'amana')[];
  }> = {
    salim: {
      name: 'Salim Transport',
      logoImage: TRANSPORT_LOGOS.salim,
      primaryColor: '#0d3b8e',
      accentColor: '#ea580c',
      bgAccent: '#eff6ff',
      badgeColor: 'text-[#0d3b8e] bg-blue-50 border-blue-200',
      allowedMobilePayments: ['wallet', 'nita'],
    },
    stm: {
      name: 'STM',
      logoImage: TRANSPORT_LOGOS.stm,
      primaryColor: '#008cc9',
      accentColor: '#f97316',
      bgAccent: '#f0f9ff',
      badgeColor: 'text-[#008cc9] bg-sky-50 border-sky-200',
      allowedMobilePayments: ['wallet', 'nita'],
    },
    amana_transport: {
      name: 'Amana Transport',
      logoImage: TRANSPORT_LOGOS.amana_transport,
      primaryColor: '#009696',
      accentColor: '#ea580c',
      bgAccent: '#f0fdfa',
      badgeColor: 'text-[#009696] bg-teal-50 border-teal-200',
      allowedMobilePayments: ['wallet', 'amana'],
    },
    ema: {
      name: 'EMA Transport',
      logoImage: TRANSPORT_LOGOS.ema,
      primaryColor: '#ea580c',
      accentColor: '#16a34a',
      bgAccent: '#fff7ed',
      badgeColor: 'text-[#ea580c] bg-orange-50 border-orange-200',
      allowedMobilePayments: ['wallet', 'amana'],
    },
  };

  const currentCompany = companiesTheme[companyId];

  // Available Buses that unfold automatically in Step 2
  const availableBuses = [
    {
      id: 'bus-1',
      busNumber: 'BUS N° 108 VIP',
      departureTime: '06h30',
      category: 'VIP Climatisé Starlink',
      basePrice: 13500,
    },
    {
      id: 'bus-2',
      busNumber: 'BUS N° 214 Confort',
      departureTime: '07h30',
      category: 'Express Confort',
      basePrice: 12000,
    },
    {
      id: 'bus-3',
      busNumber: 'BUS N° 302 Soir',
      departureTime: '15h00',
      category: 'Ligne Après-midi',
      basePrice: 11000,
    },
  ];

  const activeBus = availableBuses.find(b => b.id === selectedBusId) || availableBuses[0];

  // Bus seat configuration
  const occupiedSeats = ['02', '05', '09', '14', '19', '22'];
  const seatRows = [
    { row: 1, seats: ['01', '02', '03', '04'] },
    { row: 2, seats: ['05', '06', '07', '08'] },
    { row: 3, seats: ['09', '10', '11', '12'] },
    { row: 4, seats: ['13', '14', '15', '16'] },
    { row: 5, seats: ['17', '18', '19', '20'] },
    { row: 6, seats: ['21', '22', '23', '24'] },
  ];

  const finalPassengerName = passengerType === 'self' ? selfName : otherName;
  const finalPassengerPhone = passengerType === 'self' ? selfPhone : otherPhone;

  // Navigation handlers
  const handleNextStep = () => {
    setError(null);
    if (currentStep === 1) {
      if (passengerType === 'other') {
        if (!otherName.trim()) {
          setError('Veuillez renseigner le nom complet du passager');
          return;
        }
        if (!otherPhone.trim() || otherPhone.length < 8) {
          setError('Veuillez renseigner un numéro de téléphone valide');
          return;
        }
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (departureCity === arrivalCity) {
        setError('La ville de destination doit être différente de la ville de départ');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!selectedSeat) {
        setError('Veuillez sélectionner un siège disponible');
        return;
      }
      setCurrentStep(4);
    }
  };

  const handlePrevStep = () => {
    setError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleConfirmOrder = () => {
    setError(null);

    if (paymentMethod === 'wallet' && walletBalance < activeBus.basePrice) {
      setError(`Solde du portefeuille insuffisant (${walletBalance.toLocaleString('fr-FR')} FCFA dispo)`);
      return;
    }

    const ticket: BusTicket = {
      id: `tkt-${Date.now()}`,
      companyId,
      companyName: currentCompany.name,
      passengerName: finalPassengerName,
      passengerPhone: finalPassengerPhone,
      departureCity,
      arrivalCity,
      travelDate,
      departureTime: `${activeBus.departureTime} (${activeBus.busNumber})`,
      seatNumber: selectedSeat,
      price: activeBus.basePrice,
      paymentMethod: paymentMethod === 'cash_station' ? 'wallet' : paymentMethod,
      referenceCode: `${companyId.substring(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
      qrCodeData: `SAHEL-BUS:${currentCompany.name}:${departureCity}-${arrivalCity}:${selectedSeat}:${finalPassengerName}:${paymentMethod}`,
    };

    setTicketConfirmed(ticket);
    onConfirmBooking(ticket);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="w-full max-w-lg bg-white rounded-t-[36px] sm:rounded-[36px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-gray-100"
        >
          {/* Header with Company Logo & Step Indicator */}
          <div className="px-6 pt-5 pb-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center p-1.5 border border-gray-100 shadow-2xs">
                <img
                  src={currentCompany.logoImage}
                  alt={currentCompany.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-gray-950 leading-tight">
                  {currentCompany.name}
                </h3>
                <span className="text-[11px] font-semibold text-gray-500">
                  Réservation en {currentStep}/4 étapes
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress Bar */}
          {!ticketConfirmed && (
            <div className="px-6 py-3 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
              {[
                { step: 1, label: '1. Voyageur' },
                { step: 2, label: '2. Trajet' },
                { step: 3, label: '3. Siège' },
                { step: 4, label: '4. Paiement' },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      currentStep === item.step
                        ? 'text-white shadow-xs'
                        : currentStep > item.step
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                    style={{
                      backgroundColor:
                        currentStep === item.step
                          ? currentCompany.primaryColor
                          : currentStep > item.step
                          ? '#10b981'
                          : undefined,
                    }}
                  >
                    {currentStep > item.step ? '✓' : item.step}
                  </div>
                  <span
                    className={`text-[11px] font-bold hidden sm:inline ${
                      currentStep === item.step
                        ? 'text-gray-900'
                        : 'text-gray-400'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Wizard Content */}
          {!ticketConfirmed ? (
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* ===================== ÉTAPE 1 : VOYAGEUR ===================== */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-gray-950 uppercase tracking-wide">
                      Étape 1 : Informations du Voyageur
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Pour qui réservez-vous ce billet de bus ?
                    </p>
                  </div>

                  {/* Switcher: Pour moi vs Un autre */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setPassengerType('self')}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        passengerType === 'self'
                          ? 'bg-white text-gray-950 shadow-xs'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      Pour moi
                    </button>
                    <button
                      type="button"
                      onClick={() => setPassengerType('other')}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        passengerType === 'other'
                          ? 'bg-white text-gray-950 shadow-xs'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      Un autre voyageur
                    </button>
                  </div>

                  {passengerType === 'self' ? (
                    <div className="p-4 rounded-3xl bg-gray-50 border border-gray-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Profil Compte Connecté
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          Vérifié
                        </span>
                      </div>
                      <div>
                        <span className="text-base font-bold text-gray-950 block">
                          {selfName}
                        </span>
                        <span className="text-xs font-mono text-gray-500 mt-0.5 block">
                          {selfPhone}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400">
                        Vos informations de profil sont automatiquement associées à la réservation du billet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-1">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Nom & Prénom du passager
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={otherName}
                            onChange={(e) => setOtherName(e.target.value)}
                            placeholder="ex: Moussa Halidou"
                            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-xs font-semibold text-gray-900 bg-gray-50 focus:border-gray-900 focus:bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Numéro de Téléphone
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            value={otherPhone}
                            onChange={(e) => setOtherPhone(e.target.value)}
                            placeholder="ex: +227 96 11 22 33"
                            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-xs font-semibold text-gray-900 bg-gray-50 focus:border-gray-900 focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ===================== ÉTAPE 2 : TRAJET & BUS ===================== */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-gray-950 uppercase tracking-wide">
                      Étape 2 : Trajet & Horaires
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Sélectionnez les villes et la date de départ
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">
                        Ville de départ
                      </label>
                      <select
                        value={departureCity}
                        onChange={(e) => setDepartureCity(e.target.value)}
                        className="w-full p-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-900 bg-gray-50 focus:border-gray-900"
                      >
                        <option value="Niamey">Niamey (Gare Centrale)</option>
                        <option value="Maradi">Maradi</option>
                        <option value="Zinder">Zinder</option>
                        <option value="Tahoua">Tahoua</option>
                        <option value="Agadez">Agadez</option>
                        <option value="Dosso">Dosso</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">
                        Ville de destination
                      </label>
                      <select
                        value={arrivalCity}
                        onChange={(e) => setArrivalCity(e.target.value)}
                        className="w-full p-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-900 bg-gray-50 focus:border-gray-900"
                      >
                        <option value="Maradi">Maradi</option>
                        <option value="Zinder">Zinder</option>
                        <option value="Tahoua">Tahoua</option>
                        <option value="Agadez">Agadez</option>
                        <option value="Dosso">Dosso</option>
                        <option value="Niamey">Niamey</option>
                        <option value="Diffa">Diffa</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">
                      Date de départ
                    </label>
                    <select
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full p-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-900 bg-gray-50 focus:border-gray-900"
                    >
                      <option value="Aujourd'hui">Aujourd'hui ({new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })})</option>
                      <option value="Demain">Demain</option>
                      <option value="Après-demain">Après-demain</option>
                      <option value="Vendredi prochain">Vendredi prochain</option>
                    </select>
                  </div>

                  {/* UNROLLED BUS & SCHEDULES SECTION */}
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-2">
                      Départs disponibles pour ce trajet ({currentCompany.name})
                    </span>
                    <div className="space-y-2">
                      {availableBuses.map((bus) => {
                        const isSelected = selectedBusId === bus.id;
                        return (
                          <div
                            key={bus.id}
                            onClick={() => setSelectedBusId(bus.id)}
                            className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                              isSelected
                                ? 'border-gray-950 bg-gray-900 text-white shadow-sm'
                                : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                                  isSelected ? 'bg-white/20 text-white' : 'bg-white text-gray-900 shadow-2xs'
                                }`}
                              >
                                <BusIcon className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="text-xs font-bold flex items-center gap-2">
                                  <span>{bus.busNumber}</span>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                    isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                                  }`}>
                                    {bus.departureTime}
                                  </span>
                                </div>
                                <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                                  {bus.category} • Départ Garé Centrale
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-sm font-black block">
                                {bus.basePrice.toLocaleString('fr-FR')} F
                              </span>
                              {isSelected && (
                                <span className="text-[10px] font-bold text-emerald-400">
                                  Sélectionné
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ===================== ÉTAPE 3 : CHOIX DU SIÈGE ===================== */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold text-gray-950 uppercase tracking-wide">
                        Étape 3 : Choix du Siège
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Plan de cabine du bus {activeBus.busNumber}
                      </p>
                    </div>
                    <span
                      className="text-xs font-black px-3 py-1 rounded-full text-white"
                      style={{ backgroundColor: currentCompany.primaryColor }}
                    >
                      Siège N° {selectedSeat}
                    </span>
                  </div>

                  {/* Seat Legend */}
                  <div className="flex items-center justify-center gap-5 text-[11px] font-bold text-gray-600 py-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-md border border-gray-300 bg-white shadow-2xs" />
                      <span>Disponible</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-4 h-4 rounded-md text-white flex items-center justify-center text-[9px]"
                        style={{ backgroundColor: currentCompany.primaryColor }}
                      >
                        ✓
                      </div>
                      <span>Sélectionné</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-md bg-gray-200 text-gray-400 flex items-center justify-center text-[9px]">
                        ✕
                      </div>
                      <span>Occupé</span>
                    </div>
                  </div>

                  {/* Bus Cabin Visual Layout */}
                  <div className="w-full bg-[#f8f9fa] rounded-3xl p-4 border border-gray-200/90 shadow-inner">
                    {/* Cockpit / Driver Area */}
                    <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4 text-xs text-gray-500 font-semibold px-2">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-gray-300 flex items-center justify-center text-[8px] font-bold">
                          D
                        </span>
                        Cabine Chauffeur
                      </span>
                      <span className="text-[10px] uppercase font-bold text-gray-400">
                        Porte Avant ➔
                      </span>
                    </div>

                    {/* Seat Grid: 4 columns (2 Left - Aisle - 2 Right) */}
                    <div className="space-y-2.5 max-w-[280px] mx-auto">
                      {seatRows.map((r) => (
                        <div key={r.row} className="flex items-center justify-between gap-3">
                          {/* Left 2 seats */}
                          <div className="flex gap-2">
                            {r.seats.slice(0, 2).map((seat) => {
                              const isOccupied = occupiedSeats.includes(seat);
                              const isSelected = selectedSeat === seat;
                              return (
                                <button
                                  key={seat}
                                  type="button"
                                  disabled={isOccupied}
                                  onClick={() => setSelectedSeat(seat)}
                                  className={`w-10 h-10 rounded-xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                                    isSelected
                                      ? 'text-white shadow-md scale-105'
                                      : isOccupied
                                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                                      : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-200/80 shadow-2xs'
                                  }`}
                                  style={{
                                    backgroundColor: isSelected ? currentCompany.primaryColor : undefined,
                                  }}
                                >
                                  {seat}
                                </button>
                              );
                            })}
                          </div>

                          {/* Center Aisle */}
                          <div className="w-6 text-center text-[9px] font-mono text-gray-300">
                            |
                          </div>

                          {/* Right 2 seats */}
                          <div className="flex gap-2">
                            {r.seats.slice(2, 4).map((seat) => {
                              const isOccupied = occupiedSeats.includes(seat);
                              const isSelected = selectedSeat === seat;
                              return (
                                <button
                                  key={seat}
                                  type="button"
                                  disabled={isOccupied}
                                  onClick={() => setSelectedSeat(seat)}
                                  className={`w-10 h-10 rounded-xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                                    isSelected
                                      ? 'text-white shadow-md scale-105'
                                      : isOccupied
                                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                                      : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-200/80 shadow-2xs'
                                  }`}
                                  style={{
                                    backgroundColor: isSelected ? currentCompany.primaryColor : undefined,
                                  }}
                                >
                                  {seat}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ===================== ÉTAPE 4 : PAIEMENT ===================== */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-gray-950 uppercase tracking-wide">
                      Étape 4 : Mode de Paiement & Confirmation
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Vérifiez les détails et choisissez votre règlement
                    </p>
                  </div>

                  {/* Ticket Summary Card */}
                  <div className="p-4 rounded-3xl bg-gray-50 border border-gray-200/90 space-y-2.5 text-xs">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="text-gray-500">Trajet & Compagnie</span>
                      <span className="font-bold text-gray-950">
                        {departureCity} ➔ {arrivalCity} ({currentCompany.name})
                      </span>
                    </div>

                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="text-gray-500">Horaire & Bus</span>
                      <span className="font-semibold text-gray-900">
                        {travelDate} à {activeBus.departureTime} • {activeBus.busNumber}
                      </span>
                    </div>

                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="text-gray-500">Voyageur & Siège</span>
                      <span className="font-bold text-gray-950">
                        {finalPassengerName} • Siège N° {selectedSeat}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <span className="text-gray-500 font-bold uppercase">Prix du billet</span>
                      <span className="text-lg font-black text-gray-950">
                        {activeBus.basePrice.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  </div>

                  {/* Payment Options strictly adhering to user requirements */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Sélectionnez votre moyen de paiement
                    </label>

                    <div className="space-y-2">
                      {/* Option 1: Portefeuille Sahel Pay */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('wallet')}
                        className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          paymentMethod === 'wallet'
                            ? 'border-gray-950 bg-gray-900 text-white shadow-xs'
                            : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-black text-xs text-gray-900 shadow-2xs">
                            SP
                          </div>
                          <div>
                            <div className="text-xs font-bold">Portefeuille Sahel Pay</div>
                            <div className={`text-[10px] ${paymentMethod === 'wallet' ? 'text-gray-300' : 'text-gray-500'}`}>
                              Solde dispo : {walletBalance.toLocaleString('fr-FR')} FCFA
                            </div>
                          </div>
                        </div>
                        {paymentMethod === 'wallet' && <Check className="w-4 h-4 text-emerald-400" />}
                      </button>

                      {/* Option 2: My NITA (Available for Salim & STM only) */}
                      {currentCompany.allowedMobilePayments.includes('nita') && (
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('nita')}
                          className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                            paymentMethod === 'nita'
                              ? 'border-gray-950 bg-gray-900 text-white shadow-xs'
                              : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-2xs overflow-hidden">
                              <MyNitaLogo size={28} />
                            </div>
                            <div>
                              <div className="text-xs font-bold">My NITA Transfert</div>
                              <div className={`text-[10px] ${paymentMethod === 'nita' ? 'text-gray-300' : 'text-gray-500'}`}>
                                Paiement direct compte My NITA
                              </div>
                            </div>
                          </div>
                          {paymentMethod === 'nita' && <Check className="w-4 h-4 text-emerald-400" />}
                        </button>
                      )}

                      {/* Option 3: AMANA (Available for Amana Transport & EMA only) */}
                      {currentCompany.allowedMobilePayments.includes('amana') && (
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('amana')}
                          className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                            paymentMethod === 'amana'
                              ? 'border-gray-950 bg-gray-900 text-white shadow-xs'
                              : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-2xs overflow-hidden">
                              <AmanaLogo size={28} />
                            </div>
                            <div>
                              <div className="text-xs font-bold">AMANA Transfert</div>
                              <div className={`text-[10px] ${paymentMethod === 'amana' ? 'text-gray-300' : 'text-gray-500'}`}>
                                Paiement direct compte AMANA
                              </div>
                            </div>
                          </div>
                          {paymentMethod === 'amana' && <Check className="w-4 h-4 text-emerald-400" />}
                        </button>
                      )}

                      {/* Option 4: Payer en espèces à la gare (Demandé expressément !) */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cash_station')}
                        className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          paymentMethod === 'cash_station'
                            ? 'border-gray-950 bg-gray-900 text-white shadow-xs'
                            : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shadow-2xs">
                            <Banknote className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold">Payer en espèces à la gare</div>
                            <div className={`text-[10px] ${paymentMethod === 'cash_station' ? 'text-gray-300' : 'text-gray-500'}`}>
                              Règlement au guichet {currentCompany.name} avant l'embarquement
                            </div>
                          </div>
                        </div>
                        {paymentMethod === 'cash_station' && <Check className="w-4 h-4 text-emerald-400" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Banner */}
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Wizard Bottom Nav Buttons */}
              <div className="flex items-center gap-3 pt-2">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="p-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Précédent</span>
                  </button>
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-1 py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-transform active:scale-[0.98] cursor-pointer"
                    style={{ backgroundColor: currentCompany.primaryColor }}
                  >
                    <span>
                      {currentStep === 1
                        ? 'Continuer vers le Trajet'
                        : currentStep === 2
                        ? 'Choisir mon Siège'
                        : 'Passer au Paiement'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleConfirmOrder}
                    className="flex-1 py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-transform active:scale-[0.98] cursor-pointer"
                    style={{ backgroundColor: currentCompany.primaryColor }}
                  >
                    <span>
                      {paymentMethod === 'cash_station'
                        ? 'Valider la réservation (Paiement à la gare)'
                        : `Confirmer & Payer (${activeBus.basePrice.toLocaleString('fr-FR')} FCFA)`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* ===================== CONFIRMATION DU BILLET ===================== */
            <div className="p-6 overflow-y-auto space-y-4 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase border border-emerald-100">
                  {ticketConfirmed.paymentMethod === 'wallet' && paymentMethod === 'cash_station'
                    ? 'Réservation Enregistrée (Paiement Guichet)'
                    : 'Billet Électronique Validé'}
                </span>
                <h3 className="text-xl font-black text-gray-950 mt-2">
                  {ticketConfirmed.departureCity} ➔ {ticketConfirmed.arrivalCity}
                </h3>
                <p className="text-xs text-gray-500 font-semibold">{ticketConfirmed.companyName}</p>
              </div>

              {/* Boarding Pass Card */}
              <div className="w-full bg-gray-50 rounded-3xl p-5 border border-dashed border-gray-300 text-left space-y-3">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block">PASSAGER</span>
                    <span className="font-bold text-gray-900">{ticketConfirmed.passengerName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 font-bold block">SIÈGE N°</span>
                    <span
                      className="text-base font-black"
                      style={{ color: currentCompany.primaryColor }}
                    >
                      {ticketConfirmed.seatNumber}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-b border-gray-200 pb-2 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block">DÉPART</span>
                    <span className="font-semibold text-gray-800">
                      {ticketConfirmed.travelDate} à {ticketConfirmed.departureTime}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 font-bold block">PRIX</span>
                    <span className="font-bold text-gray-900">
                      {ticketConfirmed.price.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-b border-gray-200 pb-2 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block">MODE DE RÈGLEMENT</span>
                    <span className="font-bold text-gray-900">
                      {paymentMethod === 'cash_station'
                        ? 'En espèces au guichet'
                        : ticketConfirmed.paymentMethod.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 font-bold block">RÉFÉRENCE</span>
                    <span className="font-mono font-bold text-gray-900">
                      {ticketConfirmed.referenceCode}
                    </span>
                  </div>
                </div>

                {/* QR Code */}
                <div className="pt-2 flex flex-col items-center justify-center">
                  <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-xs mb-1">
                    <QrCode className="w-24 h-24 text-gray-900" />
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono text-center">
                    Présentez ce QR Code à l'embarquement à la gare {ticketConfirmed.departureCity}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-4 text-white font-bold text-sm rounded-2xl transition-all cursor-pointer shadow-md"
                style={{ backgroundColor: currentCompany.primaryColor }}
              >
                Terminer & Retourner
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
