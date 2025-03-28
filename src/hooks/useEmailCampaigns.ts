import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  category: string;
  active: boolean;
}

interface EmailCampaign {
  id: string;
  name: string;
  template_id: string;
  segment_criteria: Record<string, any>;
  scheduled_at?: string;
  sent_at?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'failed';
}

export function useEmailCampaigns() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEmailData();
  }, []);

  const loadEmailData = async () => {
    try {
      // Load templates
      const { data: templateData, error: templateError } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (templateError) throw templateError;
      setTemplates(templateData || []);

      // Load campaigns
      const { data: campaignData, error: campaignError } = await supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (campaignError) throw campaignError;
      setCampaigns(campaignData || []);

      setError(null);
    } catch (err) {
      console.error('Error loading email data:', err);
      setError('Failed to load email data');
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async (template: Omit<EmailTemplate, 'id'>) => {
    try {
      const { data, error: err } = await supabase
        .from('email_templates')
        .insert(template)
        .select()
        .single();

      if (err) throw err;

      setTemplates(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error creating template:', err);
      throw err;
    }
  };

  const updateTemplate = async (id: string, updates: Partial<EmailTemplate>) => {
    try {
      const { data, error: err } = await supabase
        .from('email_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (err) throw err;

      setTemplates(prev => prev.map(t => t.id === id ? data : t));
      return data;
    } catch (err) {
      console.error('Error updating template:', err);
      throw err;
    }
  };

  const createCampaign = async (campaign: Omit<EmailCampaign, 'id'>) => {
    try {
      const { data, error: err } = await supabase
        .from('email_campaigns')
        .insert(campaign)
        .select()
        .single();

      if (err) throw err;

      setCampaigns(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error creating campaign:', err);
      throw err;
    }
  };

  const updateCampaign = async (id: string, updates: Partial<EmailCampaign>) => {
    try {
      const { data, error: err } = await supabase
        .from('email_campaigns')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (err) throw err;

      setCampaigns(prev => prev.map(c => c.id === id ? data : c));
      return data;
    } catch (err) {
      console.error('Error updating campaign:', err);
      throw err;
    }
  };

  return {
    templates,
    campaigns,
    loading,
    error,
    refresh: loadEmailData,
    createTemplate,
    updateTemplate,
    createCampaign,
    updateCampaign
  };
}