export interface UserFeedback {
  id: string;
  user_id: string;
  type: 'bug' | 'feature' | 'improvement' | 'other';
  content: string;
  status: 'pending' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}