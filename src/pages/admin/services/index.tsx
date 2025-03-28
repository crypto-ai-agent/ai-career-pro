import React, { useState } from 'react';
import { Settings, Wrench, Play, AlertCircle } from 'lucide-react';
import { ServiceNav, sections } from './ServiceNav';
import { ServicePanel } from './ServicePanel';

export function ServicesManagementPage() {
  const [activeTab, setActiveTab] = useState('cv');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Wrench className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Services Management</h1>
          </div>
        </div>
     

        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <ServiceNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <ServicePanel serviceId={activeTab} />
      </div>
    </div>
  );
}