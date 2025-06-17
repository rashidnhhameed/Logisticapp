import React, { useState } from 'react';
import { X, FileText, Building2, Plus, Trash2 } from 'lucide-react';
import { POItem, PurchaseOrder } from '../types/purchaseOrder';
import { Supplier } from '../types/shipment';
import { SupplierModal } from './SupplierModal';

interface CreatePOModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (po: Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdAt' | 'updatedAt'>) => void;
}

export function CreatePOModal({ isOpen, onClose, onCreate }: CreatePOModalProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    deliveryAddress: 'Dubai Logistics Center, Dubai, UAE',
    requestedDeliveryDate: '',
    terms: 'Net 30 days',
    notes: ''
  });

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [items, setItems] = useState<Omit<POItem, 'id' | 'totalPrice'>[]>([
    {
      description: '',
      partNumber: '',
      quantity: 1,
      unitPrice: 0,
      unit: 'pcs',
      specifications: ''
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

    const poItems: POItem[] = items.map((item, index) => ({
      ...item,
      id: (index + 1).toString(),
      totalPrice: item.quantity * item.unitPrice
    }));

    const totalAmount = poItems.reduce((sum, item) => sum + item.totalPrice, 0);

    onCreate({
      ...formData,
      status: 'draft',
      supplier: selectedSupplier,
      buyer: {
        id: '2',
        email: 'buyer@company.com',
        name: 'Sarah Buyer',
        role: 'buyer',
        company: 'Logistics Corp',
        createdAt: '2024-01-01T00:00:00Z'
      },
      items: poItems,
      totalAmount,
      currency: 'AED'
    });
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      deliveryAddress: 'Dubai Logistics Center, Dubai, UAE',
      requestedDeliveryDate: '',
      terms: 'Net 30 days',
      notes: ''
    });
    setSelectedSupplier(null);
    setItems([{
      description: '',
      partNumber: '',
      quantity: 1,
      unitPrice: 0,
      unit: 'pcs',
      specifications: ''
    }]);
    onClose();
  };

  const addItem = () => {
    setItems([...items, {
      description: '',
      partNumber: '',
      quantity: 1,
      unitPrice: 0,
      unit: 'pcs',
      specifications: ''
    }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof Omit<POItem, 'id' | 'totalPrice'>, value: any) => {
    const updatedItems = items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);
  };

  const addSupplier = (supplierData: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: Date.now().toString()
    };
    setSuppliers([...suppliers, newSupplier]);
    setSelectedSupplier(newSupplier);
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
        <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Create Purchase Order</h2>
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
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requested Delivery Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.requestedDeliveryDate}
                    onChange={(e) => setFormData({ ...formData, requestedDeliveryDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    required
                    value={formData.deliveryAddress}
                    onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
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
                    className="flex items-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
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
                  className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <input
                          type="text"
                          required
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Item description"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Optional"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unit
                        </label>
                        <select
                          value={item.unit}
                          onChange={(e) => updateItem(index, 'unit', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                          Quantity
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unit Price (AED)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Total Price
                        </label>
                        <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 font-medium">
                          AED {(item.quantity * item.unitPrice).toLocaleString()}
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Specifications
                        </label>
                        <input
                          type="text"
                          value={item.specifications}
                          onChange={(e) => updateItem(index, 'specifications', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Optional specifications"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex justify-end">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-blue-600">AED {totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Terms & Notes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Terms
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.terms}
                    onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Net 30 days"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="Additional notes"
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
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Create Purchase Order
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