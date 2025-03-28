import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { PriceTransition } from './PriceTransition';
import { cn } from '../../lib/utils';

interface PricingCardProps {
  plan: {
    name: string;
    price: number;
    features: string[];
    limits: Record<string, number>;
  };
  tier: 'free' | 'pro' | 'enterprise';
  isPopular?: boolean;
  onSelect: (tier: string) => void;
  isLoading?: boolean;
  showAgentToken?: boolean;
}

export function PricingCard({
  plan,
  tier,
  isPopular,
  onSelect,
  isLoading,
  showAgentToken = true
}: PricingCardProps) {
  const [showAgentPrice, setShowAgentPrice] = useState(false);
  const agentDiscount = tier === 'pro' ? 20 : tier === 'enterprise' ? 25 : 0;

  return (
    <Card className={cn(
      'relative',
      isPopular && 'ring-2 ring-primary'
    )}>
      {isPopular && (
        <div className="absolute top-0 right-0 bg-primary text-white text-sm font-medium px-4 py-1 rounded-bl-lg">
          Popular
        </div>
      )}

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
        
        <div className="mb-4">
          <div className="flex items-baseline space-x-2">
            <PriceTransition
              price={plan.price}
              showAgentPrice={showAgentPrice}
              agentDiscount={agentDiscount}
              className="text-4xl font-bold"
            />
            {showAgentToken && agentDiscount > 0 && (
              <button
                onClick={() => setShowAgentPrice(!showAgentPrice)}
                className="text-sm text-primary hover:text-primary/90"
              >
                {showAgentPrice ? 'Show regular price' : 'Show AGENT price'}
              </button>
            )}
          </div>
          <span className="text-gray-500">/month</span>
          {showAgentToken && agentDiscount > 0 && (
            <p className="text-sm text-green-600 mt-1">
              Save {agentDiscount}% with AGENT tokens
            </p>
          )}
        </div>

        <ul className="space-y-3 mb-6">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
          {Object.entries(plan.limits).map(([feature, limit]) => (
            <li key={feature} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <span className="text-gray-600">
                {limit === -1 ? 'Unlimited' : limit} {feature.replace('_', ' ')}
              </span>
            </li>
          ))}
        </ul>

        <Button
          onClick={() => onSelect(tier)}
          isLoading={isLoading}
          className="w-full"
          variant={tier === 'free' ? 'outline' : 'primary'}
        >
          {tier === 'free' ? 'Get Started' : 'Subscribe Now'}
        </Button>
      </div>
    </Card>
  );
}