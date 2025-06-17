import mongoose from 'mongoose';

const trackingEventSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  location: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'picked-up', 'in-transit', 'out-for-delivery', 'delivered', 'exception', 'returned'],
    required: true
  },
  description: { type: String, required: true }
});

const shipmentSchema = new mongoose.Schema({
  trackingNumber: {
    type: String,
    required: true,
    unique: true
  },
  carrier: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'picked-up', 'in-transit', 'out-for-delivery', 'delivered', 'exception', 'returned'],
    default: 'pending'
  },
  origin: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  estimatedDelivery: {
    type: Date,
    required: true
  },
  actualDelivery: Date,
  confirmedRateAED: Number,
  forwarder: {
    id: String,
    name: String,
    email: String,
    phone: String,
    company: String,
    address: String
  },
  supplier: {
    id: String,
    name: String,
    email: String,
    phone: String,
    company: String,
    address: String,
    contactPerson: String
  },
  trackingHistory: [trackingEventSchema],
  asnId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ASN'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Shipment', shipmentSchema);