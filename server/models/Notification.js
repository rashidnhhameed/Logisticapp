import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['po_created', 'material_ready', 'rfq_created', 'rfq_quote_received', 'rfq_awarded', 'asn_created', 'shipment_created', 'shipment_update', 'shipment_delivered', 'system', 'reminder'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: mongoose.Schema.Types.Mixed,
  read: {
    type: Boolean,
    default: false
  },
  expiresAt: Date
}, {
  timestamps: true
});

export default mongoose.model('Notification', notificationSchema);