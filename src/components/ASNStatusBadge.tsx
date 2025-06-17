import React from 'react';
import { ASNStatus } from '../types/asn';

interface ASNStatusBadgeProps {
  status: ASNStatus;
  className?: string;
}

export function ASNStatusBadge({ status, className = '' }: ASNStatusBadgeProps) {
  const getStatusColor = (status: ASNStatus): string => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'acknowledged':
        return 'bg-green-100 text-green-800';
      case 'in_transit':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'discrepancy':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const colorClass = getStatusColor(status);
  const displayText = status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} ${className}`}>
      {displayText}
    </span>
  );
}