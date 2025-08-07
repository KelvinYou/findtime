import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/react';

import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

type LayoutProps = {
  children: ReactNode;
  locale: 'en' | 'zh' | 'ms';
  changeLocale: (locale: 'en' | 'zh' | 'ms') => void;
};

export function Layout({ children, locale, changeLocale }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to={ROUTES.HOME} className="flex items-center space-x-2">
            <Clock className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Zync</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Button
              variant={locale === 'en' ? 'default' : 'outline'}
              size="sm"
              onClick={() => changeLocale('en')}
            >
              EN
            </Button>
            <Button
              variant={locale === 'zh' ? 'default' : 'outline'}
              size="sm"
              onClick={() => changeLocale('zh')}
            >
              中文
            </Button>
            <Button
              variant={locale === 'ms' ? 'default' : 'outline'}
              size="sm"
              onClick={() => changeLocale('ms')}
            >
              MS
            </Button>
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
            <Trans id="© 2024 Zync. All rights reserved." /> 
          </p>
        </div>
      </footer>
    </div>
  );
} 