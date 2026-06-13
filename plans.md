# IFU Engineering Specification

This is the living project-local plan for the IFU React application. It tracks discoveries, architectural decisions, and the checkable implementation sequence. Application source code should not be written until this plan is reviewed.

## Current Status

- [x] Reviewed repository layout and baseline tooling.
- [x] Reviewed nearby React files under `src/`.
- [x] Reviewed baseline reference layouts in root prototype folders.
- [x] Added root-level engineering guidance in `AGENTS.md`.
- [x] Added project-scoped Codex configuration under `.codex/config.toml`.
- [x] Initialized this markdown specification.
- [x] Review gate passed for the typed app-shell direction.
- [x] Added TypeScript compiler setup and Vite environment typing.
- [x] Converted static app content into `src/data/appContent.ts` with explicit domain models.
- [x] Added typed content models in `src/types/content.ts`.
- [x] Added typed route registry in `src/app/routes.tsx`.
- [x] Replaced the entry route engine with `src/app/AppRouter.tsx`.
- [x] Added persistent typed shell chrome through `ShellFrame`, `AppTabs`, and `BottomNav`.
- [x] Added typed journey dashboard composition through `JourneyScreen` and `JourneyStepCard`.
- [x] Kept legacy JSX lesson screens running through `allowJs: true` while new work moves TypeScript-first.
- [x] Hooked discovered extension lesson routes into the typed router.
- [x] Refined shell layout so app tabs and bottom navigation are fixed frame chrome while the route viewport scrolls.
- [x] Moved top-level section navigation into bottom chrome and restored `首頁` to the home route.
- [x] Generated project-owned lesson imagery for creation cards and the bridge hero.
- [x] Refined the bridge lesson hero so scripture appears as a separate full-text Chinese section below the image.
- [x] Added Step 3 `禱告的確據 / Assurance of Prayer` with matching Step 1/2 layout patterns and extension routes.
- [x] Added a project-local Notion Markdown transformation skill with a cleanup helper and mimic-engine guardrails.
- [x] Imported Step 4 `赦罪的確據 / Assurance of Forgiveness` from Notion Markdown with two extension routes.
- [x] Imported Step 5 `得勝的確據 / Assurance of Victory` from Notion Markdown with two extension routes.
- [x] Imported Step 6 `聖經的權威 / Authority of the Bible` from Notion Markdown with two extension routes and supporting image/PDF assets.
- [x] Imported Step 7 `持守神的話 / Intake of the Bible` from Notion Markdown with two extension routes and the Bible-hand image asset.
- [x] Imported Step 8 `有效的祈禱 / Effective Prayer` from Notion Markdown with two extension routes.
- [x] Imported Step 9 `團契互助 / Fellowship` from Notion Markdown with two extension routes.
- [x] Split the gospel bridge flow into separate `神的拯救` and `人的回應` pages using the extended bridge annex as the content reference.
- [x] Implemented Step 10 `見證主 / Witnessing` screen in TypeScript with personal testimony worksheets.
- [x] Implemented Step 11 `人生目的 / Life Goal` screen in TypeScript with guided reflection questions.
- [x] Implemented Step 12 `屬靈生命的成長 / Spiritual Growth` screen in TypeScript, featuring an interactive SVG Life Wheel component.
- [x] Locked the master shell to `h-screen` and made the route viewport the only vertical scroller so bottom navigation remains visible across desktop/mobile layout modes.
- [x] Reoriented the layout target toward a desktop-first web shell while preserving the mobile device-frame mode.
- [x] Added desktop-only content canvas and image-ratio handling so web view photos render consistently without changing mobile layout behavior.
- [x] Planned project-owned SVG replacements for the gospel separation, bridge, and out-of-death-into-life visuals so Chinese labels stay exact and image placement is deterministic.
- [x] Planned route-level scroll reset against the single route viewport so pager navigation opens each lesson at the top.
- [ ] Continue Lesson Engine phase: gradually render typed `StudyModule` content instead of duplicating lesson markup in legacy JSX.

## Baseline Snapshot

- Framework: Vite-powered React application.
- Runtime UI libraries: React 19, React DOM 19, React Router 7.
- Styling: Tailwind CSS 4 through the Vite plugin, with theme tokens currently in `src/index.css`.
- Current source language: JavaScript/JSX.
- Current app shape:
  - `src/main.jsx` mounts the app.
  - `src/App.jsx` owns route declarations.
  - `src/components/` contains shell, navigation, icon, pager, header, section title, and scripture card components.
  - `src/screens/` contains route-level lesson and app screens.
  - `src/data/appContent.js` contains untyped content arrays and objects.
