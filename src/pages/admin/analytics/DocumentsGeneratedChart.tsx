import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';

interface DocumentData {
  date: string;
  cv_count: number;
  cover_letter_count: number;
  email_count: number;
}

export function DocumentsGeneratedChart() {
  const [data, setData] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocumentData();
  }, []);

  const loadDocumentData = async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: events, error } = await supabase
        .from('analytics_events')
        .select('*')
        .in('event_type', ['cv_generated', 'cover_letter_generated', 'email_generated'])
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Process data into daily buckets
      const dailyData = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
          date: date.toISOString().slice(0, 10),
          cv_count: 0,
          cover_letter_count: 0,
          email_count: 0
        };
      }).reverse();

      // Count documents per day
      (events || []).forEach(event => {
        const day = event.created_at.slice(0, 10);
        const dayData = dailyData.find(d => d.date === day);
        if (dayData) {
          switch (event.event_type) {
            case 'cv_generated':
              dayData.cv_count++;
              break;
            case 'cover_letter_generated':
              dayData.cover_letter_count++;
              break;
            case 'email_generated':
              dayData.email_count++;
              break;
          }
        }
      });

      setData(dailyData);
    } catch (err) {
      console.error('Error loading document data:', error);
      // Set empty data on error
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  if (!data.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No document generation data available</p>
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
  const maxTotal = Math.max(
    1,
    ...data.map(d => d.cv_count + d.cover_letter_count + d.email_count)
  );
  const yScale = (value: number) => chartHeight - ((value || 0) / maxTotal) * chartHeight;
  const xScale = (index: number) => (index / (data.length - 1)) * chartWidth;
  const barWidth = chartWidth / data.length * 0.8;

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

        {/* Stacked bars */}
        {data.map((d, i) => {
          const x = xScale(i) + padding - barWidth / 2;
          let y = height - padding;
          const bars = [
            { value: d.email_count || 0, color: '#C7D2FE' },
            { value: d.cover_letter_count || 0, color: '#818CF8' },
            { value: d.cv_count || 0, color: '#4F46E5' }
          ];

          return bars.map((bar, j) => {
            const barHeight = ((bar.value || 0) / maxTotal) * chartHeight;
            y -= barHeight;
            return (
              <rect
                key={`bar-${i}-${j}`}
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={bar.color}
              />
            );
          });
        })}

        {/* Y-axis labels */}
        {[0, maxTotal / 2, maxTotal].map((value, i) => (
          <text
            key={i}
            x={padding - 10}
            y={yScale(value || 0) + padding}
            textAnchor="end"
            alignmentBaseline="middle"
            className="text-xs text-gray-500"
          >
            {Math.round(value)}
          </text>
        ))}

        {/* X-axis labels */}
        {data.map((d, i) => {
          if (i % 5 === 0) {
            return (
              <text
                key={i}
                x={xScale(i) + padding}
                y={height - padding + 20}
                textAnchor="middle"
                className="text-xs text-gray-500"
              >
                {new Date(d.date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric'
                })}
              </text>
            );
          }
          return null;
        })}
      </svg>

      {/* Legend */}
      <div className="absolute top-0 right-0 flex items-center space-x-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-indigo-600 rounded-sm mr-2" />
          <span className="text-sm text-gray-600">CVs</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-indigo-400 rounded-sm mr-2" />
          <span className="text-sm text-gray-600">Cover Letters</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-indigo-200 rounded-sm mr-2" />
          <span className="text-sm text-gray-600">Emails</span>
        </div>
      </div>
    </div>
  );
}