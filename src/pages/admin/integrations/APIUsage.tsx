import React, { useState, useEffect } from 'react';
import { BarChart, Clock, AlertTriangle } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { supabase } from '../../../lib/supabase';

interface APIMetrics {
  total_requests: number;
  success_rate: number;
  avg_response_time: number;
  error_rate: number;
}

interface UsageByEndpoint {
  endpoint: string;
  requests: number;
  success_rate: number;
}

export function APIUsage() {
  const [metrics, setMetrics] = useState<APIMetrics | null>(null);
  const [usageByEndpoint, setUsageByEndpoint] = useState<UsageByEndpoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAPIMetrics();
  }, []);

  const loadAPIMetrics = async () => {
    try {
      // In a real application, these would be actual database queries
      // For now, we'll use mock data
      setMetrics({
        total_requests: 15234,
        success_rate: 99.2,
        avg_response_time: 245, // ms
        error_rate: 0.8
      });

      setUsageByEndpoint([
        {
          endpoint: '/api/cv-optimizer',
          requests: 5234,
          success_rate: 99.5
        },
        {
          endpoint: '/api/cover-letter',
          requests: 4123,
          success_rate: 99.3
        },
        {
          endpoint: '/api/email-preparer',
          requests: 3456,
          success_rate: 99.1
        },
        {
          endpoint: '/api/interview-coach',
          requests: 2421,
          success_rate: 98.9
        }
      ]);
    } catch (error) {
      console.error('Error loading API metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <BarChart className="h-5 w-5 text-indigo-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">API Usage Monitoring</h3>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <BarChart className="h-8 w-8 text-indigo-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Requests</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {metrics?.total_requests.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Response Time</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {metrics?.avg_response_time}ms
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <BarChart className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Success Rate</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {metrics?.success_rate}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Error Rate</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {metrics?.error_rate}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage by Endpoint */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Usage by Endpoint</h4>
          <div className="space-y-4">
            {usageByEndpoint.map((endpoint) => (
              <div
                key={endpoint.endpoint}
                className="bg-white rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-gray-900">
                    {endpoint.endpoint}
                  </h5>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    endpoint.success_rate >= 99
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {endpoint.success_rate}% Success
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{endpoint.requests.toLocaleString()} requests</span>
                  <span>{Math.round(endpoint.requests / metrics!.total_requests * 100)}% of total</span>
                </div>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${endpoint.requests / metrics!.total_requests * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}