import React, { useState, useEffect, useCallback } from 'react';
import { Transaction, UserProfile, PushNotification, ProviderType, TransportCompanyId, BusTicket } from './types';
import {
  saveSecureVault,
  loadSecureVault,
  generateProofHash,
  playNotificationSound,
} from './utils/crypto';
import { setLocalCache, getLocalCache } from './utils/cache';

// Components
import { DashboardView } from './components/DashboardView';
import { BottomNav } from './components/BottomNav';
import { PhoneContainer } from './components/PhoneContainer';
import { BiometricModal } from './components/BiometricModal';
import { PushNotificationToast } from './components/PushNotificationToast';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { SendMoneyModal, OperatorType } from './components/SendMoneyModal';
import { DepositModal } from './components/DepositModal';
import { WithdrawModal } from './components/WithdrawModal';
import { QuickActionsModal } from './components/QuickActionsModal';
import { HistoryModal } from './components/HistoryModal';
import { TransactionReceiptModal } from './components/TransactionReceiptModal';
import { SecurityComplianceModal } from './components/SecurityComplianceModal';
import { BusBookingModal } from './components/BusBookingModal';

// Sub Tabs
import { ServicesTab } from './components/ServicesTab';
import { FluxTab } from './components/FluxTab';
import { ProfileTab } from './components/ProfileTab';

