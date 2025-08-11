import { useState, useEffect, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trans } from '@lingui/react';
import { 
  LayoutDashboard, 
  Calendar, 
  Plus, 
  Settings, 
  User, 
  Menu, 
  X,
  ChevronLeft,
  ChevronRight,
  CalendarClock
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { UserMenu } from '@/components/auth/UserMenu';
import { LocaleSelector } from '@/components/ui/locale-selector';
import { ROUTES } from '@/constants/routes';
import { STORAGE_KEYS } from '@/constants/storage';
import { SupportedLocale } from '@/lib/utils';
import { cn } from '@/lib/utils';

type SidebarLayoutProps = {
  children: ReactNode;
  locale: SupportedLocale;
  changeLocale: (locale: SupportedLocale) => void;
};

type NavigationItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current?: boolean;
};

export function SidebarLayout({ children, locale, changeLocale }: SidebarLayoutProps) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED);
    if (savedState) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, JSON.stringify(newState));
  };

  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: ROUTES.DASHBOARD,
      icon: LayoutDashboard,
      current: location.pathname === ROUTES.DASHBOARD,
    },
    {
      name: 'Availability',
      href: ROUTES.AVAILABILITY,
      icon: CalendarClock,
      current: location.pathname === ROUTES.AVAILABILITY,
    },
    {
      name: 'Create Schedule',
      href: ROUTES.CREATE_SCHEDULE,
      icon: Plus,
      current: location.pathname === ROUTES.CREATE_SCHEDULE,
    },
    {
      name: 'My Schedules',
      href: ROUTES.DASHBOARD, // Will be updated when we have a schedules page
      icon: Calendar,
      current: false,
    },
    {
      name: 'Profile',
      href: ROUTES.PROFILE,
      icon: User,
      current: location.pathname === ROUTES.PROFILE,
    },
    {
      name: 'Settings',
      href: ROUTES.SETTINGS,
      icon: Settings,
      current: location.pathname === ROUTES.SETTINGS,
    },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Sidebar */}
      <div className={cn(
        "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 z-40",
        isCollapsed ? "lg:w-16" : "lg:w-64"
      )}>
        <div className="flex flex-col flex-1 glass border-r border-border/50 shadow-2xl">
          {/* Logo and Toggle */}
          <div className={cn(
            "flex items-center p-4 border-b border-border/50",
            isCollapsed ? "justify-center" : "justify-between"
          )}>
            <Link 
              to={ROUTES.DASHBOARD} 
              className={cn(
                "flex items-center group transition-all duration-300 hover:scale-105",
                isCollapsed ? "justify-center" : "space-x-3"
              )}
            >
              <div className="relative">
                <img 
                  src="/favicon-32x32.png" 
                  alt="Zync Logo" 
                  className="h-8 w-8 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" 
                />
                <div className="absolute inset-0 h-8 w-8 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              {!isCollapsed && (
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Zync
                </span>
              )}
            </Link>
            {!isCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="h-8 w-8 p-0 hover:bg-primary/10 transition-all duration-300"
              >
                <ChevronLeft className="h-4 w-4 text-primary" />
              </Button>
            )}
            {isCollapsed && (
              <div className="absolute top-4 right-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className="h-8 w-8 p-0 hover:bg-primary/10 transition-all duration-300"
                >
                  <ChevronRight className="h-4 w-4 text-primary" />
                </Button>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300 relative overflow-hidden",
                  item.current
                    ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg transform scale-105"
                    : "text-muted-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:text-primary hover:scale-105 hover:shadow-md",
                  isCollapsed ? "justify-center" : "space-x-3"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                {item.current && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur-lg" />
                )}
                <item.icon className={cn(
                  "h-5 w-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 relative z-10",
                  item.current && "drop-shadow-sm"
                )} />
                {!isCollapsed && (
                  <span className="relative z-10">
                    <Trans id={item.name} />
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border/50 bg-gradient-to-r from-muted/30 to-accent/30">
            <div className={cn(
              "flex items-center",
              isCollapsed ? "justify-center" : "justify-between"
            )}>
              {!isCollapsed && (
                <LocaleSelector 
                  currentLocale={locale}
                  onLocaleChange={changeLocale}
                  variant="icon"
                  size="sm"
                />
              )}
              <UserMenu />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 glass border-r border-border/50 shadow-2xl">
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <Link to={ROUTES.DASHBOARD} className="flex items-center space-x-3 group">
                  <div className="relative">
                    <img 
                      src="/favicon-32x32.png" 
                      alt="Zync Logo" 
                      className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 h-8 w-8 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Zync
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="h-8 w-8 p-0 hover:bg-primary/10 transition-all duration-300"
                >
                  <X className="h-4 w-4 text-primary" />
                </Button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 px-3 py-6 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "group flex items-center space-x-3 px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300 relative overflow-hidden",
                      item.current
                        ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg transform scale-105"
                        : "text-muted-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:text-primary hover:scale-105 hover:shadow-md"
                    )}
                  >
                    {item.current && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur-lg" />
                    )}
                    <item.icon className={cn(
                      "h-5 w-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 relative z-10",
                      item.current && "drop-shadow-sm"
                    )} />
                    <span className="relative z-10">
                      <Trans id={item.name} />
                    </span>
                  </Link>
                ))}
              </nav>

              {/* Mobile Footer */}
              <div className="p-4 border-t border-border/50 bg-gradient-to-r from-muted/30 to-accent/30">
                <div className="flex items-center justify-between">
                  <LocaleSelector 
                    currentLocale={locale}
                    onLocaleChange={changeLocale}
                    variant="icon"
                    size="sm"
                  />
                  <UserMenu />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col",
        "lg:ml-64",
        isCollapsed && "lg:ml-16"
      )}>
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border/50 glass sticky top-0 z-30">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(true)}
            className="h-8 w-8 p-0 hover:bg-primary/10 transition-all duration-300"
          >
            <Menu className="h-4 w-4 text-primary" />
          </Button>
          
          <Link to={ROUTES.DASHBOARD} className="flex items-center space-x-2 group">
            <div className="relative">
              <img 
                src="/favicon-32x32.png" 
                alt="Zync Logo" 
                className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" 
              />
              <div className="absolute inset-0 h-6 w-6 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Zync
            </span>
          </Link>

          <div className="flex items-center space-x-2">
            <LocaleSelector 
              currentLocale={locale}
              onLocaleChange={changeLocale}
              variant="icon"
              size="sm"
            />
            <UserMenu />
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-muted/10 to-accent/10">
          <div className="container-padding py-4 sm:py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 