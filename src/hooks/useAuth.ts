import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { getProfile } from '../services/database';

export function useAuth() {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (context.user && !context.loading) {
      checkProfileCompletion();
    }
  }, [context.user, context.loading]);

  const checkProfileCompletion = async () => {
    try {
      // Profile completion is now optional
      await getProfile(context.user!.id);
    } catch (error) {
      console.error('Error checking profile:', error);
    }
  };

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}