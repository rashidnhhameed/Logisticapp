import mongoose from 'mongoose';

const asnItemSchema = new mongoose.Schema({
  poItemId: String,
  description: { type: String, required: true },
  partNumber: String,
  quantityShipped: { type: Number, required: true },
  quantityOrdered: { type: Number, required: true },
  unit: { type: String, default: 'pcs' },
  lotNumber: String,
  serialNumbers: [String]
});

const packingDetailSchema = new mongoose.Schema({
  packageType: { type: String, required: true },
  packageNumber: { type: String, required: true },
  weight: { type: Number, required: true },
  dimensions: { type: String, required: true },
  items: [String] // ASN Item IDs
});

const asnSchema = new mongoose.Schema({
  asnNumber: {
    type: String,
    required: true,
    unique: true
  },
  poNumber: {
    type: String,
    required: true
  },
  purchaseOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PurchaseOrder'
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
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'acknowledged', 'in_transit', 'delivered', 'discrepancy'],
    default: 'draft'
  },
  shipmentDate: {
    type: Date,
    required: true
  },
  estimatedArrival: {
    type: Date,
    required: true
  },
  carrier: {
    type: String,
    required: true
  },
  trackingNumber: String,
  items: [asnItemSchema],
  packingDetails: [packingDetailSchema],
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Auto-generate ASN number
asnSchema.pre('save', async function(next) {
  if (!this.asnNumber) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments();
    this.asnNumber = `ASN-${year}-${(count + 1).toString().padStart(3, '0')}`;
  }
  next();
});

export default mongoose.model('ASN', asnSchema);