export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CREATE_SCHEDULE: '/create-schedule',
  SCHEDULE: '/schedule/:id',
  SCHEDULE_SHARE: '/schedule/:id/share',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  AVAILABILITY: '/availability',
  BOOKING: '/book/:slug',
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type RouteValues = typeof ROUTES[RouteKeys]; 