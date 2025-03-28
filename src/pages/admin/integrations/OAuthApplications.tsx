import React, { useState } from 'react';
import { Key, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { FormField, Input, TextArea } from '../../../components/ui/Form';
import { useToast } from '../../../hooks/useToast';
import { supabase } from '../../../lib/supabase';

interface OAuthApp {
  id: string;
  name: string;
  client_id: string;
  client_secret: string;
  redirect_uris: string[];
  scopes: string[];
  enabled: boolean;
}

export function OAuthApplications() {
  const [apps, setApps] = useState<OAuthApp[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const { addToast } = useToast();

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const newApp = {
        name: formData.get('name'),
        redirect_uris: formData.get('redirectUris')?.toString().split('\n').filter(Boolean),
        scopes: formData.get('scopes')?.toString().split('\n').filter(Boolean),
        enabled: true
      };

      const { data, error } = await supabase
        .from('oauth_applications')
        .insert(newApp)
        .select()
        .single();

      if (error) throw error;

      setApps(prev => [...prev, data]);
      setShowForm(false);
      addToast('success', 'OAuth application created successfully');
      form.reset();
    } catch (error) {
      console.error('Error creating OAuth app:', error);
      addToast('error', 'Failed to create OAuth application');
    }
  };

  const handleUpdate = async (id: string, updates: Partial<OAuthApp>) => {
    try {
      const { error } = await supabase
        .from('oauth_applications')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setApps(prev => prev.map(app => 
        app.id === id ? { ...app, ...updates } : app
      ));
      setEditing(null);
      addToast('success', 'OAuth application updated successfully');
    } catch (error) {
      console.error('Error updating OAuth app:', error);
      addToast('error', 'Failed to update OAuth application');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this OAuth application?')) return;

    try {
      const { error } = await supabase
        .from('oauth_applications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setApps(prev => prev.filter(app => app.id !== id));
      addToast('success', 'OAuth application deleted successfully');
    } catch (error) {
      console.error('Error deleting OAuth app:', error);
      addToast('error', 'Failed to delete OAuth application');
    }
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Key className="h-5 w-5 text-indigo-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">OAuth Applications</h3>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Application
          </Button>
        </div>

        {showForm && (
          <div className="mb-6 border-b pb-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <FormField label="Application Name">
                <Input name="name" required />
              </FormField>

              <FormField label="Redirect URIs">
                <TextArea
                  name="redirectUris"
                  rows={3}
                  placeholder="One URI per line"
                  required
                />
              </FormField>

              <FormField label="Scopes">
                <TextArea
                  name="scopes"
                  rows={3}
                  placeholder="One scope per line"
                  required
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
                  Create Application
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {apps.map((app) => (
            <div
              key={app.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {app.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Client ID: {app.client_id}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowSecrets(prev => ({
                      ...prev,
                      [app.id]: !prev[app.id]
                    }))}
                  >
                    {showSecrets[app.id] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleUpdate(app.id, { enabled: !app.enabled })}
                  >
                    {app.enabled ? 'Disable' : 'Enable'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditing(app.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(app.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {showSecrets[app.id] && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">
                    Client Secret: {app.client_secret}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <div>
                  <h5 className="text-sm font-medium text-gray-700">Redirect URIs:</h5>
                  <ul className="mt-1 space-y-1">
                    {app.redirect_uris.map((uri, i) => (
                      <li key={i} className="text-sm text-gray-600">
                        {uri}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700">Scopes:</h5>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {app.scopes.map((scope, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {apps.length === 0 && (
            <div className="text-center py-12">
              <Key className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No OAuth applications</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first OAuth application
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}