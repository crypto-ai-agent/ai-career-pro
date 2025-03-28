import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
}

export function useSEO() {
  const location = useLocation();
  const [metadata, setMetadata] = useState<SEOMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMetadata();
  }, [location.pathname]);

  const loadMetadata = async () => {
    try {
      const { data, error } = await supabase
        .from('seo_metadata')
        .select('*')
        .eq('path', location.pathname)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No metadata found for this path
          console.warn(`No SEO metadata found for path: ${location.pathname}`);
          return;
        }
        throw error;
      }

      setMetadata(data);
      setError(null);
    } catch (err) {
      console.error('Error loading SEO metadata:', err);
      setError('Failed to load SEO metadata');
    } finally {
      setLoading(false);
    }
  };

  return { metadata, loading, error };
}