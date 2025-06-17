import React, { useState } from 'react';
import { Search, Plus, Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { ASN, ASNStatus } from '../types/asn';
import { ASNCard } from './ASNCard';
import { CreateASNModal } from './CreateASNModal';

interface ASNDashboardProps {
  asns: ASN[];
  onCreateASN: (asn: any) => void;
  onSelectASN: (asn: ASN) => void;
  onDeleteASN: (id: string) => void;
}

export function ASNDashboard({ asns, onCreateASN, onSelectASN, onDeleteASN }: ASNDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ASNStatus | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredASNs = asns.filter(asn => {
    const matchesSearch = 
      asn.asnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asn.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asn.supplier.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || asn.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: asns.length,
    draft: asns.filter(asn => asn.status === 'draft').length,
    sent: asns.filter(asn => asn.status === 'sent').length,
    inTransit: asns.filter(asn => asn.status === 'in_transit').length
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Advance Shipment Notice</h1>
            <p className="text-gray-600 mt-1">Manage ASN and shipping notifications</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create ASN
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total ASNs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-gray-50 rounded-lg">
                <Clock className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Draft</p>
                <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sent</p>
                <p className="text-2xl font-bold text-gray-900">{stats.sent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-50 rounded-lg">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inTransit}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ASN number, PO number, or supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ASNStatus | 'all')}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="discrepancy">Discrepancy</option>
          </select>
        </div>
      </div>

      {/* ASNs Grid */}
      {filteredASNs.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter !== 'all' ? 'No ASNs found' : 'No ASNs yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first ASN'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First ASN
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredASNs.map(asn => (
            <ASNCard
              key={asn.id}
              asn={asn}
              onClick={() => onSelectASN(asn)}
              onDelete={() => onDeleteASN(asn.id)}
            />
          ))}
        </div>
      )}

      <CreateASNModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={onCreateASN}
      />
    </div>
  );
}