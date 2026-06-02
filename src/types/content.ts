export const journeyStatuses = [
  'active',
  'available',
  'locked',
  'complete',
] as const satisfies readonly string[];

export const accentTones = [
  'primary',
  'secondary',
  'surface',
  'tertiary',
  'danger',
] as const satisfies readonly string[];

export const visualTones = [
  'reverent',
  'quiet-authority',
  'creation',
  'separation',
  'salvation',
  'reflection',
  'warning',
  'celebration',
] as const satisfies readonly string[];

export const surfaceTreatments = [
  'page',
  'inset',
  'glass',
  'tonal',
  'elevated',
  'immersive',
] as const satisfies readonly string[];

export const studyModuleKinds = [
  'scripture-reveal',
  'reflection-prompt',
  'summary-card',
  'appendix',
  'extension-card',
  'interactive-visual',
  'content-section',
  'prayer',
] as const satisfies readonly string[];

export const interactiveVisualKinds = [
  'creation-relationship',
  'separation-chasm',
  'faith-bridge',
  'progress-path',
  'custom',
] as const satisfies readonly string[];

export type JourneyStatus = (typeof journeyStatuses)[number];
export type AccentTone = (typeof accentTones)[number];
export type VisualTone = (typeof visualTones)[number];
export type SurfaceTreatment = (typeof surfaceTreatments)[number];
export type StudyModuleKind = (typeof studyModuleKinds)[number];
export type InteractiveVisualKind = (typeof interactiveVisualKinds)[number];

export type ContentId = string;
export type RoutePath = `/${string}`;
export type LocalStorageKey = `ifu:${string}` | string;
export type IconName = string;

export interface ReverentVisualLanguage {
  tone?: VisualTone;
  accent?: AccentTone;
  surface?: SurfaceTreatment;
  icon?: IconName;
  eyebrow?: string;
  imageStyle?: string;
  prefersGlass?: boolean;
  prefersTonalSeparation?: boolean;
  allowAmbientMotion?: boolean;
}

export interface ScriptureReference {
  id?: ContentId;
  book?: string;
  reference: string;
  verse?: string;
  chinese?: string;
  english?: string;
  translation?: string;
  source?: string;
}

export interface JourneyStep {
  id: ContentId;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  icon: IconName;
  status: JourneyStatus;
  route?: RoutePath;
  prerequisiteIds?: readonly ContentId[];
  visual?: ReverentVisualLanguage;
}

export interface HomeCard {
  id: ContentId;
  title: string;
  description: string;
  icon: IconName;
  route: RoutePath;
  accent: AccentTone;
  visual?: ReverentVisualLanguage;
}

export interface LessonPoint {
  id?: ContentId;
  text: string;
  scriptureIds?: readonly ContentId[];
}

export interface GospelSection {
  id: ContentId;
  order: number;
  title: string;
  icon: IconName;
  scriptures: readonly ScriptureReference[];
  truths: readonly (LessonPoint | string)[];
  note?: string;
  visual?: ReverentVisualLanguage;
}

export interface StudyModuleBase {
  id: ContentId;
  kind: StudyModuleKind;
  title?: string;
  eyebrow?: string;
  visual?: ReverentVisualLanguage;
}

export interface ScriptureRevealModule extends StudyModuleBase {
  kind: 'scripture-reveal';
  scriptures: readonly ScriptureReference[];
  defaultOpen?: boolean;
  allowMultipleOpen?: boolean;
}

export interface ReflectionPromptModule extends StudyModuleBase {
  kind: 'reflection-prompt';
  prompt: string;
  number?: string;
  scriptures?: readonly ScriptureReference[];
  storageKey: LocalStorageKey;
  responseMode?: 'textarea' | 'short-text' | 'checklist';
  placeholder?: string;
}

export interface SummaryCardModule extends StudyModuleBase {
  kind: 'summary-card';
  body: string;
  points?: readonly (LessonPoint | string)[];
  cta?: ModuleCallToAction;
}

export interface AppendixModule extends StudyModuleBase {
  kind: 'appendix';
  display: 'inline' | 'modal';
  body?: string;
  sections?: readonly AppendixSection[];
}

export interface ExtensionCardModule extends StudyModuleBase {
  kind: 'extension-card';
  route: RoutePath;
  description: string;
  source?: string;
  ctaLabel?: string;
}

export interface InteractiveVisualModule extends StudyModuleBase {
  kind: 'interactive-visual';
  visualKind: InteractiveVisualKind;
  description?: string;
  labels?: readonly InteractiveLabel[];
  reducedMotionFallback?: string;
}

export interface ContentSectionModule extends StudyModuleBase {
  kind: 'content-section';
  body?: string;
  scriptures?: readonly ScriptureReference[];
  points?: readonly (LessonPoint | string)[];
  note?: string;
}

export interface PrayerModule extends StudyModuleBase {
  kind: 'prayer';
  body: string;
  prompts?: readonly string[];
  storageKey?: LocalStorageKey;
}

export type StudyModule =
  | ScriptureRevealModule
  | ReflectionPromptModule
  | SummaryCardModule
  | AppendixModule
  | ExtensionCardModule
  | InteractiveVisualModule
  | ContentSectionModule
  | PrayerModule;

export interface AppendixSection {
  id: ContentId;
  title: string;
  body?: string;
  rows?: readonly AppendixTableRow[];
}

export interface AppendixTableRow {
  id?: ContentId;
  cells: readonly string[];
}

export interface InteractiveLabel {
  id?: ContentId;
  label: string;
  description?: string;
  position?: 'left' | 'right' | 'top' | 'bottom' | 'center';
}

export interface ModuleCallToAction {
  label: string;
  route?: RoutePath;
  action?: 'expand' | 'continue' | 'save' | 'reflect';
  tone?: AccentTone;
}

export interface LessonRoute {
  id: ContentId;
  journeyStepId: ContentId;
  route: RoutePath;
  title: string;
  subtitle?: string;
  modules: readonly StudyModule[];
  previousRoute?: RoutePath;
  nextRoute?: RoutePath;
  visual?: ReverentVisualLanguage;
}

export interface ProgressSummary {
  completed: number;
  total: number;
  label?: string;
  stages?: readonly ProgressStage[];
}

export interface ProgressStage {
  id: ContentId;
  label: string;
  status: JourneyStatus;
}
