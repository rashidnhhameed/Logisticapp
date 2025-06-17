import React from 'react';
import { Package, Building2, Calendar, Truck, MoreVertical } from 'lucide-react';
import { ASN } from '../types/asn';
import { ASNStatusBadge } from './ASNStatusBadge';

interface ASNCardProps {
  asn: ASN;
  onClick: () => void;
  onDelete: () => void;
}

export function ASNCard({ asn, onClick, onDelete }: ASNCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Package className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
              {asn.asnNumber}
            </h3>
            <p className="text-sm text-gray-500">PO: {asn.poNumber}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <ASNStatusBadge status={asn.status} />
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
          <span>{asn.supplier.company}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Truck className="h-4 w-4 mr-2 text-gray-400" />
          <span>{asn.carrier}</span>
          {asn.trackingNumber && (
            <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
              {asn.trackingNumber}
            </span>
          )}
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
          <span>Ship: {new Date(asn.shipmentDate).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
          <span>ETA: {new Date(asn.estimatedArrival).toLocaleDateString()}</span>
        </div>

        <div className="text-sm text-gray-600">
          <span className="font-medium">{asn.items.length}</span> item{asn.items.length !== 1 ? 's' : ''} • 
          <span className="font-medium ml-1">{asn.packingDetails.length}</span> package{asn.packingDetails.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div 
        onClick={onClick}
        className="text-center py-2 text-sm text-purple-600 hover:text-purple-700 font-medium cursor-pointer border-t border-gray-100 pt-3"
      >
        View Details
      </div>
    </div>
  );
}