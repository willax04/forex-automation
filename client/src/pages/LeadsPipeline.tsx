import React from 'react';
import { Users, TrendingUp, DollarSign } from 'lucide-react';
import { LeadStatus } from '../types';

function LeadsPipeline() {
  const pipelineStages: { status: LeadStatus; color: string; count: number }[] = [
    { status: 'New Lead', color: 'bg-blue-500', count: 8 },
    { status: 'Warm Lead', color: 'bg-yellow-500', count: 12 },
    { status: 'Negotiation', color: 'bg-orange-500', count: 5 },
    { status: 'Closed Sale', color: 'bg-green-500', count: 3 },
    { status: 'Lost', color: 'bg-gray-500', count: 2 },
  ];

  const sampleLeads = [
    { id: 1, name: 'Sarah Johnson', value: 1200, stage: 'Negotiation', lastContact: '2 hours ago' },
    { id: 2, name: 'Mike Chen', value: 800, stage: 'Warm Lead', lastContact: '1 day ago' },
    { id: 3, name: 'Emma Davis', value: 1500, stage: 'New Lead', lastContact: '3 hours ago' },
  ];

  return (
    <div className="container-mobile py-6 space-y-6">
      {/* Pipeline Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Sales Pipeline</h2>
        
        <div className="grid grid-cols-1 gap-4">
          {pipelineStages.map((stage) => (
            <div key={stage.status} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${stage.color}`}></div>
                <span className="font-medium text-gray-900 dark:text-white">{stage.status}</span>
              </div>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                {stage.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg w-fit mx-auto mb-2">
            <Users size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">30</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">Total Leads</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg w-fit mx-auto mb-2">
            <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">18%</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">Conversion</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg w-fit mx-auto mb-2">
            <DollarSign size={20} className="text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">$4.2K</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">Revenue</p>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Hot Leads</h2>
        
        <div className="space-y-4">
          {sampleLeads.map((lead) => (
            <div key={lead.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-brand-teal rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {lead.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{lead.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{lead.stage}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">${lead.value}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{lead.lastContact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drag & Drop Placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
        <Users size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Drag & Drop Pipeline
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Interactive pipeline with drag & drop functionality coming soon!
        </p>
      </div>
    </div>
  );
}

export default LeadsPipeline;
