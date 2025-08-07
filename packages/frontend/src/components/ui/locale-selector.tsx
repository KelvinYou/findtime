import { useState } from 'react';
import { Trans } from '@lingui/react';
import { Globe, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { APP_LOCALES } from '@zync/shared';
import { SupportedLocale } from '@/lib/utils';

type LocaleOption = {
  code: SupportedLocale;
  nativeName: string;
  englishName: string;
  flag: string;
};

const LOCALE_OPTIONS: LocaleOption[] = [
  {
    code: 'en',
    nativeName: 'English',
    englishName: 'English',
    flag: '🇺🇸',
  },
  {
    code: 'zh',
    nativeName: '中文',
    englishName: 'Chinese',
    flag: '🇨🇳',
  },
  {
    code: 'ms',
    nativeName: 'Bahasa Melayu',
    englishName: 'Malay',
    flag: '🇲🇾',
  },
];

type LocaleSelectorProps = {
  currentLocale: SupportedLocale;
  onLocaleChange: (locale: SupportedLocale) => void;
  variant?: 'icon' | 'text';
  size?: 'sm' | 'default' | 'lg';
};

export function LocaleSelector({ 
  currentLocale, 
  onLocaleChange, 
  variant = 'icon',
  size = 'default'
}: LocaleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLocaleOption = LOCALE_OPTIONS.find(option => option.code === currentLocale);

  const handleLocaleChange = (locale: SupportedLocale) => {
    onLocaleChange(locale);
    setIsOpen(false);
  };

  const triggerContent = variant === 'icon' ? (
    <div className="flex items-center space-x-1">
      <Globe className="h-4 w-4" />
      <span className="text-sm">{currentLocaleOption?.flag}</span>
    </div>
  ) : (
    <div className="flex items-center space-x-2">
      <span className="text-sm">{currentLocaleOption?.flag}</span>
      <span className="text-sm font-medium">{currentLocaleOption?.nativeName}</span>
    </div>
  );

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size={size}
          className="h-8 px-2 hover:bg-gray-100 focus:bg-gray-100"
          aria-label="Select language"
        >
          {triggerContent}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {LOCALE_OPTIONS.map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => handleLocaleChange(locale.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{locale.flag}</span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{locale.nativeName}</span>
                <span className="text-xs text-gray-500">{locale.englishName}</span>
              </div>
            </div>
            {currentLocale === locale.code && (
              <Check className="h-4 w-4 text-blue-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 