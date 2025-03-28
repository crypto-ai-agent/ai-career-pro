import React, { useState } from 'react';
import { CreditCard, Shield, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FormField, Input } from '../ui/Form';
import { createCheckoutSession, createPortalSession } from '../../services/stripe';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../contexts/AuthContext';

interface SubscriptionSettingsProps {
  currentPlan: 'free' | 'pro' | 'enterprise';
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: string;
}

export function SubscriptionSettings({
  currentPlan,
  billingCycle,
  nextBillingDate
}: SubscriptionSettingsProps) {
  const [showBillingForm, setShowBillingForm] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();
  const { addToast } = useToast();

  const handleUpdateBilling = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    // Add billing update logic here
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProcessing(false);
    setShowBillingForm(false);
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;
    // Add cancellation logic here
  };

  const handleUpgrade = async () => {
    if (!user) return;
    setProcessing(true);
    try {
      addToast('info', 'Redirecting to checkout...');
      await createCheckoutSession(user.id, 'price_pro_monthly');
    } catch (error) {
      console.error('Error upgrading:', error);
      addToast('error', 'Failed to start checkout process');
    } finally {
      setProcessing(false);
    }
  };

  const handleManageBilling = async () => {
    if (!user) return;
    setProcessing(true);
    try {
      addToast('info', 'Opening billing portal...');
      await createPortalSession(user.id);
    } catch (error) {
      console.error('Error opening billing portal:', error);
      addToast('error', 'Failed to open billing portal');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Current Plan
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">
                {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan
              </p>
              <p className="text-sm text-gray-500">
                {billingCycle === 'monthly' ? 'Monthly' : 'Yearly'} billing
              </p>
            </div>
            {currentPlan !== 'free' && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Next billing date</p>
                <p className="font-medium">{nextBillingDate}</p>
              </div>
            )}
          </div>
          {currentPlan === 'free' ? (
            <Button className="mt-4" onClick={handleUpgrade} isLoading={processing}>
              Upgrade to Pro
            </Button>
          ) : (
            <div className="mt-4 flex justify-end space-x-4">
              <Button variant="outline" onClick={handleManageBilling} isLoading={processing}>
                Manage Billing
              </Button>
              <Button onClick={handleUpgrade} isLoading={processing}>
                Change Plan
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Payment Method */}
      {currentPlan !== 'free' && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Payment Method
            </h3>
            {!showBillingForm ? (
              <div>
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <span className="ml-2">•••• •••• •••• 4242</span>
                </div>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowBillingForm(true)}
                >
                  Update Payment Method
                </Button>
              </div>
            ) : (
              <form onSubmit={handleUpdateBilling} className="space-y-4">
                <FormField label="Card Number">
                  <Input
                    type="text"
                    placeholder="•••• •••• •••• ••••"
                    required
                  />
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Expiry Date">
                    <Input
                      type="text"
                      placeholder="MM/YY"
                      required
                    />
                  </FormField>
                  <FormField label="CVC">
                    <Input
                      type="text"
                      placeholder="•••"
                      required
                    />
                  </FormField>
                </div>
                <div className="flex items-center mt-4 text-sm text-gray-500">
                  <Shield className="h-4 w-4 mr-2" />
                  Your payment information is secure
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowBillingForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={processing}>
                    Update Payment Method
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Card>
      )}

      {/* Billing History */}
      {currentPlan !== 'free' && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Billing History
            </h3>
            <div className="space-y-4">
              {[
                {
                  date: '2024-03-01',
                  amount: 19.99,
                  status: 'Paid'
                },
                {
                  date: '2024-02-01',
                  amount: 19.99,
                  status: 'Paid'
                }
              ].map((invoice) => (
                <div
                  key={invoice.date}
                  className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      ${invoice.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(invoice.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-600 text-sm mr-4">
                      {invoice.status}
                    </span>
                    <Button variant="outline">
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}