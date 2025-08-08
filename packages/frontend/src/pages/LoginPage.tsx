import { Link, useNavigate } from 'react-router-dom';
import { Trans } from '@lingui/react';

import { LoginForm } from '@/components/auth/LoginForm';
import { ROUTES } from '@/constants/routes';

export function LoginPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate(ROUTES.DASHBOARD);
  };

  const handleSwitchToRegister = () => {
    navigate(ROUTES.REGISTER);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to={ROUTES.HOME} className="inline-block">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              <Trans id="Zync" />
            </h1>
          </Link>
          <p className="text-gray-600">
            <Trans id="Sign in to manage your schedules" />
          </p>
        </div>

        <LoginForm
          onSuccess={handleSuccess}
          onSwitchToRegister={handleSwitchToRegister}
        />

        <div className="mt-8 text-center">
          <Link
            to={ROUTES.HOME}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            <Trans id="Back to Home" />
          </Link>
        </div>
      </div>
    </div>
  );
} 