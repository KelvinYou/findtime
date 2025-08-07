export const ROUTES = {
  HOME: '/',
  CREATE_SCHEDULE: '/create-schedule',
  SCHEDULE: '/schedule/:id',
  SCHEDULE_SHARE: '/schedule/:id/share',
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type RouteValues = typeof ROUTES[RouteKeys]; 