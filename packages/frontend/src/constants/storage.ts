/**
 * Local Storage Keys
 * Centralized constants for localStorage keys used throughout the application
 */

// Authentication related keys
export const STORAGE_KEYS = {
  // Auth tokens and user data
  AUTH_TOKEN: 'auth_token',
  AUTH_USER: 'auth_user',
  
  // Guest user data
  GUEST_USER_DATA: 'guest_user_data',
  
  // User preferences
  THEME: 'user_theme',
  LOCALE: 'user_locale',
  
  // Application settings
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  LAST_VISITED_ROUTE: 'last_visited_route',
  
  // Feature toggles and UI state
  SHOW_ONBOARDING: 'show_onboarding',
  NOTIFICATION_SETTINGS: 'notification_settings',
} as const;

export type StorageKey = keyof typeof STORAGE_KEYS;
export type StorageValue = typeof STORAGE_KEYS[StorageKey]; 