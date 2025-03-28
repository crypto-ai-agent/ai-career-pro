import { supabase } from '../lib/supabase';
import { z } from 'zod';

// Validation schemas
export const inputFieldSchema = z.object({
  name: z.string().min(1, 'Field name is required'),
  type: z.enum(['text', 'textarea', 'select', 'number', 'file']),
  required: z.boolean(),
  description: z.string(),
  options: z.array(z.string()).optional()
});

export const pricingTierSchema = z.object({
  price: z.number().min(0, 'Price must be non-negative'),
  limits: z.record(z.string(), z.number())
});

export const serviceConfigSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  description: z.string().min(1, 'Description is required'),
  webhook_url: z.string().url('Invalid webhook URL'),
  input_fields: z.array(inputFieldSchema),
  pricing: z.object({
    free: pricingTierSchema,
    pro: pricingTierSchema,
    enterprise: pricingTierSchema
  }),
  active: z.boolean()
});

export type ServiceConfig = z.infer<typeof serviceConfigSchema>;

// Service functions
export async function getServices() {
  const { data, error } = await supabase
    .from('service_configs')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

export async function getService(id: string) {
  const { data, error } = await supabase
    .from('service_configs')
    .select('*')
    .eq('slug', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createService(service: Omit<ServiceConfig, 'id'>) {
  // Validate service config
  const validatedService = serviceConfigSchema.parse(service);

  const { data, error } = await supabase
    .from('service_configs')
    .insert(validatedService)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateService(id: string, updates: Partial<ServiceConfig>) {
  // Validate updates
  const validatedUpdates = serviceConfigSchema.partial().parse(updates);

  const { data, error } = await supabase
    .from('service_configs')
    .update({
      ...validatedUpdates,
      updated_at: new Date().toISOString()
    })
    .eq('slug', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteService(id: string) {
  const { error } = await supabase
    .from('service_configs')
    .delete()
    .eq('slug', id);

  if (error) throw error;
}

export async function testService(id: string, testData?: Record<string, any>) {
  const service = await getService(id);
  if (!service) throw new Error('Service not found');

  try {
    const response = await fetch(service.webhook_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData || {
        test: true,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Update last test result
    await supabase
      .from('service_configs')
      .update({
        last_test_at: new Date().toISOString(),
        last_test_status: 'success'
      })
      .eq('slug', id);

    return result;
  } catch (error) {
    // Update last test result
    await supabase
      .from('service_configs')
      .update({
        last_test_at: new Date().toISOString(),
        last_test_status: 'error'
      })
      .eq('slug', id);

    throw error;
  }
}