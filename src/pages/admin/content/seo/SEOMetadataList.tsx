import React, { useState, useEffect } from 'react';
import { Card } from '../../../../components/ui/Card';
import { SEOMetadataForm } from './SEOMetadataForm';
import { SEOMetadataItem } from './SEOMetadataItem';
import { useSEOMetadataContext } from './SEOMetadataContext';
import { useToast } from '../../../../hooks/useToast';
import { supabase } from '../../../../lib/supabase';

interface SEOMetadata {
  id: string;
  path: string;
  title: string;
  description: string;
  keywords: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
}

export function SEOMetadataList() {
  const [metadata, setMetadata] = useState<SEOMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const { searchQuery, showForm } = useSEOMetadataContext();
  const { addToast } = useToast();

  useEffect(() => {
    loadMetadata();
  }, []);

  const loadMetadata = async () => {
    try {
      const { data, error } = await supabase
        .from('seo_metadata')
        .select('*')
        .order('path');

      if (error) throw error;
      setMetadata(data || []);
    } catch (error) {
      console.error('Error loading SEO metadata:', error);
      addToast('error', 'Failed to load SEO metadata');
    } finally {
      setLoading(false);
    }
  };

  const filteredMetadata = metadata.filter(item =>
    item.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.path.startsWith('/services/') && searchQuery.toLowerCase().includes('service')) ||
    (item.path.startsWith('/tools/') && searchQuery.toLowerCase().includes('tool'))
  );

  const groupedMetadata = filteredMetadata.reduce((acc, item) => {
    let group = 'Other';
    if (item.path.startsWith('/services/')) group = 'Service Pages';
    else if (item.path.startsWith('/tools/')) group = 'Tool Pages';
    else if (item.path === '/' || !item.path.includes('/', 1)) group = 'Main Pages';
    
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, SEOMetadata[]>);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {showForm && <SEOMetadataForm onSuccess={loadMetadata} />}

      {Object.entries(groupedMetadata).map(([group, items]) => (
        <div key={group} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">{group}</h3>
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <SEOMetadataItem
                  item={item}
                  isEditing={editing === item.id}
                  onEdit={() => setEditing(item.id)}
                  onCancel={() => setEditing(null)}
                  onUpdate={async (updates) => {
                    try {
                      const { error } = await supabase
                        .from('seo_metadata')
                        .update(updates)
                        .eq('id', item.id);

                      if (error) throw error;

                      setMetadata(prev => prev.map(m =>
                        m.id === item.id ? { ...m, ...updates } : m
                      ));
                      setEditing(null);
                      addToast('success', 'SEO metadata updated successfully');
                    } catch (error) {
                      console.error('Error updating SEO metadata:', error);
                      addToast('error', 'Failed to update SEO metadata');
                    }
                  }}
                />
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}