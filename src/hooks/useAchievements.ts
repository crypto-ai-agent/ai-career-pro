import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAchievements, getUserAchievements, checkAchievement } from '../services/achievements';
import type { Achievement, UserAchievement } from '../types/achievements';

export function useAchievements() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadAchievements();
    }
  }, [user]);

  const loadAchievements = async () => {
    try {
      const [allAchievements, userProgress] = await Promise.all([
        getAchievements(),
        getUserAchievements(user!.id)
      ]);

      setAchievements(allAchievements);
      setUserAchievements(userProgress);
      setError(null);
    } catch (err) {
      console.error('Error loading achievements:', err);
      setError('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  const checkForAchievements = async (category: string, action: Record<string, any>) => {
    if (!user) return null;

    try {
      const newAchievement = await checkAchievement(user.id, category, action);
      if (newAchievement) {
        await loadAchievements(); // Refresh achievements
        return newAchievement;
      }
      return null;
    } catch (err) {
      console.error('Error checking achievements:', err);
      return null;
    }
  };

  return {
    achievements,
    userAchievements,
    loading,
    error,
    checkForAchievements,
    refresh: loadAchievements
  };
}