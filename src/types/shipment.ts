export interface Shipment {
  id: string;
  trackingNumber: string;
  carrier: string;
  description: string;
  status: ShipmentStatus;
  origin: string;
  destination: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  createdAt: string;
  updatedAt: string;
  trackingHistory: TrackingEvent[];
  forwarder?: Forwarder;
  confirmedRateAED?: number;
  supplier?: Supplier;
  documents?: Document[];
}

export interface TrackingEvent {
  id: string;
  timestamp: string;
  location: string;
  status: ShipmentStatus;
  description: string;
}

export interface Forwarder {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  contactPerson: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  url?: string;
}

export type ShipmentStatus = 
  | 'pending'
  | 'picked-up'
  | 'in-transit'
  | 'out-for-delivery'
  | 'delivered'
  | 'exception'
  | 'returned';

export const CARRIERS = [
  'FedEx',
  'UPS',
  'USPS',
  'DHL',
  'Amazon',
  'Other'
] as const;

export type Carrier = typeof CARRIERS[number];