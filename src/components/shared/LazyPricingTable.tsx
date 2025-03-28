import React, { lazy, Suspense } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

const PricingTable = lazy(() => import('./PricingTable'));

interface LazyPricingTableProps {
  service?: string;
  onSelect: (tier: string) => void;
  isLoading?: boolean;
}

export function LazyPricingTable(props: LazyPricingTableProps) {
  return (
    <Suspense 
      fallback={
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <PricingTable {...props} />
    </Suspense>
  );
}