export interface PurchaseOrder {
  id: string;
  poNumber: string;
  date: string;
  status: POStatus;
  supplier: Supplier;
  buyer: User;
  items: POItem[];
  totalAmount: number;
  currency: string;
  deliveryAddress: string;
  requestedDeliveryDate: string;
  materialReadinessDate?: string;
  terms: string;
  notes?: string;
  attachments?: Document[];
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface POItem {
  id: string;
  description: string;
  partNumber?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit: string;
  specifications?: string;
}

export type POStatus = 
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'sent_to_supplier'
  | 'acknowledged'
  | 'material_ready'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

// Re-export existing types
export type { Supplier, Document, User } from './shipment';