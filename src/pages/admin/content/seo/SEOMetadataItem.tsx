import React from 'react';
import { Edit, Save } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { FormField, Input, TextArea } from '../../../../components/ui/Form';
import { useToast } from '../../../../hooks/useToast';
import { supabase } from '../../../../lib/supabase';

interface SEOMetadataItemProps {
  item: {
    id: string;
    path: string;
    title: string;
    description: string;
    keywords: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
    canonical_url?: string;
  };
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onUpdate: (updates: Partial<typeof item>) => void;
}

export function SEOMetadataItem({
  item,
  isEditing,
  onEdit,
  onCancel,
  onUpdate
}: SEOMetadataItemProps) {
  const { addToast } = useToast();

  const handleUpdate = async () => {
    try {
      const { error } = await supabase
        .from('seo_metadata')
        .update(item)
        .eq('id', item.id);

      if (error) throw error;

      onUpdate(item);
      addToast('success', 'SEO metadata updated successfully');
    } catch (error) {
      console.error('Error updating SEO metadata:', error);
      addToast('error', 'Failed to update SEO metadata');
    }
  };

  if (isEditing) {
    return (
      <div className="p-6 space-y-4">
        <FormField label="Page Title">
          <Input
            value={item.title}
            onChange={(e) => onUpdate({ ...item, title: e.target.value })}
          />
        </FormField>

        <FormField label="Meta Description">
          <TextArea
            value={item.description}
            onChange={(e) => onUpdate({ ...item, description: e.target.value })}
            rows={3}
          />
        </FormField>

        <FormField label="Keywords">
          <Input
            value={item.keywords}
            onChange={(e) => onUpdate({ ...item, keywords: e.target.value })}
          />
        </FormField>

        <div className="space-y-4 border-t pt-4 mt-4">
          <h4 className="font-medium text-gray-900">Open Graph Data</h4>
          
          <FormField label="OG Title">
            <Input
              value={item.og_title || ''}
              onChange={(e) => onUpdate({ ...item, og_title: e.target.value })}
            />
          </FormField>

          <FormField label="OG Description">
            <TextArea
              value={item.og_description || ''}
              onChange={(e) => onUpdate({ ...item, og_description: e.target.value })}
              rows={2}
            />
          </FormField>

          <FormField label="OG Image URL">
            <Input
              value={item.og_image || ''}
              onChange={(e) => onUpdate({ ...item, og_image: e.target.value })}
              type="url"
            />
          </FormField>
        </div>

        <FormField label="Canonical URL">
          <Input
            value={item.canonical_url || ''}
            onChange={(e) => onUpdate({ ...item, canonical_url: e.target.value })}
            type="url"
          />
        </FormField>

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button onClick={handleUpdate}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-lg font-medium text-gray-900">
            {item.path}
          </h4>
          <p className="text-sm text-gray-500">
            Title: {item.title}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={onEdit}
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p><strong>Description:</strong> {item.description}</p>
        <p><strong>Keywords:</strong> {item.keywords}</p>
        {item.canonical_url && (
          <p><strong>Canonical URL:</strong> {item.canonical_url}</p>
        )}
        {item.og_title && (
          <p><strong>OG Title:</strong> {item.og_title}</p>
        )}
        {item.og_description && (
          <p><strong>OG Description:</strong> {item.og_description}</p>
        )}
        {item.og_image && (
          <p><strong>OG Image:</strong> {item.og_image}</p>
        )}
      </div>
    </div>
  );
}