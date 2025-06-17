export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
  expiresAt?: string;
}

export type NotificationType = 
  | 'po_created'
  | 'material_ready'
  | 'rfq_created'
  | 'rfq_quote_received'
  | 'rfq_awarded'
  | 'asn_created'
  | 'shipment_created'
  | 'shipment_update'
  | 'shipment_delivered'
  | 'system'
  | 'reminder';

export interface NotificationPreferences {
  userId: string;
  email: boolean;
  push: boolean;
  types: NotificationType[];
}