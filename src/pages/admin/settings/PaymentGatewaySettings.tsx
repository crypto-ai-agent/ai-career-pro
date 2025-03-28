import React, { useState, useEffect } from 'react';
import { CreditCard, Eye, EyeOff } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { FormField, Input } from '../../../components/ui/Form';
import { Table } from '../../../components/ui/Table';
import { useToast } from '../../../hooks/useToast';
import { supabase } from '../../../lib/supabase';
import { STRIPE_CONFIG } from '../../../config/stripe';

interface PaymentKeys {
  stripe_secret_key?: string;
  stripe_public_key?: string;
  stripe_webhook_secret?: string;
  paypal_client_id?: string;
  paypal_secret_key?: string;
  paypal_webhook_id?: string;
}

interface StripeProduct {
  id: string;
  name: string;
  description?: string;
  prices: Array<{
    id: string;
    nickname?: string;
    unit_amount: number;
    currency: string;
    recurring?: {
      interval: 'month' | 'year';
    };
  }>;
}

export function PaymentGatewaySettings() {
  const [keys, setKeys] = useState<PaymentKeys>({});
  const [products, setProducts] = useState<StripeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    loadKeys();
    loadStripeProducts();
  }, []);

  const loadKeys = async () => {
    try {
      const paymentKeys = ['stripe_secret_key', 'stripe_public_key', 'stripe_webhook_secret', 
                          'paypal_client_id', 'paypal_secret_key', 'paypal_webhook_id'];
      
      const keys: PaymentKeys = {};
      for (const key of paymentKeys) {
        const { data: value } = await supabase.rpc('get_secret', { secret_name: key });
        if (value) keys[key as keyof PaymentKeys] = value;
      }
      
      setKeys(keys);
    } catch (error) {
      console.error('Error loading payment keys:', error);
      addToast('error', 'Failed to load payment gateway settings');
    } finally {
      setLoading(false);
    }
  };

  const loadStripeProducts = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('list-stripe-products');
      if (error) throw error;
      setProducts(data);
    } catch (error) {
      console.error('Error loading Stripe products:', error);
      addToast('error', 'Failed to load Stripe products');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(keys)) {
        if (value) {
          await supabase.rpc('set_secret', {
            secret_name: key,
            secret_value: value
          });
        }
      }
      addToast('success', 'Payment gateway settings updated successfully');
    } catch (error) {
      console.error('Error saving payment keys:', error);
      addToast('error', 'Failed to update payment gateway settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: keyof PaymentKeys, value: string) => {
    setKeys(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Payment Gateway Settings
            </h3>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowSecrets(!showSecrets)}
          >
            {showSecrets ? (
              <EyeOff className="h-4 w-4 mr-2" />
            ) : (
              <Eye className="h-4 w-4 mr-2" />
            )}
            {showSecrets ? 'Hide' : 'Show'} Keys
          </Button>
        </div>

        <div className="space-y-6">
          {/* Stripe Settings */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Stripe Configuration</h4>
            <div className="space-y-4">
              <FormField label="Stripe Public Key">
                <Input
                  type={showSecrets ? 'text' : 'password'}
                  value={keys.stripe_public_key || ''}
                  onChange={(e) => handleChange('stripe_public_key', e.target.value)}
                  placeholder="pk_..."
                />
              </FormField>

              <FormField label="Stripe Secret Key">
                <Input
                  type={showSecrets ? 'text' : 'password'}
                  value={keys.stripe_secret_key || ''}
                  onChange={(e) => handleChange('stripe_secret_key', e.target.value)}
                  placeholder="sk_..."
                />
              </FormField>

              <FormField label="Stripe Webhook Secret">
                <Input
                  type={showSecrets ? 'text' : 'password'}
                  value={keys.stripe_webhook_secret || ''}
                  onChange={(e) => handleChange('stripe_webhook_secret', e.target.value)}
                  placeholder="whsec_..."
                />
              </FormField>
            </div>
          </div>

          {/* PayPal Settings */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">PayPal Configuration</h4>
            <div className="space-y-4">
              <FormField label="PayPal Client ID">
                <Input
                  type={showSecrets ? 'text' : 'password'}
                  value={keys.paypal_client_id || ''}
                  onChange={(e) => handleChange('paypal_client_id', e.target.value)}
                />
              </FormField>

              <FormField label="PayPal Secret Key">
                <Input
                  type={showSecrets ? 'text' : 'password'}
                  value={keys.paypal_secret_key || ''}
                  onChange={(e) => handleChange('paypal_secret_key', e.target.value)}
                />
              </FormField>

              <FormField label="PayPal Webhook ID">
                <Input
                  type={showSecrets ? 'text' : 'password'}
                  value={keys.paypal_webhook_id || ''}
                  onChange={(e) => handleChange('paypal_webhook_id', e.target.value)}
                />
              </FormField>
            </div>
          </div>

          {/* Stripe Products */}
          <div className="mt-8">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Stripe Products</h4>
            <div className="overflow-x-auto">
              <Table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Description</th>
                    <th>Price ID</th>
                    <th>Amount</th>
                    <th>Interval</th>
                    <th>Config Key</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    product.prices.map(price => {
                      // Find matching config key
                      const configKey = Object.entries(STRIPE_CONFIG.PRICES)
                        .find(([_, priceMap]) => 
                          Object.values(priceMap).flat().includes(price.id)
                        )?.[0];
                      
                      return (
                        <tr key={price.id}>
                          <td>{product.name}</td>
                          <td>{product.description || '-'}</td>
                          <td>
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                              {price.id}
                            </code>
                          </td>
                          <td>
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: price.currency
                            }).format(price.unit_amount / 100)}
                          </td>
                          <td>{price.recurring?.interval || '-'}</td>
                          <td>
                            {configKey ? (
                              <code className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                {configKey}
                              </code>
                            ) : (
                              <span className="text-red-600">Not mapped</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ))}
                </tbody>
              </Table>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              isLoading={saving}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}