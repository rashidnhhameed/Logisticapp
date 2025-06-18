import mongoose from 'mongoose';

const modulePermissionSchema = new mongoose.Schema({
  module: {
    type: String,
    required: true,
    enum: [
      'dashboard',
      'purchase_orders',
      'material_readiness',
      'rfq_management',
      'shipment_tracking',
      'asn_management',
      'user_management',
      'reports',
      'settings',
      'notifications'
    ]
  },
  permissions: {
    view: { type: Boolean, default: false },
    create: { type: Boolean, default: false },
    edit: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
    approve: { type: Boolean, default: false },
    export: { type: Boolean, default: false }
  }
});

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  isSystemRole: {
    type: Boolean,
    default: false
  },
  modulePermissions: [modulePermissionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Pre-populate system roles
roleSchema.statics.createSystemRoles = async function() {
  const systemRoles = [
    {
      name: 'Super Admin',
      description: 'Full access to all modules and features',
      isSystemRole: true,
      modulePermissions: [
        'dashboard', 'purchase_orders', 'material_readiness', 'rfq_management',
        'shipment_tracking', 'asn_management', 'user_management', 'reports', 'settings', 'notifications'
      ].map(module => ({
        module,
        permissions: {
          view: true,
          create: true,
          edit: true,
          delete: true,
          approve: true,
          export: true
        }
      }))
    },
    {
      name: 'Procurement Manager',
      description: 'Full access to procurement processes',
      isSystemRole: true,
      modulePermissions: [
        { module: 'dashboard', permissions: { view: true, create: false, edit: false, delete: false, approve: false, export: true } },
        { module: 'purchase_orders', permissions: { view: true, create: true, edit: true, delete: true, approve: true, export: true } },
        { module: 'material_readiness', permissions: { view: true, create: false, edit: true, delete: false, approve: true, export: true } },
        { module: 'rfq_management', permissions: { view: true, create: true, edit: true, delete: true, approve: true, export: true } },
        { module: 'shipment_tracking', permissions: { view: true, create: true, edit: true, delete: false, approve: false, export: true } },
        { module: 'asn_management', permissions: { view: true, create: true, edit: true, delete: false, approve: false, export: true } },
        { module: 'reports', permissions: { view: true, create: false, edit: false, delete: false, approve: false, export: true } },
        { module: 'notifications', permissions: { view: true, create: false, edit: false, delete: true, approve: false, export: false } }
      ]
    },
    {
      name: 'Buyer',
      description: 'Create and manage purchase orders',
      isSystemRole: true,
      modulePermissions: [
        { module: 'dashboard', permissions: { view: true, create: false, edit: false, delete: false, approve: false, export: false } },
        { module: 'purchase_orders', permissions: { view: true, create: true, edit: true, delete: false, approve: false, export: true } },
        { module: 'material_readiness', permissions: { view: true, create: false, edit: false, delete: false, approve: false, export: true } },
        { module: 'rfq_management', permissions: { view: true, create: true, edit: true, delete: false, approve: false, export: true } },
        { module: 'shipment_tracking', permissions: { view: true, create: false, edit: false, delete: false, approve: false, export: false } },
        { module: 'asn_management', permissions: { view: true, create: false, edit: false, delete: false, approve: false, export: false } },
        { module: 'notifications', permissions: { view: true, create: false, edit: false, delete: false, approve: false, export: false } }
      ]
    },
    {
      name: 'Supplier',
      description: 'View orders and update material readiness',
      isSystemRole: true,
      modulePermissions: [
        { module: 'dashboard', permissions: { view: true, create: false, edit: false, delete: false, approve: false, export: false } },
        { module: 'purchase_orders', permissions: { view: true, create: false, edit: false, delete: false, approve: false, export: false } },
        { module: 'material_readiness', permissions: { view: true, create: false, edit: true, delete: false, approve: false, export: false } },
        { module: 'asn_management', permissions: { view: true, create: true, edit: true, delete: false, approve: false, export: false } },
        { module: 'notifications', permissions: { view: true, create: false, edit: false, delete: false, approve: false, export: false } }
      ]
    },
    {
      name: 'Logistics Coordinator',
      description: 'Manage shipments and tracking',
      isSystemRole: true,
      modulePermissions: [
        { module: 'dashboard', permissions: { view: true, create: false, edit: false, delete: false, approve: false, export: false } },
        { module: 'rfq_management', permissions: { view: true, create: false, edit: false, delete: false, approve: false, export: true } },
        { module: 'shipment_tracking', permissions: { view: true, create: true, edit: true, delete: true, approve: false, export: true } },
        { module: 'asn_management', permissions: { view: true, create: false, edit: true, delete: false, approve: false, export: true } },
        { module: 'notifications', permissions: { view: true, create: false, edit: false, delete: false, approve: false, export: false } }
      ]
    },
    {
      name: 'Viewer',
      description: 'Read-only access to most modules',
      isSystemRole: true,
      modulePermissions: [
        { module: 'dashboard', permissions: { view: true, create: false, edit: false, delete: false, approve: false, export: false } },
        { module: 'purchase_orders', permissions: { view: true, create: false, edit: false, delete: false, approve: false, export: false } },
        { module: 'material_readiness', permissions: { view: true, create: false, edit: false, delete: false, approve: false, export: false } },
        { module: 'rfq_management', permissions: { view: true, create: false, edit: false, delete: false, approve: false, export: false } },
        { module: 'shipment_tracking', permissions: { view: true, create: false, edit: false, delete: false, approve: false, export: false } },
        { module: 'asn_management', permissions: { view: true, create: false, edit: false, delete: false, approve: false, export: false } },
        { module: 'reports', permissions: { view: true, create: false, edit: false, delete: false, approve: false, export: false } },
        { module: 'notifications', permissions: { view: true, create: false, edit: false, delete: false, approve: false, export: false } }
      ]
    }
  ];

  for (const roleData of systemRoles) {
    const existingRole = await this.findOne({ name: roleData.name });
    if (!existingRole) {
      await this.create(roleData);
    }
  }
};

export default mongoose.model('Role', roleSchema);