import React from 'react';
import { Calendar, Building2, DollarSign, Clock, CheckCircle, AlertTriangle, Package } from 'lucide-react';
import { PurchaseOrder } from '../types/purchaseOrder';
import { POStatusBadge } from './POStatusBadge';

interface MaterialReadinessCardProps {
  purchaseOrder: PurchaseOrder;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onUpdate: () => void;
  isOverdue: boolean;
  daysUntilDelivery: number;
}

export function MaterialReadinessCard({
  purchaseOrder,
  isSelected,
  onSelect,
  onUpdate,
  isOverdue,
  daysUntilDelivery
}: MaterialReadinessCardProps) {
  const getUrgencyColor = () => {
    if (purchaseOrder.status === 'material_ready') return 'border-green-200 bg-green-50';
    if (isOverdue) return 'border-red-300 bg-red-50';
    if (daysUntilDelivery <= 3) return 'border-orange-300 bg-orange-50';
    return 'border-gray-200 bg-white';
  };

  const getStatusIcon = () => {
    if (purchaseOrder.status === 'material_ready') {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    if (isOverdue) {
      return <AlertTriangle className="h-5 w-5 text-red-600" />;
    }
    return <Clock className="h-5 w-5 text-yellow-600" />;
  };

  const getDaysText = () => {
    if (purchaseOrder.status === 'material_ready') {
      return 'Material Ready';
    }
    if (isOverdue) {
      return `${Math.abs(daysUntilDelivery)} days overdue`;
    }
    if (daysUntilDelivery === 0) {
      return 'Due today';
    }
    if (daysUntilDelivery === 1) {
      return 'Due tomorrow';
    }
    return `${daysUntilDelivery} days until delivery`;
  };

  return (
    <div className={`rounded-xl shadow-sm border-2 p-6 transition-all duration-200 hover:shadow-md ${getUrgencyColor()}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <div>
              <h3 className="font-semibold text-gray-900">{purchaseOrder.poNumber}</h3>
              <p className="text-sm text-gray-500">{new Date(purchaseOrder.date).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        <POStatusBadge status={purchaseOrder.status} />
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
            <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
            <span>Ready: {new Date(purchaseOrder.materialReadinessDate).toLocaleDateString()}</span>
          </div>
        )}

        <div className="flex items-center text-sm">
          <Package className="h-4 w-4 mr-2 text-gray-400" />
          <span className={`font-medium ${
            purchaseOrder.status === 'material_ready' ? 'text-green-600' :
            isOverdue ? 'text-red-600' :
            daysUntilDelivery <= 3 ? 'text-orange-600' :
            'text-gray-600'
          }`}>
            {getDaysText()}
          </span>
        </div>
      </div>

      {purchaseOrder.status !== 'material_ready' && (
        <button
          onClick={onUpdate}
          className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
            isOverdue 
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Update Material Readiness
        </button>
      )}
    </div>
  );
}