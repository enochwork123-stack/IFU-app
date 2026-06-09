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

## Contributor Workflow (AI-assisted)

This project uses a GitHub Project board to track features and coordinate contributors. Follow this workflow when picking up and implementing a feature.

**Project board:** https://github.com/orgs/IFU-Web-App/projects/1

### Prerequisites (one-time setup)
- Install the GitHub CLI: https://cli.github.com
- Authenticate: `gh auth login`
- Clone the repo and set the upstream remote if working from a fork

### Step 1 — See what needs to be done
When the user asks what to work on, run:
```
gh issue list --repo enochwork123-stack/IFU-app --state open
```
Present the list clearly and ask the user to pick an issue number.

### Step 2 — Assign and branch
Once an issue is chosen (e.g. issue #2):
1. Assign it to the user so teammates know it is taken:
   `gh issue edit 2 --repo enochwork123-stack/IFU-app --add-assignee @me`
2. Pull the latest main to avoid conflicts:
   `git pull origin main`
3. Create a branch named after the issue number:
   `git checkout -b 2-daily-quiet-time`
   (format: `<issue-number>-<short-kebab-slug>`)

### Step 3 — Implement
Work on the feature. Reference the issue number in commit messages so commits appear in the issue timeline:
```
git commit -m "Add scripture display component #2"
```

### Step 4 — Open a Pull Request
When the feature is ready, open a PR targeting `main`:
```
gh pr create --repo enochwork123-stack/IFU-app --base main --title "<short title>" --body "Closes #2"
```
The `Closes #<number>` phrase is important — it automatically closes the issue and marks the project card as Done when the PR is merged.

### Step 5 — Wait for review
A maintainer will review and merge the PR. Do not merge your own PR without a second pair of eyes unless explicitly agreed.

### Key rules
- One issue → one branch → one PR. Do not combine multiple features in one branch.
- Always branch from the latest `main`, not from another feature branch.
- Never push directly to `main`.
