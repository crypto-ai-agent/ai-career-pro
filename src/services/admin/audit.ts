import { supabase } from '../../lib/supabase';

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  changes: Record<string, any>;
  created_at: string;
}

export async function logAdminAction(
  userId: string,
  action: string,
  entityType: string,
  entityId: string,
  changes: Record<string, any>
): Promise<void> {
  const { error } = await supabase
    .from('admin_audit_logs')
    .insert({
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      changes,
      created_at: new Date().toISOString()
    });

  if (error) throw error;
}

export async function getAuditLogs(
  filters?: {
    userId?: string;
    entityType?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  },
  page: number = 1,
  limit: number = 20
): Promise<{ logs: AuditLog[]; total: number }> {
  let query = supabase
    .from('admin_audit_logs')
    .select('*', { count: 'exact' });

  if (filters?.userId) {
    query = query.eq('user_id', filters.userId);
  }
  if (filters?.entityType) {
    query = query.eq('entity_type', filters.entityType);
  }
  if (filters?.action) {
    query = query.eq('action', filters.action);
  }
  if (filters?.startDate) {
    query = query.gte('created_at', filters.startDate);
  }
  if (filters?.endDate) {
    query = query.lte('created_at', filters.endDate);
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) throw error;

  return {
    logs: data || [],
    total: count || 0
  };
}