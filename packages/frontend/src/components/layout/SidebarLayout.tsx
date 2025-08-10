import { useState, useEffect, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trans } from '@lingui/react';
import { 
  Clock, 
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

  // Save sidebar state to localStorage
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
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={cn(
        "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0",
        isCollapsed ? "lg:w-16" : "lg:w-64"
      )}>
        <div className="flex flex-col flex-1 bg-card border-r border-border">
          {/* Logo and Toggle */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link 
              to={ROUTES.DASHBOARD} 
              className={cn(
                "flex items-center space-x-2",
                isCollapsed && "justify-center"
              )}
            >
              <Clock className="h-8 w-8 text-primary flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-xl font-bold text-foreground">Zync</span>
              )}
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="h-8 w-8 p-0"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                  item.current
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  isCollapsed ? "justify-center" : "space-x-3"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <Trans id={item.name} />
                )}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
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
          <div className="fixed inset-0 bg-black/20" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border">
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <Link to={ROUTES.DASHBOARD} className="flex items-center space-x-2">
                  <Clock className="h-8 w-8 text-primary" />
                  <span className="text-xl font-bold text-foreground">Zync</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "group flex items-center space-x-3 px-2 py-2 text-sm font-medium rounded-md transition-colors",
                      item.current
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <Trans id={item.name} />
                  </Link>
                ))}
              </nav>

              {/* Mobile Footer */}
              <div className="p-4 border-t border-border">
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
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(true)}
            className="h-8 w-8 p-0"
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <Link to={ROUTES.DASHBOARD} className="flex items-center space-x-2">
            <Clock className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground">Zync</span>
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
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 