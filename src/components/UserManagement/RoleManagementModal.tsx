import React, { useState, useEffect } from 'react';
import { X, Shield, Plus, Edit, Trash2, Lock } from 'lucide-react';
import { roleAPI } from '../../services/api';

interface RoleManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RoleManagementModal({ isOpen, onClose }: RoleManagementModalProps) {
  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    modulePermissions: []
  });

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesResponse, modulesResponse] = await Promise.all([
        roleAPI.getAll(),
        roleAPI.getModules()
      ]);
      
      setRoles(rolesResponse.data);
      setModules(modulesResponse.data.modules);
      setPermissions(modulesResponse.data.permissions);
    } catch (error) {
      console.error('Error fetching roles data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = () => {
    setFormData({
      name: '',
      description: '',
      modulePermissions: modules.map(module => ({
        module: module.id,
        permissions: {
          view: false,
          create: false,
          edit: false,
          delete: false,
          approve: false,
          export: false
        }
      }))
    });
    setEditingRole(null);
    setShowCreateForm(true);
  };

  const handleEditRole = (role) => {
    setFormData({
      name: role.name,
      description: role.description,
      modulePermissions: modules.map(module => {
        const existing = role.modulePermissions.find(mp => mp.module === module.id);
        return {
          module: module.id,
          permissions: existing ? existing.permissions : {
            view: false,
            create: false,
            edit: false,
            delete: false,
            approve: false,
            export: false
          }
        };
      })
    });
    setEditingRole(role);
    setShowCreateForm(true);
  };

  const handleSubmitRole = async (e) => {
    e.preventDefault();
    
    try {
      if (editingRole) {
        await roleAPI.update(editingRole._id, formData);
      } else {
        await roleAPI.create(formData);
      }
      
      await fetchData();
      setShowCreateForm(false);
      setEditingRole(null);
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await roleAPI.delete(roleId);
        await fetchData();
      } catch (error) {
        console.error('Error deleting role:', error);
        alert('Failed to delete role. It may be in use by existing users.');
      }
    }
  };

  const updatePermission = (moduleIndex, permissionKey, value) => {
    const updatedPermissions = [...formData.modulePermissions];
    updatedPermissions[moduleIndex].permissions[permissionKey] = value;
    setFormData({ ...formData, modulePermissions: updatedPermissions });
  };

  const toggleAllPermissions = (moduleIndex, enable) => {
    const updatedPermissions = [...formData.modulePermissions];
    Object.keys(updatedPermissions[moduleIndex].permissions).forEach(key => {
      updatedPermissions[moduleIndex].permissions[key] = enable;
    });
    setFormData({ ...formData, modulePermissions: updatedPermissions });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Role Management</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : showCreateForm ? (
            <form onSubmit={handleSubmitRole} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingRole ? 'Edit Role' : 'Create New Role'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter role name"
                    disabled={editingRole?.isSystemRole}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter role description"
                  />
                </div>
              </div>

              {editingRole?.isSystemRole && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> This is a system role. You can only modify permissions, not the name.
                  </p>
                </div>
              )}

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Module Permissions</h4>
                <div className="space-y-4">
                  {modules.map((module, moduleIndex) => {
                    const modulePermissions = formData.modulePermissions[moduleIndex];
                    const hasAnyPermission = Object.values(modulePermissions?.permissions || {}).some(Boolean);
                    
                    return (
                      <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h5 className="font-medium text-gray-900">{module.name}</h5>
                            <p className="text-sm text-gray-500">{module.description}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => toggleAllPermissions(moduleIndex, true)}
                              className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                            >
                              All
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleAllPermissions(moduleIndex, false)}
                              className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                            >
                              None
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                          {permissions.map(permission => (
                            <label key={permission.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={modulePermissions?.permissions[permission.id] || false}
                                onChange={(e) => updatePermission(moduleIndex, permission.id, e.target.checked)}
                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              />
                              <span className="text-sm text-gray-700">{permission.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  {editingRole ? 'Update Role' : 'Create Role'}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Roles & Permissions</h3>
                <button
                  onClick={handleCreateRole}
                  className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Role
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map(role => (
                  <div key={role._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${role.isSystemRole ? 'bg-blue-50' : 'bg-purple-50'}`}>
                          {role.isSystemRole ? (
                            <Lock className={`h-5 w-5 ${role.isSystemRole ? 'text-blue-600' : 'text-purple-600'}`} />
                          ) : (
                            <Shield className={`h-5 w-5 ${role.isSystemRole ? 'text-blue-600' : 'text-purple-600'}`} />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{role.name}</h4>
                          <p className="text-sm text-gray-500">{role.description}</p>
                        </div>
                      </div>
                      
                      {!role.isSystemRole && (
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEditRole(role)}
                            className="p-1 text-gray-400 hover:text-blue-600"
                            title="Edit Role"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRole(role._id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Delete Role"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Modules Access:</span>
                        <span className="font-medium text-gray-900">
                          {role.modulePermissions?.length || 0}
                        </span>
                      </div>
                      
                      {role.isSystemRole && (
                        <div className="flex items-center space-x-2">
                          <Lock className="h-3 w-3 text-blue-500" />
                          <span className="text-xs text-blue-600">System Role</span>
                        </div>
                      )}
                      
                      <button
                        onClick={() => handleEditRole(role)}
                        className="w-full mt-3 px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors"
                      >
                        {role.isSystemRole ? 'View Permissions' : 'Edit Role'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}