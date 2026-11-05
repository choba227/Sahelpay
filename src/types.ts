export type ProviderType = 'amana' | 'nita';

export type TransportCompanyId = 'salim' | 'stm' | 'amana_transport' | 'ema';

export interface TransportCompany {
  id: TransportCompanyId;
  name: string;
  fullName: string;
  tagline: string;
  supportedPayments: ('wallet' | 'nita' | 'amana')[];
  routes: { from: string; to: string; price: number; duration: string }[];
}

export interface BusTicket {
  id: string;
  companyId: TransportCompanyId;
  companyName: string;
  passengerName: string;
  passengerPhone: string;
  departureCity: string;
  arrivalCity: string;
  travelDate: string;
  departureTime: string;
  seatNumber: string;
  price: number;
  paymentMethod: 'wallet' | 'nita' | 'amana';
  referenceCode: string;
  qrCodeData: string;
}

export interface Transaction {
  id: string;
  type: 'envoi' | 'reception' | 'depot' | 'retrait' | 'paiement';
  provider: ProviderType;
  providerName: string;
  recipientOrSender: string;
  phoneNumber: string;
  amount: number;
  currency: 'FCFA' | 'F';
  formattedAmount: string;
  date: string;
  time: string;
  timestamp: number;
  status: 'completed' | 'pending' | 'failed';
  referenceCode: string;
  fee: number;
  note?: string;
  encryptedHash: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  accountNumber: string;
  avatarUrl: string;
  balance: number;
  currency: string;
  biometricEnabled: boolean;
  biometricType: 'face' | 'fingerprint' | 'both';
  pushNotificationsEnabled: boolean;
  e2eEncryptionEnabled: boolean;
  encryptionKeyFingerprint: string;
  lastAuditDate: string;
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  timeAgo: string;
  read: boolean;
  type: 'transfer' | 'security' | 'promo' | 'system';
  transactionId?: string;
}
