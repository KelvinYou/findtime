import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';

import { Clock } from 'lucide-react';
import { APP_LOCALES, SOURCE_LOCALE } from '@zync/shared';
import { Layout } from '@/components/layout/Layout';
import { ROUTES } from '@/constants/routes';
import CreateSchedulePage from '@/components/pages/CreateSchedulePage';
import HomePage from '@/components/pages/HomePage';
import ScheduleViewPage from '@/components/pages/ScheduleViewPage';

export const dynamicActivate = async (locale: keyof typeof APP_LOCALES) => {
  if (!Object.values(APP_LOCALES).includes(locale)) {
    console.warn(`Invalid locale "${locale}", defaulting to "${SOURCE_LOCALE}"`);
    locale = SOURCE_LOCALE;
  }
  const { messages } = await import(`../locales/generated/${locale}.ts`);
  i18n.load(locale, messages);
  i18n.activate(locale);
};

function App() {
  const [locale, setLocale] = useState<'en' | 'zh' | 'ms'>('en');
  const [isLoading, setIsLoading] = useState(true);

  const changeLocale = async (newLocale: 'en' | 'zh' | 'ms') => {
    setIsLoading(true);
    await dynamicActivate(newLocale);
    setLocale(newLocale);
    setIsLoading(false);
  };

  // Initialize with English on first load
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
      <Router>
        <Layout locale={locale} changeLocale={changeLocale}>
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.CREATE_SCHEDULE} element={<CreateSchedulePage />} />
            <Route path={ROUTES.SCHEDULE} element={<ScheduleViewPage />} />
          </Routes>
        </Layout>
      </Router>
    </I18nProvider>
  );
}

export default App;
