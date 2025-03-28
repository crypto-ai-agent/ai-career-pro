import React, { useState } from 'react';
import { Send, Calendar, Users, Edit, Trash2, Plus } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { FormField, Input, Select, TextArea } from '../../../components/ui/Form';
import { useToast } from '../../../hooks/useToast';
import { supabase } from '../../../lib/supabase';

interface EmailCampaign {
  id: string;
  name: string;
  template_id: string;
  segment_criteria: Record<string, any>;
  scheduled_at?: string;
  sent_at?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'failed';
}

interface CampaignManagerProps {
  campaigns: EmailCampaign[];
}

export function CampaignManager({ campaigns: initialCampaigns }: CampaignManagerProps) {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const newCampaign = {
        name: formData.get('name'),
        template_id: formData.get('templateId'),
        segment_criteria: JSON.parse(formData.get('segmentCriteria')?.toString() || '{}'),
        scheduled_at: formData.get('scheduledAt')?.toString(),
        status: 'draft'
      };

      const { data, error } = await supabase
        .from('email_campaigns')
        .insert(newCampaign)
        .select()
        .single();

      if (error) throw error;

      setCampaigns(prev => [...prev, data]);
      setShowForm(false);
      addToast('success', 'Campaign created successfully');
      form.reset();
    } catch (error) {
      console.error('Error creating campaign:', error);
      addToast('error', 'Failed to create campaign');
    }
  };

  const handleUpdate = async (id: string, updates: Partial<EmailCampaign>) => {
    try {
      const { error } = await supabase
        .from('email_campaigns')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setCampaigns(prev => prev.map(campaign => 
        campaign.id === id ? { ...campaign, ...updates } : campaign
      ));
      setEditing(null);
      addToast('success', 'Campaign updated successfully');
    } catch (error) {
      console.error('Error updating campaign:', error);
      addToast('error', 'Failed to update campaign');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      const { error } = await supabase
        .from('email_campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
      addToast('success', 'Campaign deleted successfully');
    } catch (error) {
      console.error('Error deleting campaign:', error);
      addToast('error', 'Failed to delete campaign');
    }
  };

  const getStatusColor = (status: EmailCampaign['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'sending':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Send className="h-5 w-5 text-indigo-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Campaign Manager</h3>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>

        {showForm && (
          <div className="mb-6 border-b pb-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <FormField label="Campaign Name">
                <Input name="name" required />
              </FormField>

              <FormField label="Email Template">
                <Select name="templateId" required>
                  <option value="">Select a template</option>
                  {/* Add template options */}
                </Select>
              </FormField>

              <FormField label="Segment Criteria">
                <TextArea
                  name="segmentCriteria"
                  rows={4}
                  placeholder="Enter JSON segment criteria"
                  required
                />
              </FormField>

              <FormField label="Schedule Send">
                <Input
                  type="datetime-local"
                  name="scheduledAt"
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
                  Create Campaign
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {campaign.name}
                  </h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getStatusColor(campaign.status)
                    }`}>
                      {campaign.status}
                    </span>
                    {campaign.scheduled_at && (
                      <span className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(campaign.scheduled_at).toLocaleString()}
                      </span>
                    )}
                    {campaign.sent_at && (
                      <span className="flex items-center text-sm text-gray-500">
                        <Send className="h-4 w-4 mr-1" />
                        Sent: {new Date(campaign.sent_at).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditing(campaign.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(campaign.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <h5 className="text-sm font-medium text-gray-700">Segment Criteria:</h5>
                  <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(campaign.segment_criteria, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ))}

          {campaigns.length === 0 && (
            <div className="text-center py-12">
              <Send className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first email campaign
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}