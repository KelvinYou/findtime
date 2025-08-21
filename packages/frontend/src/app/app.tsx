import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';

import { Clock } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ROUTES } from '@/constants/routes';
import { STORAGE_KEYS } from '@/constants/storage';
import CreateSchedulePage from '@/pages/CreateSchedulePage';
import HomePage from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import ScheduleViewPage from '@/pages/ScheduleViewPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { AvailabilityPage } from '@/pages/AvailabilityPage';
import { BookingPage } from '@/pages/BookingPage';
import { dynamicActivate, SupportedLocale } from '@/lib/utils';
import { queryClient } from '@/lib/queryClient';
import { Toaster } from '@/components/ui/toaster';

function App() {
  const [locale, setLocale] = useState<SupportedLocale>('en');
  const [isLoading, setIsLoading] = useState(true);

  const changeLocale = (newLocale: SupportedLocale) => {
    // Since all translations are preloaded, this should be instant
    if (i18n.messages[newLocale]) {
      i18n.activate(newLocale);
    } else {
      // Fallback to dynamic loading if somehow not preloaded
      dynamicActivate(newLocale);
    }
    setLocale(newLocale);
    localStorage.setItem(STORAGE_KEYS.LOCALE, newLocale);
  };

  useEffect(() => {
    const initializeLocale = async () => {
      // Load saved locale or default to 'en'
      const savedLocale = localStorage.getItem(STORAGE_KEYS.LOCALE) as SupportedLocale;
      const initialLocale = savedLocale && ['en', 'zh', 'ms'].includes(savedLocale) ? savedLocale : 'en';
      
      // Preload all translations for instant switching
      const preloadPromises = ['en', 'zh', 'ms'].map(async (locale) => {
        try {
          const { messages } = await import(`../locales/generated/${locale}.ts`);
          i18n.load(locale, messages);
        } catch (error) {
          console.warn(`Failed to preload locale ${locale}:`, error);
        }
      });
      
      await Promise.all(preloadPromises);
      
      // Activate the initial locale
      i18n.activate(initialLocale);
      setLocale(initialLocale);
      setIsLoading(false);
    };
    initializeLocale();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <Clock className="h-16 w-16 text-primary mx-auto animate-spin float" />
            <div className="absolute inset-0 h-16 w-16 bg-primary/30 rounded-full blur-xl pulse-soft mx-auto" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Zync
            </h2>
            <p className="text-muted-foreground animate-pulse">Loading your experience...</p>
          </div>
        </div>
      </div>
    );
  }

    return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider i18n={i18n}>
        <ThemeProvider>
          <AuthProvider>
            <Router>
          <Routes>
            {/* Public routes */}
            <Route path={ROUTES.HOME} element={
              <Layout locale={locale} changeLocale={changeLocale}>
                <HomePage />
              </Layout>
            } />
            <Route path={ROUTES.ABOUT} element={
              <Layout locale={locale} changeLocale={changeLocale}>
                <AboutPage />
              </Layout>
            } />
            <Route path={ROUTES.SCHEDULE} element={
              <Layout locale={locale} changeLocale={changeLocale}>
                <ScheduleViewPage />
              </Layout>
            } />
            
            {/* Auth routes */}
            <Route path={ROUTES.LOGIN} element={
              <ProtectedRoute requireAuth={false}>
                <LoginPage />
              </ProtectedRoute>
            } />
            <Route path={ROUTES.REGISTER} element={
              <ProtectedRoute requireAuth={false}>
                <RegisterPage />
              </ProtectedRoute>
            } />
            
              {/* Protected routes with sidebar layout */}
            <Route path={ROUTES.DASHBOARD} element={
              <ProtectedRoute>
                  <SidebarLayout locale={locale} changeLocale={changeLocale}>
                  <DashboardPage />
                  </SidebarLayout>
              </ProtectedRoute>
            } />
            <Route path={ROUTES.CREATE_SCHEDULE} element={
                <ProtectedRoute>
                  <SidebarLayout locale={locale} changeLocale={changeLocale}>
                <CreateSchedulePage />
                  </SidebarLayout>
                </ProtectedRoute>
              } />
              <Route path={ROUTES.SETTINGS} element={
                <ProtectedRoute>
                  <SidebarLayout locale={locale} changeLocale={changeLocale}>
                    <SettingsPage locale={locale} changeLocale={changeLocale} />
                  </SidebarLayout>
                </ProtectedRoute>
              } />
              <Route path={ROUTES.AVAILABILITY} element={
                <ProtectedRoute>
                  <SidebarLayout locale={locale} changeLocale={changeLocale}>
                    <AvailabilityPage />
                  </SidebarLayout>
                </ProtectedRoute>
              } />
              <Route path={ROUTES.PROFILE} element={
                <ProtectedRoute>
                  <SidebarLayout locale={locale} changeLocale={changeLocale}>
                    <ProfilePage />
                  </SidebarLayout>
                </ProtectedRoute>
              } />
              
              {/* Public booking page */}
              <Route path={ROUTES.BOOKING} element={<BookingPage />} />
                      </Routes>
            <Toaster />
          </Router>
        </AuthProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </I18nProvider>
    </QueryClientProvider>
  );
}

export default App;
