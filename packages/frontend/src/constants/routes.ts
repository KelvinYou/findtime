export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  LOGIN: '/login',
  REGISTER: '/register',
  CREATE_SCHEDULE: '/create-schedule',
  SCHEDULE: '/schedule/:id',
  SCHEDULE_SHARE: '/schedule/:id/share',
  DASHBOARD: '/dashboard',
  MY_SCHEDULES: '/my-schedules',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  AVAILABILITY: '/availability',
  BOOKING: '/book/:slug',
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type RouteValues = typeof ROUTES[RouteKeys]; 