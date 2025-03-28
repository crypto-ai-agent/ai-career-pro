import { supabase } from '../lib/supabase';
import { sendEmail } from './email';

export async function enableTwoFactor(userId: string): Promise<{
  secret: string;
  qrCode: string;
}> {
  const { data, error } = await supabase.rpc('enable_two_factor', {
    p_user_id: userId
  });

  if (error) throw error;
  return data;
}

export async function verifyTwoFactor(userId: string, token: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('verify_two_factor', {
    p_user_id: userId,
    p_token: token
  });

  if (error) throw error;
  return data;
}

export async function disableTwoFactor(userId: string, token: string): Promise<void> {
  const { error } = await supabase.rpc('disable_two_factor', {
    p_user_id: userId,
    p_token: token
  });

  if (error) throw error;

  // Send confirmation email
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.email) {
    await sendEmail({
      to: user.email,
      subject: 'Two-Factor Authentication Disabled',
      html: `
        <h1>Two-Factor Authentication Disabled</h1>
        <p>Two-factor authentication has been disabled for your account.</p>
        <p>If you did not make this change, please contact support immediately.</p>
      `
    });
  }
}

export async function getLoginHistory(userId: string): Promise<Array<{
  id: string;
  ip_address: string;
  user_agent: string;
  location: string;
  created_at: string;
}>> {
  const { data, error } = await supabase
    .from('auth_events')
    .select('*')
    .eq('user_id', userId)
    .eq('event_type', 'login')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
}

export async function deleteAccount(userId: string): Promise<void> {
  const { error } = await supabase.rpc('delete_user_account', {
    p_user_id: userId
  });

  if (error) throw error;

  // Sign out after account deletion
  await supabase.auth.signOut();
}