---
name: notion-markdown-transform
description: Transform raw Markdown exported from Notion into this IFU React app's typed, token-based content format. Use when importing Notion lesson notes, tables, outlines, scripture blocks, or study material into the Vite React 19 / React Router 7 / Tailwind CSS 4 codebase.
---

# Notion Markdown Transform

Use this skill when a new Notion Markdown export needs to become production-ready IFU website content.

## Required Workflow

1. Read project context before transforming:
   - `AGENTS.md`
   - `plans.md`
   - `src/index.css`
   - `src/types/content.ts`
   - nearby files in `src/data/`, `src/screens/`, and `src/components/content/`
2. Run the cleanup helper:

```bash
node .codex/skills/notion-markdown-transform/scripts/prepare-notion-markdown.mjs path/to/notion-export.md --out /tmp/notion.prepared.ts --clean /tmp/notion.cleaned.md
```

3. Convert the prepared document into the smallest appropriate app surface:
   - Prefer typed content in `src/data/` using `satisfies`.
   - Use route-level screen composition only when interaction or layout sequencing requires it.
   - Reuse established content/layout components before adding new primitives.
4. Update `plans.md` when the import changes sequencing, architecture, routes, or content model assumptions.
5. Verify with `npm run build` after implementation.

## Mimic Engine Prompt

Use this instruction block for the agent pass that turns the prepared output into application code:

```text
You are transforming a cleaned Notion Markdown export into IFU website content.

Before writing application source, inspect the existing IFU app as source of truth:
- Read AGENTS.md and plans.md for project guardrails and current technical direction.
- Read src/index.css and use only Tailwind CSS 4 theme tokens already defined there, such as primary, secondary, surface, surface-container, on-surface, outline, font-headline, and font-body.
- Read src/types/content.ts and prefer existing domain models: StudyModule, ScriptureReference, LessonPoint, AppendixSection, AppendixTableRow, ReverentVisualLanguage, RoutePath, and ContentId.
- Read nearby src/data content and route-level screens that match the target lesson or article.
- Read reusable components under src/components/content, src/components/layout, and current legacy lesson components before creating a new component.

Transformation rules:
- Map Notion headings to semantic route or module hierarchy, not decorative text.
- Map paragraphs to typed body fields or accessible <p> content using existing typography patterns.
- Map bullet and numbered lists to LessonPoint arrays or semantic list markup.
- Map blockquotes containing scripture references to ScriptureReference or existing scripture display components; otherwise map them to note/summary content.
- Map tables to AppendixSection.rows or a reusable semantic table component. Preserve headers and cell order.
- Map checkboxes to typed reflection/checklist data only when they represent learner actions.
- Map callouts to summary-card, content-section note, appendix, or reflection-prompt modules according to intent.
- Preserve Chinese and English text exactly except for Notion export cleanup, whitespace normalization, and obvious metadata removal.

Hard guardrails:
- Do not introduce one-off style sprawl.
- Do not add hard-coded hex colors, arbitrary decorative gradients, or new visual tokens unless the user explicitly approves a design-system change.
- Do not import prototype HTML directly.
- Do not perform broad layout refactors for a content import.
- Do not mix new JSX into TypeScript-first feature work unless the surrounding file is already legacy JSX and the plan allows it.
- Generated output must be modular, accessible, type-safe, and able to fit existing shell/layout components.

Return or implement only the focused content transformation and any minimal supporting types/components required by the import.
```

## Notion Mapping Cheatsheet

- `#` page title: route title or content entity title.
- `##` / `###`: `StudyModule.title`, appendix section title, or screen section heading.
- Paragraphs: `body` strings or semantic paragraph blocks.
- Bullets: `points` arrays, preserving nested text in a single point unless local components support nesting.
- Numbered lists: ordered learner sequence; preserve order explicitly.
- Quotes: scripture or note content.
- Tables: `AppendixTableRow[]` with stable generated IDs.
- Fenced code: preserve only when the lesson genuinely needs code-like text; otherwise flag for manual review.
- Links: keep URL text, but review local Notion asset paths before committing.

## Checklist

- [ ] Confirm the target route/content owner.
- [ ] Run the preparation script and inspect warnings.
- [ ] Compare the cleaned export against nearby IFU content patterns.
- [ ] Choose typed data, route-level TSX, or a small reusable component.
- [ ] Reuse `src/index.css` tokens and existing class patterns.
- [ ] Add explicit TypeScript types or `satisfies` checks.
- [ ] Preserve semantic HTML and accessible control labels.
- [ ] Update `plans.md` if assumptions changed.
- [ ] Run `npm run build`.
