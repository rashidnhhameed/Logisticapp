import React, { useState } from 'react';
import { X, Package, User, Building2, Upload, FileText, Trash2 } from 'lucide-react';
import { CARRIERS, ShipmentStatus, Forwarder, Supplier, Document } from '../types/shipment';
import { ForwarderModal } from './ForwarderModal';
import { SupplierModal } from './SupplierModal';

interface AddShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (shipment: {
    trackingNumber: string;
    carrier: string;
    description: string;
    status: ShipmentStatus;
    origin: string;
    destination: string;
    estimatedDelivery: string;
    forwarder?: Forwarder;
    confirmedRateAED?: number;
    supplier?: Supplier;
    documents?: Document[];
  }) => void;
}

export function AddShipmentModal({ isOpen, onClose, onAdd }: AddShipmentModalProps) {
  const [formData, setFormData] = useState({
    trackingNumber: '',
    carrier: 'FedEx',
    description: '',
    status: 'pending' as ShipmentStatus,
    origin: '',
    destination: '',
    estimatedDelivery: '',
    confirmedRateAED: ''
  });

  const [selectedForwarder, setSelectedForwarder] = useState<Forwarder | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showForwarderModal, setShowForwarderModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);

  // Mock data for forwarders and suppliers (in real app, this would come from a store/API)
  const [forwarders, setForwarders] = useState<Forwarder[]>([
    {
      id: '1',
      name: 'Ahmed Al-Rashid',
      email: 'ahmed@globalfreight.ae',
      phone: '+971 50 123 4567',
      company: 'Global Freight Solutions',
      address: 'Dubai Logistics City, Dubai, UAE'
    }
  ]);

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
    onAdd({
      ...formData,
      confirmedRateAED: formData.confirmedRateAED ? parseFloat(formData.confirmedRateAED) : undefined,
      forwarder: selectedForwarder || undefined,
      supplier: selectedSupplier || undefined,
      documents: documents.length > 0 ? documents : undefined
    });
    
    // Reset form
    setFormData({
      trackingNumber: '',
      carrier: 'FedEx',
      description: '',
      status: 'pending',
      origin: '',
      destination: '',
      estimatedDelivery: '',
      confirmedRateAED: ''
    });
    setSelectedForwarder(null);
    setSelectedSupplier(null);
    setDocuments([]);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (documents.length + files.length > 5) {
      alert('Maximum 5 documents allowed');
      return;
    }

    const newDocuments = files.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString()
    }));

    setDocuments([...documents, ...newDocuments]);
  };

  const removeDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const addForwarder = (forwarderData: Omit<Forwarder, 'id'>) => {
    const newForwarder: Forwarder = {
      ...forwarderData,
      id: Date.now().toString()
    };
    setForwarders([...forwarders, newForwarder]);
    setSelectedForwarder(newForwarder);
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
        <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Add New Shipment</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.trackingNumber}
                    onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter tracking number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carrier
                  </label>
                  <select
                    value={formData.carrier}
                    onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {CARRIERS.map(carrier => (
                      <option key={carrier} value={carrier}>{carrier}</option>
                    ))}
                  </select>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What's being shipped?"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="To"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Delivery
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.estimatedDelivery}
                    onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmed Rate (AED)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.confirmedRateAED}
                    onChange={(e) => setFormData({ ...formData, confirmedRateAED: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Forwarder Section */}
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
                    Add Forwarder
                  </button>
                )}
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
                    Add Supplier Details
                  </button>
                )}
              </div>
            </div>

            {/* Document Attachments */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Document Attachments</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Upload up to 5 documents</p>
                  <label className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Files
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                    />
                  </label>
                </div>

                {documents.length > 0 && (
                  <div className="space-y-2">
                    {documents.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDocument(doc.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
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
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Add Shipment
              </button>
            </div>
          </form>
        </div>
      </div>

      <ForwarderModal
        isOpen={showForwarderModal}
        onClose={() => setShowForwarderModal(false)}
        onAdd={addForwarder}
        forwarders={forwarders}
        onSelect={setSelectedForwarder}
      />

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