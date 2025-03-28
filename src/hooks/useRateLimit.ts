import { useState, useEffect } from 'react';
import { checkRateLimit, getRemainingUsage } from '../services/rateLimit';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './useToast';

export function useRateLimit(feature: string) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [remaining, setRemaining] = useState<number | null>(null);
  const [resetTime, setResetTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkUsage();
    }
  }, [user, feature]);

  const checkUsage = async () => {
    try {
      const { remaining, resetTime } = await getRemainingUsage(user!.id, feature as any);
      setRemaining(remaining);
      setResetTime(resetTime);

      if (remaining <= 3) {
        addToast('warning', `You have ${remaining} ${feature} requests remaining`);
      }
    } catch (error) {
      console.error('Error checking rate limit:', error);
      addToast('error', 'Failed to check usage limits');
    } finally {
      setLoading(false);
    }
  };

  const checkLimit = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const canProceed = await checkRateLimit(user.id, feature as any);
      if (!canProceed) {
        addToast('error', 'Rate limit exceeded. Please try again later.');
      }
      return canProceed;
    } catch (error) {
      console.error('Error checking rate limit:', error);
      addToast('error', 'Failed to check rate limit');
      return false;
    }
  };

  return {
    remaining,
    resetTime,
    loading,
    checkLimit,
    refresh: checkUsage
  };
}