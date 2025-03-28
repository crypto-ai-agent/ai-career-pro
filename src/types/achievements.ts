export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'tool_usage' | 'quality' | 'streak' | 'special';
  requirements: Record<string, any>;
  points: number;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold';
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  progress: number;
  completed: boolean;
  completed_at: string | null;
  current_streak: number;
  created_at: string;
  updated_at: string;
  achievement?: Achievement;
}