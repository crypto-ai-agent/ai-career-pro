import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { useEffect } from 'react';
import { useToast } from '../../hooks/useToast';
import { EmailVerification } from './EmailVerification';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireVerification?: boolean;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requireVerification = true,
  requireAdmin = false 
}: ProtectedRouteProps) {
  const { user, loading, isVerified, isAdmin } = useAuth();
  const location = useLocation();
  const { addToast } = useToast();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requireVerification && !isVerified) {
    return <EmailVerification />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  useEffect(() => {
    if (user && requireAdmin && !isAdmin) {
      addToast('error', 'You do not have permission to access this page');
    }
  }, [user, requireAdmin, isAdmin, addToast]);

  return <>{children}</>;
}