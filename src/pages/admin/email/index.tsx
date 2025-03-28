import React from 'react';
import { Mail, Send, BarChart, Users } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { useEmailCampaigns } from '../../../hooks/useEmailCampaigns';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { ErrorAlert } from '../../../components/shared/ErrorAlert';
import { EmailTemplates } from './EmailTemplates';
import { CampaignManager } from './CampaignManager';
import { EmailAnalytics } from './EmailAnalytics';

export function EmailManagementPage() {
  const { templates, campaigns, loading, error } = useEmailCampaigns();

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  const stats = [
    {
      name: 'Active Templates',
      value: templates.filter(t => t.active).length,
      icon: Mail,
      color: 'text-indigo-600 bg-indigo-100'
    },
    {
      name: 'Campaigns Sent',
      value: campaigns.filter(c => c.status === 'completed').length,
      icon: Send,
      color: 'text-green-600 bg-green-100'
    },
    {
      name: 'Average Open Rate',
      value: '45.8%',
      icon: BarChart,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      name: 'Subscribers',
      value: '2,547',
      icon: Users,
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Mail className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Email Management</h1>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 bg-white rounded-lg shadow-sm p-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-gray-50 rounded-lg p-6">
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
            );
          })}
        </div>

        <div className="space-y-8">
          {/* Email Templates */}
          <EmailTemplates templates={templates} />

          {/* Campaign Manager */}
          <CampaignManager campaigns={campaigns} />

          {/* Email Analytics */}
          <EmailAnalytics />
        </div>
      </div>
    </div>
  );
}