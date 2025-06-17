import React from 'react';
import { POStatus } from '../types/purchaseOrder';

interface POStatusBadgeProps {
  status: POStatus;
  className?: string;
}

export function POStatusBadge({ status, className = '' }: POStatusBadgeProps) {
  const getStatusColor = (status: POStatus): string => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'sent_to_supplier':
        return 'bg-blue-100 text-blue-800';
      case 'acknowledged':
        return 'bg-purple-100 text-purple-800';
      case 'material_ready':
        return 'bg-orange-100 text-orange-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
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