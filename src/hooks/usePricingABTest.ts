import { useState, useEffect } from 'react';
import { trackEvent } from '../services/analytics';

type Variant = 'A' | 'B';

interface ABTestConfig {
  testId: string;
  variants: {
    A: Record<string, any>;
    B: Record<string, any>;
  };
}

export function usePricingABTest(config: ABTestConfig) {
  const [variant, setVariant] = useState<Variant | null>(null);

  useEffect(() => {
    // Get or assign variant
    const storedVariant = localStorage.getItem(`ab_test_${config.testId}`);
    if (storedVariant === 'A' || storedVariant === 'B') {
      setVariant(storedVariant);
    } else {
      const newVariant: Variant = Math.random() < 0.5 ? 'A' : 'B';
      localStorage.setItem(`ab_test_${config.testId}`, newVariant);
      setVariant(newVariant);
      
      // Track assignment
      trackEvent('ab_test_assigned', {
        testId: config.testId,
        variant: newVariant
      });
    }
  }, [config.testId]);

  const trackConversion = () => {
    if (variant) {
      trackEvent('ab_test_conversion', {
        testId: config.testId,
        variant
      });
    }
  };

  return {
    variant,
    config: variant ? config.variants[variant] : null,
    trackConversion
  };
}