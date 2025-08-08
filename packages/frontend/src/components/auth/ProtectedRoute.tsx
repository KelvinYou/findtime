import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Trans } from '@lingui/react';
import { Clock } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants/routes';

type ProtectedRouteProps = {
  children: ReactNode;
  requireAuth?: boolean;
};

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">
            <Trans id="Loading..." />
          </p>
        </div>
      </div>
    );
  }

  // If route requires auth but user is not authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (isAuthenticated && (location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.REGISTER)) {
    const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
} 