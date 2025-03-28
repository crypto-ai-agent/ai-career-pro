import React from 'react';
import { Key, Webhook, GitBranch, BarChart } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { OAuthApplications } from './OAuthApplications';
import { WebhookLogs } from './WebhookLogs';
import { APIUsage } from './APIUsage';
import { ThirdPartyIntegrations } from './ThirdPartyIntegrations';

export function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <GitBranch className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Integration Management</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              name: 'OAuth Applications',
              value: '3 Active',
              icon: Key,
              color: 'text-indigo-600 bg-indigo-100'
            },
            {
              name: 'Webhooks',
              value: '8 Configured',
              icon: Webhook,
              color: 'text-purple-600 bg-purple-100'
            },
            {
              name: 'API Endpoints',
              value: '12 Active',
              icon: GitBranch,
              color: 'text-green-600 bg-green-100'
            },
            {
              name: 'API Usage',
              value: '98% Uptime',
              icon: BarChart,
              color: 'text-blue-600 bg-blue-100'
            }
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.name} className="bg-white">
                <div className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="space-y-8">
          {/* OAuth Applications */}
          <OAuthApplications />

          {/* Webhook Logs */}
          <WebhookLogs />

          {/* API Usage */}
          <APIUsage />

          {/* Third-Party Integrations */}
          <ThirdPartyIntegrations />
        </div>
      </div>
    </div>
  );
}