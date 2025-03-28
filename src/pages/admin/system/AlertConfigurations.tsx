import React, { useState } from 'react';
import { Bell, Plus, Edit, Trash2 } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { FormField, Input, Select, TextArea } from '../../../components/ui/Form';
import { useToast } from '../../../hooks/useToast';
import { supabase } from '../../../lib/supabase';

interface Alert {
  id: string;
  name: string;
  description?: string;
  conditions: {
    metric: string;
    operator: '>' | '<' | '==' | '>=' | '<=';
    value: number;
  }[];
  notification_channels: {
    type: 'email' | 'slack' | 'webhook';
    target: string;
  }[];
  enabled: boolean;
}

interface AlertConfigurationsProps {
  alerts: Alert[];
}

export function AlertConfigurations({ alerts: initialAlerts }: AlertConfigurationsProps) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const newAlert = {
        name: formData.get('name'),
        description: formData.get('description'),
        conditions: [{
          metric: formData.get('metric'),
          operator: formData.get('operator'),
          value: Number(formData.get('value'))
        }],
        notification_channels: [{
          type: formData.get('notificationType'),
          target: formData.get('notificationTarget')
        }],
        enabled: true
      };

      const { data, error } = await supabase
        .from('alert_configurations')
        .insert(newAlert)
        .select()
        .single();

      if (error) throw error;

      setAlerts(prev => [...prev, data]);
      setShowForm(false);
      addToast('success', 'Alert configuration created successfully');
      form.reset();
    } catch (error) {
      console.error('Error creating alert:', error);
      addToast('error', 'Failed to create alert configuration');
    }
  };

  const handleUpdate = async (id: string, updates: Partial<Alert>) => {
    try {
      const { error } = await supabase
        .from('alert_configurations')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setAlerts(prev => prev.map(alert => 
        alert.id === id ? { ...alert, ...updates } : alert
      ));
      setEditing(null);
      addToast('success', 'Alert configuration updated successfully');
    } catch (error) {
      console.error('Error updating alert:', error);
      addToast('error', 'Failed to update alert configuration');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this alert configuration?')) return;

    try {
      const { error } = await supabase
        .from('alert_configurations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAlerts(prev => prev.filter(alert => alert.id !== id));
      addToast('success', 'Alert configuration deleted successfully');
    } catch (error) {
      console.error('Error deleting alert:', error);
      addToast('error', 'Failed to delete alert configuration');
    }
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-indigo-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Alert Configurations</h3>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Alert
          </Button>
        </div>

        {showForm && (
          <div className="mb-6 border-b pb-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <FormField label="Alert Name">
                <Input name="name" required />
              </FormField>

              <FormField label="Description">
                <TextArea name="description" rows={2} />
              </FormField>

              <div className="grid grid-cols-3 gap-4">
                <FormField label="Metric">
                  <Select name="metric" required>
                    <option value="error_rate">Error Rate</option>
                    <option value="response_time">Response Time</option>
                    <option value="cpu_usage">CPU Usage</option>
                    <option value="memory_usage">Memory Usage</option>
                  </Select>
                </FormField>

                <FormField label="Operator">
                  <Select name="operator" required>
                    <option value=">">Greater than</option>
                    <option value="<">Less than</option>
                    <option value="==">Equals</option>
                    <option value=">=">Greater than or equal</option>
                    <option value="<=">Less than or equal</option>
                  </Select>
                </FormField>

                <FormField label="Value">
                  <Input type="number" name="value" required />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Notification Type">
                  <Select name="notificationType" required>
                    <option value="email">Email</option>
                    <option value="slack">Slack</option>
                    <option value="webhook">Webhook</option>
                  </Select>
                </FormField>

                <FormField label="Notification Target">
                  <Input name="notificationTarget" required />
                </FormField>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Create Alert
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <h4 className="text-lg font-medium text-gray-900">
                    {alert.name}
                  </h4>
                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    alert.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {alert.enabled ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleUpdate(alert.id, { enabled: !alert.enabled })}
                  >
                    {alert.enabled ? 'Disable' : 'Enable'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditing(alert.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(alert.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {alert.description && (
                <p className="text-sm text-gray-600 mb-2">
                  {alert.description}
                </p>
              )}

              <div className="text-sm text-gray-600">
                <p>
                  <strong>Conditions:</strong>{' '}
                  {alert.conditions.map((condition, i) => (
                    <span key={i}>
                      {condition.metric} {condition.operator} {condition.value}
                      {i < alert.conditions.length - 1 ? ' AND ' : ''}
                    </span>
                  ))}
                </p>
                <p>
                  <strong>Notifications:</strong>{' '}
                  {alert.notification_channels.map((channel, i) => (
                    <span key={i}>
                      {channel.type}: {channel.target}
                      {i < alert.notification_channels.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          ))}

          {alerts.length === 0 && (
            <div className="text-center py-12">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No alerts configured</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding your first alert configuration
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}