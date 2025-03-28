import { useCache } from './useCache';
import { getServicePricing } from '../services/pricing';
import type { ServiceConfig } from '../services/services';

export function usePricingCache(service?: keyof ServiceConfig) {
  return useCache(
    `pricing_${service || 'all'}`,
    () => getServicePricing(service),
    {
      ttl: 5 * 60 * 1000, // 5 minutes
      staleWhileRevalidate: true
    }
  );
}