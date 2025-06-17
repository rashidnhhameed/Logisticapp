import express from 'express';
import Shipment from '../models/Shipment.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// Get all shipments
router.get('/', async (req, res) => {
  try {
    const shipments = await Shipment.find()
      .populate('createdBy', 'name email')
      .populate('asnId')
      .sort({ createdAt: -1 });
    res.json(shipments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create shipment
router.post('/', async (req, res) => {
  try {
    const shipment = new Shipment({
      ...req.body,
      createdBy: req.user._id,
      trackingHistory: [{
        timestamp: new Date(),
        location: req.body.origin,
        status: req.body.status || 'pending',
        description: 'Shipment created'
      }]
    });

    await shipment.save();
    await shipment.populate('createdBy', 'name email');

    // Create notification for shipment creation
    await Notification.create({
      userId: req.user._id,
      type: 'shipment_created',
      title: 'Shipment Created',
      message: `Shipment ${shipment.trackingNumber} has been created`,
      data: { trackingNumber: shipment.trackingNumber }
    });

    res.status(201).json(shipment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add tracking event
router.post('/:id/tracking', async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    shipment.trackingHistory.push(req.body);
    shipment.status = req.body.status;
    
    if (req.body.status === 'delivered') {
      shipment.actualDelivery = new Date();
    }

    await shipment.save();

    // Create notification for shipment update
    await Notification.create({
      userId: shipment.createdBy,
      type: req.body.status === 'delivered' ? 'shipment_delivered' : 'shipment_update',
      title: req.body.status === 'delivered' ? 'Shipment Delivered' : 'Shipment Update',
      message: `Shipment ${shipment.trackingNumber} is now ${req.body.status.replace('-', ' ')}`,
      data: { trackingNumber: shipment.trackingNumber, status: req.body.status }
    });

    res.json(shipment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update shipment
router.put('/:id', async (req, res) => {
  try {
    const shipment = await Shipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('createdBy', 'name email');

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    res.json(shipment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete shipment
router.delete('/:id', async (req, res) => {
  try {
    const shipment = await Shipment.findByIdAndDelete(req.params.id);
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }
    res.json({ message: 'Shipment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;