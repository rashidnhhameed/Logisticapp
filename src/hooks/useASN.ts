import { useState, useEffect } from 'react';
import { ASN } from '../types/asn';
import { asnAPI } from '../services/api';

export function useASN() {
  const [asns, setASNs] = useState<ASN[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchASNs();
  }, []);

  const fetchASNs = async () => {
    try {
      const response = await asnAPI.getAll();
      setASNs(response.data);
    } catch (error) {
      console.error('Error fetching ASNs:', error);
    } finally {
      setLoading(false);
    }
  };

  const createASN = async (asnData: any) => {
    try {
      const response = await asnAPI.create(asnData);
      setASNs(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Error creating ASN:', error);
      throw error;
    }
  };

  const updateASN = async (id: string, updates: any) => {
    try {
      const response = await asnAPI.update(id, updates);
      setASNs(prev => 
        prev.map(asn => asn.id === id ? response.data : asn)
      );
      return response.data;
    } catch (error) {
      console.error('Error updating ASN:', error);
      throw error;
    }
  };

  const deleteASN = async (id: string) => {
    try {
      await asnAPI.delete(id);
      setASNs(prev => prev.filter(asn => asn.id !== id));
    } catch (error) {
      console.error('Error deleting ASN:', error);
      throw error;
    }
  };

  return {
    asns,
    loading,
    createASN,
    updateASN,
    deleteASN,
    refetch: fetchASNs
  };
}