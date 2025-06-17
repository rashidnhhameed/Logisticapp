import mongoose from 'mongoose';

const forwarderQuoteSchema = new mongoose.Schema({
  forwarderId: String,
  forwarder: {
    id: String,
    name: String,
    email: String,
    phone: String,
    company: String,
    address: String
  },
  priceAED: { type: Number, required: true },
  transitTime: { type: String, required: true },
  validUntil: { type: Date, required: true },
  notes: String,
  status: {
    type: String,
    enum: ['pending', 'submitted', 'accepted', 'rejected'],
    default: 'submitted'
  },
  submittedAt: { type: Date, default: Date.now }
});

const rfqSchema = new mongoose.Schema({
  rfqNumber: {
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
    enum: ['draft', 'sent', 'quoted', 'awarded', 'cancelled'],
    default: 'draft'
  },
  origin: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  weight: Number,
  dimensions: String,
  supplier: {
    id: String,
    name: String,
    email: String,
    phone: String,
    company: String,
    address: String,
    contactPerson: String
  },
  quotes: [forwarderQuoteSchema],
  selectedQuoteId: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Auto-generate RFQ number
rfqSchema.pre('save', async function(next) {
  if (!this.rfqNumber) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments();
    this.rfqNumber = `RFQ-${year}-${(count + 1).toString().padStart(3, '0')}`;
  }
  next();
});

export default mongoose.model('RFQ', rfqSchema);