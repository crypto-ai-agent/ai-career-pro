import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useSubscription } from './useSubscription';
import { createCheckoutSession } from '../services/payment';
import { useToast } from './useToast';
import type { ServiceConfig } from '../services/services';

export function usePricing(service?: keyof ServiceConfig) {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (tier: string) => {
    if (!user) {
      addToast('error', 'Please sign in to subscribe');
      return;
    }

    setIsLoading(true);
    try {
      await createCheckoutSession(user.id, tier);
    } catch (error) {
      console.error('Subscription error:', error);
      addToast('error', 'Failed to start subscription process');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDiscount = (price: number, tier: string): number => {
    if (!subscription?.payment_method?.includes('agent_token')) return price;
    
    const discount = tier === 'pro' ? 0.2 : tier === 'enterprise' ? 0.25 : 0;
    return price * (1 - discount);
  };

  return {
    isLoading,
    handleSubscribe,
    calculateDiscount,
    currentPlan: subscription?.plan || 'free'
  };
}