import React from 'react';
import { FileText, Package, Truck, CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'pending' | 'blocked';
  icon: React.ReactNode;
  count?: number;
}

interface WorkflowDashboardProps {
  onNavigate: (section: string) => void;
}

export function WorkflowDashboard({ onNavigate }: WorkflowDashboardProps) {
  const workflowSteps: WorkflowStep[] = [
    {
      id: 'purchase-orders',
      title: 'Purchase Orders',
      description: 'Create and manage purchase orders',
      status: 'completed',
      icon: <FileText className="h-6 w-6" />,
      count: 3
    },
    {
      id: 'material-readiness',
      title: 'Material Readiness',
      description: 'Update material readiness dates',
      status: 'active',
      icon: <Clock className="h-6 w-6" />,
      count: 1
    },
    {
      id: 'rfq',
      title: 'RFQ Management',
      description: 'Create RFQs and compare quotes',
      status: 'pending',
      icon: <TrendingUp className="h-6 w-6" />,
      count: 2
    },
    {
      id: 'shipments',
      title: 'Shipment Tracking',
      description: 'Track and follow up shipments',
      status: 'pending',
      icon: <Truck className="h-6 w-6" />,
      count: 2
    },
    {
      id: 'asn',
      title: 'Advance Shipment Notice',
      description: 'Create ASN near arrival time',
      status: 'pending',
      icon: <Package className="h-6 w-6" />,
      count: 1
    }
  ];

  const getStatusColor = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'active':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'blocked':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getStatusIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'active':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'blocked':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Procurement Workflow</h1>
        <p className="text-gray-600">Complete end-to-end procurement to delivery process</p>
      </div>

      {/* Updated Workflow Description */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-blue-900 mb-3">Updated Workflow Process</h2>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>1. Purchase Orders:</strong> Create and manage purchase orders with suppliers</p>
          <p><strong>2. Material Readiness:</strong> Suppliers update when materials are ready</p>
          <p><strong>3. RFQ Management:</strong> Create RFQs and get quotes from forwarders</p>
          <p><strong>4. Shipment Tracking:</strong> Track shipments from pickup to delivery</p>
          <p><strong>5. ASN Creation:</strong> Create Advance Shipment Notice when shipment is near arrival time</p>
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {workflowSteps.map((step, index) => (
          <div key={step.id} className="relative">
            <button
              onClick={() => onNavigate(step.id)}
              className={`w-full p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${getStatusColor(step.status)} hover:scale-105`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${getStatusColor(step.status).replace('50', '100')}`}>
                  {step.icon}
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(step.status)}
                  {step.count !== undefined && (
                    <span className="bg-white px-2 py-1 rounded-full text-sm font-medium">
                      {step.count}
                    </span>
                  )}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm opacity-80">{step.description}</p>
            </button>

            {/* Connector Line */}
            {index < workflowSteps.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gray-300 transform -translate-y-1/2 z-10">
                <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active POs</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open RFQs</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Truck className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending ASNs</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}