- Reference material:
  - `lumina_path/DESIGN.md` defines the reverent editorial visual language and lesson interaction patterns.
  - `standardized_nav/code.html` shows the app-level navigation shell and home card stack.
  - `dashboard_standardized_nav/code.html` shows the vertical discipleship path with active/open/locked states.
  - `illustrative_update/code.html`, `updated_separation_image/code.html`, and `3d_step_of_faith_enhanced/code.html` show interactive lesson visuals for creation, separation, and step-of-faith layouts.

## Architectural Direction

The application should move toward a typed, route-led React architecture:

```text
main.tsx
└── App
    └── AppRouter
        └── AppShell
            ├── ShellFrame
            ├── RouteViewport
            │   └── Screen components
            └── BottomNav
```

Target source organization:

```text
src/
├── app/
│   ├── App.tsx
│   ├── AppRouter.tsx
│   └── routes.tsx
├── components/
│   ├── layout/
│   ├── content/
│   └── primitives/
├── data/
├── screens/
├── styles/
└── types/
```

Ownership boundaries:

- `app/` owns framework wiring, routes, providers, and route metadata.
- `components/layout/` owns persistent chrome: shell, page header, bottom navigation, and viewport frame.
- `components/content/` owns lesson blocks: scripture panels, reflection cards, progress path cards, extension cards, and guided-study modules.
- `components/primitives/` owns small generic pieces such as icons, buttons, badges, and disclosure controls.
- `data/` owns structured content only.
- `types/` owns reusable domain models.
- `screens/` owns route-level composition and learner workflow sequencing.

## Type-Safe Data Model Plan

Goal: replace implicit content shapes with explicit TypeScript models before expanding interaction behavior.

- [ ] Inventory all exported content in `src/data/appContent.js`.
- [ ] Identify every consumer of `homeCards`, `discipleshipSteps`, `creationCards`, `faithDefinitions`, `assuranceGospelSections`, and `quietTimeStudyItems`.
- [ ] Define stable ID conventions for content entities.
- [ ] Define `RoutePath` as a constrained string type or route metadata lookup.
- [ ] Define `IconName` around the current Material Symbols usage.
- [ ] Define `AccentTone` for card and CTA variants.
- [ ] Define `JourneyStatus` as `active | available | locked | complete`.
- [ ] Define `HomeCard` with title, description, icon, route, and accent.
- [ ] Define `JourneyStep` with id, title, subtitle, description, icon, status, route, order, and optional prerequisite IDs.
- [ ] Define `ScriptureReference` with book, reference, optional chinese text, optional english text, and source/version metadata when available.
- [ ] Define `TruthPoint` or `LessonPoint` for reusable lesson statements.
- [ ] Define `GospelSection` with id, title, icon, scriptures, truths, note, and display order.
- [ ] Define `ReflectionPrompt` with id, prompt text, optional scripture references, local storage key, and response mode.
- [ ] Define `StudyModule` as a discriminated union for scripture reveal, reflection prompt, summary card, appendix, extension card, and interactive illustration.
- [ ] Define `LessonRoute` with id, parent journey step, route, title, subtitle, modules, previous route, and next route.
- [ ] Define extension lesson metadata separately from core lesson metadata.
- [ ] Convert content file naming from `appContent.js` to `appContent.ts` only after the types are approved.
- [ ] Use `satisfies` checks for content arrays so literal values stay narrow.
- [ ] Add compile-time checks for missing route paths, duplicate IDs, and invalid status values.
- [ ] Keep all learner-entered saved-answer data outside static content definitions.

## Interactive Step-by-Step Layout View Plan

Goal: build a type-driven guided layout for the discipleship journey and lesson steps, preserving the reference feel while prioritizing the desktop web experience and keeping the mobile device-frame experience compatible.

- [x] Confirm the primary layout target: desktop-first web shell with mobile compatibility.
- [x] Preserve the current narrow app-frame metaphor only inside explicit mobile layout mode.
- [ ] Continue evolving desktop screens toward wider, scan-friendly reading and study layouts without breaking mobile lesson flows.
- [ ] Model the journey overview as a vertical path of typed `JourneyStep` entities.
- [ ] Render each step through a reusable `JourneyStepCard`.
- [ ] Represent active steps with ochre emphasis, filled icon, elevated surface, and clear action.
- [ ] Represent available steps with primary emphasis and route access.
- [ ] Represent locked steps with muted surface, lock icon, and no route action.
- [ ] Represent completed steps with a future-safe status distinct from active/open.
- [ ] Derive card labels from status instead of hard-coded conditionals inside the screen.
- [ ] Derive route links from typed route metadata.
- [ ] Preserve dotted or path-line continuity between journey cards.
- [ ] Add a typed progress summary model before changing the visual progress block.
- [ ] Avoid introducing visual dividers where spacing or tonal surfaces can do the work.
- [ ] Keep bottom navigation and top page header consistent with existing reference layouts.
- [ ] Ensure the step card hit target is clear and accessible.
- [ ] Define empty, locked, and unavailable states before adding more lessons.
- [ ] Verify that Chinese and English labels fit in the card at mobile width.

