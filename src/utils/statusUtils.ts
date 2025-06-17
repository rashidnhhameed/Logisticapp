import { ShipmentStatus } from '../types/shipment';

export const getStatusColor = (status: ShipmentStatus): string => {
  switch (status) {
    case 'pending':
      return 'bg-gray-100 text-gray-800';
    case 'picked-up':
      return 'bg-blue-100 text-blue-800';
    case 'in-transit':
      return 'bg-yellow-100 text-yellow-800';
    case 'out-for-delivery':
      return 'bg-orange-100 text-orange-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'exception':
      return 'bg-red-100 text-red-800';
    case 'returned':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusIcon = (status: ShipmentStatus): string => {
  switch (status) {
    case 'pending':
      return 'Clock';
    case 'picked-up':
      return 'Package';
    case 'in-transit':
      return 'Truck';
    case 'out-for-delivery':
      return 'MapPin';
    case 'delivered':
      return 'CheckCircle';
    case 'exception':
      return 'AlertTriangle';
    case 'returned':
      return 'RotateCcw';
    default:
      return 'Package';
  }
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusProgress = (status: ShipmentStatus): number => {
  switch (status) {
    case 'pending':
      return 0;
    case 'picked-up':
      return 20;
    case 'in-transit':
      return 50;
    case 'out-for-delivery':
      return 80;
    case 'delivered':
      return 100;
    case 'exception':
      return 50;
    case 'returned':
      return 100;
    default:
      return 0;
  }
};