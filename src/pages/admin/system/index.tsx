import React from 'react';
import { AlertTriangle, Activity, Bell } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { useSystemHealth } from '../../../hooks/useSystemHealth';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { ErrorAlert } from '../../../components/shared/ErrorAlert';
import { ErrorLogs } from './ErrorLogs';
import { PerformanceMetrics } from './PerformanceMetrics';
import { AlertConfigurations } from './AlertConfigurations';

export function SystemHealthPage() {
  const { data, loading, error } = useSystemHealth();

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
      name: 'Active Alerts',
      value: data.alerts.filter(a => !a.resolved).length,
      icon: Bell,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      name: 'Recent Errors',
      value: data.errors.filter(e => !e.resolved).length,
      icon: AlertTriangle,
      color: 'text-red-600 bg-red-100'
    },
    {
      name: 'System Health',
      value: '98%',
      icon: Activity,
      color: 'text-green-600 bg-green-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">System Health</h1>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => {
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

        {/* Error Logs */}
        <div className="mb-8">
          <ErrorLogs errors={data.errors} />
        </div>

        {/* Performance Metrics */}
        <div className="mb-8">
          <PerformanceMetrics metrics={data.performance} />
        </div>

        {/* Alert Configurations */}
        <div>
          <AlertConfigurations alerts={data.alerts} />
        </div>
      </div>
    </div>
  );
}