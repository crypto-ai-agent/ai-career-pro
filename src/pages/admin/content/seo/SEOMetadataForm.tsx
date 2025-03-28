import React from 'react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { FormField, Input, TextArea } from '../../../../components/ui/Form';
import { useToast } from '../../../../hooks/useToast';
import { useSEOMetadataContext } from './SEOMetadataContext';
import { supabase } from '../../../../lib/supabase';

export function SEOMetadataForm() {
  const { setShowForm } = useSEOMetadataContext();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const { error } = await supabase
        .from('seo_metadata')
        .insert({
          path: formData.get('path'),
          title: formData.get('title'),
          description: formData.get('description'),
          keywords: formData.get('keywords'),
          og_title: formData.get('og_title'),
          og_description: formData.get('og_description'),
          og_image: formData.get('og_image'),
          canonical_url: formData.get('canonical_url')
        });

      if (error) throw error;

      addToast('success', 'SEO metadata created successfully');
      setShowForm(false);
    } catch (error) {
      console.error('Error creating SEO metadata:', error);
      addToast('error', 'Failed to create SEO metadata');
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <FormField label="Page Path">
          <Input
            name="path"
            placeholder="/example-page"
            required
          />
        </FormField>

        <FormField label="Page Title">
          <Input
            name="title"
            placeholder="Page Title - AI Career Pro"
            required
          />
        </FormField>

        <FormField label="Meta Description">
          <TextArea
            name="description"
            rows={3}
            placeholder="Brief description of the page content"
            required
          />
        </FormField>

        <FormField label="Keywords">
          <Input
            name="keywords"
            placeholder="Comma-separated keywords"
            required
          />
        </FormField>

        <div className="space-y-4 border-t pt-4 mt-4">
          <h4 className="font-medium text-gray-900">Open Graph Data</h4>
          
          <FormField label="OG Title">
            <Input
              name="og_title"
              placeholder="Open Graph title (optional)"
            />
          </FormField>

          <FormField label="OG Description">
            <TextArea
              name="og_description"
              rows={2}
              placeholder="Open Graph description (optional)"
            />
          </FormField>

          <FormField label="OG Image URL">
            <Input
              name="og_image"
              type="url"
              placeholder="https://example.com/image.jpg"
            />
          </FormField>
        </div>

        <FormField label="Canonical URL">
          <Input
            name="canonical_url"
            type="url"
            placeholder="https://example.com/canonical-page"
          />
        </FormField>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </Button>
          <Button type="submit">
            Create Page
          </Button>
        </div>
      </form>
    </Card>
  );
}