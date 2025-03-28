import { supabase } from '../../lib/supabase';

export interface ServiceVersion {
  id: string;
  service_id: string;
  version: number;
  config: Record<string, any>;
  created_by: string;
  created_at: string;
  comment?: string;
}

export async function createServiceVersion(
  serviceId: string,
  config: Record<string, any>,
  userId: string,
  comment?: string
): Promise<ServiceVersion> {
  // Get latest version number
  const { data: versions } = await supabase
    .from('service_versions')
    .select('version')
    .eq('service_id', serviceId)
    .order('version', { ascending: false })
    .limit(1);

  const nextVersion = versions?.[0]?.version ? versions[0].version + 1 : 1;

  const { data, error } = await supabase
    .from('service_versions')
    .insert({
      service_id: serviceId,
      version: nextVersion,
      config,
      created_by: userId,
      comment,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getServiceVersions(
  serviceId: string
): Promise<ServiceVersion[]> {
  const { data, error } = await supabase
    .from('service_versions')
    .select('*')
    .eq('service_id', serviceId)
    .order('version', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function rollbackToVersion(
  serviceId: string,
  version: number
): Promise<void> {
  const { data: versionData, error: versionError } = await supabase
    .from('service_versions')
    .select('config')
    .eq('service_id', serviceId)
    .eq('version', version)
    .single();

  if (versionError) throw versionError;

  const { error: updateError } = await supabase
    .from('service_configs')
    .update({ ...versionData.config })
    .eq('id', serviceId);

  if (updateError) throw updateError;
}