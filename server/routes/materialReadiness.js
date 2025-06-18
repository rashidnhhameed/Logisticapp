import express from 'express';
import PurchaseOrder from '../models/PurchaseOrder.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// Get all POs for material readiness tracking
router.get('/', async (req, res) => {
  try {
    const { status, supplier, startDate, endDate, search } = req.query;
    
    let query = {};
    
    // Filter by status
    if (status === 'ready') {
      query.status = 'material_ready';
    } else if (status === 'pending') {
      query.status = { $in: ['approved', 'sent_to_supplier', 'acknowledged'] };
    } else if (status === 'overdue') {
      query.requestedDeliveryDate = { $lt: new Date() };
      query.status = { $nin: ['material_ready', 'shipped', 'delivered', 'cancelled'] };
    }
    
    // Filter by supplier
    if (supplier) {
      query['supplier.company'] = { $regex: supplier, $options: 'i' };
    }
    
    // Filter by date range
    if (startDate || endDate) {
      query.requestedDeliveryDate = {};
      if (startDate) query.requestedDeliveryDate.$gte = new Date(startDate);
      if (endDate) query.requestedDeliveryDate.$lte = new Date(endDate);
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { poNumber: { $regex: search, $options: 'i' } },
        { 'supplier.company': { $regex: search, $options: 'i' } }
      ];
    }
    
    const purchaseOrders = await PurchaseOrder.find(query)
      .populate('buyer', 'name email')
      .sort({ requestedDeliveryDate: 1 });
    
    res.json(purchaseOrders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update material readiness for single PO
router.put('/:id/readiness', async (req, res) => {
  try {
    const { materialReadinessDate, notes } = req.body;
    
    const purchaseOrder = await PurchaseOrder.findByIdAndUpdate(
      req.params.id,
      { 
        materialReadinessDate,
        status: 'material_ready',
        notes: notes || purchaseOrder.notes
      },
      { new: true }
    ).populate('buyer', 'name email');

    if (!purchaseOrder) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }

    // Create notification for material readiness
    await Notification.create({
      userId: purchaseOrder.buyer._id,
      type: 'material_ready',
      title: 'Material Ready for Shipment',
      message: `${purchaseOrder.poNumber} materials are ready for pickup from ${purchaseOrder.supplier.company}`,
      data: { 
        poNumber: purchaseOrder.poNumber,
        supplier: purchaseOrder.supplier.company,
        materialReadinessDate 
      }
    });

    res.json(purchaseOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Bulk update material readiness
router.put('/bulk-update', async (req, res) => {
  try {
    const { poIds, materialReadinessDate, notes } = req.body;
    
    if (!poIds || !Array.isArray(poIds) || poIds.length === 0) {
      return res.status(400).json({ message: 'PO IDs are required' });
    }
    
    const updateData = {
      materialReadinessDate,
      status: 'material_ready'
    };
    
    if (notes) {
      updateData.notes = notes;
    }
    
    const result = await PurchaseOrder.updateMany(
      { _id: { $in: poIds } },
      updateData
    );
    
    // Get updated POs for notifications
    const updatedPOs = await PurchaseOrder.find({ _id: { $in: poIds } })
      .populate('buyer', 'name email');
    
    // Create notifications for each updated PO
    const notifications = updatedPOs.map(po => ({
      userId: po.buyer._id,
      type: 'material_ready',
      title: 'Material Ready for Shipment',
      message: `${po.poNumber} materials are ready for pickup from ${po.supplier.company}`,
      data: { 
        poNumber: po.poNumber,
        supplier: po.supplier.company,
        materialReadinessDate 
      }
    }));
    
    await Notification.insertMany(notifications);
    
    res.json({ 
      message: `${result.modifiedCount} purchase orders updated successfully`,
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get material readiness statistics
router.get('/stats', async (req, res) => {
  try {
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const [
      totalPOs,
      readyPOs,
      pendingPOs,
      overduePOs,
      thisWeekPOs
    ] = await Promise.all([
      PurchaseOrder.countDocuments({ 
        status: { $nin: ['cancelled', 'delivered'] } 
      }),
      PurchaseOrder.countDocuments({ 
        status: 'material_ready' 
      }),
      PurchaseOrder.countDocuments({ 
        status: { $in: ['approved', 'sent_to_supplier', 'acknowledged'] } 
      }),
      PurchaseOrder.countDocuments({
        requestedDeliveryDate: { $lt: now },
        status: { $nin: ['material_ready', 'shipped', 'delivered', 'cancelled'] }
      }),
      PurchaseOrder.countDocuments({
        requestedDeliveryDate: { $gte: now, $lte: weekFromNow },
        status: { $nin: ['material_ready', 'shipped', 'delivered', 'cancelled'] }
      })
    ]);
    
    res.json({
      total: totalPOs,
      ready: readyPOs,
      pending: pendingPOs,
      overdue: overduePOs,
      thisWeek: thisWeekPOs
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send reminder notifications for overdue POs
router.post('/send-reminders', async (req, res) => {
  try {
    const overduePOs = await PurchaseOrder.find({
      requestedDeliveryDate: { $lt: new Date() },
      status: { $nin: ['material_ready', 'shipped', 'delivered', 'cancelled'] }
    }).populate('buyer', 'name email');
    
    const notifications = overduePOs.map(po => ({
      userId: po.buyer._id,
      type: 'reminder',
      title: 'Overdue Material Readiness',
      message: `${po.poNumber} from ${po.supplier.company} is overdue. Please follow up on material readiness.`,
      data: { 
        poNumber: po.poNumber,
        supplier: po.supplier.company,
        requestedDeliveryDate: po.requestedDeliveryDate
      }
    }));
    
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
    
    res.json({ 
      message: `Reminders sent for ${notifications.length} overdue purchase orders`,
      count: notifications.length 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;