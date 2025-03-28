import React from 'react';
import { CreditCard, Check } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface Plan {
  id: 'free' | 'pro' | 'enterprise';
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

interface SubscriptionCardProps {
  plan: Plan;
  currentPlan: string;
  onSelect: (plan: Plan) => void;
  isLoading?: boolean;
}

export function SubscriptionCard({ plan, currentPlan, onSelect, isLoading }: SubscriptionCardProps) {
  const isCurrentPlan = currentPlan === plan.id;

  const handleSelect = async () => {
    if (isCurrentPlan || isLoading) return;
    
    try {
      onSelect(plan);
    } catch (error) {
      console.error('Error selecting plan:', error);
    }
  };

  return (
    <Card className={cn(
      'relative',
      plan.popular ? 'ring-2 ring-indigo-600' : '',
      isCurrentPlan ? 'bg-indigo-50' : ''
    )}>
      {plan.popular && (
        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-sm font-medium px-4 py-1 rounded-bl-lg">
          Popular
        </div>
      )}

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
        
        <div className="mb-4">
          <span className="text-4xl font-bold text-gray-900">
            ${plan.price}
          </span>
          <span className="text-gray-500">/month</span>
        </div>

        <ul className="space-y-3 mb-6">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          onClick={handleSelect}
          disabled={isLoading || isCurrentPlan}
          className="w-full"
          variant={isCurrentPlan ? 'outline' : 'default'}
        >
          {isCurrentPlan ? 'Current Plan' : isLoading ? 'Processing...' : 'Select Plan'}
        </Button>
      </div>
    </Card>
  );
}