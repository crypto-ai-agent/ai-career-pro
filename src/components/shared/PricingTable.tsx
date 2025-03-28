import React from 'react';
import { PricingCard } from './PricingCard';
import { SERVICE_PLANS, PACKAGE_PLANS } from '../../lib/constants';

interface PricingTableProps {
  service?: keyof typeof SERVICE_PLANS;
  onSelect: (tier: string) => void;
  isLoading?: boolean;
  showAgentToken?: boolean;
}

export function PricingTable({ 
  service, 
  onSelect, 
  isLoading,
  showAgentToken = true
}: PricingTableProps) {
  const plans = service ? SERVICE_PLANS[service] : PACKAGE_PLANS;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <PricingCard
        plan={plans.free}
        tier="free"
        onSelect={onSelect}
        isLoading={isLoading}
        showAgentToken={showAgentToken}
      />
      <PricingCard
        plan={plans.pro}
        tier="pro"
        isPopular
        onSelect={onSelect}
        isLoading={isLoading}
        showAgentToken={showAgentToken}
      />
      <PricingCard
        plan={plans.enterprise}
        tier="enterprise"
        onSelect={onSelect}
        isLoading={isLoading}
        showAgentToken={showAgentToken}
      />
    </div>
  );
}