import React, { useState } from 'react';
import { X, FileText, Building2, Package, Calendar } from 'lucide-react';
import { Supplier } from '../types/shipment';
import { SupplierModal } from './SupplierModal';

interface CreateRFQModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (rfq: {
    date: string;
    origin: string;
    destination: string;
    description: string;
    weight?: number;
    dimensions?: string;
    supplier?: Supplier;
  }) => void;
}

export function CreateRFQModal({ isOpen, onClose, onCreate }: CreateRFQModalProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    origin: '',
    destination: '',
    description: '',
    weight: '',
    dimensions: ''
  });

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showSupplierModal, setShowSupplierModal] = useState(false);

  // Mock suppliers data (in real app, this would come from a store/API)
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'TechCorp Manufacturing',
      email: 'orders@techcorp.com',
      phone: '+86 138 0013 8000',
      company: 'TechCorp Ltd.',
      address: 'Shenzhen, Guangdong, China',
      contactPerson: 'Li Wei'
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      ...formData,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      supplier: selectedSupplier || undefined
    });
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      origin: '',
      destination: '',
      description: '',
      weight: '',
      dimensions: ''
    });
    setSelectedSupplier(null);
    onClose();
  };

  const addSupplier = (supplierData: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: Date.now().toString()
    };
    setSuppliers([...suppliers, newSupplier]);
    setSelectedSupplier(newSupplier);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
        <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Create New RFQ</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Auto-generated info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">RFQ Number will be auto-generated</p>
                  <p className="text-xs text-green-600">Format: RFQ-YYYY-XXX</p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">RFQ Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Origin
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="From"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="To"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="What needs to be shipped?"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 120x80x60 cm (optional)"
                  />
                </div>
              </div>
            </div>

            {/* Supplier Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Supplier Details</h3>
              <div className="flex items-center space-x-4">
                {selectedSupplier ? (
                  <div className="flex-1 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{selectedSupplier.company}</h4>
                        <p className="text-sm text-gray-600">Contact: {selectedSupplier.contactPerson}</p>
                        <p className="text-sm text-gray-500">{selectedSupplier.email}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedSupplier(null)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowSupplierModal(true)}
                    className="flex items-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
                  >
                    <Building2 className="h-5 w-5 mr-2 text-gray-400" />
                    Add Supplier Details (Optional)
                  </button>
                )}
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
                Create RFQ
              </button>
            </div>
          </form>
        </div>
      </div>

      <SupplierModal
        isOpen={showSupplierModal}
        onClose={() => setShowSupplierModal(false)}
        onAdd={addSupplier}
        suppliers={suppliers}
        onSelect={setSelectedSupplier}
      />
    </>
  );
}