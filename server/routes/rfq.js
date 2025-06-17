import express from 'express';
import RFQ from '../models/RFQ.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// Get all RFQs
router.get('/', async (req, res) => {
  try {
    const rfqs = await RFQ.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(rfqs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create RFQ
router.post('/', async (req, res) => {
  try {
    const rfq = new RFQ({
      ...req.body,
      createdBy: req.user._id
    });

    await rfq.save();
    await rfq.populate('createdBy', 'name email');

    // Create notification
    await Notification.create({
      userId: req.user._id,
      type: 'rfq_created',
      title: 'RFQ Created',
      message: `RFQ ${rfq.rfqNumber} has been created successfully`,
      data: { rfqNumber: rfq.rfqNumber }
    });

    res.status(201).json(rfq);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add quote to RFQ
router.post('/:id/quotes', async (req, res) => {
  try {
    const rfq = await RFQ.findById(req.params.id);
    if (!rfq) {
      return res.status(404).json({ message: 'RFQ not found' });
    }

    rfq.quotes.push(req.body);
    rfq.status = 'quoted';
    await rfq.save();

    // Create notification for quote received
    await Notification.create({
      userId: rfq.createdBy,
      type: 'rfq_quote_received',
      title: 'New Quote Received',
      message: `${req.body.forwarder.company} submitted a quote for ${rfq.rfqNumber}`,
      data: { rfqNumber: rfq.rfqNumber, forwarder: req.body.forwarder.company }
    });

    res.json(rfq);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Select quote
router.post('/:id/select-quote', async (req, res) => {
  try {
    const { quoteId } = req.body;
    const rfq = await RFQ.findByIdAndUpdate(
      req.params.id,
      { 
        selectedQuoteId: quoteId,
        status: 'awarded'
      },
      { new: true }
    );

    if (!rfq) {
      return res.status(404).json({ message: 'RFQ not found' });
    }

    const selectedQuote = rfq.quotes.id(quoteId);
    
    // Create notification for awarded RFQ
    await Notification.create({
      userId: rfq.createdBy,
      type: 'rfq_awarded',
      title: 'RFQ Awarded',
      message: `${rfq.rfqNumber} has been awarded to ${selectedQuote.forwarder.company}`,
      data: { rfqNumber: rfq.rfqNumber, forwarder: selectedQuote.forwarder.company }
    });

    res.json(rfq);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete RFQ
router.delete('/:id', async (req, res) => {
  try {
    const rfq = await RFQ.findByIdAndDelete(req.params.id);
    if (!rfq) {
      return res.status(404).json({ message: 'RFQ not found' });
    }
    res.json({ message: 'RFQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;