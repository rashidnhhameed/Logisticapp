import React, { useState } from 'react';
import { X, Package, Building2, Plus, Trash2 } from 'lucide-react';
import { ASNItem, PackingDetail, ASN } from '../types/asn';
import { Supplier } from '../types/shipment';
import { SupplierModal } from './SupplierModal';

interface CreateASNModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (asn: Omit<ASN, 'id' | 'asnNumber' | 'createdAt' | 'updatedAt'>) => void;
}

export function CreateASNModal({ isOpen, onClose, onCreate }: CreateASNModalProps) {
  const [formData, setFormData] = useState({
    poNumber: 'PO-2024-001',
    date: new Date().toISOString().split('T')[0],
    shipmentDate: '',
    estimatedArrival: '',
    carrier: 'DHL Express',
    trackingNumber: '',
    notes: ''
  });

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [items, setItems] = useState<Omit<ASNItem, 'id'>[]>([
    {
      poItemId: '1',
      description: '',
      partNumber: '',
      quantityShipped: 0,
      quantityOrdered: 0,
      unit: 'pcs',
      lotNumber: ''
    }
  ]);
  const [packingDetails, setPackingDetails] = useState<Omit<PackingDetail, 'id'>[]>([
    {
      packageType: 'Carton',
      packageNumber: '',
      weight: 0,
      dimensions: '',
      items: []
    }
  ]);
  const [showSupplierModal, setShowSupplierModal] = useState(false);

  // Mock suppliers data
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
    if (!selectedSupplier) {
      alert('Please select a supplier');
      return;
    }

    const asnItems: ASNItem[] = items.map((item, index) => ({
      ...item,
      id: (index + 1).toString()
    }));

    const asnPackingDetails: PackingDetail[] = packingDetails.map((pack, index) => ({
      ...pack,
      id: (index + 1).toString()
    }));

    onCreate({
      ...formData,
      status: 'draft',
      supplier: selectedSupplier,
      items: asnItems,
      packingDetails: asnPackingDetails
    });
    
    // Reset form
    setFormData({
      poNumber: 'PO-2024-001',
      date: new Date().toISOString().split('T')[0],
      shipmentDate: '',
      estimatedArrival: '',
      carrier: 'DHL Express',
      trackingNumber: '',
      notes: ''
    });
    setSelectedSupplier(null);
    setItems([{
      poItemId: '1',
      description: '',
      partNumber: '',
      quantityShipped: 0,
      quantityOrdered: 0,
      unit: 'pcs',
      lotNumber: ''
    }]);
    setPackingDetails([{
      packageType: 'Carton',
      packageNumber: '',
      weight: 0,
      dimensions: '',
      items: []
    }]);
    onClose();
  };

  const addItem = () => {
    setItems([...items, {
      poItemId: (items.length + 1).toString(),
      description: '',
      partNumber: '',
      quantityShipped: 0,
      quantityOrdered: 0,
      unit: 'pcs',
      lotNumber: ''
    }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof Omit<ASNItem, 'id'>, value: any) => {
    const updatedItems = items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);
  };

  const addPackingDetail = () => {
    setPackingDetails([...packingDetails, {
      packageType: 'Carton',
      packageNumber: '',
      weight: 0,
      dimensions: '',
      items: []
    }]);
  };

  const removePackingDetail = (index: number) => {
    if (packingDetails.length > 1) {
      setPackingDetails(packingDetails.filter((_, i) => i !== index));
    }
  };

  const updatePackingDetail = (index: number, field: keyof Omit<PackingDetail, 'id'>, value: any) => {
    const updatedPacking = packingDetails.map((pack, i) => 
      i === index ? { ...pack, [field]: value } : pack
    );
    setPackingDetails(updatedPacking);
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
        <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Package className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Create Advance Shipment Notice</h2>
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
                    Purchase Order Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.poNumber}
                    onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ASN Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipment Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.shipmentDate}
                    onChange={(e) => setFormData({ ...formData, shipmentDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Arrival
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.estimatedArrival}
                    onChange={(e) => setFormData({ ...formData, estimatedArrival: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carrier
                  </label>
                  <select
                    value={formData.carrier}
                    onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="DHL Express">DHL Express</option>
                    <option value="FedEx">FedEx</option>
                    <option value="UPS">UPS</option>
                    <option value="TNT">TNT</option>
                    <option value="Aramex">Aramex</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={formData.trackingNumber}
                    onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>

            {/* Supplier Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Supplier</h3>
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
                    className="flex items-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors"
                  >
                    <Building2 className="h-5 w-5 mr-2 text-gray-400" />
                    Select Supplier
                  </button>
                )}
              </div>
            </div>

            {/* Items Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Items</h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Item {index + 1}</h4>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <input
                          type="text"
                          required
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Part Number
                        </label>
                        <input
                          type="text"
                          value={item.partNumber}
                          onChange={(e) => updateItem(index, 'partNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unit
                        </label>
                        <select
                          value={item.unit}
                          onChange={(e) => updateItem(index, 'unit', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="pcs">Pieces</option>
                          <option value="kg">Kilograms</option>
                          <option value="m">Meters</option>
                          <option value="box">Boxes</option>
                          <option value="set">Sets</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quantity Ordered
                        </label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={item.quantityOrdered}
                          onChange={(e) => updateItem(index, 'quantityOrdered', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quantity Shipped
                        </label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={item.quantityShipped}
                          onChange={(e) => updateItem(index, 'quantityShipped', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lot Number
                        </label>
                        <input
                          type="text"
                          value={item.lotNumber}
                          onChange={(e) => updateItem(index, 'lotNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Packing Details Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Packing Details</h3>
                <button
                  type="button"
                  onClick={addPackingDetail}
                  className="flex items-center px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Package
                </button>
              </div>

              <div className="space-y-4">
                {packingDetails.map((pack, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Package {index + 1}</h4>
                      {packingDetails.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePackingDetail(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Package Type
                        </label>
                        <select
                          value={pack.packageType}
                          onChange={(e) => updatePackingDetail(index, 'packageType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="Carton">Carton</option>
                          <option value="Pallet">Pallet</option>
                          <option value="Crate">Crate</option>
                          <option value="Box">Box</option>
                          <option value="Bag">Bag</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Package Number
                        </label>
                        <input
                          type="text"
                          required
                          value={pack.packageNumber}
                          onChange={(e) => updatePackingDetail(index, 'packageNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="e.g., CTN-001"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          required
                          value={pack.weight}
                          onChange={(e) => updatePackingDetail(index, 'weight', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dimensions (cm)
                        </label>
                        <input
                          type="text"
                          required
                          value={pack.dimensions}
                          onChange={(e) => updatePackingDetail(index, 'dimensions', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="L x W x H"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Notes</h3>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
                placeholder="Additional notes or special instructions"
              />
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
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                Create ASN
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