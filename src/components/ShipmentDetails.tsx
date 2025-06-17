import React, { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Truck, Package, Plus, Edit3 } from 'lucide-react';
import { Shipment, ShipmentStatus, TrackingEvent } from '../types/shipment';
import { StatusBadge } from './StatusBadge';
import { formatDate, getStatusProgress } from '../utils/statusUtils';

interface ShipmentDetailsProps {
  shipment: Shipment;
  onBack: () => void;
  onAddEvent: (shipmentId: string, event: Omit<TrackingEvent, 'id'>) => void;
  onUpdateStatus: (shipmentId: string, status: ShipmentStatus) => void;
}

export function ShipmentDetails({ shipment, onBack, onAddEvent, onUpdateStatus }: ShipmentDetailsProps) {
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    location: '',
    status: shipment.status,
    description: ''
  });

  const progress = getStatusProgress(shipment.status);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEvent(shipment.id, {
      ...newEvent,
      timestamp: new Date().toISOString()
    });
    setNewEvent({ location: '', status: shipment.status, description: '' });
    setShowAddEvent(false);
  };

  const statusOptions: ShipmentStatus[] = [
    'pending', 'picked-up', 'in-transit', 'out-for-delivery', 'delivered', 'exception', 'returned'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
          <button
            onClick={onBack}
            className="flex items-center text-blue-100 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">{shipment.description}</h1>
              <p className="text-blue-100 text-lg">{shipment.trackingNumber}</p>
            </div>
            <StatusBadge status={shipment.status} className="bg-white/20 text-white border border-white/30" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Delivery Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                shipment.status === 'delivered' ? 'bg-green-500' :
                shipment.status === 'exception' ? 'bg-red-500' :
                'bg-blue-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="p-6">
          {/* Shipment Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipment Information</h2>
              
              <div className="flex items-center text-gray-600">
                <Truck className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Carrier</p>
                  <p className="font-medium">{shipment.carrier}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Route</p>
                  <p className="font-medium">{shipment.origin} → {shipment.destination}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">
                    {shipment.status === 'delivered' ? 'Delivered' : 'Estimated Delivery'}
                  </p>
                  <p className="font-medium">
                    {shipment.status === 'delivered' && shipment.actualDelivery
                      ? formatDate(shipment.actualDelivery)
                      : new Date(shipment.estimatedDelivery).toLocaleDateString()
                    }
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Status
                  </label>
                  <select
                    value={shipment.status}
                    onChange={(e) => onUpdateStatus(shipment.id, e.target.value as ShipmentStatus)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setShowAddEvent(!showAddEvent)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tracking Event
                </button>
              </div>
            </div>
          </div>

          {/* Add Event Form */}
          {showAddEvent && (
            <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Tracking Event</h3>
              <form onSubmit={handleAddEvent} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      required
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City, State"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={newEvent.status}
                      onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value as ShipmentStatus })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>
                          {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    required
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Event description"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddEvent(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Add Event
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tracking History */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Tracking History</h2>
            <div className="space-y-4">
              {shipment.trackingHistory
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((event, index) => (
                <div key={event.id} className="flex items-start space-x-4 pb-4">
                  <div className="flex-shrink-0">
                    <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-gray-300'}`} />
                    {index < shipment.trackingHistory.length - 1 && (
                      <div className="w-0.5 h-8 bg-gray-200 ml-1 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{event.description}</p>
                        <p className="text-sm text-gray-500">{event.location}</p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={event.status} className="mb-1" />
                        <p className="text-xs text-gray-500">{formatDate(event.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}