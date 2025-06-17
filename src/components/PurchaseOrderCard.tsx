import React, { useState } from 'react';
import { FileText, Building2, Calendar, DollarSign, MoreVertical, Clock } from 'lucide-react';
import { PurchaseOrder } from '../types/purchaseOrder';
import { POStatusBadge } from './POStatusBadge';

interface PurchaseOrderCardProps {
  purchaseOrder: PurchaseOrder;
  onClick: () => void;
  onDelete: () => void;
  onUpdateMaterialReadiness: (id: string, date: string) => void;
}

export function PurchaseOrderCard({ 
  purchaseOrder, 
  onClick, 
  onDelete, 
  onUpdateMaterialReadiness 
}: PurchaseOrderCardProps) {
  const [showMaterialReadiness, setShowMaterialReadiness] = useState(false);
  const [materialDate, setMaterialDate] = useState(
    purchaseOrder.materialReadinessDate || new Date().toISOString().split('T')[0]
  );

  const handleUpdateMaterialReadiness = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onUpdateMaterialReadiness(purchaseOrder.id, materialDate);
    setShowMaterialReadiness(false);
  };

  const canUpdateMaterialReadiness = ['approved', 'sent_to_supplier', 'acknowledged'].includes(purchaseOrder.status);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {purchaseOrder.poNumber}
            </h3>
            <p className="text-sm text-gray-500">{new Date(purchaseOrder.date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <POStatusBadge status={purchaseOrder.status} />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all"
          >
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-4">
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
          <span>Delivery: {new Date(purchaseOrder.requestedDeliveryDate).toLocaleDateString()}</span>
        </div>

        {purchaseOrder.materialReadinessDate && (
          <div className="flex items-center text-sm text-green-600">
            <Clock className="h-4 w-4 mr-2 text-green-400" />
            <span>Material Ready: {new Date(purchaseOrder.materialReadinessDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Material Readiness Update */}
      {canUpdateMaterialReadiness && !showMaterialReadiness && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMaterialReadiness(true);
          }}
          className="w-full mb-4 px-3 py-2 text-sm bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg font-medium transition-colors"
        >
          Update Material Readiness
        </button>
      )}

      {showMaterialReadiness && (
        <form onSubmit={handleUpdateMaterialReadiness} className="mb-4 p-3 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Material Readiness Date
          </label>
          <div className="flex space-x-2">
            <input
              type="date"
              value={materialDate}
              onChange={(e) => setMaterialDate(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors"
            >
              Update
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowMaterialReadiness(false);
              }}
              className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div 
        onClick={onClick}
        className="text-center py-2 text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer border-t border-gray-100 pt-3"
      >
        View Details
      </div>
    </div>
  );
}