## Guided Lesson Interaction Plan

The lesson screens should become step-by-step guided experiences instead of loose page markup.

- [ ] Model scripture reveal panels as typed modules.
- [ ] Model saved answer blocks with stable storage keys.
- [ ] Keep localStorage persistence behind a reusable typed hook after review.
- [ ] Preserve click-to-expand scripture panels.
- [ ] Preserve textarea response blocks under every reflection prompt.
- [ ] Preserve expandable appendices for short reference material.
- [ ] Preserve modal-style expansion for long review material.
- [ ] Keep extension lessons as route cards rather than embedding long articles in core lessons.
- [ ] Support interactive visual modules for creation, separation, and step-of-faith scenes.
- [ ] Ensure interactive modules degrade gracefully if animation or 3D effects are reduced.

## Notion Markdown Transformation Plan

Goal: turn raw Notion Markdown exports into IFU-shaped content without introducing one-off styling or bypassing the typed Lesson Engine direction.

- [x] Define a project-local Codex skill at `.codex/skills/notion-markdown-transform/SKILL.md`.
- [x] Add a dependency-free preparation script that strips predictable Notion artifacts and emits a typed intermediate document.
- [x] Require every transformation pass to inspect `src/index.css`, `src/types/content.ts`, nearby `src/data` content, and reusable components before writing app source.
- [x] Document mappings from Notion headings, paragraphs, lists, blockquotes, tables, checkboxes, and callouts into existing IFU content models and semantic UI primitives.
- [x] Use the skill on the next real Notion export and record any missing content-model cases here.
- [ ] Promote repeated mapping patterns into reusable `StudyModule` renderers instead of duplicating route-level JSX.

## Visual Standards From References

- [ ] Use the existing moss, ochre, warm surface, and tonal surface tokens.
- [ ] Preserve Noto Serif TC for headings and Manrope for body/labels.
- [ ] Use glass navigation surfaces where appropriate.
- [ ] Prefer tonal shifts and whitespace over divider-heavy layouts.
- [ ] Use rounded, soft surfaces consistent with the current product language.
- [ ] Keep CTAs visually distinct with secondary/ochre emphasis.
- [ ] Avoid importing prototype HTML directly into React.
- [ ] Translate reference layouts into reusable components and typed data.

## Implementation Sequence After Review

- [x] Add TypeScript compiler configuration and dependency updates if missing.
- [x] Add `src/types/content.ts` with approved domain types.
- [x] Convert static content into typed content modules.
- [x] Move route metadata into a typed route registry.
- [ ] Convert low-risk primitives first.
- [x] Convert layout components next.
- [x] Convert journey overview and step cards.
- [x] Hook existing legacy extension routes through the typed route registry.
- [x] Refine shell chrome so only route content scrolls.
- [ ] Convert core lesson screens module-by-module.
- [ ] Add focused tests or compile checks for content validity.
- [ ] Run build verification.
- [ ] Update this plan with any deviations.

## Discoveries And Surprises

