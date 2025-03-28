import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';

interface RevenueData {
  date: string;
  mrr: number;
  new_subscriptions: number;
  churned_subscriptions: number;
}

export function RevenueChart() {
  const [data, setData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRevenueData();
  }, []);

  const loadRevenueData = async () => {
    try {
      const today = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 11);
      startDate.setDate(1); // First day of month

      const { data, error } = await supabase
        .from('revenue_metrics')
        .select('*')
        .gte('date', startDate.toISOString())
        .order('date', { ascending: true })
        .limit(12);

      if (error) throw error;
      
      // Ensure we have data for all months
      const allMonths = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        return {
          date: date.toISOString().slice(0, 10),
          mrr: 0,
          new_subscriptions: 0,
          churned_subscriptions: 0
        };
      }).reverse();

      // Merge actual data with placeholder data
      const mergedData = allMonths.map(month => {
        const actualData = data?.find(d => d.date?.slice(0, 7) === month.date.slice(0, 7));
        return actualData || month;
      });

      setData(mergedData);
    } catch (error) {
      console.error('Error loading revenue data:', error);
      setData([]);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  if (!data.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No revenue data available</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Calculate chart dimensions
  const width = 800;
  const height = 300;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Calculate scales with safe defaults
  const maxMRR = Math.max(1, ...data.map(d => d.mrr || 0));
  const yScale = (value: number) => chartHeight - (value / maxMRR) * chartHeight;
  const xScale = (index: number) => (index / (data.length - 1)) * chartWidth;

  // Generate path data
  const pathData = data.map((d, i) => {
    const x = xScale(i) + padding;
    const y = yScale(d.mrr || 0) + padding;
    return i === 0 ? `M ${x},${y}` : `L ${x},${y}`;
  }).join(' ');

  return (
    <div className="relative">
      <svg width={width} height={height} className="overflow-visible">
        {/* Y-axis */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#E5E7EB"
        />
        {/* X-axis */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#E5E7EB"
        />

        {/* Revenue line */}
        <path
          d={pathData}
          fill="none"
          stroke="#4F46E5"
          strokeWidth={2}
        />

        {/* Data points */}
        {data.map((d, i) => (
          <circle
            key={d.date}
            cx={xScale(i) + padding}
            cy={yScale(d.mrr || 0) + padding}
            r={4}
            fill="#4F46E5"
          />
        ))}

        {/* Y-axis labels */}
        {[0, maxMRR / 2, maxMRR].map((value, i) => (
          <text
            key={i}
            x={padding - 10}
            y={yScale(value || 0) + padding}
            textAnchor="end"
            alignmentBaseline="middle"
            className="text-xs text-gray-500"
          >
            ${value.toLocaleString()}
          </text>
        ))}

        {/* X-axis labels */}
        {data.map((d, i) => {
          if (i % 2 === 0) {
            return (
              <text
                key={i}
                x={xScale(i) + padding}
                y={height - padding + 20}
                textAnchor="middle"
                className="text-xs text-gray-500"
              >
                {new Date(d.date).toLocaleDateString(undefined, { month: 'short' })}
              </text>
            );
          }
          return null;
        })}
      </svg>

      {/* Legend */}
      <div className="absolute top-0 right-0 flex items-center space-x-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-indigo-600 rounded-full mr-2" />
          <span className="text-sm text-gray-600">MRR</span>
        </div>
      </div>
    </div>
  );
}