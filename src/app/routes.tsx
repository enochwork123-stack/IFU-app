import type { RoutePath } from '../types/content';

export const ROUTE_REGISTRY = {
  HOME: '/',
  JOURNEY: '/journey',
  LIBRARY: '/library',
  CREATION: '/journey/creation',
  PROBLEM: '/journey/problem',
  BRIDGE: '/journey/bridge',
  RESPONSE: '/journey/response',
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
  FORGIVENESS_ASSURANCE: '/journey/forgiveness-assurance',
  FORGIVENESS_ASSURANCE_CONFESSION_AND_FORGIVENESS:
    '/journey/forgiveness-assurance/confession-and-forgiveness',
  FORGIVENESS_ASSURANCE_HOW_CAN_SIN_BE_FORGIVEN:
    '/journey/forgiveness-assurance/how-can-sin-be-forgiven',
  VICTORY_ASSURANCE: '/journey/victory-assurance',
  VICTORY_ASSURANCE_GROWING_THROUGH_TEMPTATION:
    '/journey/victory-assurance/growing-through-temptation',
  VICTORY_ASSURANCE_OVERCOMING_TEMPTATION:
    '/journey/victory-assurance/overcoming-temptation',
  BIBLE_AUTHORITY: '/journey/bible-authority',
  BIBLE_AUTHORITY_IS_GODS_WORD:
    '/journey/bible-authority/is-the-bible-gods-word',
  BIBLE_AUTHORITY_TEXT_RELIABLE:
    '/journey/bible-authority/is-the-bible-text-reliable',
  BIBLE_INTAKE: '/journey/bible-intake',
  BIBLE_INTAKE_WORD_HAND: '/journey/bible-intake/word-hand',
  BIBLE_INTAKE_GRASPING_GODS_WORD:
    '/journey/bible-intake/grasping-gods-word',
  EFFECTIVE_PRAYER: '/journey/effective-prayer',
  EFFECTIVE_PRAYER_ACCEPTABLE_PRAYER:
    '/journey/effective-prayer/acceptable-prayer',
  EFFECTIVE_PRAYER_FRIENDSHIP_WITH_GOD:
    '/journey/effective-prayer/friendship-with-god',
  FELLOWSHIP: '/journey/fellowship',
  FELLOWSHIP_DO_NOT_WALK_ALONE: '/journey/fellowship/do-not-walk-alone',
  FELLOWSHIP_CHURCH_FAMILY: '/journey/fellowship/church-family',
  WITNESSING: '/journey/witnessing',
  WITNESSING_PERSONAL_TESTIMONY: '/journey/witnessing/personal-testimony',
  LIFE_GOAL: '/journey/life-goal',
  SPIRITUAL_GROWTH: '/journey/spiritual-growth',
} as const satisfies Record<string, RoutePath>;

export type RouteRegistryKey = keyof typeof ROUTE_REGISTRY;
export type AppRoutePath = (typeof ROUTE_REGISTRY)[RouteRegistryKey];
