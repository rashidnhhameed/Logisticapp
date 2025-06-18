import React, { useState } from 'react';
import { Search, Filter, Clock, CheckCircle, AlertTriangle, Calendar, Bell, Download } from 'lucide-react';
import { useMaterialReadiness } from '../hooks/useMaterialReadiness';
import { MaterialReadinessCard } from './MaterialReadinessCard';
import { MaterialReadinessModal } from './MaterialReadinessModal';
import { BulkUpdateModal } from './BulkUpdateModal';

export function MaterialReadinessDashboard() {
  const {
    purchaseOrders,
    stats,
    loading,
    filters,
    updateMaterialReadiness,
    bulkUpdateMaterialReadiness,
    sendReminders,
    updateFilters,
    isOverdue,
    getDaysUntilDelivery
  } = useMaterialReadiness();

  const [selectedPO, setSelectedPO] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedPOs, setSelectedPOs] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    updateFilters({ search: term || undefined });
  };

  const handleSupplierFilter = (supplier: string) => {
    setSupplierFilter(supplier);
    updateFilters({ supplier: supplier || undefined });
  };

  const handleStatusFilter = (status: string) => {
    updateFilters({ status: status === 'all' ? undefined : status as any });
  };

  const handleSelectPO = (poId: string, selected: boolean) => {
    if (selected) {
      setSelectedPOs(prev => [...prev, poId]);
    } else {
      setSelectedPOs(prev => prev.filter(id => id !== poId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedPOs(purchaseOrders.map(po => po.id));
    } else {
      setSelectedPOs([]);
    }
  };

  const handleUpdateReadiness = async (id: string, materialReadinessDate: string, notes?: string) => {
    try {
      await updateMaterialReadiness(id, materialReadinessDate, notes);
      setShowUpdateModal(false);
      setSelectedPO(null);
    } catch (error) {
      console.error('Error updating material readiness:', error);
    }
  };

  const handleBulkUpdate = async (materialReadinessDate: string, notes?: string) => {
    try {
      await bulkUpdateMaterialReadiness(selectedPOs, materialReadinessDate, notes);
      setShowBulkModal(false);
      setSelectedPOs([]);
    } catch (error) {
      console.error('Error bulk updating material readiness:', error);
    }
  };

  const handleSendReminders = async () => {
    try {
      const result = await sendReminders();
      alert(`Reminders sent for ${result.count} overdue purchase orders`);
    } catch (error) {
      console.error('Error sending reminders:', error);
    }
  };

  const uniqueSuppliers = [...new Set(purchaseOrders.map(po => po.supplier.company))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Material Readiness</h1>
            <p className="text-gray-600 mt-1">Track and manage material readiness for purchase orders</p>
          </div>
          <div className="flex space-x-3">
            {stats.overdue > 0 && (
              <button
                onClick={handleSendReminders}
                className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
              >
                <Bell className="h-5 w-5 mr-2" />
                Send Reminders ({stats.overdue})
              </button>
            )}
            {selectedPOs.length > 0 && (
              <button
                onClick={() => setShowBulkModal(true)}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Bulk Update ({selectedPOs.length})
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total POs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ready</p>
                <p className="text-2xl font-bold text-gray-900">{stats.ready}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">{stats.thisWeek}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search PO number or supplier..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status || 'all'}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="ready">Ready</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
              <select
                value={supplierFilter}
                onChange={(e) => handleSupplierFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Suppliers</option>
                {uniqueSuppliers.map(supplier => (
                  <option key={supplier} value={supplier}>{supplier}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedPOs.length === purchaseOrders.length && purchaseOrders.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Select All</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Orders Grid */}
      {purchaseOrders.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No purchase orders found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchaseOrders.map(po => (
            <MaterialReadinessCard
              key={po.id}
              purchaseOrder={po}
              isSelected={selectedPOs.includes(po.id)}
              onSelect={(selected) => handleSelectPO(po.id, selected)}
              onUpdate={() => {
                setSelectedPO(po);
                setShowUpdateModal(true);
              }}
              isOverdue={isOverdue(po)}
              daysUntilDelivery={getDaysUntilDelivery(po)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showUpdateModal && selectedPO && (
        <MaterialReadinessModal
          isOpen={showUpdateModal}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedPO(null);
          }}
          purchaseOrder={selectedPO}
          onUpdate={handleUpdateReadiness}
        />
      )}

      {showBulkModal && (
        <BulkUpdateModal
          isOpen={showBulkModal}
          onClose={() => setShowBulkModal(false)}
          selectedCount={selectedPOs.length}
          onUpdate={handleBulkUpdate}
        />
      )}
    </div>
  );
}