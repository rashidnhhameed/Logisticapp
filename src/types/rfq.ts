export interface RFQ {
  id: string;
  rfqNumber: string;
  date: string;
  status: RFQStatus;
  origin: string;
  destination: string;
  description: string;
  weight?: number;
  dimensions?: string;
  supplier?: Supplier;
  quotes: ForwarderQuote[];
  createdAt: string;
  updatedAt: string;
  selectedQuoteId?: string;
}

export interface ForwarderQuote {
  id: string;
  forwarderId: string;
  forwarder: Forwarder;
  priceAED: number;
  transitTime: string;
  validUntil: string;
  notes?: string;
  status: QuoteStatus;
  submittedAt: string;
}

export type RFQStatus = 
  | 'draft'
  | 'sent'
  | 'quoted'
  | 'awarded'
  | 'cancelled';

export type QuoteStatus = 
  | 'pending'
  | 'submitted'
  | 'accepted'
  | 'rejected';

// Re-export existing types
export type { Supplier, Forwarder } from './shipment';