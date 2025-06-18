import { useLocalStorage } from './useLocalStorage';
import { Supplier } from '../types/shipment';

const defaultSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'TechCorp Manufacturing',
    email: 'orders@techcorp.com',
    phone: '+86 138 0013 8000',
    company: 'TechCorp Ltd.',
    address: 'Shenzhen, Guangdong, China',
    contactPerson: 'Li Wei'
  },
  {
    id: '2',
    name: 'Global Electronics Supply',
    email: 'sales@globalsupply.com',
    phone: '+65 6123 4567',
    company: 'Global Electronics Pte Ltd',
    address: 'Singapore Industrial Park, Singapore',
    contactPerson: 'John Tan'
  }
];

export function useSuppliers() {
  const [suppliers, setSuppliers] = useLocalStorage<Supplier[]>('logistics-suppliers', defaultSuppliers);

  const addSupplier = (supplierData: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    
    setSuppliers(prev => [...prev, newSupplier]);
    return newSupplier;
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers(prev => 
      prev.map(supplier => 
        supplier.id === id ? { ...supplier, ...updates } : supplier
      )
    );
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
  };

  const getSupplierById = (id: string) => {
    return suppliers.find(supplier => supplier.id === id);
  };

  return {
    suppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    getSupplierById
  };
}