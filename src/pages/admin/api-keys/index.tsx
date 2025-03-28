import React, { useState, useEffect } from 'react';
import { Key, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { FormField, Input, TextArea } from '../../../components/ui/Form';
import { useToast } from '../../../hooks/useToast';
import { getApiKeys, createApiKey, updateApiKey, deleteApiKey } from '../../../services/api';
import type { ApiKey } from '../../../types/admin';

function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const { addToast } = useToast();

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      const data = await getApiKeys();
      setKeys(data);
    } catch (error) {
      console.error('Error loading API keys:', error);
      addToast('error', 'Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const newKey = {
        name: formData.get('name') as string,
        value: formData.get('value') as string,
        description: formData.get('description') as string
      };

      const data = await createApiKey(newKey);
      setKeys(prev => [...prev, data]);
      setShowForm(false);
      addToast('success', 'API key created successfully');
      form.reset();
    } catch (error) {
      console.error('Error creating API key:', error);
      addToast('error', 'Failed to create API key');
    }
  };

  const handleUpdate = async (id: string, value: string) => {
    try {
      const data = await updateApiKey(id, value);
      setKeys(prev => prev.map(key => 
        key.id === id ? data : key
      ));
      setEditing(null);
      addToast('success', 'API key updated successfully');
    } catch (error) {
      console.error('Error updating API key:', error);
      addToast('error', 'Failed to update API key');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) return;

    try {
      await deleteApiKey(id);
      setKeys(prev => prev.filter(key => key.id !== id));
      addToast('success', 'API key deleted successfully');
    } catch (error) {
      console.error('Error deleting API key:', error);
      addToast('error', 'Failed to delete API key');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Key className="h-8 w-8 text-indigo-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add API Key
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <form onSubmit={handleCreate} className="p-6 space-y-4">
            <FormField label="Name">
              <Input
                name="name"
                placeholder="e.g., Production API Key"
                required
              />
            </FormField>

            <FormField label="Value">
              <Input
                name="value"
                placeholder="Enter API key value"
                required
              />
            </FormField>

            <FormField label="Description">
              <TextArea
                name="description"
                placeholder="Describe the purpose of this API key"
                rows={3}
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
                Create API Key
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {keys.map((key) => (
          <Card key={key.id}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {key.name}
                  </h3>
                  {key.description && (
                    <p className="text-sm text-gray-500">{key.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowSecrets(prev => ({
                      ...prev,
                      [key.id]: !prev[key.id]
                    }))}
                  >
                    {showSecrets[key.id] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditing(key.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(key.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {editing === key.id ? (
                <div className="space-y-4">
                  <FormField label="API Key Value">
                    <Input
                      type={showSecrets[key.id] ? 'text' : 'password'}
                      value={key.value}
                      onChange={(e) => setKeys(prev => prev.map(k =>
                        k.id === key.id ? { ...k, value: e.target.value } : k
                      ))}
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
                      onClick={() => handleUpdate(key.id, key.value)}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="font-mono text-sm">
                    {showSecrets[key.id] ? key.value : '••••••••••••••••'}
                  </p>
                  {key.last_used && (
                    <p className="text-sm text-gray-500 mt-2">
                      Last used: {new Date(key.last_used).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          </Card>
        ))}

        {keys.length === 0 && !loading && (
          <Card>
            <div className="p-6 text-center">
              <Key className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No API keys</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first API key
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export { ApiKeysPage }