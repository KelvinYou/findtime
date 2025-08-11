import { Trans } from '@lingui/react';
import { Monitor, Moon, Sun, Globe, Bell } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/contexts/ThemeContext';
import { SupportedLocale } from '@/lib/utils';

type SettingsPageProps = {
  locale: SupportedLocale;
  changeLocale: (locale: SupportedLocale) => void;
};

const LOCALE_OPTIONS = [
  { code: 'en' as SupportedLocale, name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'zh' as SupportedLocale, name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ms' as SupportedLocale, name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
];

export function SettingsPage({ locale, changeLocale }: SettingsPageProps) {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
  };

  const handleLocaleChange = (newLocale: string) => {
    changeLocale(newLocale as SupportedLocale);
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          <Trans id="Settings" />
        </h1>
        <p className="text-muted-foreground">
          <Trans id="Manage your account settings and preferences" />
        </p>
      </div>

      <Separator />

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Monitor className="mr-2 h-5 w-5 text-primary" />
            <Trans id="Appearance" />
          </CardTitle>
          <CardDescription>
            <Trans id="Customize how Zync looks and feels" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              <Trans id="Theme" />
            </Label>
            <RadioGroup
              value={theme}
              onValueChange={handleThemeChange}
              className="grid grid-cols-3 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="flex items-center cursor-pointer">
                  <Sun className="mr-2 h-4 w-4" />
                  <Trans id="Light" />
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="flex items-center cursor-pointer">
                  <Moon className="mr-2 h-4 w-4" />
                  <Trans id="Dark" />
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system" className="flex items-center cursor-pointer">
                  <Monitor className="mr-2 h-4 w-4" />
                  <Trans id="System" />
                </Label>
              </div>
            </RadioGroup>
            <p className="text-xs text-muted-foreground">
              <Trans id="Choose your preferred color scheme" />
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Language & Region */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="mr-2 h-5 w-5 text-primary" />
            <Trans id="Language & Region" />
          </CardTitle>
          <CardDescription>
            <Trans id="Select your preferred language and regional settings" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              <Trans id="Language" />
            </Label>
            <Select value={locale} onValueChange={handleLocaleChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOCALE_OPTIONS.map((option) => (
                  <SelectItem key={option.code} value={option.code}>
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{option.flag}</span>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{option.nativeName}</span>
                        <span className="text-xs text-muted-foreground">{option.name}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              <Trans id="Change the language used throughout the application" />
            </p>
          </div>
        </CardContent>
      </Card>



      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5 text-primary" />
            <Trans id="Notifications" />
          </CardTitle>
          <CardDescription>
            <Trans id="Control how you receive notifications" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-sm text-muted-foreground">
            <Trans id="Notification settings will be available in a future update" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 