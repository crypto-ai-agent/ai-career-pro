import React, { useState, useEffect } from 'react';
import { CreditCard, Users, DollarSign, Settings } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { FormField, Input, Select } from '../../../components/ui/Form';
import { useToast } from '../../../hooks/useToast';
import { getSubscriptionPlans, updateSubscriptionPlan } from '../../../services/admin/subscriptions';
import type { Plan } from '../../../types/admin';

export function SubscriptionsPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showAgentDiscounts, setShowAgentDiscounts] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await getSubscriptionPlans();
      setPlans(data);
    } catch (error) {
      console.error('Error loading plans:', error);
      addToast('error', 'Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, updates: Partial<Plan>) => {
    try {
      await updateSubscriptionPlan(id, updates);
      addToast('success', 'Plan updated successfully');
      setEditing(null);
      loadPlans();
    } catch (error) {
      console.error('Error updating plan:', error);
      addToast('error', 'Failed to update plan');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <CreditCard className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Subscription Plans</h1>
          </div>
        </div>
      

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Subscribers</p>
                <p className="text-2xl font-semibold text-gray-900">2,543</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">$12,345</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Plans</p>
                <p className="text-2xl font-semibold text-gray-900">{plans.length}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Plans */}
      <div className="space-y-6">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAgentDiscounts(!showAgentDiscounts)}
                  >
                    AGENT Token Discounts
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditing(plan.id)}
                  >
                    Edit Plan
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  {editing === plan.id ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setEditing(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleUpdate(plan.id, plan)}
                      >
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setEditing(plan.id)}
                    >
                      Edit Plan
                    </Button>
                  )}
                </div>
              </div>

              {showAgentDiscounts && (
                <div className="mb-4 bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-medium text-indigo-900 mb-2">AGENT Token Discounts</h4>
                  <div className="space-y-2">
                    <p className="text-indigo-700">
                      Pro Plan: 20% off when paying with AGENT tokens
                    </p>
                    <p className="text-indigo-700">
                      Enterprise Plan: 25% off when paying with AGENT tokens
                    </p>
                  </div>
                </div>
              )}

              {editing === plan.id ? (
                <div className="space-y-4">
                  <FormField label="Price">
                    <Input
                      type="number"
                      value={plan.price}
                      onChange={(e) => setPlans(prev => 
                        prev.map(p => p.id === plan.id ? { ...p, price: Number(e.target.value) } : p)
                      )}
                    />
                  </FormField>

                  <FormField label="Billing Interval">
                    <Select
                      value={plan.interval}
                      onChange={(e) => setPlans(prev => 
                        prev.map(p => p.id === plan.id ? { ...p, interval: e.target.value as 'month' | 'year' } : p)
                      )}
                    >
                      <option value="month">Monthly</option>
                      <option value="year">Yearly</option>
                    </Select>
                  </FormField>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Feature Limits</h4>
                    {Object.entries(plan.limits).map(([feature, limit]) => (
                      <FormField key={feature} label={feature}>
                        <Input
                          type="number"
                          value={limit}
                          onChange={(e) => setPlans(prev => 
                            prev.map(p => p.id === plan.id ? {
                              ...p,
                              limits: {
                                ...p.limits,
                                [feature]: Number(e.target.value)
                              }
                            } : p)
                          )}
                        />
                      </FormField>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-gray-900">
                      ${plan.price}
                      <span className="text-sm text-gray-500">
                        /{plan.interval}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Features</h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Limits</h4>
                      <ul className="space-y-2">
                        {Object.entries(plan.limits).map(([feature, limit]) => (
                          <li key={feature} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">{feature}</span>
                            <span className="font-medium text-gray-900">{limit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
      </div>
    </div>
  );
}