import { supabase } from '../lib/supabase';
import type { Profile, UpdateProfile, Subscription, UpdateSubscription, Newsletter } from '../types/database';

// Profile Functions
export async function getProfile(userId: string): Promise<Profile | null> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST301') {
      return null; // Profile not found
    }
    throw error;
  }

  return data;
}

export async function upsertProfile(profile: Profile | UpdateProfile): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Subscription Functions
export async function getSubscription(userId: string): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select()
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateSubscription(id: string, updates: UpdateSubscription): Promise<Subscription> {
  const { data, error } = await supabase
    .from('subscriptions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function cancelSubscription(id: string): Promise<void> {
  const { error } = await supabase
    .from('subscriptions')
    .update({ 
      status: 'canceled',
      cancel_at_period_end: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) throw error;
}

// Cover Letter Functions
export async function getCoverLetters(userId: string): Promise<CoverLetter[]> {
  const { data, error } = await supabase
    .from('cover_letters')
    .select()
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createCoverLetter(letter: InsertCoverLetter): Promise<CoverLetter> {
  const { data, error } = await supabase
    .from('cover_letters')
    .insert(letter)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCoverLetter(id: string, updates: UpdateCoverLetter): Promise<CoverLetter> {
  const { data, error } = await supabase
    .from('cover_letters')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCoverLetter(id: string): Promise<void> {
  const { error } = await supabase
    .from('cover_letters')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// CV Functions
export async function getCVs(userId: string): Promise<CV[]> {
  const { data, error } = await supabase
    .from('cvs')
    .select()
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createCV(cv: InsertCV): Promise<CV> {
  const { data, error } = await supabase
    .from('cvs')
    .insert(cv)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCV(id: string, updates: UpdateCV): Promise<CV> {
  const { data, error } = await supabase
    .from('cvs')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCV(id: string): Promise<void> {
  const { error } = await supabase
    .from('cvs')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Email Functions
export async function getEmails(userId: string): Promise<Email[]> {
  const { data, error } = await supabase
    .from('emails')
    .select()
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createEmail(email: InsertEmail): Promise<Email> {
  const { data, error } = await supabase
    .from('emails')
    .insert(email)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateEmail(id: string, updates: UpdateEmail): Promise<Email> {
  const { data, error } = await supabase
    .from('emails')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteEmail(id: string): Promise<void> {
  const { error } = await supabase
    .from('emails')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Interview Functions
export async function getInterviews(userId: string): Promise<Interview[]> {
  const { data, error } = await supabase
    .from('interviews')
    .select()
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createInterview(interview: InsertInterview): Promise<Interview> {
  const { data, error } = await supabase
    .from('interviews')
    .insert(interview)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateInterview(id: string, updates: UpdateInterview): Promise<Interview> {
  const { data, error } = await supabase
    .from('interviews')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteInterview(id: string): Promise<void> {
  const { error } = await supabase
    .from('interviews')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Newsletter Functions
export async function getNewsletterStats(): Promise<{
  subscribedCount: number;
  totalEmails: number;
}> {
  const { count: subscribedCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .contains('notification_preferences', { marketing: true });

  const { count: totalEmails } = await supabase
    .from('newsletter_history')
    .select('*', { count: 'exact', head: true });

  return {
    subscribedCount: subscribedCount || 0,
    totalEmails: totalEmails || 0
  };
}

export async function getNewsletterHistory(): Promise<Newsletter[]> {
  const { data, error } = await supabase
    .from('newsletter_history')
    .select('*')
    .order('sent_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function sendNewsletter(newsletter: {
  subject: string;
  content: string;
  type: string;
}): Promise<void> {
  const { error } = await supabase
    .from('newsletter_history')
    .insert({
      subject: newsletter.subject,
      content: newsletter.content,
      type: newsletter.type,
      sent_at: new Date().toISOString()
    });

  if (error) throw error;
}