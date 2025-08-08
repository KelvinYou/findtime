import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';

import { Clock } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ROUTES } from '@/constants/routes';
import CreateSchedulePage from '@/pages/CreateSchedulePage';
import HomePage from '@/pages/HomePage';
import ScheduleViewPage from '@/pages/ScheduleViewPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { dynamicActivate, SupportedLocale } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

function App() {
  const [locale, setLocale] = useState<SupportedLocale>('en');
  const [isLoading, setIsLoading] = useState(true);

  const changeLocale = async (newLocale: SupportedLocale) => {
    setIsLoading(true);
    await dynamicActivate(newLocale);
    setLocale(newLocale);
    setIsLoading(false);
  };

  useEffect(() => {
    const initializeLocale = async () => {
      await dynamicActivate('en');
      setIsLoading(false);
    };
    initializeLocale();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <I18nProvider i18n={i18n}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path={ROUTES.HOME} element={
              <Layout locale={locale} changeLocale={changeLocale}>
                <HomePage />
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
            
            {/* Protected routes */}
            <Route path={ROUTES.DASHBOARD} element={
              <ProtectedRoute>
                <Layout locale={locale} changeLocale={changeLocale}>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path={ROUTES.CREATE_SCHEDULE} element={
              <Layout locale={locale} changeLocale={changeLocale}>
                <CreateSchedulePage />
              </Layout>
            } />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </I18nProvider>
  );
}

export default App;
