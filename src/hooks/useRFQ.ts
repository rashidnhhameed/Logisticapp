import { useState, useEffect } from 'react';
import { RFQ, ForwarderQuote } from '../types/rfq';
import { rfqAPI } from '../services/api';

export function useRFQ() {
  const [rfqs, setRFQs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRFQs();
  }, []);

  const fetchRFQs = async () => {
    try {
      const response = await rfqAPI.getAll();
      setRFQs(response.data);
    } catch (error) {
      console.error('Error fetching RFQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRFQ = async (rfqData: any) => {
    try {
      const response = await rfqAPI.create(rfqData);
      setRFQs(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Error creating RFQ:', error);
      throw error;
    }
  };

  const addQuote = async (rfqId: string, quote: Omit<ForwarderQuote, 'id' | 'submittedAt'>) => {
    try {
      const response = await rfqAPI.addQuote(rfqId, quote);
      setRFQs(prev => 
        prev.map(rfq => rfq.id === rfqId ? response.data : rfq)
      );
      return response.data;
    } catch (error) {
      console.error('Error adding quote:', error);
      throw error;
    }
  };

  const selectQuote = async (rfqId: string, quoteId: string) => {
    try {
      const response = await rfqAPI.selectQuote(rfqId, quoteId);
      setRFQs(prev => 
        prev.map(rfq => rfq.id === rfqId ? response.data : rfq)
      );
      return response.data;
    } catch (error) {
      console.error('Error selecting quote:', error);
      throw error;
    }
  };

  const deleteRFQ = async (id: string) => {
    try {
      await rfqAPI.delete(id);
      setRFQs(prev => prev.filter(rfq => rfq.id !== id));
    } catch (error) {
      console.error('Error deleting RFQ:', error);
      throw error;
    }
  };

  return {
    rfqs,
    loading,
    createRFQ,
    addQuote,
    selectQuote,
    deleteRFQ,
    refetch: fetchRFQs
  };
}