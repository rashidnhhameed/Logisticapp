import { useState, useEffect } from 'react';
import { Shipment, TrackingEvent } from '../types/shipment';
import { shipmentAPI } from '../services/api';

export function useShipments() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      const response = await shipmentAPI.getAll();
      setShipments(response.data);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const addShipment = async (shipmentData: any) => {
    try {
      const response = await shipmentAPI.create(shipmentData);
      setShipments(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Error creating shipment:', error);
      throw error;
    }
  };

  const updateShipment = async (id: string, updates: any) => {
    try {
      const response = await shipmentAPI.update(id, updates);
      setShipments(prev => 
        prev.map(shipment => shipment.id === id ? response.data : shipment)
      );
      return response.data;
    } catch (error) {
      console.error('Error updating shipment:', error);
      throw error;
    }
  };

  const addTrackingEvent = async (shipmentId: string, event: Omit<TrackingEvent, 'id'>) => {
    try {
      const response = await shipmentAPI.addTracking(shipmentId, event);
      setShipments(prev => 
        prev.map(shipment => shipment.id === shipmentId ? response.data : shipment)
      );
      return response.data;
    } catch (error) {
      console.error('Error adding tracking event:', error);
      throw error;
    }
  };

  const deleteShipment = async (id: string) => {
    try {
      await shipmentAPI.delete(id);
      setShipments(prev => prev.filter(shipment => shipment.id !== id));
    } catch (error) {
      console.error('Error deleting shipment:', error);
      throw error;
    }
  };

  return {
    shipments,
    loading,
    addShipment,
    updateShipment,
    addTrackingEvent,
    deleteShipment,
    refetch: fetchShipments
  };
}