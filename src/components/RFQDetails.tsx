import React, { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Building2, Package, Plus, Award, DollarSign } from 'lucide-react';
import { RFQ, ForwarderQuote } from '../types/rfq';
import { Forwarder } from '../types/shipment';
import { RFQStatusBadge } from './RFQStatusBadge';
import { AddQuoteModal } from './AddQuoteModal';

interface RFQDetailsProps {
  rfq: RFQ;
  onBack: () => void;
  onAddQuote: (rfqId: string, quote: Omit<ForwarderQuote, 'id' | 'submittedAt'>) => void;
  onSelectQuote: (rfqId: string, quoteId: string) => void;
}

export function RFQDetails({ rfq, onBack, onAddQuote, onSelectQuote }: RFQDetailsProps) {
  const [showAddQuote, setShowAddQuote] = useState(false);

  const sortedQuotes = [...rfq.quotes].sort((a, b) => a.priceAED - b.priceAED);
  const lowestQuote = sortedQuotes[0];

  const handleSelectQuote = (quoteId: string) => {
    onSelectQuote(rfq.id, quoteId);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8 text-white">
          <button
            onClick={onBack}
            className="flex items-center text-green-100 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to RFQ Dashboard
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">{rfq.rfqNumber}</h1>
              <p className="text-green-100 text-lg">{rfq.description}</p>
            </div>
            <RFQStatusBadge status={rfq.status} className="bg-white/20 text-white border border-white/30" />
          </div>
        </div>

        <div className="p-6">
          {/* RFQ Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">RFQ Information</h2>
              
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{new Date(rfq.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Route</p>
                  <p className="font-medium">{rfq.origin} → {rfq.destination}</p>
                </div>
              </div>

              {rfq.weight && (
                <div className="flex items-center text-gray-600">
                  <Package className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-medium">{rfq.weight} kg</p>
                  </div>
                </div>
              )}

              {rfq.dimensions && (
                <div className="flex items-center text-gray-600">
                  <Package className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Dimensions</p>
                    <p className="font-medium">{rfq.dimensions}</p>
                  </div>
                </div>
              )}

              {rfq.supplier && (
                <div className="flex items-center text-gray-600">
                  <Building2 className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Supplier</p>
                    <p className="font-medium">{rfq.supplier.company}</p>
                    <p className="text-sm text-gray-500">{rfq.supplier.contactPerson}</p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quote Summary</h2>
              
              <div className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Quotes Received</span>
                    <span className="text-lg font-bold text-gray-900">{rfq.quotes.length}</span>
                  </div>
                </div>

                {lowestQuote && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-600">Best Quote</span>
                      <span className="text-lg font-bold text-green-700">AED {lowestQuote.priceAED.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">by {lowestQuote.forwarder.company}</p>
                  </div>
                )}

                <button
                  onClick={() => setShowAddQuote(true)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Quote
                </button>
              </div>
            </div>
          </div>

          {/* Quotes Comparison */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Forwarder Quotes</h2>
            
            {rfq.quotes.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No quotes yet</h3>
                <p className="text-gray-500 mb-6">Add quotes from forwarders to compare prices</p>
                <button
                  onClick={() => setShowAddQuote(true)}
                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add First Quote
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {sortedQuotes.map((quote, index) => (
                  <div 
                    key={quote.id} 
                    className={`p-6 rounded-xl border-2 transition-all ${
                      rfq.selectedQuoteId === quote.id
                        ? 'border-green-500 bg-green-50'
                        : index === 0
                        ? 'border-yellow-300 bg-yellow-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {quote.forwarder.company}
                          </h3>
                          {index === 0 && rfq.selectedQuoteId !== quote.id && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                              Best Price
                            </span>
                          )}
                          {rfq.selectedQuoteId === quote.id && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center">
                              <Award className="h-3 w-3 mr-1" />
                              Selected
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Price</p>
                            <p className="text-xl font-bold text-gray-900">AED {quote.priceAED.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Transit Time</p>
                            <p className="font-medium text-gray-900">{quote.transitTime}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Valid Until</p>
                            <p className="font-medium text-gray-900">{new Date(quote.validUntil).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Contact</p>
                            <p className="font-medium text-gray-900">{quote.forwarder.name}</p>
                          </div>
                        </div>

                        {quote.notes && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-500">Notes</p>
                            <p className="text-gray-700">{quote.notes}</p>
                          </div>
                        )}
                      </div>

                      {rfq.selectedQuoteId !== quote.id && rfq.status !== 'awarded' && (
                        <button
                          onClick={() => handleSelectQuote(quote.id)}
                          className="ml-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Select Quote
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AddQuoteModal
        isOpen={showAddQuote}
        onClose={() => setShowAddQuote(false)}
        onAdd={(quote) => onAddQuote(rfq.id, quote)}
      />
    </div>
  );
}