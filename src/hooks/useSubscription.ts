import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getSubscription } from '../services/database';
import { useErrorHandler } from './useErrorHandler';
import { SERVICE_PLANS } from '../lib/constants';
import type { Subscription } from '../types/database';

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    if (user) {
      loadSubscription();
    }
  }, [user]);

  const loadSubscription = async () => {
    try {
      const data = await getSubscription(user!.id);
      setSubscription(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const canUseService = (service: keyof typeof SERVICE_PLANS, usage: number) => {
    if (!subscription) return false;

    // Check if user has a package plan
    if (subscription.package_plan) {
      const packageLimits = SERVICE_PLANS[service][subscription.package_plan].limits;
      return packageLimits[`monthly_${service}`] === -1 || usage < packageLimits[`monthly_${service}`];
    }

    // Check individual service subscription
    const servicePlan = subscription.services[service];
    if (!servicePlan) return false;

    const limits = SERVICE_PLANS[service][servicePlan].limits;
    return limits[`monthly_${service}`] === -1 || usage < limits[`monthly_${service}`];
  };

  const getServicePlan = (service: keyof typeof SERVICE_PLANS) => {
    if (!subscription) return 'free';
    return subscription.package_plan || subscription.services[service] || 'free';
  };

  const getRemainingUsage = (service: keyof typeof SERVICE_PLANS) => {
    if (!subscription) return 0;

    const plan = subscription.package_plan || subscription.services[service] || 'free';
    const limits = SERVICE_PLANS[service][plan].limits;
    const limit = limits[`monthly_${service}`];
    
    if (limit === -1) return Infinity;
    // TODO: Get actual usage from database
    const usage = 0;
    return limit - usage;
  };

  return {
    subscription,
    loading,
    canUseService,
    getServicePlan,
    getRemainingUsage,
    refresh: loadSubscription
  };
}