import { i18n } from "@lingui/core";
import { APP_LOCALES, SOURCE_LOCALE } from "@zync/shared";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type SupportedLocale = keyof typeof APP_LOCALES;

export const dynamicActivate = async (locale: SupportedLocale) => {
  if (!Object.values(APP_LOCALES).includes(locale)) {
    console.warn(`Invalid locale "${locale}", defaulting to "${SOURCE_LOCALE}"`);
    locale = SOURCE_LOCALE;
  }
  const { messages } = await import(`../locales/generated/${locale}.ts`);
  i18n.load(locale, messages);
  i18n.activate(locale);
};
