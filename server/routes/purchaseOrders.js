import express from 'express';
import PurchaseOrder from '../models/PurchaseOrder.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// Get all purchase orders
router.get('/', async (req, res) => {
  try {
    const purchaseOrders = await PurchaseOrder.find()
      .populate('buyer', 'name email')
      .sort({ createdAt: -1 });
    res.json(purchaseOrders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create purchase order
router.post('/', async (req, res) => {
  try {
    const purchaseOrder = new PurchaseOrder({
      ...req.body,
      buyer: req.user._id
    });

    await purchaseOrder.save();
    await purchaseOrder.populate('buyer', 'name email');

    // Create notification for supplier
    if (purchaseOrder.supplier.id) {
      await Notification.create({
        userId: purchaseOrder.supplier.id,
        type: 'po_created',
        title: 'New Purchase Order',
        message: `Purchase Order ${purchaseOrder.poNumber} has been created`,
        data: { poNumber: purchaseOrder.poNumber }
      });
    }

    res.status(201).json(purchaseOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update purchase order
router.put('/:id', async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('buyer', 'name email');

    if (!purchaseOrder) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }

    // Send notification for material readiness
    if (req.body.status === 'material_ready' && req.body.materialReadinessDate) {
      await Notification.create({
        userId: purchaseOrder.buyer._id,
        type: 'material_ready',
        title: 'Material Ready for Shipment',
        message: `${purchaseOrder.poNumber} materials are ready for pickup from ${purchaseOrder.supplier.company}`,
        data: { poNumber: purchaseOrder.poNumber }
      });
    }

    res.json(purchaseOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete purchase order
router.delete('/:id', async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findByIdAndDelete(req.params.id);
    if (!purchaseOrder) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }
    res.json({ message: 'Purchase order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;