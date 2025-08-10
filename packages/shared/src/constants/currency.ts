export const CURRENCIES = [
  { value: 'MYR', label: 'MYR (RM)' },
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'JPY', label: 'JPY (¥)' },
  { value: 'CAD', label: 'CAD (C$)' },
  { value: 'AUD', label: 'AUD (A$)' },
  { value: 'SGD', label: 'SGD (S$)' },
  { value: 'CNY', label: 'CNY (¥)' },
  { value: 'INR', label: 'INR (₹)' },
] as const;

export type CurrencyCode = typeof CURRENCIES[number]['value'];