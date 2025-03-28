import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from './useSubscription';
import { useToast } from './useToast';
import { trackUsage } from '../services/usage';
import type { SERVICE_PLANS } from '../lib/constants';

export function useServiceUsage(service: keyof typeof SERVICE_PLANS) {
  const { user } = useAuth();
  const { canUseService, getServicePlan, getRemainingUsage } = useSubscription();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const trackServiceUsage = async () => {
    if (!user) return false;

    setIsLoading(true);
    try {
      const remaining = getRemainingUsage(service);
      
      if (remaining === 0) {
        addToast('error', 'Usage limit reached. Please upgrade your plan.');
        return false;
      }

      await trackUsage(user.id, service);
      
      // Show warning if approaching limit
      if (remaining <= 3 && remaining > 0) {
        addToast('info', `You have ${remaining} ${service} uses remaining this month.`);
      }

      return true;
    } catch (error) {
      console.error('Error tracking usage:', error);
      addToast('error', 'Failed to track usage');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    canUse: canUseService(service, 0),
    plan: getServicePlan(service),
    remaining: getRemainingUsage(service),
    trackUsage: trackServiceUsage
  };
}