export default function App() {
  // 1. Initial Balance matching reference screenshot: 18,450 FCFA
  const [balance, setBalance] = useState<number>(18450);

  // User profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Elhadji Mahamane',
    phone: '+227 90 45 88 12',
    email: 'elhadji.mahamane@sahelpay.ne',
    accountNumber: 'NE24-0019-9842-8812-90',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    balance: 18450,
    currency: 'FCFA',
    biometricEnabled: true,
    biometricType: 'face',
    pushNotificationsEnabled: true,
    e2eEncryptionEnabled: true,
    encryptionKeyFingerprint: 'SHA256:7F4A-98E1-2C0B-DF48',
    lastAuditDate: '05 Nov 2026',
  });

  // Initial Transactions matching exact screenshot: "Envoie : Moussa Halidou" "35 000 F" with AMANA logo
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'tx-001',
      type: 'envoi',
      provider: 'amana',
      providerName: 'AMANA Transfert',
      recipientOrSender: 'Moussa Halidou',
      phoneNumber: '+227 96 44 20 18',
      amount: 35000,
      currency: 'F',
      formattedAmount: '35 000 F',
      date: "Aujourd'hui",
      time: '11:42',
      timestamp: Date.now() - 3600000,
      status: 'completed',
      referenceCode: 'AMN-894102',
      fee: 0,
      encryptedHash: '0x9E81A4DF23C078B1',
    },
    {
      id: 'tx-002',
      type: 'reception',
      provider: 'nita',
      providerName: 'My NITA',
      recipientOrSender: 'Abdoul Karim',
      phoneNumber: '+227 92 11 05 99',
      amount: 25000,
      currency: 'F',
      formattedAmount: '25 000 F',
      date: 'Hier',
      time: '16:15',
      timestamp: Date.now() - 86400000,
      status: 'completed',
      referenceCode: 'NIT-451928',
      fee: 0,
      encryptedHash: '0x17BF54AC9203EAA5',
    },
    {
      id: 'tx-003',
      type: 'depot',
      provider: 'amana',
      providerName: 'Agence AMANA',
      recipientOrSender: 'Dépôt Espèces Agence',
      phoneNumber: '+227 20 73 88 00',
      amount: 50000,
      currency: 'F',
      formattedAmount: '50 000 F',
      date: '02 Nov',
      time: '09:30',
      timestamp: Date.now() - 172800000,
      status: 'completed',
      referenceCode: 'DEP-102948',
      fee: 0,
      encryptedHash: '0x3344FFA891BC0211',
    },
  ]);

  // Notifications
  const [notifications, setNotifications] = useState<PushNotification[]>([
    {
      id: 'notif-1',
      title: 'Envoi AMANA Confirmé',
      body: 'Votre transfert de 35 000 FCFA à Moussa Halidou a été exécuté en temps réel.',
      timestamp: Date.now() - 3600000,
      timeAgo: 'Il y a 1h',
      read: false,
      type: 'transfer',
      transactionId: 'tx-001',
    },
    {
      id: 'notif-2',
      title: 'Audit de Sécurité RGPD',
      body: 'Vos clés de chiffrement de bout en bout ont été auditées avec succès.',
      timestamp: Date.now() - 86400000,
      timeAgo: 'Hier',
      read: true,
      type: 'security',
    },
  ]);

  // Bus Tickets state with local caching
  const [bookedTickets, setBookedTickets] = useState<BusTicket[]>([
    {
      id: 'tkt-001',
      companyId: 'stm',
      companyName: 'STM',
      passengerName: 'Elhadji Mahamane',
      passengerPhone: '+227 90 45 88 12',
      departureCity: 'Niamey',
      arrivalCity: 'Maradi',
      travelDate: '07 Nov 2026',
      departureTime: '07h30',
      seatNumber: '14',
      price: 12000,
      paymentMethod: 'wallet',
      referenceCode: 'STM-89421',
      qrCodeData: 'SAHEL_STM_NIAMEY_MARADI_14_89421',
    },
  ]);

  // Active Bottom Navigation Tab:
  // 0 = Accueil (Home)
  // 1 = Transport & Billets (Salim, STM, Amana Transport, EMA)
  // 2 = Flux & Statistiques (Portefeuille Sahel Pay)
  // 3 = Profil & Sécurité
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isRefreshingFlux, setIsRefreshingFlux] = useState<boolean>(false);

  // Modals & Overlays State
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [showBiometrics, setShowBiometrics] = useState<boolean>(false);
  const [biometricPendingAction, setBiometricPendingAction] = useState<(() => void) | null>(null);
  const [biometricDetails, setBiometricDetails] = useState<{
    title: string;
    subtitle: string;
    amount?: number;
    providerName?: string;
  }>({
    title: "Authentification Biométrique",
    subtitle: "Reconnaissance faciale ou digitale",
  });

  const [activeToast, setActiveToast] = useState<PushNotification | null>(null);
  const [showNotifCenter, setShowNotifCenter] = useState<boolean>(false);

  // Send Money Modal State
  const [showSendModal, setShowSendModal] = useState<boolean>(false);
  const [sendSource, setSendSource] = useState<OperatorType>('wallet');
  const [sendDestination, setSendDestination] = useState<OperatorType>('amana');
  const [sendStartStep, setSendStartStep] = useState<1 | 2>(1);

  // Withdraw & Deposit Modals
  const [showDepositModal, setShowDepositModal] = useState<boolean>(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);

  const [showQuickActionsModal, setShowQuickActionsModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);
  const [showSecurityModal, setShowSecurityModal] = useState<boolean>(false);

  // Bus booking modal state
  const [selectedTransportCompany, setSelectedTransportCompany] = useState<TransportCompanyId | null>(null);
  const [showBusModal, setShowBusModal] = useState<boolean>(false);

  // Load encrypted local storage vault and cached tickets on mount
  useEffect(() => {
    async function initVault() {
      const saved = await loadSecureVault<{ balance: number; transactions: Transaction[] }>();
      if (saved && typeof saved.balance === 'number') {
        setBalance(saved.balance);
        if (saved.transactions && saved.transactions.length > 0) {
          setTransactions(saved.transactions);
        }
      }

      const cachedTkts = getLocalCache<BusTicket[]>('booked_tickets');
      if (cachedTkts && cachedTkts.length > 0) {
        setBookedTickets(cachedTkts);
      }
    }
    initVault();
  }, []);

  // Save changes to encrypted local storage
  const syncVault = useCallback(async (newBal: number, newTxList: Transaction[]) => {
    await saveSecureVault({
      balance: newBal,
      transactions: newTxList,
      timestamp: Date.now(),
    });
  }, []);

  // Dispatch an instant push notification
  const triggerInstantPush = (notif: Omit<PushNotification, 'id' | 'timestamp' | 'timeAgo' | 'read'>) => {
    const fullNotif: PushNotification = {
      ...notif,
      id: `push-${Date.now()}`,
      timestamp: Date.now(),
      timeAgo: "À l'instant",
      read: false,
    };

    setNotifications(prev => [fullNotif, ...prev]);
    setActiveToast(fullNotif);
    playNotificationSound();

    setTimeout(() => {
      setActiveToast(current => (current?.id === fullNotif.id ? null : current));
    }, 5000);
  };

  // Helper to open Send Modal with custom initial params
  const handleOpenSend = (source: OperatorType = 'wallet', dest: OperatorType = 'amana', step: 1 | 2 = 1) => {
    setSendSource(source);
    setSendDestination(dest);
    setSendStartStep(step);
    setShowSendModal(true);
  };

  // 1. Transaction Handlers: Initiate Send -> Biometric auth -> Complete
  const handleInitiateSend = (txData: {
    source: OperatorType;
    destination: OperatorType;
    recipientName: string;
    phoneNumber: string;
    amount: number;
    fee: number;
  }) => {
    setShowSendModal(false);

    const sourceLabel = txData.source === 'wallet' ? 'Portefeuille Sahel' : txData.source === 'nita' ? 'My NITA' : 'AMANA';
    const destLabel = txData.destination === 'wallet' ? 'Portefeuille Sahel' : txData.destination === 'nita' ? 'My NITA' : 'AMANA';

    setBiometricDetails({
      title: "Confirmer le Transfert",
      subtitle: `${sourceLabel} ➔ ${destLabel}`,
      amount: txData.amount,
      providerName: destLabel,
    });

    setBiometricPendingAction(() => async () => {
      let newBal = balance;
      if (txData.source === 'wallet') {
        newBal = balance - txData.amount;
        setBalance(newBal);
      }

      const proof = await generateProofHash(`${txData.recipientName}_${txData.amount}_${Date.now()}`);
      const refCode = `${txData.destination === 'amana' ? 'AMN' : txData.destination === 'nita' ? 'NIT' : 'SHL'}-${Math.floor(100000 + Math.random() * 900000)}`;

      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        type: 'envoi',
        provider: txData.destination === 'wallet' ? 'amana' : txData.destination,
        providerName: `${sourceLabel} ➔ ${destLabel}`,
        recipientOrSender: txData.recipientName,
        phoneNumber: txData.phoneNumber,
        amount: txData.amount,
        currency: 'F',
        formattedAmount: `${txData.amount.toLocaleString('fr-FR')} F`,
        date: "Aujourd'hui",
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        status: 'completed',
        referenceCode: refCode,
        fee: txData.fee,
        encryptedHash: proof,
      };

      const updatedTxs = [newTx, ...transactions];
      setTransactions(updatedTxs);
      syncVault(newBal, updatedTxs);

      triggerInstantPush({
        title: `Transfert Réussi vers ${destLabel}`,
        body: `${txData.amount.toLocaleString('fr-FR')} FCFA envoyé à ${txData.recipientName} (${txData.phoneNumber}). Frais: 0% promo. Réf: ${refCode}`,
        type: 'transfer',
        transactionId: newTx.id,
      });

      setSelectedReceipt(newTx);
    });

    setShowBiometrics(true);
  };

  // 2. Deposit Handler (Recharge via NITA ou AMANA)
  const handleDepositSuccess = async (amount: number, method: string) => {
    const newBal = balance + amount;
    setBalance(newBal);

    const proof = await generateProofHash(`DEPOSIT_${amount}_${Date.now()}`);
    const refCode = `DEP-${Math.floor(100000 + Math.random() * 900000)}`;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'depot',
      provider: method.includes('AMANA') ? 'amana' : 'nita',
      providerName: method,
      recipientOrSender: `Recharge via ${method}`,
      phoneNumber: userProfile.phone,
      amount: amount,
      currency: 'F',
      formattedAmount: `${amount.toLocaleString('fr-FR')} F`,
      date: "Aujourd'hui",
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      status: 'completed',
      referenceCode: refCode,
      fee: 0,
      encryptedHash: proof,
    };

    const updatedTxs = [newTx, ...transactions];
    setTransactions(updatedTxs);
    syncVault(newBal, updatedTxs);

    triggerInstantPush({
      title: 'Recharge Sahel Pay Validée',
      body: `Votre compte a été crédité de +${amount.toLocaleString('fr-FR')} FCFA via ${method}. Nouveau solde : ${newBal.toLocaleString('fr-FR')} FCFA.`,
      type: 'transfer',
      transactionId: newTx.id,
    });
  };

  // 3. Withdrawal Handler (Retrait vers guichet AMANA ou My NITA)
  const handleConfirmWithdraw = async (data: {
    destination: 'nita' | 'amana';
    amount: number;
    withdrawalCode: string;
    agentName: string;
  }) => {
    const newBal = balance - data.amount;
    setBalance(newBal);

    const proof = await generateProofHash(`WITHDRAW_${data.withdrawalCode}_${data.amount}_${Date.now()}`);
    const refCode = `WTH-${Math.floor(100000 + Math.random() * 900000)}`;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'retrait',
      provider: data.destination,
      providerName: data.agentName,
      recipientOrSender: `Retrait Espèces (${data.withdrawalCode})`,
      phoneNumber: userProfile.phone,
      amount: data.amount,
      currency: 'F',
      formattedAmount: `${data.amount.toLocaleString('fr-FR')} F`,
      date: "Aujourd'hui",
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      status: 'completed',
      referenceCode: refCode,
      fee: 0,
      encryptedHash: proof,
    };

    const updatedTxs = [newTx, ...transactions];
    setTransactions(updatedTxs);
    syncVault(newBal, updatedTxs);

    triggerInstantPush({
      title: 'Code de Retrait Généré',
      body: `Code ${data.withdrawalCode} valide pour retrait de ${data.amount.toLocaleString('fr-FR')} FCFA en ${data.agentName}.`,
      type: 'transfer',
      transactionId: newTx.id,
    });

    setSelectedReceipt(newTx);
  };

  // 4. Bus Booking Confirmation Handler
  const handleConfirmBusBooking = async (ticket: BusTicket) => {
    const isCashAtStation = ticket.qrCodeData.includes('cash_station');
    let newBal = balance;
    if (ticket.paymentMethod === 'wallet' && !isCashAtStation) {
      newBal = balance - ticket.price;
      setBalance(newBal);
    }

    const proof = await generateProofHash(`BUS_${ticket.companyName}_${ticket.price}_${Date.now()}`);

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'paiement',
      provider: ticket.paymentMethod === 'wallet' ? 'amana' : ticket.paymentMethod,
      providerName: ticket.companyName,
      recipientOrSender: `Billet : ${ticket.departureCity} ➔ ${ticket.arrivalCity}`,
      phoneNumber: ticket.passengerPhone,
      amount: ticket.price,
      currency: 'F',
      formattedAmount: `${ticket.price.toLocaleString('fr-FR')} F`,
      date: "Aujourd'hui",
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      status: 'completed',
      referenceCode: ticket.referenceCode,
      fee: 0,
      encryptedHash: proof,
    };

    const updatedTxs = [newTx, ...transactions];
    setTransactions(updatedTxs);
    syncVault(newBal, updatedTxs);

    // Add to booked tickets and cache
    const updatedTickets = [ticket, ...bookedTickets];
    setBookedTickets(updatedTickets);
    setLocalCache('booked_tickets', updatedTickets);

    triggerInstantPush({
      title: `Billet ${ticket.companyName} Réservé`,
      body: `Trajet ${ticket.departureCity} ➔ ${ticket.arrivalCity} (Siège N° ${ticket.seatNumber}) confirmé. Réf: ${ticket.referenceCode}`,
      type: 'transfer',
      transactionId: newTx.id,
    });
  };

  // Biometrics success callback
  const handleBiometricSuccess = () => {
    setShowBiometrics(false);
    if (isLocked) {
      setIsLocked(false);
      triggerInstantPush({
        title: 'Session Déverrouillée',
        body: 'Accès sécurisé accordé via reconnaissance faciale & digitale conforme RGPD.',
        type: 'security',
      });
    }
    if (biometricPendingAction) {
      biometricPendingAction();
      setBiometricPendingAction(null);
    }
  };

  // Refresh data handler for Flux tab
  const handleRefreshFlux = () => {
    setIsRefreshingFlux(true);
    setTimeout(() => {
      setIsRefreshingFlux(false);
      triggerInstantPush({
        title: 'Données Actualisées',
        body: 'Portefeuille et transactions synchronisés avec les registres sécurisés.',
        type: 'system',
      });
    }, 700);
  };

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] flex justify-center">
      {/* Top Push Notification Banner */}
      <PushNotificationToast
        notification={activeToast}
        onDismiss={() => setActiveToast(null)}
        onClick={() => {
          if (activeToast?.transactionId) {
            const tx = transactions.find(t => t.id === activeToast.transactionId);
            if (tx) setSelectedReceipt(tx);
          }
          setActiveToast(null);
        }}
      />

      {/* Main Responsive Application Container */}
      <PhoneContainer>
        <div className="flex flex-col min-h-screen justify-between">
          {/* Active Screen View */}
          <div className="w-full flex-1">
            <div className={activeTab === 0 ? 'block' : 'hidden'}>
              <DashboardView
                balance={balance}
                userName={userProfile.name}
                accountNumber={userProfile.accountNumber}
                transactions={transactions}
                unreadNotifCount={unreadNotifCount}
                userAvatar={userProfile.avatarUrl}
                onOpenNotifications={() => setShowNotifCenter(true)}
                onOpenDeposit={() => setShowDepositModal(true)}
                onOpenSend={() => handleOpenSend('wallet', 'amana', 1)}
                onOpenWithdraw={() => setShowWithdrawModal(true)}
                onOpenNitaToAmana={() => handleOpenSend('nita', 'amana', 2)}
                onOpenAmanaToNita={() => handleOpenSend('amana', 'nita', 2)}
                onOpenQuickActions={() => setShowQuickActionsModal(true)}
                onOpenHistory={() => setShowHistoryModal(true)}
                onSelectTransaction={(tx) => setSelectedReceipt(tx)}
              />
            </div>

            <div className={activeTab === 1 ? 'block' : 'hidden'}>
              <ServicesTab
                tickets={bookedTickets}
                onSelectTransport={(companyId) => {
                  setSelectedTransportCompany(companyId);
                  setShowBusModal(true);
                }}
                onViewTicket={(ticket) => {
                  // Find or generate receipt view for ticket
                  const matchingTx = transactions.find(t => t.referenceCode === ticket.referenceCode);
                  if (matchingTx) {
                    setSelectedReceipt(matchingTx);
                  } else {
                    setSelectedReceipt({
                      id: ticket.id,
                      type: 'paiement',
                      provider: ticket.paymentMethod === 'wallet' ? 'amana' : ticket.paymentMethod,
                      providerName: ticket.companyName,
                      recipientOrSender: `Billet : ${ticket.departureCity} ➔ ${ticket.arrivalCity}`,
                      phoneNumber: ticket.passengerPhone,
                      amount: ticket.price,
                      currency: 'F',
                      formattedAmount: `${ticket.price.toLocaleString('fr-FR')} F`,
                      date: ticket.travelDate,
                      time: ticket.departureTime,
                      timestamp: Date.now(),
                      status: 'completed',
                      referenceCode: ticket.referenceCode,
                      fee: 0,
                      encryptedHash: ticket.qrCodeData,
                    });
                  }
                }}
              />
            </div>

            <div className={activeTab === 2 ? 'block' : 'hidden'}>
              <FluxTab
                balance={balance}
                transactions={transactions}
                userName={userProfile.name}
                accountNumber={userProfile.accountNumber}
                onRefresh={handleRefreshFlux}
                isRefreshing={isRefreshingFlux}
                onSelectTransaction={(tx) => setSelectedReceipt(tx)}
              />
            </div>

            <div className={activeTab === 3 ? 'block' : 'hidden'}>
              <ProfileTab
                userProfile={userProfile}
                onToggleBiometrics={() => {
                  setUserProfile(prev => ({
                    ...prev,
                    biometricEnabled: !prev.biometricEnabled,
                  }));
                }}
                onTogglePush={() => {
                  setUserProfile(prev => ({
                    ...prev,
                    pushNotificationsEnabled: !prev.pushNotificationsEnabled,
                  }));
                }}
                onOpenSecurityModal={() => setShowSecurityModal(true)}
                onTriggerLock={() => {
                  setIsLocked(true);
                  setBiometricDetails({
                    title: "Application Verrouillée",
                    subtitle: "Authentifiez-vous pour déverrouiller Sahel Pay",
                  });
                  setShowBiometrics(true);
                }}
                onTestBiometrics={() => {
                  setBiometricDetails({
                    title: "Test de Reconnaissance",
                    subtitle: "Testez l'analyse biométrique locale chiffrée",
                  });
                  setShowBiometrics(true);
                }}
              />
            </div>
          </div>

          {/* Bottom Navigation with 4 clean tabs */}
          <div className="sticky bottom-0 inset-x-0 z-20 bg-white">
            <BottomNav
              activeTab={activeTab}
              onTabChange={(idx) => setActiveTab(idx)}
            />
          </div>
        </div>
      </PhoneContainer>

      {/* Modals & Dialogs */}
      {/* 1. Biometric Authentication Modal */}
      <BiometricModal
        isOpen={showBiometrics}
        onSuccess={handleBiometricSuccess}
        onCancel={() => {
          setShowBiometrics(false);
          setBiometricPendingAction(null);
        }}
        title={biometricDetails.title}
        subtitle={biometricDetails.subtitle}
        amount={biometricDetails.amount}
        providerName={biometricDetails.providerName}
        isLockScreen={isLocked}
      />

      {/* 2. Send Money Modal (Inter-Transfert Portefeuille, NITA, AMANA) */}
      <SendMoneyModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        currentBalance={balance}
        initialSource={sendSource}
        initialDestination={sendDestination}
        startAtStep={sendStartStep}
        onConfirmSend={handleInitiateSend}
      />

      {/* 3. Deposit Modal (Recharge Portefeuille via NITA ou AMANA) */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onDepositSuccess={handleDepositSuccess}
      />

      {/* 4. Withdraw Modal (Retrait vers guichet NITA ou AMANA) */}
      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        balance={balance}
        onConfirmWithdraw={handleConfirmWithdraw}
      />

      {/* 5. Quick Actions Modal */}
      <QuickActionsModal
        isOpen={showQuickActionsModal}
        onClose={() => setShowQuickActionsModal(false)}
        onSelectNitaToAmana={() => {
          setShowQuickActionsModal(false);
          handleOpenSend('nita', 'amana', 2);
        }}
        onSelectAmanaToNita={() => {
          setShowQuickActionsModal(false);
          handleOpenSend('amana', 'nita', 2);
        }}
        onSelectDeposit={() => {
          setShowQuickActionsModal(false);
          setShowDepositModal(true);
        }}
        onSelectWithdraw={() => {
          setShowQuickActionsModal(false);
          setShowWithdrawModal(true);
        }}
        onSelectTransport={(companyId) => {
          setShowQuickActionsModal(false);
          setSelectedTransportCompany(companyId);
          setShowBusModal(true);
        }}
      />

      {/* 6. Bus Booking Modal (Salim, STM, Amana Transport, EMA) */}
      <BusBookingModal
        isOpen={showBusModal}
        onClose={() => {
          setShowBusModal(false);
          setSelectedTransportCompany(null);
        }}
        companyId={selectedTransportCompany}
        walletBalance={balance}
        onConfirmBooking={handleConfirmBusBooking}
      />

      {/* 7. History Modal */}
      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        transactions={transactions}
        onSelectTransaction={(tx) => setSelectedReceipt(tx)}
      />

      {/* 8. Transaction Receipt Modal */}
      <TransactionReceiptModal
        transaction={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />

      {/* 9. Notification Center Modal */}
      <NotificationCenterModal
        isOpen={showNotifCenter}
        onClose={() => setShowNotifCenter(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }}
        onClearAll={() => {
          setNotifications([]);
        }}
        onSelectNotification={(notif) => {
          if (notif.transactionId) {
            const tx = transactions.find(t => t.id === notif.transactionId);
            if (tx) {
              setSelectedReceipt(tx);
              setShowNotifCenter(false);
            }
          }
        }}
      />

      {/* 10. Banking Security & RGPD Compliance Modal */}
      <SecurityComplianceModal
        isOpen={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
        userProfile={userProfile}
        onRotateKeys={() => {
          const newFingerprint = `SHA256:${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
          setUserProfile(prev => ({
            ...prev,
            encryptionKeyFingerprint: newFingerprint,
          }));
          syncVault(balance, transactions);
        }}
        onExportData={() => {
          const exportObj = {
            user: userProfile,
            balance,
            transactions,
            exportedAt: new Date().toISOString(),
            complianceStandard: "RGPD Art. 20 (Droit à la portabilité) & UEMOA",
          };
          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
          const dlAnchor = document.createElement('a');
          dlAnchor.setAttribute("href", dataStr);
          dlAnchor.setAttribute("download", `sahel_pay_rgpd_export_${Date.now()}.json`);
          document.body.appendChild(dlAnchor);
          dlAnchor.click();
          dlAnchor.remove();
        }}
        onClearLocalData={() => {
          if (window.confirm("Êtes-vous sûr de vouloir purger toutes vos données locales chiffrées (Droit à l'oubli) ?")) {
            localStorage.clear();
            setTransactions([]);
            setBalance(0);
            setShowSecurityModal(false);
            triggerInstantPush({
              title: "Données locales purgées",
              body: "Conformément au RGPD, toutes les données chiffrées ont été effacées.",
              type: "security",
            });
          }
        }}
      />
    </div>
  );
}

