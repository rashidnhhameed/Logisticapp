import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import PurchaseOrder from './models/PurchaseOrder.js';
import RFQ from './models/RFQ.js';
import ASN from './models/ASN.js';
import Shipment from './models/Shipment.js';
import Notification from './models/Notification.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/logistics-manager');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await PurchaseOrder.deleteMany({});
    await RFQ.deleteMany({});
    await ASN.deleteMany({});
    await Shipment.deleteMany({});
    await Notification.deleteMany({});

    // Create users
    const users = await User.create([
      {
        email: 'admin@company.com',
        password: 'password',
        name: 'John Admin',
        role: 'admin',
        company: 'Logistics Corp',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      },
      {
        email: 'buyer@company.com',
        password: 'password',
        name: 'Sarah Buyer',
        role: 'buyer',
        company: 'Logistics Corp',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      },
      {
        email: 'supplier@techcorp.com',
        password: 'password',
        name: 'Li Wei',
        role: 'supplier',
        company: 'TechCorp Ltd.',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      }
    ]);

    console.log('Users created successfully');

    // Create sample purchase order
    const purchaseOrder = await PurchaseOrder.create({
      date: new Date('2024-01-10'),
      status: 'material_ready',
      supplier: {
        id: users[2]._id.toString(),
        name: 'TechCorp Manufacturing',
        email: 'orders@techcorp.com',
        phone: '+86 138 0013 8000',
        company: 'TechCorp Ltd.',
        address: 'Shenzhen, Guangdong, China',
        contactPerson: 'Li Wei'
      },
      buyer: users[1]._id,
      items: [
        {
          description: 'MacBook Pro 16" M3 Max',
          partNumber: 'MBP16-M3MAX-1TB',
          quantity: 10,
          unitPrice: 2500.00,
          totalPrice: 25000.00,
          unit: 'pcs',
          specifications: 'Space Black, 1TB SSD, 32GB RAM'
        }
      ],
      totalAmount: 25000.00,
      currency: 'AED',
      deliveryAddress: 'Dubai Logistics Center, Dubai, UAE',
      requestedDeliveryDate: new Date('2024-01-25'),
      materialReadinessDate: new Date('2024-01-15'),
      terms: 'Net 30 days',
      notes: 'Urgent order for Q1 launch'
    });

    console.log('Purchase order created successfully');

    // Create sample RFQ
    const rfq = await RFQ.create({
      date: new Date('2024-01-15'),
      status: 'quoted',
      origin: 'Shanghai, China',
      destination: 'Dubai, UAE',
      description: 'Electronics Components - 50 cartons',
      weight: 250,
      dimensions: '120x80x60 cm per carton',
      supplier: {
        id: users[2]._id.toString(),
        name: 'TechCorp Manufacturing',
        email: 'orders@techcorp.com',
        phone: '+86 138 0013 8000',
        company: 'TechCorp Ltd.',
        address: 'Shenzhen, Guangdong, China',
        contactPerson: 'Li Wei'
      },
      quotes: [
        {
          forwarderId: '1',
          forwarder: {
            id: '1',
            name: 'Ahmed Al-Rashid',
            email: 'ahmed@globalfreight.ae',
            phone: '+971 50 123 4567',
            company: 'Global Freight Solutions',
            address: 'Dubai Logistics City, Dubai, UAE'
          },
          priceAED: 2800.00,
          transitTime: '7-10 days',
          validUntil: new Date('2024-01-30'),
          notes: 'Express service available',
          status: 'submitted'
        }
      ],
      createdBy: users[1]._id
    });

    console.log('RFQ created successfully');

    // Create sample notifications
    await Notification.create([
      {
        userId: users[1]._id,
        type: 'material_ready',
        title: 'Material Ready for Shipment',
        message: `${purchaseOrder.poNumber} materials are ready for pickup from TechCorp Ltd.`,
        data: { poNumber: purchaseOrder.poNumber },
        read: false
      },
      {
        userId: users[1]._id,
        type: 'rfq_quote_received',
        title: 'New Quote Received',
        message: `Global Freight Solutions submitted a quote for ${rfq.rfqNumber}`,
        data: { rfqNumber: rfq.rfqNumber },
        read: false
      }
    ]);

    console.log('Notifications created successfully');
    console.log('Database seeded successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();