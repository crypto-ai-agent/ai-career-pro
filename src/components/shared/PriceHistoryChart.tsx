import React from 'react';
import { Link as Line } from 'lucide-react';
import { Card } from '../ui/Card';
import type { PriceHistory } from '../../services/pricing';

interface PriceHistoryChartProps {
  history: PriceHistory[];
  tier: string;
}

export function PriceHistoryChart({ history, tier }: PriceHistoryChartProps) {
  const filteredHistory = history
    .filter(h => h.tier === tier)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  if (filteredHistory.length < 2) return null;

  const maxPrice = Math.max(...filteredHistory.map(h => Math.max(h.oldPrice, h.newPrice)));
  const minPrice = Math.min(...filteredHistory.map(h => Math.min(h.oldPrice, h.newPrice)));
  const range = maxPrice - minPrice;

  const getY = (price: number) => {
    return 150 - ((price - minPrice) / range) * 100;
  };

  const points = filteredHistory.map((h, i) => ({
    x: (i / (filteredHistory.length - 1)) * 600,
    y: getY(h.newPrice),
    price: h.newPrice,
    date: new Date(h.createdAt).toLocaleDateString()
  }));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Price History - {tier}</h3>
      <div className="relative w-[600px] h-[200px]">
        <svg width="600" height="200" className="overflow-visible">
          {/* Y-axis */}
          <line x1="50" y1="0" x2="50" y2="150" stroke="#E5E7EB" />
          {/* X-axis */}
          <line x1="50" y1="150" x2="600" y2="150" stroke="#E5E7EB" />
          
          {/* Price line */}
          <path
            d={`M ${points.map(p => `${p.x + 50},${p.y}`).join(' L ')}`}
            fill="none"
            stroke="#4F46E5"
            strokeWidth="2"
          />

          {/* Data points */}
          {points.map((point, i) => (
            <g key={i}>
              <circle
                cx={point.x + 50}
                cy={point.y}
                r="4"
                fill="#4F46E5"
              />
              <text
                x={point.x + 50}
                y="170"
                textAnchor="middle"
                className="text-xs text-gray-500"
              >
                {point.date}
              </text>
              <text
                x={point.x + 50}
                y={point.y - 10}
                textAnchor="middle"
                className="text-xs text-gray-700"
              >
                ${point.price}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </Card>
  );
}