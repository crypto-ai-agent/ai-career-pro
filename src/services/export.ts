import { supabase } from '../lib/supabase';

export async function exportUserData(userId: string): Promise<Blob> {
  // Fetch all user data
  const [
    { data: profile },
    { data: coverLetters },
    { data: cvs },
    { data: emails },
    { data: interviews }
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('cover_letters').select('*').eq('user_id', userId),
    supabase.from('cvs').select('*').eq('user_id', userId),
    supabase.from('emails').select('*').eq('user_id', userId),
    supabase.from('interviews').select('*').eq('user_id', userId)
  ]);

  const userData = {
    profile,
    content: {
      coverLetters,
      cvs,
      emails,
      interviews
    },
    exportDate: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(userData, null, 2)], {
    type: 'application/json'
  });

  return blob;
}