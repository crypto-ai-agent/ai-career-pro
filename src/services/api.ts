import { supabase } from '../lib/supabase';
import type { FormData as CoverLetterFormData } from '../types/coverLetter';
import type { CVFormData } from '../types/cv';
import type { EmailFormData } from '../types/email';
import { ENDPOINTS, REQUEST_CONFIG, ERROR_CODES, SERVICES } from '../config/api';
import { generateApiKey } from '../lib/security';
import { checkRateLimit, incrementRateLimit } from './rateLimit';

// API Key Types
export interface ApiKey {
  id: string;
  name: string;
  value: string;
  description: string;
  last_used?: string }


/**
 * Generic API request handler with retries and error handling
 */
async function makeRequest<T>(
  url: string,
  options: RequestInit,
  userId?: string,
  feature?: string,
  retries = REQUEST_CONFIG.retryAttempts
): Promise<T> {
  const controller = new AbortController(); // Add this line to define the controller

  try {
    // Check rate limit if userId and feature are provided
    if (userId && feature) {
      const canProceed = await checkRateLimit(userId, feature as any);
      if (!canProceed) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
    }

    console.log('Making API request to:', url);

    const response = await fetch(url, {
      ...options,
      headers: { ...REQUEST_CONFIG.headers, ...options.headers },
      signal: controller.signal,
      mode: 'cors',
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error (${response.status}): ${error}`);
    }

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      if (data.error) throw new Error(data.error);
      
      // Increment rate limit counter on successful request
      if (userId && feature) {
        await incrementRateLimit(userId, feature as any);
      }
      
      return data;
    } catch {
      return { output: text } as T;
    }
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, REQUEST_CONFIG.retryDelay));
      return makeRequest(url, options, userId, feature, retries - 1);
    }
    throw error;
  }
}



// API Key Management Functions
export async function getApiKeys(): Promise<ApiKey[]> {
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createApiKey(key: Omit<ApiKey, 'id'>): Promise<ApiKey> {
  const { data, error } = await supabase
    .from('api_keys')
    .insert([{
      ...key,
      value: await generateApiKey(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateApiKey(id: string, value: string): Promise<ApiKey> {
  const { data, error } = await supabase
    .from('api_keys')
    .update({ 
      value,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteApiKey(id: string): Promise<void> {
  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Service API Functions
export async function generateCoverLetter(formData: CoverLetterFormData): Promise<string> {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) throw new Error('User not authenticated');

    const data = await makeRequest<{ output: string }>(
      ENDPOINTS.COVER_LETTER,
      {
        method: 'POST',
        body: JSON.stringify({
          jobTitle: formData.jobTitle,
          company: formData.company,
          skills: formData.keySkills,
          experience: formData.experience,
          tone: formData.tone,
          length: formData.length,
          language: formData.language,
          recipient: formData.recipientDescription || 'Hiring Manager'
        })
      },
      userId,
      'cover-letter'
    );
    return data.output;
  } catch (error) {
    console.error('API call failed:', error);
    throw error instanceof Error ? error : new Error('Failed to generate cover letter');
  }
}

export async function optimizeCV(formData: CVFormData): Promise<string> {
  try {
    const requestData = {
      targetRole: formData.targetRole,
      industry: formData.industry,
      experienceLevel: formData.experienceLevel,
      keySkills: formData.keySkills,
      currentCV: formData.currentCV ? await formData.currentCV.text() : undefined
    };

    const data = await makeRequest<{ output: string }>(
      ENDPOINTS.CV,
      {
        method: 'POST',
        body: JSON.stringify(requestData)
      }
    );
    return data.output;
  } catch (error) {
    console.error('API call failed:', error);
    throw error instanceof Error ? error : new Error('Failed to optimize CV');
  }
}

export async function generateEmail(formData: EmailFormData): Promise<string> {
  try {
    console.log('Generating email with data:', formData);

    const webhookUrl = 'https://shayldon.app.n8n.cloud/webhook-test/1c328895-2736-4acd-811c-e199dcbdb312';

    const data = await makeRequest<{ output: string }>(
      webhookUrl,
      {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!data.output) {
      throw new Error('No output received from email generation service');
    }

    return data.output;
  } catch (error) {
    console.error('API call failed:', error);
    throw new Error(
      error instanceof Error
        ? `Failed to generate email: ${error.message}`
        : 'Failed to generate email'
    );
  }
}