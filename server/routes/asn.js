import express from 'express';
import ASN from '../models/ASN.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// Get all ASNs
router.get('/', async (req, res) => {
  try {
    const asns = await ASN.find()
      .populate('createdBy', 'name email')
      .populate('purchaseOrder')
      .sort({ createdAt: -1 });
    res.json(asns);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create ASN
router.post('/', async (req, res) => {
  try {
    const asn = new ASN({
      ...req.body,
      createdBy: req.user._id
    });

    await asn.save();
    await asn.populate('createdBy', 'name email');

    // Create notification for ASN creation
    await Notification.create({
      userId: req.user._id,
      type: 'asn_created',
      title: 'Advance Shipment Notice Created',
      message: `ASN ${asn.asnNumber} created for PO ${asn.poNumber}`,
      data: { asnNumber: asn.asnNumber, poNumber: asn.poNumber }
    });

    res.status(201).json(asn);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update ASN
router.put('/:id', async (req, res) => {
  try {
    const asn = await ASN.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('createdBy', 'name email');

    if (!asn) {
      return res.status(404).json({ message: 'ASN not found' });
    }

    res.json(asn);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete ASN
router.delete('/:id', async (req, res) => {
  try {
    const asn = await ASN.findByIdAndDelete(req.params.id);
    if (!asn) {
      return res.status(404).json({ message: 'ASN not found' });
    }
    res.json({ message: 'ASN deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;