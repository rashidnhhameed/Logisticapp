import mongoose from 'mongoose';

const poItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  partNumber: String,
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  unit: { type: String, default: 'pcs' },
  specifications: String
});

const purchaseOrderSchema = new mongoose.Schema({
  poNumber: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'pending_approval', 'approved', 'sent_to_supplier', 'acknowledged', 'material_ready', 'shipped', 'delivered', 'cancelled'],
    default: 'draft'
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
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [poItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'AED'
  },
  deliveryAddress: {
    type: String,
    required: true
  },
  requestedDeliveryDate: {
    type: Date,
    required: true
  },
  materialReadinessDate: Date,
  terms: String,
  notes: String,
  approvedBy: String,
  approvedAt: Date
}, {
  timestamps: true
});

// Auto-generate PO number
purchaseOrderSchema.pre('save', async function(next) {
  if (!this.poNumber) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments();
    this.poNumber = `PO-${year}-${(count + 1).toString().padStart(3, '0')}`;
  }
  next();
});

export default mongoose.model('PurchaseOrder', purchaseOrderSchema);