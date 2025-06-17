import React, { useState } from 'react';
import { Shipment, ShipmentStatus, TrackingEvent } from './types/shipment';
import { RFQ } from './types/rfq';
import { PurchaseOrder } from './types/purchaseOrder';
import { ASN } from './types/asn';
import { useAuth } from './hooks/useAuth';
import { useShipments } from './hooks/useShipments';
import { useRFQ } from './hooks/useRFQ';
import { usePurchaseOrders } from './hooks/usePurchaseOrders';
import { useASN } from './hooks/useASN';
import { useNotifications } from './hooks/useNotifications';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';
import { ShipmentDetails } from './components/ShipmentDetails';
import { RFQDashboard } from './components/RFQDashboard';
import { RFQDetails } from './components/RFQDetails';
import { PurchaseOrderDashboard } from './components/PurchaseOrderDashboard';
import { ASNDashboard } from './components/ASNDashboard';
import { WorkflowDashboard } from './components/WorkflowDashboard';
import { NotificationCenter } from './components/NotificationCenter';
import { LogOut, User, Home } from 'lucide-react';

type View = 'workflow' | 'purchase-orders' | 'material-readiness' | 'rfq' | 'asn' | 'shipments';

function App() {
  const { user, isAuthenticated, loading: authLoading, login, logout } = useAuth();
  const { shipments, loading: shipmentsLoading, addShipment, updateShipment, addTrackingEvent, deleteShipment } = useShipments();
  const { rfqs, loading: rfqLoading, createRFQ, addQuote, selectQuote, deleteRFQ } = useRFQ();
  const { purchaseOrders, loading: poLoading, createPO, updatePO, updateMaterialReadiness, deletePO } = usePurchaseOrders();
  const { asns, loading: asnLoading, createASN, updateASN, deleteASN } = useASN();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications(user?.id);
  
  const [currentView, setCurrentView] = useState<View>('workflow');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [selectedASN, setSelectedASN] = useState<ASN | null>(null);

  const handleAddShipment = (shipmentData: any) => {
    addShipment(shipmentData);
  };

  const handleUpdateStatus = (shipmentId: string, status: ShipmentStatus) => {
    updateShipment(shipmentId, { status });
  };

  const handleAddTrackingEvent = (shipmentId: string, event: Omit<TrackingEvent, 'id'>) => {
    addTrackingEvent(shipmentId, event);
  };

  const handleCreateRFQ = (rfqData: any) => {
    createRFQ(rfqData);
  };

  const handleCreatePO = (poData: any) => {
    createPO(poData);
  };

  const handleCreateASN = (asnData: any) => {
    createASN(asnData);
  };

  const handleNavigate = (section: string) => {
    setCurrentView(section as View);
    setSelectedShipment(null);
    setSelectedRFQ(null);
    setSelectedPO(null);
    setSelectedASN(null);
  };

  const loading = authLoading || shipmentsLoading || rfqLoading || poLoading || asnLoading;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} loading={authLoading} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your data...</p>
        </div>
      </div>
    );
  }

  const getViewTitle = () => {
    switch (currentView) {
      case 'workflow': return 'Workflow Dashboard';
      case 'purchase-orders': return 'Purchase Orders';
      case 'material-readiness': return 'Material Readiness';
      case 'rfq': return 'RFQ Management';
      case 'asn': return 'Advance Shipment Notice';
      case 'shipments': return 'Shipment Tracking';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => handleNavigate('workflow')}
                className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
              >
                Logistics Manager
              </button>
              
              {currentView !== 'workflow' && (
                <button
                  onClick={() => handleNavigate('workflow')}
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </button>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <NotificationCenter
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
                onDelete={deleteNotification}
              />
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.role}</p>
                  </div>
                </div>
                
                <button
                  onClick={logout}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {currentView === 'workflow' ? (
          <WorkflowDashboard onNavigate={handleNavigate} />
        ) : currentView === 'purchase-orders' ? (
          <PurchaseOrderDashboard
            purchaseOrders={purchaseOrders}
            onCreatePO={handleCreatePO}
            onSelectPO={setSelectedPO}
            onDeletePO={deletePO}
            onUpdateMaterialReadiness={updateMaterialReadiness}
          />
        ) : currentView === 'rfq' ? (
          selectedRFQ ? (
            <RFQDetails
              rfq={selectedRFQ}
              onBack={() => setSelectedRFQ(null)}
              onAddQuote={addQuote}
              onSelectQuote={selectQuote}
            />
          ) : (
            <RFQDashboard
              rfqs={rfqs}
              onCreateRFQ={handleCreateRFQ}
              onSelectRFQ={setSelectedRFQ}
              onDeleteRFQ={deleteRFQ}
            />
          )
        ) : currentView === 'asn' ? (
          <ASNDashboard
            asns={asns}
            onCreateASN={handleCreateASN}
            onSelectASN={setSelectedASN}
            onDeleteASN={deleteASN}
          />
        ) : currentView === 'shipments' ? (
          selectedShipment ? (
            <ShipmentDetails
              shipment={selectedShipment}
              onBack={() => setSelectedShipment(null)}
              onAddEvent={handleAddTrackingEvent}
              onUpdateStatus={handleUpdateStatus}
            />
          ) : (
            <Dashboard
              shipments={shipments}
              onAddShipment={handleAddShipment}
              onSelectShipment={setSelectedShipment}
              onDeleteShipment={deleteShipment}
            />
          )
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{getViewTitle()}</h2>
            <p className="text-gray-600">This section is under development.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;