- The repository already uses modern React, Vite, React Router, and Tailwind, but the source is still JSX.
- `src/data/appContent.js` is the main pressure point for type safety because it contains multiple implicit content shapes.
- The journey overview already implements active and available states, but locked is currently inferred from missing status/route.
- Reference folders are valuable for layout direction but are standalone HTML prototypes, not production source.
- `BUILD_PROCESS.md` is currently untracked and was not touched.
- The committed app entry now bypasses legacy `src/App.jsx` and mounts `src/app/AppRouter.tsx` directly from `src/main.tsx`.
- Legacy extension screens for salvation assurance and quiet time already exist and can be reached safely through the new typed router.
- The previous shell had nested scroll behavior; the current layout makes tabs and bottom navigation fixed frame chrome with a single route viewport scroller.
- The top tabs competed with the bottom app navigation, so the primary app sections now live together in `BottomNav`.
- Generated bitmap lesson assets live under `public/assets` and should be referenced from project paths, not Codex's generated image cache.
- The bridge hero reads better when the image carries only short concept labels while full Bible verses are rendered as separate content below.
- Step 3 currently follows the legacy JSX lesson-screen pattern to remain visually consistent with Steps 1 and 2 while the typed Lesson Engine is still pending.
- Notion imports should now start with `.codex/skills/notion-markdown-transform/scripts/prepare-notion-markdown.mjs`, then use the skill's mimic-engine prompt to map cleaned content into typed IFU structures.
- The first real Notion import exposed repeated lesson helpers (`SavedAnswer`, scripture toggles, question cards, extension article sections) that should be promoted before adding many more lessons.
- Step 4 is implemented as a legacy JSX route to match Steps 1-3 while preserving the planned typed `StudyModule` migration.
- Step 5 also follows the legacy JSX route pattern, while extension article Markdown now renders through a shared `NotionMarkdownArticle` component to reduce repeated import plumbing.
- The supplied Step 5 extension B Markdown appears to contain the Step 4-style redemption article and reflection prompts despite being titled `戰勝試探`; it was imported as provided.
- Step 6 includes a project-owned image asset under `public/assets/study-6-bible-inspiration.jpg` and a PDF reference under `public/assets/bible-inspired-reference.pdf`.
- Step 7 includes the project-owned Bible-hand asset under `public/assets/bible-hand.png`; the supplied extension A and B Markdown exports both carry substantially the same Navigators Word Hand article under different extension titles.
- Step 8 follows the same legacy JSX route composition while preserving the raw extension exports through `NotionMarkdownArticle`; repeated helpers should be promoted before the next batch of lesson imports.
- Step 9 continues the same route composition, with the main lesson rendered as guided scripture/reflection blocks and extension exports preserved through `NotionMarkdownArticle`.
- The bridge annex separates `(3) 神的拯救` from `(4) 人的回應`; `/journey/bridge` now carries the God-salvation bridge content, while `/journey/response` carries faith, acceptance, assurance, and the decision prayer.
- Steps 10, 11, and 12 were implemented as TypeScript screens. They do not have extension sub-pages, but are complete with all lesson questions.
- Step 12 features a fully interactive SVG Wheel Diagram for the Navigators Life Wheel illustration, displaying description cards and scripture references reactively when parts of the wheel are tapped.
- Standardized all step headers (Steps 2–12) to match Step 1's dark green theme and added detailed introductory paragraphs, resolving layout inconsistencies across the main screens.
- Desktop mode now uses a centered web content canvas and desktop-only image sizing rules; mobile mode keeps the original 390px device-emulation frame and route behavior.
- Public lesson assets should be referenced through `assetPath()` so images and PDFs resolve in both root-hosted and `/IFU-app`-prefixed deployments.
- Text-heavy gospel diagrams should be maintained as project-owned SVG assets instead of generated bitmap screenshots, because SVG preserves exact Chinese labels, responsive scaling, and single-image composition.
- React Router navigation preserves scroll state in the app's custom route viewport unless explicitly reset; page-to-page lesson navigation should scroll that viewport to top on pathname changes.

## Legacy Screen File Log

- Home / introduction landing page: `src/screens/HomeScreen.jsx`
  - Export format: named export `HomeScreen`.
  - Imports: `Link` from `react-router-dom`, `homeCards` from `src/data/appContent`, and `Icon` from `src/components/Icon.jsx`.
  - Route intent: original root/introduction screen with `認識福音`, `初信栽培`, and `查經學習` cards.
- Gospel creation lesson: `src/screens/CreationScreen.jsx`
  - Export format: named export `CreationScreen`.
  - Imports: `useState`, `Link`, `Icon`, `JourneyPager`, `PageHeader`, `ScriptureCard`, and `creationCards`.
  - Route intent: `/journey/creation`; includes scripture card, modal quote behavior, creation relationship visual, and pager to `/journey/problem`.
- Human problem lesson: `src/screens/ProblemScreen.jsx`
  - Export format: named export `ProblemScreen`.
  - Imports: `Link`, `Icon`, `JourneyPager`, `PageHeader`, and `ScriptureCard`.
  - Route intent: `/journey/problem`; includes separation/chasm visual, dark consequence sections, and pager links to creation/bridge.
- Bridge / response lessons: `src/screens/BridgeScreen.jsx`
  - Export format: named exports `BridgeScreen` and `HumanResponseScreen`.
  - Imports: `Icon`, `JourneyPager`, `PageHeader`, `ScriptureCard`, and `useAppContent`.
  - Route intent: `/journey/bridge` carries `神的拯救`; `/journey/response` carries `人的回應`, faith definitions, assurance, and the decision prayer.
- Shared legacy components required by those screens:
  - `src/components/Icon.jsx`: named export `Icon`.
  - `src/components/PageHeader.jsx`: named export `PageHeader`.
  - `src/components/JourneyPager.jsx`: named export `JourneyPager`.
  - `src/components/ScriptureCard.jsx`: named export `ScriptureCard`.
- Integration note: these are JSX named exports and can be imported into `src/app/AppRouter.tsx` directly while `allowJs` remains enabled. They already expect a React Router context and should run inside the new `ShellFrame`/`Outlet` layout without their old `AppShell`.

## Review Gate

The typed app-shell direction has been reviewed and implemented. Future architectural changes should still be recorded here before expanding the Lesson Engine.
