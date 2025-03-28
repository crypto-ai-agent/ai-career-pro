import React, { useState, useEffect } from 'react';
import { BarChart, PieChart, TrendingUp } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { supabase } from '../../../lib/supabase';

interface EmailMetrics {
  total_sent: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
}

interface EmailEventsByType {
  type: string;
  count: number;
}

export function EmailAnalytics() {
  const [metrics, setMetrics] = useState<EmailMetrics | null>(null);
  const [eventsByType, setEventsByType] = useState<EmailEventsByType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmailAnalytics();
  }, []);

  const loadEmailAnalytics = async () => {
    try {
      // In a real application, these would be actual database queries
      // For now, we'll use mock data
      setMetrics({
        total_sent: 15234,
        open_rate: 45.8,
        click_rate: 12.3,
        bounce_rate: 0.5
      });

      setEventsByType([
        { type: 'opened', count: 6977 },
        { type: 'clicked', count: 1874 },
        { type: 'bounced', count: 76 },
        { type: 'unsubscribed', count: 234 }
      ]);
    } catch (error) {
      console.error('Error loading email analytics:', error);
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
          <h3 className="text-lg font-medium text-gray-900">Email Analytics</h3>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <BarChart className="h-8 w-8 text-indigo-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Sent</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {metrics?.total_sent.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <PieChart className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Open Rate</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {metrics?.open_rate}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Click Rate</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {metrics?.click_rate}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <BarChart className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Bounce Rate</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {metrics?.bounce_rate}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Events by Type */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Events by Type</h4>
          <div className="space-y-4">
            {eventsByType.map((event) => (
              <div
                key={event.type}
                className="bg-white rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-gray-900 capitalize">
                    {event.type}
                  </h5>
                  <span className="text-sm text-gray-500">
                    {event.count.toLocaleString()} events
                  </span>
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <div
                      style={{ width: `${(event.count / metrics!.total_sent) * 100}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {((event.count / metrics!.total_sent) * 100).toFixed(1)}% of total emails
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}