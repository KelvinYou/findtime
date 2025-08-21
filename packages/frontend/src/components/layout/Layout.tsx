import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/react';

import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { LocaleSelector } from '@/components/ui/locale-selector';
import { ThemeToggle } from '@/components/ui/theme-toggle';
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="container mx-auto container-padding py-4 flex justify-between items-center">
          <Link 
            to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME} 
            className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105"
          >
            <div className="relative">
              <img 
                src="/favicon-32x32.png" 
                alt="Zync Logo" 
                className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" 
              />
              <div className="absolute inset-0 h-8 w-8 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Zync
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to={ROUTES.ABOUT}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <Trans id="About" />
            </Link>
          </nav>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <ThemeToggle />
            <LocaleSelector 
              currentLocale={locale}
              onLocaleChange={changeLocale}
              variant="icon"
              size="sm"
            />
            
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Link to={ROUTES.LOGIN}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="transition-all duration-300 hover:bg-primary/10 hover:text-primary"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    <Trans id="Sign In" />
                  </Button>
                </Link>
                <Link to={ROUTES.REGISTER}>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
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
      <footer className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-primary opacity-95" />
        <div className="relative z-10 py-12 sm:py-16 lg:py-20 container-padding">
          <div className="container mx-auto text-center responsive-spacing">
            <div className="flex items-center justify-center space-x-3 mb-6 group">
              <div className="relative">
                <img 
                  src="/favicon-32x32.png" 
                  alt="Zync Logo" 
                  className="h-8 w-8 transition-transform duration-300 group-hover:scale-110 float" 
                />
                <div className="absolute inset-0 h-8 w-8 bg-white/30 rounded-full blur-lg pulse-soft" />
              </div>
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Zync</span>
            </div>
            <p className="text-white/80 text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              <Trans id="Streamline your scheduling and make time management effortless with our modern platform." />
            </p>
            <div className="flex justify-center space-x-6 mb-8">
              <Link 
                to={ROUTES.ABOUT} 
                className="text-white/70 hover:text-white transition-colors duration-200"
              >
                <Trans id="About" />
              </Link>
              <Link 
                to={ROUTES.HOME} 
                className="text-white/70 hover:text-white transition-colors duration-200"
              >
                <Trans id="Home" />
              </Link>
            </div>
            <div className="border-t border-white/20 pt-8">
              <p className="text-white/60">
                <Trans id="© 2025 Zync. All rights reserved." /> 
              </p>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
      </footer>
    </div>
  );
} 