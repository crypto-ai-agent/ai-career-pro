import React, { useState } from 'react';
import { Mail, Plus, Edit, Trash2 } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { FormField, Input, TextArea, Select } from '../../../components/ui/Form';
import { useToast } from '../../../hooks/useToast';
import { supabase } from '../../../lib/supabase';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  category: string;
  active: boolean;
}

interface EmailTemplatesProps {
  templates: EmailTemplate[];
}

export function EmailTemplates({ templates: initialTemplates }: EmailTemplatesProps) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const newTemplate = {
        name: formData.get('name'),
        subject: formData.get('subject'),
        content: formData.get('content'),
        variables: formData.get('variables')?.toString().split(',').map(v => v.trim()),
        category: formData.get('category'),
        active: true
      };

      const { data, error } = await supabase
        .from('email_templates')
        .insert(newTemplate)
        .select()
        .single();

      if (error) throw error;

      setTemplates(prev => [...prev, data]);
      setShowForm(false);
      addToast('success', 'Email template created successfully');
      form.reset();
    } catch (error) {
      console.error('Error creating template:', error);
      addToast('error', 'Failed to create email template');
    }
  };

  const handleUpdate = async (id: string, updates: Partial<EmailTemplate>) => {
    try {
      const { error } = await supabase
        .from('email_templates')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setTemplates(prev => prev.map(template => 
        template.id === id ? { ...template, ...updates } : template
      ));
      setEditing(null);
      addToast('success', 'Email template updated successfully');
    } catch (error) {
      console.error('Error updating template:', error);
      addToast('error', 'Failed to update email template');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const { error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTemplates(prev => prev.filter(template => template.id !== id));
      addToast('success', 'Email template deleted successfully');
    } catch (error) {
      console.error('Error deleting template:', error);
      addToast('error', 'Failed to delete email template');
    }
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-indigo-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Email Templates</h3>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Template
          </Button>
        </div>

        {showForm && (
          <div className="mb-6 border-b pb-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <FormField label="Template Name">
                <Input name="name" required />
              </FormField>

              <FormField label="Subject">
                <Input name="subject" required />
              </FormField>

              <FormField label="Content">
                <TextArea
                  name="content"
                  rows={6}
                  required
                />
              </FormField>

              <FormField label="Variables">
                <Input
                  name="variables"
                  placeholder="name,email,company (comma-separated)"
                />
              </FormField>

              <FormField label="Category">
                <Select name="category" required>
                  <option value="transactional">Transactional</option>
                  <option value="marketing">Marketing</option>
                  <option value="notification">Notification</option>
                </Select>
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
                  Create Template
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {template.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Category: {template.category}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleUpdate(template.id, { active: !template.active })}
                  >
                    {template.active ? 'Active' : 'Inactive'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditing(template.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(template.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <h5 className="text-sm font-medium text-gray-700">Subject:</h5>
                  <p className="text-sm text-gray-600">{template.subject}</p>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-700">Content:</h5>
                  <pre className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-2 rounded">
                    {template.content}
                  </pre>
                </div>

                {template.variables.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700">Variables:</h5>
                    <div className="flex flex-wrap gap-2">
                      {template.variables.map((variable) => (
                        <span
                          key={variable}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {variable}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {templates.length === 0 && (
            <div className="text-center py-12">
              <Mail className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No email templates</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first email template
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}