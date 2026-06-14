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

### On session start — always do this first
At the beginning of every session, before anything else, ask the user:

> "Would you like to see the open issues on this project so you can pick a feature to work on?"

If they say yes (or anything affirmative), run:
```
gh issue list --repo enochwork123-stack/IFU-app --state open
```
Display the results clearly — issue number, title — and ask them to pick one.

If they say no, proceed normally with whatever they ask for. But if at any point they seem unsure what to work on, proactively offer the issue list again.

### Prerequisites (one-time setup)
- Install the GitHub CLI: https://cli.github.com
- Authenticate: `gh auth login`
- Clone the repo and set the upstream remote if working from a fork

### Step 1 — Pick an issue
Run `gh issue list --repo enochwork123-stack/IFU-app --state open` and present the open issues. Ask the user which one they want to implement.

### Step 2 — Assign and branch
Once an issue is chosen (e.g. issue #7):
1. Pull the latest main from the remote GitHub repository first to avoid conflicts and ensure local is up-to-date:
   `git pull origin main`
2. Assign the issue to the user so teammates know it is taken:
   `gh issue edit 7 --repo enochwork123-stack/IFU-app --add-assignee @me`
3. Check if a linked branch already exists for the issue:
   `gh issue develop --list 7`
   - **If no branch exists** — create, link to the issue, and check it out in one command:
     `gh issue develop 7 --checkout`
     GitHub auto-names it `<number>-<issue-title-slug>` (e.g. `7-user-authentication-profiles`).
   - **If a branch was created manually before this workflow** — just check it out:
     `git checkout <existing-branch-name>`

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
- Always pull from the remote GitHub repository (e.g. `git pull origin main`) first before creating or checking out a new branch for the chosen GitHub issue.
- One issue → one branch → one PR. Do not combine multiple features in one branch.
- Always branch from the latest `main`, not from another feature branch.
- Never push directly to `main`.
- Never commit and push to main without being explicitly told to do so.
