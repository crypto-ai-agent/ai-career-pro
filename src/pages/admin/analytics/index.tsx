import React from 'react';
import { DollarSign, Users, FileText, TrendingUp, BarChart } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { useAnalytics } from '../../../hooks/useAnalytics';
import { ErrorBoundary } from '../../../components/shared/ErrorBoundary';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { ErrorAlert } from '../../../components/shared/ErrorAlert';
import { RevenueChart } from './RevenueChart';
import { UserGrowthChart } from './UserGrowthChart';
import { DocumentsGeneratedChart } from './DocumentsGeneratedChart';

function AnalyticsContent() {
  const { data, loading, error } = useAnalytics();

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

  if (!data) return null;

  const stats = [
    {
      name: 'Monthly Recurring Revenue',
      value: `$${data.mrr.toLocaleString()}`,
      change: `${data.revenueGrowth > 0 ? '+' : ''}${data.revenueGrowth.toFixed(1)}%`,
      changeType: data.revenueGrowth >= 0 ? 'positive' : 'negative',
      icon: DollarSign,
      color: 'bg-green-100'
    },
    {
      name: 'Total Users',
      value: data.totalUsers.toLocaleString(),
      change: `${data.userGrowth > 0 ? '+' : ''}${data.userGrowth.toFixed(1)}%`,
      changeType: data.userGrowth >= 0 ? 'positive' : 'negative',
      icon: Users,
      color: 'bg-blue-100'
    },
    {
      name: 'Active Subscriptions',
      value: data.activeSubscriptions.toLocaleString(),
      icon: TrendingUp,
      color: 'bg-purple-100'
    },
    {
      name: 'Documents Generated',
      value: data.documentsGenerated.toLocaleString(),
      icon: FileText,
      color: 'bg-yellow-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <BarChart className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.name} className="bg-white">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                      {stat.change && (
                        <p className={`text-sm ${
                          stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change} from last month
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Growth</h3>
              <RevenueChart />
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">User Growth</h3>
              <UserGrowthChart />
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Documents Generated</h3>
              <DocumentsGeneratedChart />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function AnalyticsPage() {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-6">
          <ErrorAlert message="Failed to load analytics data" />
        </div>
      }
    >
      <AnalyticsContent />
    </ErrorBoundary>
  );
}