import React, { useState, useEffect } from 'react';
import { Edit, Eye, EyeOff } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { FormField, Input, TextArea } from '../../../components/ui/Form';
import { useToast } from '../../../hooks/useToast';
import { getPage, updatePage } from '../../../services/cms';
import type { ContentPage } from '../../../services/cms';

export function ContentPages() {
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const privacyPage = await getPage('privacy');
      const termsPage = await getPage('terms');
      setPages([privacyPage, termsPage]);
    } catch (error) {
      console.error('Error loading pages:', error);
      addToast('error', 'Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (slug: string, content: any) => {
    try {
      await updatePage(slug, content);
      addToast('success', 'Page updated successfully');
      setEditing(null);
      loadPages();
    } catch (error) {
      console.error('Error updating page:', error);
      addToast('error', 'Failed to update page');
    }
  };

  return (
    <div className="space-y-6">
      {pages.map((page) => (
        <Card key={page.slug}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {page.title}
              </h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => page.published ? null : null}
                >
                  {page.published ? (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Published
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Draft
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setEditing(editing === page.slug ? null : page.slug)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>

            {editing === page.slug ? (
              <div className="space-y-4">
                {page.content.sections.map((section: any, index: number) => (
                  <div key={index}>
                    <FormField label={`Section ${index + 1} Title`}>
                      <Input
                        value={section.title}
                        onChange={(e) => {
                          const newContent = {
                            ...page.content,
                            sections: page.content.sections.map((s: any, i: number) =>
                              i === index ? { ...s, title: e.target.value } : s
                            )
                          };
                          setPages(prev => prev.map(p =>
                            p.slug === page.slug ? { ...p, content: newContent } : p
                          ));
                        }}
                      />
                    </FormField>

                    <FormField label={`Section ${index + 1} Content`}>
                      <TextArea
                        rows={6}
                        value={section.content}
                        onChange={(e) => {
                          const newContent = {
                            ...page.content,
                            sections: page.content.sections.map((s: any, i: number) =>
                              i === index ? { ...s, content: e.target.value } : s
                            )
                          };
                          setPages(prev => prev.map(p =>
                            p.slug === page.slug ? { ...p, content: newContent } : p
                          ));
                        }}
                      />
                    </FormField>
                  </div>
                ))}

                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setEditing(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleUpdate(page.slug, page.content)}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="prose max-w-none">
                {page.content.sections.map((section: any, index: number) => (
                  <div key={index} className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      {section.title}
                    </h4>
                    <div className="text-gray-600 whitespace-pre-wrap">
                      {section.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}