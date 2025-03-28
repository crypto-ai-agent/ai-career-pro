import { supabase } from '../lib/supabase';

interface TwoFactorResponse {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

async function enable2FA(userId: string): Promise<TwoFactorResponse> {
  const { data, error } = await supabase.rpc('enable_two_factor', {
    p_user_id: userId
  });

  if (error) throw error;
  return data;
}

async function verify2FA(userId: string, token: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('verify_two_factor', {
    p_user_id: userId,
    p_token: token,
    p_ip_address: await getClientIP()
  });

  if (error) throw error;
  return data;
}

async function disable2FA(userId: string): Promise<void> {
  const { error } = await supabase.rpc('disable_two_factor', {
    p_user_id: userId
  });

  if (error) throw error;
}

export async function check2FAStatus(userId: string): Promise<{
  enabled: boolean;
  backupCodesRemaining: number;
}> {
  const { data, error } = await supabase
    .from('two_factor_auth')
    .select('enabled, backup_codes')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  
  return {
    enabled: data?.enabled || false,
    backupCodesRemaining: data?.backup_codes?.length || 0
  };
}

async function getClientIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error getting client IP:', error);
    return '0.0.0.0';
  }
}

export { enable2FA, verify2FA, disable2FA }