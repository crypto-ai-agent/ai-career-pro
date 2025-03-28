import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';

interface NavigationGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireVerification?: boolean;
}

export function NavigationGuard({
  children,
  requireAuth = false,
  requireAdmin = false,
  requireVerification = false
}: NavigationGuardProps) {
  const { user, isVerified, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();

  React.useEffect(() => {
    if (requireAuth && !user) {
      addToast('error', 'Please sign in to access this page');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (requireVerification && !isVerified) {
      addToast('error', 'Please verify your email to access this page');
      navigate('/verify-email');
      return;
    }

    if (requireAdmin && !isAdmin) {
      addToast('error', 'You do not have permission to access this page');
      navigate('/dashboard');
      return;
    }
  }, [user, isVerified, isAdmin, location, navigate, addToast]);

  return <>{children}</>;
}