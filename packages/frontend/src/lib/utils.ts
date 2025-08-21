import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { i18n } from "@lingui/core";
import { APP_LOCALES, SOURCE_LOCALE } from '@zync/shared';
import { GuestData, GuestUser } from '@zync/shared';
import { STORAGE_KEYS } from '@/constants/storage';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type SupportedLocale = keyof typeof APP_LOCALES;

export const dynamicActivate = async (locale: SupportedLocale) => {
  if (!Object.values(APP_LOCALES).includes(locale)) {
    console.warn(`Invalid locale "${locale}", defaulting to "${SOURCE_LOCALE}"`);
    locale = SOURCE_LOCALE;
  }
  
  // Skip if locale is already active
  if (i18n.locale === locale) {
    return;
  }
  
  // If messages are already loaded, just activate
  if (i18n.messages[locale]) {
    i18n.activate(locale);
    return;
  }
  
  // Otherwise, load and activate
  const { messages } = await import(`../locales/generated/${locale}.ts`);
  i18n.load(locale, messages);
  i18n.activate(locale);
};

// Guest local storage utilities

export const guestStorage = {
  // Save guest user data to localStorage
  saveGuestData: (guestUser: GuestUser): void => {
    try {
      const guestData: GuestData = {
        user: guestUser,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.GUEST_USER_DATA, JSON.stringify(guestData));
    } catch (error) {
      console.warn('Failed to save guest data to localStorage:', error);
    }
  },

  // Get guest user data from localStorage
  getGuestData: (): GuestData | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GUEST_USER_DATA);
      if (!stored) return null;
      
      const guestData: GuestData = JSON.parse(stored);
      
      // Validate the structure
      if (!guestData.user?.name) return null;
      
      return guestData;
    } catch (error) {
      console.warn('Failed to parse guest data from localStorage:', error);
      return null;
    }
  },

  // Clear guest user data from localStorage
  clearGuestData: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.GUEST_USER_DATA);
    } catch (error) {
      console.warn('Failed to clear guest data from localStorage:', error);
    }
  },

  // Check if guest data exists and is recent (within 30 days)
  hasValidGuestData: (): boolean => {
    const guestData = guestStorage.getGuestData();
    if (!guestData) return false;
    
    const savedDate = new Date(guestData.savedAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return savedDate > thirtyDaysAgo;
  },
};
