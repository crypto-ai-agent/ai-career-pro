import React from 'react';
import { useParams } from 'react-router-dom';
import { useServiceConfig } from '../../hooks/useServiceConfig';
import { PageHeader } from '../../components/layout/PageHeader';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { ErrorAlert } from '../../components/shared/ErrorAlert';
import { Card } from '../../components/ui/Card';
import { cn } from '../../lib/utils';

export function ServicePage() {
  const { id } = useParams<{ id: string }>();
  const { config, loading, error } = useServiceConfig(id);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !config) {
    return <ErrorAlert message={error || 'Service not found'} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title={config.name}
        description={config.description}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(['free', 'pro', 'enterprise'] as const).map((tier) => (
            <Card
              key={tier}
              className={cn(
                'relative',
                tier === 'pro' ? 'ring-2 ring-indigo-600' : ''
              )}
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  {tier === 'free' ? 'Basic' : tier === 'pro' ? 'Professional' : 'Enterprise'} Plan
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">
                    ${config.pricing[tier].price}
                  </span>
                  <span className="text-gray-500">/month</span>
                </div>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-600">
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2" />
                    {config.pricing[tier].limits.monthly === -1 
                      ? 'Unlimited usage'
                      : `${config.pricing[tier].limits.monthly} uses per month`}
                  </li>
                  {/* Add more features based on tier */}
                </ul>

                <button
                  className={cn(
                    'w-full px-4 py-2 rounded-md font-medium transition-colors',
                    tier === 'pro'
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  )}
                >
                  Get Started
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Service Details */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {config.input_fields.map((field, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-medium text-gray-900 mb-2">
                  {field.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {field.description}
                </p>
                {field.type === 'select' && field.options && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Available options:</p>
                    <ul className="space-y-1">
                      {field.options.map((option, i) => (
                        <li key={i} className="text-sm text-gray-600">
                          • {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}