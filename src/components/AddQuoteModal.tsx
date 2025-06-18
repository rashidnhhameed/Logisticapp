import React, { useState } from 'react';
import { X, DollarSign, User } from 'lucide-react';
import { ForwarderQuote } from '../types/rfq';
import { Forwarder } from '../types/shipment';
import { ForwarderModal } from './ForwarderModal';

interface AddQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (quote: Omit<ForwarderQuote, 'id' | 'submittedAt'>) => void;
}

export function AddQuoteModal({ isOpen, onClose, onAdd }: AddQuoteModalProps) {
  const [formData, setFormData] = useState({
    priceAED: '',
    transitTime: '',
    validUntil: '',
    notes: ''
  });

  const [selectedForwarder, setSelectedForwarder] = useState<Forwarder | null>(null);
  const [showForwarderModal, setShowForwarderModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForwarder) {
      alert('Please select a forwarder');
      return;
    }

    const quoteData = {
      forwarderId: selectedForwarder.id,
      forwarder: selectedForwarder,
      priceAED: parseFloat(formData.priceAED),
      transitTime: formData.transitTime,
      validUntil: formData.validUntil,
      notes: formData.notes || undefined,
      status: 'submitted' as const
    };

    console.log('Submitting quote data:', quoteData); // Debug log
    onAdd(quoteData);
    
    // Reset form
    setFormData({
      priceAED: '',
      transitTime: '',
      validUntil: '',
      notes: ''
    });
    setSelectedForwarder(null);
    onClose();
  };

  const handleForwarderSelect = (forwarder: Forwarder) => {
    console.log('Selecting forwarder:', forwarder); // Debug log
    setSelectedForwarder(forwarder);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Add Forwarder Quote</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Forwarder Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Forwarder</h3>
              <div className="flex items-center space-x-4">
                {selectedForwarder ? (
                  <div className="flex-1 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{selectedForwarder.name}</h4>
                        <p className="text-sm text-gray-600">{selectedForwarder.company}</p>
                        <p className="text-sm text-gray-500">{selectedForwarder.email}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedForwarder(null)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowForwarderModal(true)}
                    className="flex items-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    <User className="h-5 w-5 mr-2 text-gray-400" />
                    Select Forwarder
                  </button>
                )}
              </div>
            </div>

            {/* Quote Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Quote Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (AED)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.priceAED}
                    onChange={(e) => setFormData({ ...formData, priceAED: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transit Time
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.transitTime}
                    onChange={(e) => setFormData({ ...formData, transitTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 7-10 days"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    placeholder="Additional information about the quote"
                  />
                </div>
              </div>
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
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Add Quote
              </button>
            </div>
          </form>
        </div>
      </div>

      <ForwarderModal
        isOpen={showForwarderModal}
        onClose={() => setShowForwarderModal(false)}
        onSelect={handleForwarderSelect}
      />
    </>
  );
}