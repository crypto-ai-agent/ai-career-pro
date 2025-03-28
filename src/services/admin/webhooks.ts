import { supabase } from '../../lib/supabase';
import type { Webhook, WebhookTestResult } from '../../types/webhooks';

export async function getWebhooks(): Promise<Webhook[]> {
  const { data, error } = await supabase
    .from('webhooks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createWebhook(webhook: Omit<Webhook, 'id'>): Promise<Webhook> {
  const { data, error } = await supabase
    .from('webhooks')
    .insert({
      ...webhook,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateWebhook(id: string, updates: Partial<Webhook>): Promise<Webhook> {
  const { data, error } = await supabase
    .from('webhooks')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteWebhook(id: string): Promise<void> {
  const { error } = await supabase
    .from('webhooks')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function testWebhook(id: string): Promise<WebhookTestResult> {
  const { data: webhook, error: fetchError } = await supabase
    .from('webhooks')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError) throw fetchError;
  if (!webhook) throw new Error('Webhook not found');

  // Make test request to webhook URL
  const response = await fetch(webhook.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...webhook.headers
    },
    body: JSON.stringify({ test: true })
  });

  // Get response body
  let responseBody;
  try {
    responseBody = await response.json();
  } catch {
    responseBody = await response.text();
  }

  // Update webhook status
  await supabase
    .from('webhooks')
    .update({
      last_triggered: new Date().toISOString(),
      last_status: response.ok ? 'success' : 'error'
    })
    .eq('id', id);

  return {
    request: {
      url: webhook.url,
      method: 'POST',
      headers: webhook.headers,
      body: { test: true }
    },
    response: {
      status: response.status,
      statusText: response.statusText,
      body: responseBody
    }
  };
}