import React from 'react';
import { Check, X } from 'lucide-react';
import { Card } from '../ui/Card';
import { Tooltip } from '../ui/Tooltip';
import { SERVICE_PLANS } from '../../lib/constants';

interface PricingComparisonProps {
  service?: keyof typeof SERVICE_PLANS;
}

export function PricingComparison({ service }: PricingComparisonProps) {
  const plans = service ? SERVICE_PLANS[service] : null;

  const features = [
    { name: 'Monthly Usage', tooltip: 'Number of documents/sessions per month' },
    { name: 'AI-Powered Analysis', tooltip: 'Advanced AI analysis and suggestions' },
    { name: 'Custom Templates', tooltip: 'Access to premium templates' },
    { name: 'Priority Support', tooltip: '24/7 priority customer support' },
    { name: 'API Access', tooltip: 'Access to our REST API' },
    { name: 'Team Features', tooltip: 'Collaboration tools for teams' }
  ];

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Features</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">Free</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">Pro</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">Enterprise</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {features.map((feature) => (
              <tr key={feature.name}>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <Tooltip content={feature.tooltip}>
                    {feature.name}
                  </Tooltip>
                </td>
                <td className="px-6 py-4 text-center">
                  {feature.name === 'Monthly Usage' ? (
                    <span className="text-sm text-gray-600">
                      {plans?.free.limits.monthly || 'Limited'}
                    </span>
                  ) : (
                    feature.name === 'AI-Powered Analysis' ? (
                      <span className="text-sm text-gray-600">Basic</span>
                    ) : (
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    )
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {feature.name === 'Monthly Usage' ? (
                    <span className="text-sm text-gray-600">
                      {plans?.pro.limits.monthly === -1 ? 'Unlimited' : plans?.pro.limits.monthly}
                    </span>
                  ) : (
                    feature.name === 'API Access' || feature.name === 'Team Features' ? (
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    ) : (
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    )
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}