import { supabase } from '../lib/supabase';
import type { Achievement, UserAchievement } from '../types/achievements';

export async function getAchievements(): Promise<Achievement[]> {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('points', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getUserAchievements(userId: string): Promise<UserAchievement[]> {
  const { data, error } = await supabase
    .from('user_achievements')
    .select(`
      *,
      achievement:achievements (*)
    `)
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function checkAchievement(
  userId: string,
  category: string,
  action: Record<string, any>
): Promise<Achievement | null> {
  // Get relevant achievements for the category
  const { data: achievements } = await supabase
    .from('achievements')
    .select('*')
    .eq('category', category);

  if (!achievements?.length) return null;

  // Check each achievement's requirements
  for (const achievement of achievements) {
    const { data: userAchievement } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .eq('achievement_id', achievement.id)
      .single();

    if (userAchievement?.completed) continue;

    const isCompleted = await checkRequirements(userId, achievement.requirements, action);
    
    if (isCompleted) {
      await completeAchievement(userId, achievement.id);
      return achievement;
    }
  }

  return null;
}

async function checkRequirements(
  userId: string,
  requirements: Record<string, any>,
  action: Record<string, any>
): Promise<boolean> {
  switch (requirements.type) {
    case 'count':
      const { count } = await supabase
        .from('usage_metrics')
        .select('count', { count: 'exact' })
        .eq('user_id', userId)
        .eq('type', requirements.tool);
      
      return count >= requirements.target;

    case 'streak':
      const { data: streaks } = await supabase
        .from('usage_metrics')
        .select('date')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(requirements.days);

      if (!streaks || streaks.length < requirements.days) return false;

      // Check if dates are consecutive
      for (let i = 1; i < streaks.length; i++) {
        const diff = new Date(streaks[i-1].date).getTime() - new Date(streaks[i].date).getTime();
        if (diff !== 86400000) return false; // One day in milliseconds
      }
      return true;

    case 'quality':
      if (!action.score) return false;
      return action.score >= requirements.min_score;

    default:
      return false;
  }
}

async function completeAchievement(userId: string, achievementId: string): Promise<void> {
  const { error } = await supabase
    .from('user_achievements')
    .upsert({
      user_id: userId,
      achievement_id: achievementId,
      completed: true,
      completed_at: new Date().toISOString()
    });

  if (error) throw error;
}