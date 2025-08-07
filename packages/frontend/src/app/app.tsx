import { useState, useEffect } from 'react';
import { i18n } from '@lingui/core';
import { I18nProvider, Trans } from '@lingui/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Users } from 'lucide-react';
import { APP_LOCALES, SOURCE_LOCALE } from '@zync/shared';

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

  const features = [
    {
      icon: <Clock className="h-8 w-8" />,
      title: <Trans id="Smart Scheduling" />,
      description: <Trans id="Automatically find the best meeting times based on everyone's availability" />,
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: <Trans id="Calendar Integration" />,
      description: <Trans id="Seamlessly sync with your existing calendar applications" />,
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: <Trans id="Team Collaboration" />,
      description: <Trans id="Coordinate schedules across your entire team efficiently" />,
    },
  ];

  return (
    <I18nProvider i18n={i18n}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Zync</span>
            </div>
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

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              <Trans id="Welcome to Zync" />
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              <Trans id="Find the perfect time for your meetings" />
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3">
                <Trans id="Get Started" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                <Trans id="Learn More" />
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              <Trans id="Features" />
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center text-blue-600">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              <Trans id="Ready to optimize your scheduling?" />
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              <Trans id="Join thousands of teams who have already improved their meeting coordination" />
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              <Trans id="Get Started" />
            </Button>
          </div>
        </section>

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
    </I18nProvider>
  );
}

export default App;
