import Role from '../models/Role.js';

export const checkPermission = (module, action) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      // Super admin bypass
      if (req.user.role === 'admin') {
        return next();
      }

      // Get user's role with permissions
      const userRole = await Role.findOne({ name: req.user.role });
      if (!userRole) {
        return res.status(403).json({ message: 'Invalid user role' });
      }

      // Find module permissions
      const modulePermission = userRole.modulePermissions.find(
        mp => mp.module === module
      );

      if (!modulePermission) {
        return res.status(403).json({ 
          message: `Access denied to ${module} module` 
        });
      }

      // Check specific permission
      if (!modulePermission.permissions[action]) {
        return res.status(403).json({ 
          message: `Insufficient permissions to ${action} in ${module}` 
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: 'Permission check failed', error: error.message });
    }
  };
};

export const getModulePermissions = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Super admin gets all permissions
    if (req.user.role === 'admin') {
      req.userPermissions = {
        dashboard: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
        purchase_orders: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
        material_readiness: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
        rfq_management: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
        shipment_tracking: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
        asn_management: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
        user_management: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
        reports: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
        settings: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
        notifications: { view: true, create: true, edit: true, delete: true, approve: true, export: true }
      };
      return next();
    }

    // Get user's role permissions
    const userRole = await Role.findOne({ name: req.user.role });
    if (!userRole) {
      return res.status(403).json({ message: 'Invalid user role' });
    }

    // Convert to object format
    req.userPermissions = {};
    userRole.modulePermissions.forEach(mp => {
      req.userPermissions[mp.module] = mp.permissions;
    });

    next();
  } catch (error) {
    res.status(500).json({ message: 'Failed to get permissions', error: error.message });
  }
};