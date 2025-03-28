import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useDebounce } from './useDebounce';
import { useToast } from './useToast';
import type { ServiceConfig } from '../services/services';

export function useServiceConfig(serviceId?: string) {
  const [config, setConfig] = useState<ServiceConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();
  const debouncedId = useDebounce(serviceId, 300);

  useEffect(() => {
    if (!debouncedId) {
      setLoading(false);
      return;
    }

    let subscription: ReturnType<typeof supabase.channel>;

    async function loadConfig() {
      try {
        const { data, error } = await supabase
          .from('service_configs')
          .select()
          .eq('slug', debouncedId)
          .eq('active', true)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Service not found');
        
        setConfig(data);
        setError(null);
      } catch (err) {
        console.error('Error loading service config:', err);
        const message = err instanceof Error ? err.message : 'Failed to load service configuration';
        setError(message);
        addToast('error', message);
        setConfig(null);
      } finally {
        setLoading(false);
      }
    }

    // Subscribe to real-time changes
    subscription = supabase
      .channel(`service_changes:${debouncedId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'service_configs',
          filter: `slug=eq.${debouncedId}`
        },
        (payload) => {
          if (payload.new) {
            setConfig(payload.new as ServiceConfig);
            addToast('info', 'Service configuration updated');
          }
        }
      )
      .subscribe();

    loadConfig();

    return () => {
      subscription?.unsubscribe();
    };
  }, [debouncedId]);

  return { config, loading, error };
}