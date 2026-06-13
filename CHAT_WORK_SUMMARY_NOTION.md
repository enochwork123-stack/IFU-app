# IFU App Development Work Summary

Date: 6 June 2026

## Overview

In this working session, I expanded the IFU discipleship app by importing multiple Notion-exported lesson materials into the React application and improving the development workflow for future imports.

The work focused on making Notion Markdown content easier, faster, and more accurate to transform into production-ready lesson pages while preserving the app's existing design system, routing structure, and mobile-first learning experience.

## Main Outcomes

- Added a project-specific Notion Markdown transformation workflow using `SKILL.md`.
- Imported new discipleship lessons under `門徒之路`.
- Added extension-learning pages for each imported lesson.
- Added a shared Markdown article renderer for long-form Notion content.
- Added a global web/mobile UI layout toggle.
- Verified the app with build and TypeScript checks.
- Pushed the completed updates to GitHub.

## Lessons Imported

The following Notion Markdown exports were incorporated into the app:

- Step 4: `赦罪的確據`
- Step 5: `得勝的確據`
- Step 6: `聖經的權威`
- Step 7: `持守神的話`
- Step 8: `有效的祈禱`
- Step 9: `團契互助`

Each lesson was added as a guided page under `門徒之路`, with scripture reveal sections, reflection prompts, saved answer areas, and navigation links to related extension-learning pages.

## Extension Learning Pages Added

For each imported lesson, two extension-learning routes were created from the corresponding Notion Markdown files.

Examples include:

- `赦罪的確據`
  - `認罪與赦罪`
  - `罪怎能得赦免`
- `得勝的確據`
  - `在試探中成長`
  - `戰勝試探`
- `聖經的權威`
  - `聖經是否神的話`
  - `聖經文獻可靠嗎`
- `持守神的話`
  - `聖經手`
  - `掌握神的話`
- `有效的祈禱`
  - `神悅納的禱告`
  - `成為神的摯友`
- `團契互助`
  - `不要獨行`
  - `教會家庭`

## Using `SKILL.md` to Improve Workflow

A key improvement was creating and using a project-local Codex skill:

```text
.codex/skills/notion-markdown-transform/SKILL.md
```

This `SKILL.md` file defines a reusable workflow for transforming raw Notion Markdown exports into the IFU app's expected structure.

It improved accuracy and efficiency by requiring each import to:

- Inspect the existing app structure before writing new content.
- Reuse established routes, components, and design patterns.
- Map Notion headings, tables, lists, callouts, and article content into app-friendly UI.
- Avoid one-off styling and unnecessary layout refactors.
- Preserve Chinese lesson wording while removing Notion-specific export artifacts.
- Keep the content aligned with the app's Tailwind CSS 4 design tokens.

This made the import process more consistent and reduced the chance of accidentally creating pages that looked or behaved differently from the rest of the app.

## Automation Helper Script

Alongside `SKILL.md`, a lightweight cleanup script was added:

```text
.codex/skills/notion-markdown-transform/scripts/prepare-notion-markdown.mjs
```

The script prepares raw Notion Markdown before it is converted into app pages. It helps by:

- Stripping predictable Notion metadata.
- Cleaning empty callout wrappers.
- Normalizing Markdown structure.
- Producing cleaner intermediate content for review.

This reduced manual cleanup time and made the transformation process more repeatable.

## Shared Markdown Renderer

A shared renderer was added for long-form extension content:

```text
src/components/content/NotionMarkdownArticle.jsx
```

This component renders cleaned Markdown into the app's visual language using existing Tailwind tokens and semantic HTML patterns.

It allows long extension articles to be imported without manually rebuilding every paragraph, heading, quote, list, or table as bespoke JSX.

## Web/Mobile UI Toggle

A global visual layout toggle was added to the app shell:

```text
src/components/layout/ShellFrame.tsx
```

The toggle lets the user switch between:

- Mobile device-style layout
- Full desktop web layout

The setting is stored in localStorage using:

```text
ifu-ui-mode
```

This makes it easier to preview and test the app in both mobile and desktop constraints without changing code or resizing the browser manually. It also supports the app's development direction as both a mobile-first learning tool and a responsive web app.

## Routing and Navigation Updates

The app route registry and router were expanded so the new lessons and extension pages are reachable through React Router.

The `門徒之路` journey list was also updated so imported lessons are marked as available instead of locked.

Lesson pager navigation was connected sequentially, allowing learners to move through the path from one step to the next.

## Assets Added

Supporting assets were imported into the project for relevant lessons, including:

- Bible inspiration diagram for `聖經的權威`
- Bible-hand image for `持守神的話`
- PDF reference material for `聖經的權威`

## Verification

The app was checked with:

```bash
npm run build
npx tsc --noEmit
```

Both checks passed after the updates.

The app still reports a Vite bundle-size warning because the imported Markdown content is bundled into the main JavaScript chunk. This is not a build failure, but it is a useful future optimization target.

## GitHub Push

The updates were committed and pushed to:

```text
https://github.com/enochwork123-stack/IFU-app
```

Commit:

```text
b1223a2 Add Notion lesson imports and shell layout toggle
```

## Key Reflection

The most important workflow improvement was not only importing more content, but creating a repeatable transformation system through `SKILL.md`.

This shifted the process from manual page-by-page conversion toward a more reliable agentic workflow:

- Raw Notion exports are cleaned first.
- The app's existing structure is used as the source of truth.
- The generated pages follow established UI and routing patterns.
- Future lesson imports should be faster, more consistent, and less error-prone.

