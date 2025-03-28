import React from 'react';
import { Activity, ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

interface PerformanceMetric {
  id: string;
  metric_name: string;
  value: number;
  unit: string;
  created_at: string;
}

interface PerformanceMetricsProps {
  metrics: PerformanceMetric[];
}

export function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  // Group metrics by name and get the latest value
  const latestMetrics = metrics.reduce((acc, metric) => {
    if (!acc[metric.metric_name] || 
        new Date(metric.created_at) > new Date(acc[metric.metric_name].created_at)) {
      acc[metric.metric_name] = metric;
    }
    return acc;
  }, {} as Record<string, PerformanceMetric>);

  // Calculate trends
  const trends = Object.values(latestMetrics).map(metric => {
    const previousMetrics = metrics
      .filter(m => m.metric_name === metric.metric_name)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    if (previousMetrics.length < 2) return { ...metric, trend: 0 };
    
    const current = previousMetrics[0].value;
    const previous = previousMetrics[1].value;
    const trend = ((current - previous) / previous) * 100;
    
    return { ...metric, trend };
  });

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Activity className="h-5 w-5 text-indigo-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Performance Metrics</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trends.map((metric) => (
            <div
              key={metric.id}
              className="bg-gray-50 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-600">
                  {metric.metric_name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </h4>
                {metric.trend !== 0 && (
                  <div className={`flex items-center ${
                    metric.trend > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.trend > 0 ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                    <span className="text-sm ml-1">
                      {Math.abs(metric.trend).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-semibold text-gray-900">
                  {metric.value}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  {metric.unit}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {new Date(metric.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}