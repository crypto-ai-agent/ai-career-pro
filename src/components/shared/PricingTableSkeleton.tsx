import React from 'react';
import { Card } from '../ui/Card';

export function PricingTableSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <div className="p-6 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2" />
            <div className="h-12 bg-gray-200 rounded w-3/4" />
            <div className="space-y-2">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="h-4 bg-gray-200 rounded w-full" />
              ))}
            </div>
            <div className="h-10 bg-gray-200 rounded w-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}