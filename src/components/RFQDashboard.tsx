import React, { useState } from 'react';
import { Search, Plus, FileText, TrendingUp, Clock, CheckCircle, DollarSign } from 'lucide-react';
import { RFQ, RFQStatus } from '../types/rfq';
import { RFQCard } from './RFQCard';
import { CreateRFQModal } from './CreateRFQModal';

interface RFQDashboardProps {
  rfqs: RFQ[];
  onCreateRFQ: (rfq: any) => void;
  onSelectRFQ: (rfq: RFQ) => void;
  onDeleteRFQ: (id: string) => void;
}

export function RFQDashboard({ rfqs, onCreateRFQ, onSelectRFQ, onDeleteRFQ }: RFQDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RFQStatus | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredRFQs = rfqs.filter(rfq => {
    const matchesSearch = 
      rfq.rfqNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfq.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfq.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfq.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || rfq.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: rfqs.length,
    draft: rfqs.filter(r => r.status === 'draft').length,
    quoted: rfqs.filter(r => r.status === 'quoted').length,
    awarded: rfqs.filter(r => r.status === 'awarded').length
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">RFQ Management</h1>
            <p className="text-gray-600 mt-1">Create enquiries and compare quotes from forwarders</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create RFQ
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total RFQs</p>
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
              <div className="p-2 bg-yellow-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Quoted</p>
                <p className="text-2xl font-bold text-gray-900">{stats.quoted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Awarded</p>
                <p className="text-2xl font-bold text-gray-900">{stats.awarded}</p>
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
              placeholder="Search by RFQ number, description, or route..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as RFQStatus | 'all')}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="quoted">Quoted</option>
            <option value="awarded">Awarded</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* RFQs Grid */}
      {filteredRFQs.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter !== 'all' ? 'No RFQs found' : 'No RFQs yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first RFQ'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First RFQ
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRFQs.map(rfq => (
            <RFQCard
              key={rfq.id}
              rfq={rfq}
              onClick={() => onSelectRFQ(rfq)}
              onDelete={() => onDeleteRFQ(rfq.id)}
            />
          ))}
        </div>
      )}

      <CreateRFQModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={onCreateRFQ}
      />
    </div>
  );
}