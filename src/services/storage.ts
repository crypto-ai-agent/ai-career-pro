import { supabase } from '../lib/supabase';

export async function uploadProfilePicture(userId: string, file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `profiles/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function deleteProfilePicture(userId: string): Promise<void> {
  const { data: files, error: listError } = await supabase.storage
    .from('avatars')
    .list(`profiles/${userId}`);

  if (listError) throw listError;

  if (files?.length) {
    const { error: deleteError } = await supabase.storage
      .from('avatars')
      .remove(files.map(file => `profiles/${userId}/${file.name}`));

    if (deleteError) throw deleteError;
  }
}