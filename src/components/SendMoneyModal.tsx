import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  User,
  Phone,
  Contact,
  Check,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ArrowRightLeft,
} from 'lucide-react';
import { OperatorCircleHolder, SahelPayLogo } from './Logos';

export type OperatorType = 'wallet' | 'nita' | 'amana';

interface SendMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  initialSource?: OperatorType;
  initialDestination?: OperatorType;
  startAtStep?: 1 | 2;
  onConfirmSend: (data: {
    source: OperatorType;
    destination: OperatorType;
    recipientName: string;
    phoneNumber: string;
    amount: number;
    fee: number;
  }) => void;
}

export const SendMoneyModal: React.FC<SendMoneyModalProps> = ({
  isOpen,
  onClose,
  currentBalance,
  initialSource = 'wallet',
  initialDestination = 'amana',
  startAtStep = 1,
  onConfirmSend,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [sourceOperator, setSourceOperator] = useState<OperatorType>('wallet');
  const [destinationOperator, setDestinationOperator] = useState<OperatorType>('amana');
  const [amount, setAmount] = useState<string>('15000');

  // Destinataire state
  const [recipientType, setRecipientType] = useState<'self' | 'someone'>('someone');
  const [recipientName, setRecipientName] = useState<string>('');
  const [recipientPhone, setRecipientPhone] = useState<string>('');
  const [showContactPicker, setShowContactPicker] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-configured contacts for easy one-tap selection
  const frequentContacts = [
    { name: 'Moussa Halidou', phone: '+227 96 11 22 33' },
    { name: 'Abdoul Karim', phone: '+227 92 11 05 99' },
    { name: 'Fatouma Amadou', phone: '+227 90 28 44 10' },
    { name: 'Ibrahim Ousmane', phone: '+227 97 50 12 34' },
  ];

  // Reset or initialize state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSourceOperator(initialSource);
      setDestinationOperator(initialDestination);
      setCurrentStep(startAtStep);
      setError(null);
      if (initialSource === 'nita') {
        setDestinationOperator('amana');
      } else if (initialSource === 'amana') {
        setDestinationOperator('nita');
      }
    }
  }, [isOpen, initialSource, initialDestination, startAtStep]);

  if (!isOpen) return null;

  // Handle source change at Step 1
  const handleSelectSource = (op: OperatorType) => {
    setSourceOperator(op);
    setError(null);
    // Intelligent destination assignment:
    if (op === 'nita') {
      setDestinationOperator('amana');
    } else if (op === 'amana') {
      setDestinationOperator('nita');
    } else {
      setDestinationOperator('amana');
    }
  };

  // Handle destination change at Step 2 with automatic switch if identical
  const handleSelectDestination = (dest: OperatorType) => {
    if (dest === sourceOperator) {
      // Auto-switch to alternate operator
      if (dest === 'nita') {
        setDestinationOperator('amana');
      } else if (dest === 'amana') {
        setDestinationOperator('nita');
      } else {
        setDestinationOperator('amana');
      }
    } else {
      setDestinationOperator(dest);
    }
  };

  const handleSelectSelf = () => {
    setRecipientType('self');
    setRecipientName('Elhadji Mahamane');
    setRecipientPhone('+227 90 45 88 12');
    setShowContactPicker(false);
  };

  const handleSelectSomeone = () => {
    setRecipientType('someone');
    setRecipientName('');
    setRecipientPhone('');
  };

  const handlePickContact = (contact: { name: string; phone: string }) => {
    setRecipientName(contact.name);
    setRecipientPhone(contact.phone);
    setShowContactPicker(false);
    setError(null);
  };

  // Step 1 -> Step 2 validation
  const handleNextFromStep1 = () => {
    const num = parseInt(amount.replace(/\s+/g, ''), 10);
    if (isNaN(num) || num <= 0) {
      setError('Veuillez saisir un montant valide');
      return;
    }
    if (sourceOperator === 'wallet' && num > currentBalance) {
      setError(`Solde insuffisant dans votre portefeuille (${currentBalance.toLocaleString('fr-FR')} FCFA disponible)`);
      return;
    }
    setError(null);
    setCurrentStep(2);
  };

  // Step 2 -> Step 3 validation
  const handleNextFromStep2 = () => {
    if (!recipientName.trim()) {
      setError('Veuillez renseigner le nom complet du destinataire');
      return;
    }
    if (!recipientPhone.trim() || recipientPhone.length < 8) {
      setError('Veuillez renseigner un numéro de téléphone valide');
      return;
    }
    setError(null);
    setCurrentStep(3);
  };

  // Step 3 submission
  const handleFinalSubmit = () => {
    const num = parseInt(amount.replace(/\s+/g, ''), 10);
    onConfirmSend({
      source: sourceOperator,
      destination: destinationOperator,
      recipientName: recipientName.trim(),
      phoneNumber: recipientPhone.trim(),
      amount: num,
      fee: 0,
    });
    onClose();
  };

  const quickAmounts = [5000, 10000, 25000, 35000, 50000];

  const getOperatorName = (op: OperatorType) => {
    if (op === 'wallet') return 'Portefeuille Sahel Pay';
    if (op === 'nita') return 'My NITA';
    return 'AMANA';
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
          {/* Header */}
          <div className="px-6 pt-5 pb-3 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-950">Transfert Sahel Pay</h3>
              <span className="text-[11px] font-semibold text-gray-500">
                Étape {currentStep}/3 : {currentStep === 1 ? 'Opérateur & Montant' : currentStep === 2 ? 'Destinataire' : 'Validation'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            {/* ======================= ÉTAPE 1 : OPÉRATEUR & MONTANT ======================= */}
            {currentStep === 1 && (
              <div className="space-y-4">
                {/* 3:1 Grid of Circular Colored Holders */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                    1. Opérateur Source
                  </span>

                  <div className="grid grid-cols-3 gap-3 place-items-center py-2">
                    <OperatorCircleHolder
                      operator="wallet"
                      isSelected={sourceOperator === 'wallet'}
                      onClick={() => handleSelectSource('wallet')}
                      size={76}
                    />
                    <OperatorCircleHolder
                      operator="nita"
                      isSelected={sourceOperator === 'nita'}
                      onClick={() => handleSelectSource('nita')}
                      size={76}
                    />
                    <OperatorCircleHolder
                      operator="amana"
                      isSelected={sourceOperator === 'amana'}
                      onClick={() => handleSelectSource('amana')}
                      size={76}
                    />
                  </div>

                  <div className="text-center text-xs font-bold text-gray-900 mt-1">
                    Source sélectionnée : <span className="text-black">{getOperatorName(sourceOperator)}</span>
                  </div>
                </div>

                {/* Montant Input */}
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      2. Montant
                    </span>
                    {sourceOperator === 'wallet' && (
                      <span className="text-xs text-gray-500">
                        Dispo : <strong className="text-gray-900">{currentBalance.toLocaleString('fr-FR')} F</strong>
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setError(null);
                      }}
                      placeholder="0"
                      className="w-full pl-4 pr-16 py-3.5 rounded-2xl border border-gray-200 text-2xl font-black text-gray-900 bg-gray-50 focus:border-gray-900 focus:bg-white"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">
                      FCFA
                    </span>
                  </div>

                  {/* Quick Amounts */}
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {quickAmounts.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => {
                          setAmount(q.toString());
                          setError(null);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors cursor-pointer"
                      >
                        {q.toLocaleString('fr-FR')} F
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-xs font-semibold">
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleNextFromStep1}
                  className="w-full py-4 rounded-2xl bg-gray-950 hover:bg-black text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98] cursor-pointer mt-4"
                >
                  <span>Continuer vers le destinataire</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ======================= ÉTAPE 2 : DESTINATAIRE & DESTINATION ======================= */}
            {currentStep === 2 && (
              <div className="space-y-4">
                {/* Destination Operator Holders */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                    1. Opérateur Destination
                  </span>

                  <div className="grid grid-cols-3 gap-3 place-items-center py-2">
                    <OperatorCircleHolder
                      operator="wallet"
                      isSelected={destinationOperator === 'wallet'}
                      onClick={() => handleSelectDestination('wallet')}
                      size={74}
                    />
                    <OperatorCircleHolder
                      operator="nita"
                      isSelected={destinationOperator === 'nita'}
                      onClick={() => handleSelectDestination('nita')}
                      size={74}
                    />
                    <OperatorCircleHolder
                      operator="amana"
                      isSelected={destinationOperator === 'amana'}
                      onClick={() => handleSelectDestination('amana')}
                      size={74}
                    />
                  </div>

                  <div className="text-center text-xs font-bold text-gray-900 mt-1">
                    Destination : <span className="text-black">{getOperatorName(destinationOperator)}</span>
                  </div>
                </div>

                {/* Recipient Choice: Soi-même vs Quelqu'un */}
                <div className="pt-2 space-y-3">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                    2. Choix du Bénéficiaire
                  </span>

                  <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-2xl">
                    <button
                      type="button"
                      onClick={handleSelectSelf}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        recipientType === 'self'
                          ? 'bg-white text-gray-950 shadow-xs'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      Soi-même
                    </button>
                    <button
                      type="button"
                      onClick={handleSelectSomeone}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        recipientType === 'someone'
                          ? 'bg-white text-gray-950 shadow-xs'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      Quelqu'un d'autre
                    </button>
                  </div>

                  {recipientType === 'self' ? (
                    <div className="p-4 rounded-3xl bg-gray-50 border border-gray-200/80 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Mon Compte Sahel</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Automatique</span>
                      </div>
                      <div className="text-sm font-bold text-gray-950">Elhadji Mahamane</div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 block mb-1">Numéro (Éditable)</label>
                        <input
                          type="tel"
                          value={recipientPhone}
                          onChange={(e) => setRecipientPhone(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono font-bold bg-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {/* Contact button */}
                      <button
                        type="button"
                        onClick={() => setShowContactPicker(!showContactPicker)}
                        className="w-full p-3 rounded-2xl bg-[#f0f2f5] hover:bg-[#e4e6ea] flex items-center justify-center gap-2 text-xs font-bold text-gray-900 transition-colors cursor-pointer border border-gray-200/60"
                      >
                        <Contact className="w-4 h-4 text-gray-700" />
                        <span>Choisir à partir des contacts</span>
                      </button>

                      {/* Contact dropdown drawer */}
                      {showContactPicker && (
                        <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5 max-h-40 overflow-y-auto">
                          <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Contacts fréquents</span>
                          {frequentContacts.map((c, i) => (
                            <div
                              key={i}
                              onClick={() => handlePickContact(c)}
                              className="p-2 rounded-xl bg-white hover:bg-gray-100 flex items-center justify-between cursor-pointer border border-gray-100"
                            >
                              <span className="text-xs font-bold text-gray-900">{c.name}</span>
                              <span className="text-[11px] font-mono text-gray-500">{c.phone}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Inputs */}
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={recipientName}
                          onChange={(e) => {
                            setRecipientName(e.target.value);
                            setError(null);
                          }}
                          placeholder="Nom complet du destinataire"
                          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-xs font-semibold text-gray-900 bg-gray-50 focus:border-gray-900 focus:bg-white"
                        />
                      </div>

                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={recipientPhone}
                          onChange={(e) => {
                            setRecipientPhone(e.target.value);
                            setError(null);
                          }}
                          placeholder="Numéro de mobile (+227 ...)"
                          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-xs font-semibold text-gray-900 bg-gray-50 focus:border-gray-900 focus:bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-xs font-semibold">
                    {error}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="p-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Retour</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextFromStep2}
                    className="flex-1 py-4 rounded-2xl bg-gray-950 hover:bg-black text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98] cursor-pointer"
                  >
                    <span>Continuer vers la validation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ======================= ÉTAPE 3 : VALIDATION ======================= */}
            {currentStep === 3 && (
              <div className="space-y-4">
                {/* Visual Inter-Transfer Flow */}
                <div className="p-5 rounded-3xl bg-gray-50 border border-gray-200/90 space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold text-gray-400 uppercase mb-2">SOURCE</span>
                      <OperatorCircleHolder operator={sourceOperator} size={64} />
                      <span className="text-[11px] font-bold text-gray-800 mt-1">{getOperatorName(sourceOperator)}</span>
                    </div>

                    <div className="flex flex-col items-center px-2">
                      <div className="w-9 h-9 rounded-full bg-white shadow-xs border border-gray-200 flex items-center justify-center text-gray-900">
                        <ArrowRightLeft className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-bold text-emerald-600 mt-1">Inter-Pay</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold text-gray-400 uppercase mb-2">DESTINATION</span>
                      <OperatorCircleHolder operator={destinationOperator} size={64} />
                      <span className="text-[11px] font-bold text-gray-800 mt-1">{getOperatorName(destinationOperator)}</span>
                    </div>
                  </div>

                  {/* Summary Details */}
                  <div className="border-t border-gray-200 pt-3 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Destinataire</span>
                      <span className="font-bold text-gray-950">{recipientName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Numéro Mobile</span>
                      <span className="font-mono font-semibold text-gray-800">{recipientPhone}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Frais d'envoi</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <span>0% (Promo jusqu'en Janvier 2027)</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-200 pt-2 text-sm">
                      <span className="font-bold text-gray-900">Montant total</span>
                      <span className="text-xl font-black text-gray-950">
                        {parseInt(amount, 10).toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-2 text-xs text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Transfert instantané de bout en bout conforme aux normes bancaires et RGPD.</span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="p-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Modifier</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="flex-1 py-4 rounded-2xl bg-gray-950 hover:bg-black text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98] cursor-pointer"
                  >
                    <span>Terminer & Valider le transfert</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
