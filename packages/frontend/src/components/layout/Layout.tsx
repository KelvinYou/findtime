import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/react';

import { Clock, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { LocaleSelector } from '@/components/ui/locale-selector';
import { UserMenu } from '@/components/auth/UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import { SupportedLocale } from '@/lib/utils';

type LayoutProps = {
  children: ReactNode;
  locale: SupportedLocale;
  changeLocale: (locale: SupportedLocale) => void;
};

export function Layout({ children, locale, changeLocale }: LayoutProps) {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME} className="flex items-center space-x-2">
            <Clock className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Zync</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <LocaleSelector 
              currentLocale={locale}
              onLocaleChange={changeLocale}
              variant="icon"
              size="sm"
            />
            
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <div className="flex items-center space-x-2">
                <Link to={ROUTES.LOGIN}>
                  <Button variant="ghost" size="sm">
                    <LogIn className="mr-2 h-4 w-4" />
                    <Trans id="Sign In" />
                  </Button>
                </Link>
                <Link to={ROUTES.REGISTER}>
                  <Button size="sm">
                    <Trans id="Sign Up" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col min-h-[calc(100vh-160px)]">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Clock className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-semibold">Zync</span>
          </div>
          <p className="text-gray-400">
            <Trans id="© 2025 Zync. All rights reserved." /> 
          </p>
        </div>
      </footer>
    </div>
  );
} 