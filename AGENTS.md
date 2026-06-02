# Repository Guidance

This repository is a React-based web application built with Vite, React Router, and Tailwind CSS. Treat it as an interactive product codebase, not a static prototype dump.

## Coding Principles

- Use modern React component architecture: small focused components, declarative data flow, route-level screens, and shared UI primitives where reuse is real.
- Prefer explicit TypeScript types for props, route data, content models, handlers, and reusable utilities. New application code should be TypeScript-first.
- Keep modules crisp: separate screen composition, reusable components, data/content definitions, styling concerns, and framework entry points.
- Avoid broad refactors unless they directly serve the requested change. Preserve existing behavior while improving local structure.
- Use Tailwind CSS cleanly: readable class groupings, theme tokens where possible, and no one-off style sprawl when a component or token would clarify intent.
- Maintain accessible UI defaults: semantic elements, visible focus states, clear labels for controls, and responsive layouts that work from mobile upward.
- Keep source files purposeful. If a component grows multiple responsibilities, split it before it becomes difficult to reason about.

## Current Baseline

- App stack: Vite, React 19, React Router 7, Tailwind CSS 4.
- Current source uses JSX under `src/`; future feature work should move toward explicit TypeScript without mixing styles unnecessarily.
- Existing prototype/reference folders live at the repository root. Treat them as references unless a task explicitly promotes them into the application.

## Working Agreement

- Read nearby code before editing.
- Update `plans.md` when architectural decisions, surprises, or implementation sequencing changes.
- Do not write new application source code before the current technical design direction has been reviewed.
