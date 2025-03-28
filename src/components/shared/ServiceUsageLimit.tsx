import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useServiceUsage } from '../../hooks/useServiceUsage';
import type { SERVICE_PLANS } from '../../lib/constants';

interface ServiceUsageLimitProps {
  service: keyof typeof SERVICE_PLANS;
}

export function ServiceUsageLimit({ service }: ServiceUsageLimitProps) {
  const { canUse, plan, remaining } = useServiceUsage(service);

  if (canUse) return null;

  return (
    <Card className="p-6">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-3" />
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Usage Limit Reached
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            You've reached your monthly limit for this service on the {plan} plan.
            Upgrade your plan to continue using this service.
          </p>
          <div className="mt-4">
            <Link to="/pricing">
              <Button>
                View Plans & Upgrade
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}