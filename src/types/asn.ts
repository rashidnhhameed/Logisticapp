export interface ASN {
  id: string;
  asnNumber: string;
  poNumber: string;
  purchaseOrder?: PurchaseOrder;
  supplier: Supplier;
  date: string;
  status: ASNStatus;
  shipmentDate: string;
  estimatedArrival: string;
  carrier: string;
  trackingNumber?: string;
  items: ASNItem[];
  packingDetails: PackingDetail[];
  documents?: Document[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ASNItem {
  id: string;
  poItemId: string;
  description: string;
  partNumber?: string;
  quantityShipped: number;
  quantityOrdered: number;
  unit: string;
  lotNumber?: string;
  serialNumbers?: string[];
}

export interface PackingDetail {
  id: string;
  packageType: string;
  packageNumber: string;
  weight: number;
  dimensions: string;
  items: string[]; // ASN Item IDs
}

export type ASNStatus = 
  | 'draft'
  | 'sent'
  | 'acknowledged'
  | 'in_transit'
  | 'delivered'
  | 'discrepancy';

// Re-export existing types
export type { Supplier, Document, PurchaseOrder } from './purchaseOrder';