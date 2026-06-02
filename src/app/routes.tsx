import type { RoutePath } from '../types/content';

export const ROUTE_REGISTRY = {
  HOME: '/',
  JOURNEY: '/journey',
  LIBRARY: '/library',
  CREATION: '/journey/creation',
  PROBLEM: '/journey/problem',
  BRIDGE: '/journey/bridge',
  SALVATION_ASSURANCE: '/journey/salvation-assurance',
  QUIET_TIME: '/journey/quiet-time',
} as const satisfies Record<string, RoutePath>;

export type RouteRegistryKey = keyof typeof ROUTE_REGISTRY;
export type AppRoutePath = (typeof ROUTE_REGISTRY)[RouteRegistryKey];
