import type { RoutePath } from '../types/content';

export const ROUTE_REGISTRY = {
  HOME: '/',
  JOURNEY: '/journey',
  LIBRARY: '/library',
  CREATION: '/journey/creation',
  PROBLEM: '/journey/problem',
  BRIDGE: '/journey/bridge',
  SALVATION_ASSURANCE: '/journey/salvation-assurance',
  SALVATION_ASSURANCE_ARE_YOU_SAVED:
    '/journey/salvation-assurance/are-you-saved',
  SALVATION_ASSURANCE_FAITH_VS_SUPERSTITION:
    '/journey/salvation-assurance/faith-vs-superstition',
  QUIET_TIME: '/journey/quiet-time',
  QUIET_TIME_SEVEN_MINUTES_WITH_GOD:
    '/journey/quiet-time/seven-minutes-with-god',
  QUIET_TIME_NEW_TO_YOU: '/journey/quiet-time/new-to-you',
  PRAYER_ASSURANCE: '/journey/prayer-assurance',
  PRAYER_ASSURANCE_POUR_OUT_YOUR_HEART:
    '/journey/prayer-assurance/pour-out-your-heart',
  PRAYER_ASSURANCE_HOW_DO_WE_PRAY:
    '/journey/prayer-assurance/how-do-we-pray',
} as const satisfies Record<string, RoutePath>;

export type RouteRegistryKey = keyof typeof ROUTE_REGISTRY;
export type AppRoutePath = (typeof ROUTE_REGISTRY)[RouteRegistryKey];
