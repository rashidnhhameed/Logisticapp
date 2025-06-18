import { useLocalStorage } from './useLocalStorage';
import { Forwarder } from '../types/shipment';

const defaultForwarders: Forwarder[] = [
  {
    id: '1',
    name: 'Ahmed Al-Rashid',
    email: 'ahmed@globalfreight.ae',
    phone: '+971 50 123 4567',
    company: 'Global Freight Solutions',
    address: 'Dubai Logistics City, Dubai, UAE'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@fastlogistics.ae',
    phone: '+971 55 987 6543',
    company: 'Fast Logistics LLC',
    address: 'Jebel Ali Free Zone, Dubai, UAE'
  }
];

export function useForwarders() {
  const [forwarders, setForwarders] = useLocalStorage<Forwarder[]>('logistics-forwarders', defaultForwarders);

  const addForwarder = (forwarderData: Omit<Forwarder, 'id'>) => {
    const newForwarder: Forwarder = {
      ...forwarderData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    
    setForwarders(prev => [...prev, newForwarder]);
    return newForwarder;
  };

  const updateForwarder = (id: string, updates: Partial<Forwarder>) => {
    setForwarders(prev => 
      prev.map(forwarder => 
        forwarder.id === id ? { ...forwarder, ...updates } : forwarder
      )
    );
  };

  const deleteForwarder = (id: string) => {
    setForwarders(prev => prev.filter(forwarder => forwarder.id !== id));
  };

  const getForwarderById = (id: string) => {
    return forwarders.find(forwarder => forwarder.id === id);
  };

  return {
    forwarders,
    addForwarder,
    updateForwarder,
    deleteForwarder,
    getForwarderById
  };
}