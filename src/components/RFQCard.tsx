import React from 'react';
import { FileText, MapPin, Calendar, Building2, MoreVertical, DollarSign } from 'lucide-react';
import { RFQ } from '../types/rfq';
import { RFQStatusBadge } from './RFQStatusBadge';

interface RFQCardProps {
  rfq: RFQ;
  onClick: () => void;
  onDelete: () => void;
}

export function RFQCard({ rfq, onClick, onDelete }: RFQCardProps) {
  const lowestQuote = rfq.quotes.length > 0 
    ? Math.min(...rfq.quotes.map(q => q.priceAED))
    : null;

  const quotesCount = rfq.quotes.length;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <FileText className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
              {rfq.rfqNumber}
            </h3>
            <p className="text-sm text-gray-500">{new Date(rfq.date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <RFQStatusBadge status={rfq.status} />
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
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1">{rfq.description}</p>
          {rfq.weight && (
            <p className="text-xs text-gray-500">Weight: {rfq.weight} kg</p>
          )}
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
          <span>{rfq.origin} → {rfq.destination}</span>
        </div>

        {rfq.supplier && (
          <div className="flex items-center text-sm text-gray-600">
            <Building2 className="h-4 w-4 mr-2 text-gray-400" />
            <span>{rfq.supplier.company}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600">
            <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
            <span>{quotesCount} quote{quotesCount !== 1 ? 's' : ''}</span>
          </div>
          {lowestQuote && (
            <div className="text-green-600 font-semibold">
              From AED {lowestQuote.toLocaleString()}
            </div>
          )}
        </div>
      </div>

      <div 
        onClick={onClick}
        className="mt-4 text-center py-2 text-sm text-green-600 hover:text-green-700 font-medium cursor-pointer border-t border-gray-100 pt-3"
      >
        View Details & Quotes
      </div>
    </div>
  );
}