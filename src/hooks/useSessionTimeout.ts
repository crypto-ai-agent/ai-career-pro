import { useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './useToast';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_BEFORE = 5 * 60 * 1000; // 5 minutes before timeout

export function useSessionTimeout() {
  const { signOut } = useAuth();
  const { addToast } = useToast();

  const checkTimeout = useCallback(() => {
    const lastActivity = localStorage.getItem('lastActivity');
    if (!lastActivity) return;

    const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
    
    if (timeSinceLastActivity > SESSION_TIMEOUT) {
      signOut();
      addToast('info', 'Your session has expired. Please sign in again.');
    } else if (timeSinceLastActivity > (SESSION_TIMEOUT - WARNING_BEFORE)) {
      addToast('warning', 'Your session will expire soon. Please save your work.');
    }
  }, [signOut, addToast]);

  const updateActivity = useCallback(() => {
    localStorage.setItem('lastActivity', Date.now().toString());
  }, []);

  useEffect(() => {
    // Check timeout every minute
    const interval = setInterval(checkTimeout, 60000);
    
    // Update activity on user interaction
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, updateActivity);
    });

    // Initial activity timestamp
    updateActivity();

    return () => {
      clearInterval(interval);
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, [checkTimeout, updateActivity]);
}