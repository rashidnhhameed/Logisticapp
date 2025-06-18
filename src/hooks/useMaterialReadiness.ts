import { useState, useEffect } from 'react';
import { PurchaseOrder } from '../types/purchaseOrder';
import { materialReadinessAPI } from '../services/api';

interface MaterialReadinessStats {
  total: number;
  ready: number;
  pending: number;
  overdue: number;
  thisWeek: number;
}

interface MaterialReadinessFilters {
  status?: 'ready' | 'pending' | 'overdue' | 'all';
  supplier?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export function useMaterialReadiness() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [stats, setStats] = useState<MaterialReadinessStats>({
    total: 0,
    ready: 0,
    pending: 0,
    overdue: 0,
    thisWeek: 0
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<MaterialReadinessFilters>({
    status: 'all'
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [posResponse, statsResponse] = await Promise.all([
        materialReadinessAPI.getAll(filters),
        materialReadinessAPI.getStats()
      ]);
      
      setPurchaseOrders(posResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error fetching material readiness data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMaterialReadiness = async (id: string, materialReadinessDate: string, notes?: string) => {
    try {
      const response = await materialReadinessAPI.updateReadiness(id, {
        materialReadinessDate,
        notes
      });
      
      setPurchaseOrders(prev => 
        prev.map(po => po.id === id ? response.data : po)
      );
      
      // Refresh stats
      const statsResponse = await materialReadinessAPI.getStats();
      setStats(statsResponse.data);
      
      return response.data;
    } catch (error) {
      console.error('Error updating material readiness:', error);
      throw error;
    }
  };

  const bulkUpdateMaterialReadiness = async (poIds: string[], materialReadinessDate: string, notes?: string) => {
    try {
      await materialReadinessAPI.bulkUpdate({
        poIds,
        materialReadinessDate,
        notes
      });
      
      // Refresh data after bulk update
      await fetchData();
    } catch (error) {
      console.error('Error bulk updating material readiness:', error);
      throw error;
    }
  };

  const sendReminders = async () => {
    try {
      const response = await materialReadinessAPI.sendReminders();
      return response.data;
    } catch (error) {
      console.error('Error sending reminders:', error);
      throw error;
    }
  };

  const updateFilters = (newFilters: Partial<MaterialReadinessFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const isOverdue = (po: PurchaseOrder) => {
    const today = new Date();
    const deliveryDate = new Date(po.requestedDeliveryDate);
    return deliveryDate < today && !['material_ready', 'shipped', 'delivered', 'cancelled'].includes(po.status);
  };

  const getDaysUntilDelivery = (po: PurchaseOrder) => {
    const today = new Date();
    const deliveryDate = new Date(po.requestedDeliveryDate);
    const diffTime = deliveryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return {
    purchaseOrders,
    stats,
    loading,
    filters,
    updateMaterialReadiness,
    bulkUpdateMaterialReadiness,
    sendReminders,
    updateFilters,
    isOverdue,
    getDaysUntilDelivery,
    refetch: fetchData
  };
}