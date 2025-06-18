import express from 'express';
import Role from '../models/Role.js';
import { authenticateToken } from '../middleware/auth.js';
import { checkPermission } from '../middleware/permissions.js';

const router = express.Router();

// Get all roles
router.get('/', 
  authenticateToken, 
  checkPermission('user_management', 'view'),
  async (req, res) => {
    try {
      const roles = await Role.find().sort({ isSystemRole: -1, name: 1 });
      res.json(roles);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Create custom role
router.post('/', 
  authenticateToken, 
  checkPermission('user_management', 'create'),
  async (req, res) => {
    try {
      const { name, description, modulePermissions } = req.body;
      
      // Check if role name already exists
      const existingRole = await Role.findOne({ name });
      if (existingRole) {
        return res.status(400).json({ message: 'Role name already exists' });
      }
      
      const role = new Role({
        name,
        description,
        modulePermissions,
        isSystemRole: false,
        createdBy: req.user._id
      });
      
      await role.save();
      res.status(201).json(role);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Update role (only custom roles)
router.put('/:id', 
  authenticateToken, 
  checkPermission('user_management', 'edit'),
  async (req, res) => {
    try {
      const { name, description, modulePermissions } = req.body;
      
      const role = await Role.findById(req.params.id);
      if (!role) {
        return res.status(404).json({ message: 'Role not found' });
      }
      
      if (role.isSystemRole) {
        return res.status(400).json({ message: 'Cannot modify system roles' });
      }
      
      // Check if new name conflicts with existing role
      if (name !== role.name) {
        const existingRole = await Role.findOne({ name });
        if (existingRole) {
          return res.status(400).json({ message: 'Role name already exists' });
        }
      }
      
      role.name = name;
      role.description = description;
      role.modulePermissions = modulePermissions;
      
      await role.save();
      res.json(role);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Delete role (only custom roles)
router.delete('/:id', 
  authenticateToken, 
  checkPermission('user_management', 'delete'),
  async (req, res) => {
    try {
      const role = await Role.findById(req.params.id);
      if (!role) {
        return res.status(404).json({ message: 'Role not found' });
      }
      
      if (role.isSystemRole) {
        return res.status(400).json({ message: 'Cannot delete system roles' });
      }
      
      // Check if role is being used by any users
      const User = (await import('../models/User.js')).default;
      const usersWithRole = await User.countDocuments({ role: role.name });
      if (usersWithRole > 0) {
        return res.status(400).json({ 
          message: `Cannot delete role. ${usersWithRole} user(s) are assigned to this role.` 
        });
      }
      
      await Role.findByIdAndDelete(req.params.id);
      res.json({ message: 'Role deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Get available modules and permissions
router.get('/modules', 
  authenticateToken, 
  checkPermission('user_management', 'view'),
  async (req, res) => {
    try {
      const modules = [
        {
          id: 'dashboard',
          name: 'Dashboard',
          description: 'View dashboard and analytics'
        },
        {
          id: 'purchase_orders',
          name: 'Purchase Orders',
          description: 'Manage purchase orders'
        },
        {
          id: 'material_readiness',
          name: 'Material Readiness',
          description: 'Track material readiness status'
        },
        {
          id: 'rfq_management',
          name: 'RFQ Management',
          description: 'Create and manage RFQs'
        },
        {
          id: 'shipment_tracking',
          name: 'Shipment Tracking',
          description: 'Track shipments and deliveries'
        },
        {
          id: 'asn_management',
          name: 'ASN Management',
          description: 'Manage advance shipment notices'
        },
        {
          id: 'user_management',
          name: 'User Management',
          description: 'Manage users and permissions'
        },
        {
          id: 'reports',
          name: 'Reports',
          description: 'Generate and view reports'
        },
        {
          id: 'settings',
          name: 'Settings',
          description: 'System configuration'
        },
        {
          id: 'notifications',
          name: 'Notifications',
          description: 'Manage notifications'
        }
      ];
      
      const permissions = [
        { id: 'view', name: 'View', description: 'View module content' },
        { id: 'create', name: 'Create', description: 'Create new records' },
        { id: 'edit', name: 'Edit', description: 'Edit existing records' },
        { id: 'delete', name: 'Delete', description: 'Delete records' },
        { id: 'approve', name: 'Approve', description: 'Approve/authorize actions' },
        { id: 'export', name: 'Export', description: 'Export data' }
      ];
      
      res.json({ modules, permissions });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

export default router;