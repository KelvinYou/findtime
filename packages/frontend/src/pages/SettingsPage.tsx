import { useState } from 'react';
import { Trans } from '@lingui/react';
import { 
  Monitor, 
  Moon, 
  Sun, 
  Globe, 
  Bell, 
  User, 
  Shield, 
  Palette, 
  Zap,
  Save,
  Check,
  ChevronRight,
  Smartphone,
  Mail,
  Calendar,
  Clock,
  Volume2,
  VolumeX,
  Eye,
  EyeOff
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { useTheme } from '@/contexts/ThemeContext';
import { SupportedLocale } from '@/lib/utils';
import { cn } from '@/lib/utils';

type SettingsPageProps = {
  locale: SupportedLocale;
  changeLocale: (locale: SupportedLocale) => void;
};

const LOCALE_OPTIONS = [
  { code: 'en' as SupportedLocale, name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'zh' as SupportedLocale, name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ms' as SupportedLocale, name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
];

const SETTINGS_SECTIONS = [
  { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Theme and visual preferences' },
  { id: 'language', label: 'Language & Region', icon: Globe, description: 'Language and localization' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Manage your notifications' },
  { id: 'privacy', label: 'Privacy & Security', icon: Shield, description: 'Privacy and security settings' },
  { id: 'preferences', label: 'Preferences', icon: Zap, description: 'App behavior and preferences' },
];

export function SettingsPage({ locale, changeLocale }: SettingsPageProps) {
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('appearance');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Mock settings state - in real app, these would come from user preferences API
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
    autoSave: true,
    compactMode: false,
    showPreview: true,
    notificationVolume: [75],
    workingHours: { start: '09:00', end: '17:00' },
    timeFormat: '12h' as '12h' | '24h',
    dateFormat: 'MM/DD/YYYY' as 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD',
  });

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    setHasUnsavedChanges(true);
  };

  const handleLocaleChange = (newLocale: string) => {
    changeLocale(newLocale as SupportedLocale);
    setHasUnsavedChanges(true);
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // In real app, save to API
    setHasUnsavedChanges(false);
    // Show success toast
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'appearance':
        return (
          <div className="space-y-8">
            {/* Theme Selection */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  <Trans id="Color Theme" />
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  <Trans id="Choose your preferred color scheme" />
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { value: 'light', label: 'Light', icon: Sun, preview: 'bg-white border-gray-200' },
                  { value: 'dark', label: 'Dark', icon: Moon, preview: 'bg-gray-900 border-gray-700' },
                  { value: 'system', label: 'System', icon: Monitor, preview: 'bg-gradient-to-br from-white to-gray-900 border-gray-400' }
                ].map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md",
                      theme === option.value 
                        ? "border-primary bg-primary/5 shadow-md" 
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => handleThemeChange(option.value as any)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn("w-8 h-8 rounded-full border-2", option.preview)} />
                      <div>
                        <div className="flex items-center space-x-2">
                          <option.icon className="h-4 w-4" />
                          <span className="font-medium">
                            <Trans id={option.label} />
                          </span>
                        </div>
                        {theme === option.value && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            <Check className="h-3 w-3 mr-1" />
                            <Trans id="Active" />
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Display Options */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  <Trans id="Display Options" />
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  <Trans id="Customize how content is displayed" />
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">
                      <Trans id="Compact Mode" />
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      <Trans id="Reduce spacing and show more content" />
                    </p>
                  </div>
                  <Switch
                    checked={settings.compactMode}
                    onCheckedChange={(checked) => handleSettingChange('compactMode', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">
                      <Trans id="Show Preview" />
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      <Trans id="Display preview information in cards" />
                    </p>
                  </div>
                  <Switch
                    checked={settings.showPreview}
                    onCheckedChange={(checked) => handleSettingChange('showPreview', checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'language':
        return (
          <div className="space-y-8">
            {/* Language Selection */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  <Trans id="Language" />
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  <Trans id="Choose your preferred language" />
                </p>
              </div>

              <div className="grid gap-3">
                {LOCALE_OPTIONS.map((option) => (
                  <div
                    key={option.code}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all hover:shadow-sm",
                      locale === option.code 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => handleLocaleChange(option.code)}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{option.flag}</span>
                      <div>
                        <div className="font-medium">{option.nativeName}</div>
                        <div className="text-sm text-muted-foreground">{option.name}</div>
                      </div>
                    </div>
                    {locale === option.code && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Regional Settings */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  <Trans id="Regional Settings" />
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  <Trans id="Configure date, time, and number formats" />
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    <Trans id="Time Format" />
                  </Label>
                  <Select 
                    value={settings.timeFormat} 
                    onValueChange={(value) => handleSettingChange('timeFormat', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour (2:30 PM)</SelectItem>
                      <SelectItem value="24h">24-hour (14:30)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    <Trans id="Date Format" />
                  </Label>
                  <Select 
                    value={settings.dateFormat} 
                    onValueChange={(value) => handleSettingChange('dateFormat', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-8">
            {/* Notification Types */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  <Trans id="Notification Types" />
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  <Trans id="Choose which notifications you want to receive" />
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <Label className="text-sm font-medium">
                        <Trans id="Email Notifications" />
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        <Trans id="Receive notifications via email" />
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-primary" />
                    <div>
                      <Label className="text-sm font-medium">
                        <Trans id="Push Notifications" />
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        <Trans id="Receive push notifications on your device" />
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    {settings.soundEnabled ? (
                      <Volume2 className="h-5 w-5 text-primary" />
                    ) : (
                      <VolumeX className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <Label className="text-sm font-medium">
                        <Trans id="Sound Notifications" />
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        <Trans id="Play sounds for notifications" />
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => handleSettingChange('soundEnabled', checked)}
                  />
                </div>
              </div>
            </div>

            {settings.soundEnabled && (
              <>
                <Separator />
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      <Trans id="Sound Settings" />
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      <Trans id="Adjust notification sound volume" />
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        <Trans id="Volume" />
                      </Label>
                      <span className="text-sm text-muted-foreground">
                        {settings.notificationVolume[0]}%
                      </span>
                    </div>
                    <Slider
                      value={settings.notificationVolume}
                      onValueChange={(value) => handleSettingChange('notificationVolume', value)}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  <Trans id="Privacy Settings" />
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  <Trans id="Control your privacy and data sharing preferences" />
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800 dark:text-amber-200">
                        <Trans id="Privacy Features Coming Soon" />
                      </h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                        <Trans id="Advanced privacy controls and data management features will be available in a future update." />
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border opacity-50">
                    <div className="flex items-center space-x-3">
                      <Eye className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          <Trans id="Profile Visibility" />
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          <Trans id="Control who can see your profile" />
                        </p>
                      </div>
                    </div>
                    <Switch disabled />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border opacity-50">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          <Trans id="Schedule Privacy" />
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          <Trans id="Make your schedules private by default" />
                        </p>
                      </div>
                    </div>
                    <Switch disabled />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  <Trans id="App Preferences" />
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  <Trans id="Customize how the app behaves" />
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <Save className="h-5 w-5 text-primary" />
                    <div>
                      <Label className="text-sm font-medium">
                        <Trans id="Auto Save" />
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        <Trans id="Automatically save changes as you work" />
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  <Trans id="Working Hours" />
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  <Trans id="Set your default working hours for scheduling" />
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    <Trans id="Start Time" />
                  </Label>
                  <Select 
                    value={settings.workingHours.start} 
                    onValueChange={(value) => handleSettingChange('workingHours', { ...settings.workingHours, start: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    <Trans id="End Time" />
                  </Label>
                  <Select 
                    value={settings.workingHours.end} 
                    onValueChange={(value) => handleSettingChange('workingHours', { ...settings.workingHours, end: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Header - Mobile */}
        <div className="lg:hidden space-y-4 p-4 sm:p-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              <Trans id="Settings" />
            </h1>
            <p className="text-muted-foreground">
              <Trans id="Manage your account settings and preferences" />
            </p>
          </div>
          
          {hasUnsavedChanges && (
            <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm text-amber-800 dark:text-amber-200">
                  <Trans id="You have unsaved changes" />
                </span>
              </div>
              <Button size="sm" onClick={handleSave} className="bg-amber-600 hover:bg-amber-700">
                <Save className="h-4 w-4 mr-1" />
                <Trans id="Save" />
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar Navigation */}
        <div className="lg:w-80 lg:flex-shrink-0">
          <div className="lg:sticky lg:top-6">
            {/* Header - Desktop */}
            <div className="hidden lg:block space-y-4 p-6 pb-0">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  <Trans id="Settings" />
                </h1>
                <p className="text-muted-foreground">
                  <Trans id="Manage your account settings and preferences" />
                </p>
              </div>
              
              {hasUnsavedChanges && (
                <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-sm text-amber-800 dark:text-amber-200">
                      <Trans id="Unsaved changes" />
                    </span>
                  </div>
                  <Button size="sm" onClick={handleSave} className="bg-amber-600 hover:bg-amber-700">
                    <Save className="h-4 w-4 mr-1" />
                    <Trans id="Save" />
                  </Button>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="p-4 sm:p-6">
              <nav className="space-y-2">
                {SETTINGS_SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-lg text-left transition-all hover:bg-muted/50",
                      activeSection === section.id 
                        ? "bg-primary/10 border border-primary/20 text-primary" 
                        : "hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <section.icon className={cn(
                        "h-5 w-5",
                        activeSection === section.id ? "text-primary" : "text-muted-foreground"
                      )} />
                      <div className="text-left">
                        <div className="font-medium">
                          <Trans id={section.label} />
                        </div>
                        <div className="text-xs text-muted-foreground hidden sm:block">
                          <Trans id={section.description} />
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={cn(
                      "h-4 w-4 transition-transform lg:hidden",
                      activeSection === section.id ? "rotate-90" : ""
                    )} />
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <Card className="border-0 shadow-none lg:border lg:shadow-sm">
            <CardHeader className="border-b bg-muted/30">
              <div className="flex items-center space-x-3">
                {(() => {
                  const section = SETTINGS_SECTIONS.find(s => s.id === activeSection);
                  return section ? (
                    <>
                      <section.icon className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle className="text-xl">
                          <Trans id={section.label} />
                        </CardTitle>
                        <CardDescription>
                          <Trans id={section.description} />
                        </CardDescription>
                      </div>
                    </>
                  ) : null;
                })()}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {renderSectionContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 