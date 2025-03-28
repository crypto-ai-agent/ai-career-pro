import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ServiceForm } from './ServiceForm';
import { useToast } from '../../../hooks/useToast';
import { getService, updateService, testService } from '../../../services/services';
import type { ServiceConfig } from '../../../services/services';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { ErrorAlert } from '../../../components/shared/ErrorAlert';
import { Play, AlertCircle } from 'lucide-react';

interface ServicePanelProps {
  serviceId: string;
}

export function ServicePanel({ serviceId }: ServicePanelProps) {
  const [service, setService] = useState<ServiceConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [showPriceHistory, setShowPriceHistory] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    loadService();
  }, [serviceId]);

  const loadService = async () => {
    setLoading(true);
    try {
      const data = await getService(serviceId);
      setService(data);
      setError(null);
    } catch (error) {
      console.error('Error loading service:', error);
      setError('Failed to load service');
      addToast('error', 'Failed to load service');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedService: ServiceConfig) => {
    try {
      await updateService(serviceId, updatedService);
      addToast('success', 'Service updated successfully');
      setIsEditing(false);
      loadService();
    } catch (error) {
      console.error('Error updating service:', error);
      addToast('error', 'Failed to update service');
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    try {
      await testService(serviceId);
      addToast('success', 'Service test successful');
    } catch (error) {
      console.error('Error testing service:', error);
      addToast('error', 'Service test failed');
    } finally {
      setIsTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !service) {
    return <ErrorAlert message={error || 'Service not found'} />;
  }

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {service.name}
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowPriceHistory(!showPriceHistory)}
            >
              Price History
            </Button>
            <Button
              variant="outline"
              onClick={handleTest}
              isLoading={isTesting}
            >
              <Play className="w-4 h-4 mr-2" />
              Test
            </Button>
            <Button
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </div>

        {showPriceHistory && (
          <div className="mb-6">
            <PriceHistoryChart history={priceHistory} tier="pro" />
          </div>
        )}

        {isEditing ? (
          <ServiceForm
            service={service}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">{service.description}</p>
            
            {service.webhook_url && (
              <div className="flex items-center text-sm text-gray-500">
                <AlertCircle className="w-4 h-4 mr-2" />
                Webhook URL: {service.webhook_url}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['free', 'pro', 'enterprise'] as const).map(tier => (
                <div key={tier} className="p-4 bg-gray-50 rounded-md">
                  <h4 className="font-medium text-gray-900 capitalize mb-2">
                    {tier} Tier
                  </h4>
                  <p className="text-gray-600">
                    ${service.pricing[tier].price}/month
                  </p>
                  <p className="text-gray-600">
                    Limit: {service.pricing[tier].limits.monthly || 'Unlimited'}/month
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-4">Input Fields</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.input_fields.map((field, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-md">
                    <h5 className="font-medium text-gray-900 mb-1">
                      {field.name}
                    </h5>
                    <p className="text-sm text-gray-600 mb-2">
                      {field.description}
                    </p>
                    <div className="text-sm text-gray-500">
                      <p>Type: {field.type}</p>
                      {field.required && <p>Required</p>}
                      {field.options && (
                        <div>
                          <p>Options:</p>
                          <ul className="list-disc list-inside">
                            {field.options.map((option, i) => (
                              <li key={i}>{option}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}