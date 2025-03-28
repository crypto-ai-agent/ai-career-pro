import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';

interface UserGrowthData {
  date: string;
  total_users: number;
  new_users: number;
}

export function UserGrowthChart() {
  const [data, setData] = useState<UserGrowthData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserGrowthData();
  }, []);

  const loadUserGrowthData = async () => {
    try {
      // Get user signups by date for the last 12 months
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 11);

      const { data, error } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) throw error;

      // Process data into monthly buckets
      const monthlyData = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(endDate);
        date.setMonth(date.getMonth() - i);
        return {
          date: date.toISOString().slice(0, 7), // YYYY-MM format
          total_users: 0,
          new_users: 0
        };
      }).reverse();

      // Count users per month
      data?.forEach(user => {
        const month = user.created_at.slice(0, 7);
        const monthData = monthlyData.find(d => d.date === month);
        if (monthData) {
          monthData.new_users++;
        }
      });

      // Calculate running total
      let runningTotal = 0;
      monthlyData.forEach(month => {
        runningTotal += month.new_users;
        month.total_users = runningTotal;
      });

      setData(monthlyData);
    } catch (error) {
      console.error('Error loading user growth data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  // Calculate scales
  const maxUsers = Math.max(...data.map(d => d.total_users));
  const yScale = (value: number) => chartHeight - (value / maxUsers) * chartHeight;
  const xScale = (index: number) => (index / (data.length - 1)) * chartWidth;

  // Generate path data for total users line
  const totalUsersPath = data.map((d, i) => {
    const x = xScale(i) + padding;
    const y = yScale(d.total_users) + padding;
    return i === 0 ? `M ${x},${y}` : `L ${x},${y}`;
  }).join(' ');

  // Generate path data for new users bars
  const maxNewUsers = Math.max(...data.map(d => d.new_users));
  const barWidth = chartWidth / data.length * 0.8;
  const barScale = (value: number) => (value / maxNewUsers) * (chartHeight * 0.3);

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

        {/* New users bars */}
        {data.map((d, i) => (
          <rect
            key={`bar-${i}`}
            x={xScale(i) + padding - barWidth / 2}
            y={height - padding - barScale(d.new_users)}
            width={barWidth}
            height={barScale(d.new_users)}
            fill="#C7D2FE"
            opacity={0.6}
          />
        ))}

        {/* Total users line */}
        <path
          d={totalUsersPath}
          fill="none"
          stroke="#4F46E5"
          strokeWidth={2}
        />

        {/* Data points */}
        {data.map((d, i) => (
          <circle
            key={`point-${i}`}
            cx={xScale(i) + padding}
            cy={yScale(d.total_users) + padding}
            r={4}
            fill="#4F46E5"
          />
        ))}

        {/* Y-axis labels */}
        {[0, maxUsers / 2, maxUsers].map((value, i) => (
          <text
            key={i}
            x={padding - 10}
            y={yScale(value) + padding}
            textAnchor="end"
            alignmentBaseline="middle"
            className="text-xs text-gray-500"
          >
            {value.toLocaleString()}
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
          <span className="text-sm text-gray-600">Total Users</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-indigo-200 rounded-sm mr-2" />
          <span className="text-sm text-gray-600">New Users</span>
        </div>
      </div>
    </div>
  );
}