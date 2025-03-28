import { supabase } from '../lib/supabase';

// Content Pages
export async function getPage(slug: string) {
  const { data, error } = await supabase
    .from('content_pages')
    .select()
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
}

export async function updatePage(slug: string, content: any) {
  const { data, error } = await supabase
    .from('content_pages')
    .update({
      content,
      updated_at: new Date().toISOString()
    })
    .eq('slug', slug)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Social Links
export async function getSocialLinks() {
  const { data, error } = await supabase
    .from('social_links')
    .select()
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data;
}

export async function updateSocialLink(id: string, updates: {
  url?: string;
  active?: boolean;
  display_order?: number;
}) {
  const { data, error } = await supabase
    .from('social_links')
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

// Contact Info
export async function getContactInfo() {
  const { data, error } = await supabase
    .from('contact_info')
    .select()
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data;
}

export async function updateContactInfo(id: string, value: string) {
  const { data, error } = await supabase
    .from('contact_info')
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

// Team Members
export async function getTeamMembers() {
  const { data, error } = await supabase
    .from('team_members')
    .select()
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createTeamMember(member: {
  name: string;
  role: string;
  bio?: string;
  photo_url?: string;
  display_order?: number;
}) {
  const { data, error } = await supabase
    .from('team_members')
    .insert({
      ...member,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTeamMember(id: string, updates: {
  name?: string;
  role?: string;
  bio?: string;
  photo_url?: string;
  display_order?: number;
  active?: boolean;
}) {
  const { data, error } = await supabase
    .from('team_members')
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

export async function deleteTeamMember(id: string) {
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Site Settings
export async function getSiteSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select();

  if (error) throw error;
  return data;
}

export async function updateSiteSetting(key: string, value: any) {
  const { data, error } = await supabase
    .from('site_settings')
    .update({
      value,
      updated_at: new Date().toISOString()
    })
    .eq('key', key)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Types
export interface ContentPage {
  id: string;
  slug: string;
  title: string;
  content: any;
  meta_description?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string | null;
  active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ContactInfo {
  id: string;
  type: string;
  value: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photo_url?: string;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: any;
  description?: string;
  created_at: string;
  updated_at: string;
}