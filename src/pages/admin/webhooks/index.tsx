import React, { useState, useEffect } from 'react';
import { Webhook, Plus, Edit, Trash2, Play } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { FormField, Input, Select, TextArea } from '../../../components/ui/Form';
import { TestDialog } from './TestDialog';
import { useToast } from '../../../hooks/useToast';
import { getWebhooks, createWebhook, updateWebhook, deleteWebhook, testWebhook } from '../../../services/admin/webhooks';
import type { Webhook as WebhookType } from '../../../types/webhooks';

export function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<WebhookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [testingWebhook, setTestingWebhook] = useState<WebhookType | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    loadWebhooks();
  }, []);

  const loadWebhooks = async () => {
    try {
      const data = await getWebhooks();
      setWebhooks(data);
    } catch (error) {
      console.error('Error loading webhooks:', error);
      addToast('error', 'Failed to load webhooks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (webhook: Omit<WebhookType, 'id'>) => {
    try {
      await createWebhook(webhook);
      addToast('success', 'Webhook created successfully');
      setShowForm(false);
      loadWebhooks();
    } catch (error) {
      console.error('Error creating webhook:', error);
      addToast('error', 'Failed to create webhook');
    }
  };

  const handleUpdate = async (id: string, updates: Partial<WebhookType>) => {
    try {
      await updateWebhook(id, updates);
      addToast('success', 'Webhook updated successfully');
      setEditing(null);
      loadWebhooks();
    } catch (error) {
      console.error('Error updating webhook:', error);
      addToast('error', 'Failed to update webhook');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this webhook?')) return;

    try {
      await deleteWebhook(id);
      addToast('success', 'Webhook deleted successfully');
      loadWebhooks();
    } catch (error) {
      console.error('Error deleting webhook:', error);
      addToast('error', 'Failed to delete webhook');
    }
  };

  const handleTest = async (id: string) => {
    const webhook = webhooks.find(w => w.id === id);
    if (!webhook) return;
    setTestingWebhook(webhook);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Webhook className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Webhook Management</h1>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Webhook
          </Button>
        </div>

        {/* New Webhook Form */}
        {showForm && (
          <Card className="mb-8 bg-white">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">New Webhook</h3>
              <form className="space-y-4">
                <FormField label="Name">
                  <Input required />
                </FormField>

                <FormField label="URL">
                  <Input type="url" required />
                </FormField>

                <FormField label="Event">
                  <Select required>
                    <option value="user.created">User Created</option>
                    <option value="user.updated">User Updated</option>
                    <option value="subscription.created">Subscription Created</option>
                    <option value="subscription.updated">Subscription Updated</option>
                  </Select>
                </FormField>

                <FormField label="Description">
                  <TextArea rows={3} />
                </FormField>

                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Webhook
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        )}

        {/* Webhooks List */}
        <div className="space-y-6">
          {webhooks.map((webhook) => (
            <Card key={webhook.id} className="bg-white hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">{webhook.name}</h3>
                    {webhook.last_status && (
                      <span className={`ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        webhook.last_status === 'success' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {webhook.last_status === 'success' ? 'Success' : 'Failed'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleTest(webhook.id)} 
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Test
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditing(webhook.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(webhook.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">URL</p>
                    <p className="font-mono text-sm">{webhook.url}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Event</p>
                    <p className="font-medium">{webhook.event}</p>
                  </div>

                  {webhook.description && (
                    <div>
                      <p className="text-sm text-gray-500">Description</p>
                      <p className="text-sm text-gray-700">{webhook.description}</p>
                    </div>
                  )}

                  {webhook.last_triggered && (
                    <div>
                      <p className="text-sm text-gray-500">Last Triggered</p>
                      <p className={`text-sm ${
                        webhook.last_status === 'success' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {new Date(webhook.last_triggered).toLocaleString()}
                        {webhook.last_status && (
                          <span className="ml-2">
                            ({webhook.last_status === 'success' ? 'Success' : 'Failed'})
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      {testingWebhook && (
        <TestDialog
          isOpen={true}
          onClose={() => setTestingWebhook(null)}
          webhook={testingWebhook}
          onTest={async () => {
            try {
              const result = await testWebhook(testingWebhook.id);
              // Reload webhooks to get updated status
              await loadWebhooks();
              return result;
            } catch (error) {
              // Let the error propagate to the dialog
              throw error;
            }
          }}
        />
      )}
    </div>
  );
}