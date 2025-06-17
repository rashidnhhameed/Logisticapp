import React from 'react';
import { Package, MapPin, Calendar, Truck, MoreVertical } from 'lucide-react';
import { Shipment } from '../types/shipment';
import { StatusBadge } from './StatusBadge';
import { formatDate, getStatusProgress } from '../utils/statusUtils';

interface ShipmentCardProps {
  shipment: Shipment;
  onClick: () => void;
  onDelete: () => void;
}

export function ShipmentCard({ shipment, onClick, onDelete }: ShipmentCardProps) {
  const progress = getStatusProgress(shipment.status);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Package className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {shipment.description}
            </h3>
            <p className="text-sm text-gray-500">{shipment.trackingNumber}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <StatusBadge status={shipment.status} />
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
          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
          <span>{shipment.origin} → {shipment.destination}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Truck className="h-4 w-4 mr-2 text-gray-400" />
          <span>{shipment.carrier}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
          <span>
            {shipment.status === 'delivered' && shipment.actualDelivery
              ? `Delivered ${formatDate(shipment.actualDelivery)}`
              : `Est. delivery ${new Date(shipment.estimatedDelivery).toLocaleDateString()}`
            }
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              shipment.status === 'delivered' ? 'bg-green-500' :
              shipment.status === 'exception' ? 'bg-red-500' :
              'bg-blue-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div 
        onClick={onClick}
        className="mt-4 text-center py-2 text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
      >
        View Details
      </div>
    </div>
  );
}