import React, { useState } from 'react';
import { X, Calendar, Package, Building2, DollarSign } from 'lucide-react';
import { PurchaseOrder } from '../types/purchaseOrder';

interface MaterialReadinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseOrder: PurchaseOrder;
  onUpdate: (id: string, materialReadinessDate: string, notes?: string) => void;
}

export function MaterialReadinessModal({
  isOpen,
  onClose,
  purchaseOrder,
  onUpdate
}: MaterialReadinessModalProps) {
  const [materialReadinessDate, setMaterialReadinessDate] = useState(
    purchaseOrder.materialReadinessDate || new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState(purchaseOrder.notes || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onUpdate(purchaseOrder.id, materialReadinessDate, notes);
    } catch (error) {
      console.error('Error updating material readiness:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Package className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Update Material Readiness</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* PO Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Purchase Order Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center text-sm text-gray-600">
                <Package className="h-4 w-4 mr-2 text-gray-400" />
                <span className="font-medium">{purchaseOrder.poNumber}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                <span>{purchaseOrder.supplier.company}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                <span>{purchaseOrder.currency} {purchaseOrder.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <span>Due: {new Date(purchaseOrder.requestedDeliveryDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Items ({purchaseOrder.items.length})</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {purchaseOrder.items.map((item, index) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.description}</p>
                    {item.partNumber && (
                      <p className="text-sm text-gray-500">Part: {item.partNumber}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{item.quantity} {item.unit}</p>
                    <p className="text-sm text-gray-500">{purchaseOrder.currency} {item.totalPrice.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Update Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material Readiness Date *
              </label>
              <input
                type="date"
                required
                value={materialReadinessDate}
                onChange={(e) => setMaterialReadinessDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
                placeholder="Add any notes about material readiness..."
              />
            </div>

            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Material Readiness'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}