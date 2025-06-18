import React, { useState } from 'react';
import { X, Package, CheckCircle } from 'lucide-react';

interface BulkUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  onUpdate: (materialReadinessDate: string, notes?: string) => void;
}

export function BulkUpdateModal({
  isOpen,
  onClose,
  selectedCount,
  onUpdate
}: BulkUpdateModalProps) {
  const [materialReadinessDate, setMaterialReadinessDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onUpdate(materialReadinessDate, notes);
    } catch (error) {
      console.error('Error bulk updating material readiness:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Bulk Update Material Readiness</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Updating {selectedCount} purchase order{selectedCount !== 1 ? 's' : ''}
                </p>
                <p className="text-xs text-blue-600">
                  This will mark all selected POs as material ready
                </p>
              </div>
            </div>
          </div>

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
                placeholder="Add notes that will apply to all selected POs..."
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
                {loading ? 'Updating...' : `Update ${selectedCount} PO${selectedCount !== 1 ? 's' : ''}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}