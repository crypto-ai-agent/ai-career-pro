import React, { useState, useEffect } from 'react';
import { Link as LinkIcon } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { FormField, Input } from '../../../components/ui/Form';
import { useToast } from '../../../hooks/useToast';
import { getSocialLinks, updateSocialLink } from '../../../services/cms';
import type { SocialLink } from '../../../services/cms';

export function SocialLinks() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      const data = await getSocialLinks();
      setLinks(data);
    } catch (error) {
      console.error('Error loading social links:', error);
      addToast('error', 'Failed to load social links');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, updates: {
    url?: string;
    active?: boolean;
    display_order?: number;
  }) => {
    try {
      await updateSocialLink(id, updates);
      addToast('success', 'Social link updated successfully');
      setEditing(null);
      loadLinks();
    } catch (error) {
      console.error('Error updating social link:', error);
      addToast('error', 'Failed to update social link');
    }
  };

  return (
    <div className="space-y-6">
      {links.map((link) => (
        <Card key={link.id}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <LinkIcon className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900 capitalize">
                  {link.platform}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleUpdate(link.id, { active: !link.active })}
                >
                  {link.active ? 'Active' : 'Inactive'}
                </Button>
                <Button
                  onClick={() => setEditing(editing === link.id ? null : link.id)}
                >
                  Edit
                </Button>
              </div>
            </div>

            {editing === link.id ? (
              <div className="space-y-4">
                <FormField label="URL">
                  <Input
                    type="url"
                    value={link.url || ''}
                    onChange={(e) => setLinks(prev => prev.map(l =>
                      l.id === link.id ? { ...l, url: e.target.value } : l
                    ))}
                    placeholder={`https://${link.platform}.com/...`}
                  />
                </FormField>

                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setEditing(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleUpdate(link.id, {
                      url: link.url,
                      display_order: link.display_order
                    })}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                {link.url ? (
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    {link.url}
                  </a>
                ) : (
                  <p className="text-gray-500 italic">No URL set</p>
                )}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}