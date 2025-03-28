import React, { useState } from 'react';
import { GitBranch, Plus, Edit, Trash2 } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { FormField, Input, TextArea } from '../../../components/ui/Form';
import { useToast } from '../../../hooks/useToast';
import { supabase } from '../../../lib/supabase';

interface Integration {
  id: string;
  name: string;
  provider: string;
  config: Record<string, any>;
  status: 'active' | 'inactive' | 'error';
  last_sync?: string;
}

export function ThirdPartyIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const newIntegration = {
        name: formData.get('name'),
        provider: formData.get('provider'),
        config: JSON.parse(formData.get('config')?.toString() || '{}'),
        status: 'inactive'
      };

      const { data, error } = await supabase
        .from('third_party_integrations')
        .insert(newIntegration)
        .select()
        .single();

      if (error) throw error;

      setIntegrations(prev => [...prev, data]);
      setShowForm(false);
      addToast('success', 'Integration created successfully');
      form.reset();
    } catch (error) {
      console.error('Error creating integration:', error);
      addToast('error', 'Failed to create integration');
    }
  };

  const handleUpdate = async (id: string, updates: Partial<Integration>) => {
    try {
      const { error } = await supabase
        .from('third_party_integrations')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setIntegrations(prev => prev.map(integration => 
        integration.id === id ? { ...integration, ...updates } : integration
      ));
      setEditing(null);
      addToast('success', 'Integration updated successfully');
    } catch (error) {
      console.error('Error updating integration:', error);
      addToast('error', 'Failed to update integration');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this integration?')) return;

    try {
      const { error } = await supabase
        .from('third_party_integrations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setIntegrations(prev => prev.filter(integration => integration.id !== id));
      addToast('success', 'Integration deleted successfully');
    } catch (error) {
      console.error('Error deleting integration:', error);
      addToast('error', 'Failed to delete integration');
    }
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <GitBranch className="h-5 w-5 text-indigo-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Third-Party Integrations</h3>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>

        {showForm && (
          <div className="mb-6 border-b pb-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <FormField label="Integration Name">
                <Input name="name" required />
              </FormField>

              <FormField label="Provider">
                <Input name="provider" required />
              </FormField>

              <FormField label="Configuration">
                <TextArea
                  name="config"
                  rows={4}
                  placeholder="Enter JSON configuration"
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
                  Create Integration
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {integration.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Provider: {integration.provider}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    integration.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : integration.status === 'error'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {integration.status}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => handleUpdate(integration.id, {
                      status: integration.status === 'active' ? 'inactive' : 'active'
                    })}
                  >
                    {integration.status === 'active' ? 'Disable' : 'Enable'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditing(integration.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(integration.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <h5 className="text-sm font-medium text-gray-700">Configuration:</h5>
                  <pre className="mt-1 text-xs bg-gray-50 p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(integration.config, null, 2)}
                  </pre>
                </div>
                {integration.last_sync && (
                  <p className="text-sm text-gray-500">
                    Last synced: {new Date(integration.last_sync).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}

          {integrations.length === 0 && (
            <div className="text-center py-12">
              <GitBranch className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No integrations configured</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding your first third-party integration
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}