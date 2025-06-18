import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import roleRoutes from './routes/roles.js';
import purchaseOrderRoutes from './routes/purchaseOrders.js';
import rfqRoutes from './routes/rfq.js';
import asnRoutes from './routes/asn.js';
import shipmentRoutes from './routes/shipments.js';
import notificationRoutes from './routes/notifications.js';
import materialReadinessRoutes from './routes/materialReadiness.js';
import { authenticateToken } from './middleware/auth.js';
import { getModulePermissions } from './middleware/permissions.js';
import Role from './models/Role.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/logistics-manager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  // Initialize system roles
  await Role.createSystemRoles();
  console.log('System roles initialized');
})
.catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/purchase-orders', authenticateToken, getModulePermissions, purchaseOrderRoutes);
app.use('/api/rfq', authenticateToken, getModulePermissions, rfqRoutes);
app.use('/api/asn', authenticateToken, getModulePermissions, asnRoutes);
app.use('/api/shipments', authenticateToken, getModulePermissions, shipmentRoutes);
app.use('/api/notifications', authenticateToken, getModulePermissions, notificationRoutes);
app.use('/api/material-readiness', authenticateToken, getModulePermissions, materialReadinessRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});