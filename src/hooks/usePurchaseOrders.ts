import { useState, useEffect } from 'react';
import { PurchaseOrder } from '../types/purchaseOrder';
import { purchaseOrderAPI } from '../services/api';

export function usePurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const fetchPurchaseOrders = async () => {
    try {
      const response = await purchaseOrderAPI.getAll();
      setPurchaseOrders(response.data);
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPO = async (poData: any) => {
    try {
      const response = await purchaseOrderAPI.create(poData);
      setPurchaseOrders(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Error creating purchase order:', error);
      throw error;
    }
  };

  const updatePO = async (id: string, updates: any) => {
    try {
      const response = await purchaseOrderAPI.update(id, updates);
      setPurchaseOrders(prev => 
        prev.map(po => po.id === id ? response.data : po)
      );
      return response.data;
    } catch (error) {
      console.error('Error updating purchase order:', error);
      throw error;
    }
  };

  const updateMaterialReadiness = async (id: string, materialReadinessDate: string) => {
    return updatePO(id, { 
      materialReadinessDate, 
      status: 'material_ready'
    });
  };

  const deletePO = async (id: string) => {
    try {
      await purchaseOrderAPI.delete(id);
      setPurchaseOrders(prev => prev.filter(po => po.id !== id));
    } catch (error) {
      console.error('Error deleting purchase order:', error);
      throw error;
    }
  };

  return {
    purchaseOrders,
    loading,
    createPO,
    updatePO,
    updateMaterialReadiness,
    deletePO,
    refetch: fetchPurchaseOrders
  };
}