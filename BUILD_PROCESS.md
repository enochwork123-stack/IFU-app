# IFU App Build Process Overview

## 1. Project Goal

This app was built as a mobile-first interactive discipleship learning tool. The first release focuses on the opening modules of **初信栽培**, helping new believers learn through scripture, reflection questions, saved responses, and extension readings. 

Subsequent updates expanded the platform to cover the complete 12-step discipleship path, introduced a self-study quiet time system, and added an administrative panel to manage application content dynamically.

## 2. Technology Stack

- **Frontend:** React (TypeScript & JSX)
- **Routing:** React Router 7
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4
- **Content Source:** Notion lesson materials & parsed worksheet docs
- **Storage:** Browser `localStorage` for learner answers and custom admin overrides
- **Deployment Target:** GitHub repo, later deployable to Vercel

## 3. Design Direction

The visual style follows a “soft modern discipleship journal” approach:

- Warm cream surfaces for long-form reading
- Deep green primary color for calm authority
- Ochre accent color for calls to action and highlights
- Rounded cards, soft shadows, and spacious mobile layouts
- Serif headings for an editorial/devotional feel
- Compact interaction patterns suitable for phone use
- Responsive web container layout for wider screens, alongside a mobile device-frame emulator toggle

The design strategy is documented in `lumina_path/DESIGN.md`.

## 4. Core App Structure

The app is organized around reusable layout and learning components:

- `AppShell` and `ShellFrame` control the persistent layout frames and viewports.
- `PageHeader` provides consistent page titles and back navigation.
- `JourneyPager` handles previous/next lesson movement.
- `ScriptureCard` and custom scripture reveal panels present Bible passages.
- `NotionMarkdownArticle` renders parsed Markdown documents dynamically.
- `ContentProvider` (`ContentContext.tsx`) manages dynamic global state and localStorage configuration overrides.
- Screen components under `src/screens/` define each learning page.
- Shared course data lives in `src/data/appContent.ts`.

## 5. Built Learning Pages

### Main Discipleship Journey (初信栽培 / 門徒之路)

- **1. 得救的確據** (Assurance of Salvation)
  - Route: `/journey/salvation-assurance`
- **2. 靈修** (Quiet Time)
  - Route: `/journey/quiet-time`
- **3. 禱告的確據** (Assurance of Answered Prayer)
  - Route: `/journey/prayer-assurance`
- **4. 赦罪的確據** (Assurance of Forgiveness)
  - Route: `/journey/forgiveness-assurance`
- **5. 得勝的確據** (Assurance of Victory)
  - Route: `/journey/victory-assurance`
- **6. 聖經的權威** (Authority of the Bible)
  - Route: `/journey/bible-authority`
- **7. 持守神的話** (Intake of the Bible)
  - Route: `/journey/bible-intake`
- **8. 有效的祈禱** (Effective Prayer)
  - Route: `/journey/effective-prayer`
- **9. 團契互助** (Fellowship)
  - Route: `/journey/fellowship`
- **10. 見證主** (Witnessing)
  - Route: `/journey/witnessing`
- **11. 人生目的** (Life Goal)
  - Route: `/journey/life-goal`
- **12. 屬靈生命的成長** (Spiritual Growth)
  - Route: `/journey/spiritual-growth`

### Gospel Illustration Annexes

- **神的拯救** (God's Salvation / Gospel Bridge)
  - Route: `/journey/bridge`
- **人的回應** (Human Response & Faith Decision)
  - Route: `/journey/response`

### Self-Study & Devotional Library (自修學習)

- **靈修自修庫** (Quiet Time Library)
  - Route: `/library`
  - Includes a searchable Directory view with topic/book pill filters, bookmarking, and custom sorting, as well as a randomized Card Deck view with 3D card flips.

### Content Administration

- **管理後台** (Admin Content Portal)
  - Route: `/admin`
  - Access code: `admin123`. Allows inline edits for all 12 chapters, cards reordering, Base64 image caching, and JSON configurations download/import.

## 6. Content Workflow

The source materials are processed in two ways:

1. **Notion Imports**:
   - Extract raw Notion Markdown exports.
   - Run the custom cleanup script (`prepare-notion-markdown.mjs`) to strip Notion headers and empty blocks.
   - Map files to structured JSX/TSX screens or render them dynamically through `NotionMarkdownArticle`.
2. **Worksheet Parsing**:
   - Parse raw doc/PDF lesson worksheets using the `worksheet-extractor` script (`extract-chapters.mjs`).
   - Format underlines and open text areas into standard placeholder tags (`[__input:key__]`, `[__textarea:key__]`).
   - Map text to interactive TypeScript screen components.

## 7. Key Learning Interactions

- **Click-to-expand scriptures:** Learners can reveal or hide Bible passages as needed.
- **Saved answer blocks & inputs:** Reflection answers, multiline fields, and fill-in-the-blank boxes are typed directly into the page and stored locally.
- **Interactive SVG Life Wheel:** A touch-responsive wheel segment visual (Step 12) displaying description cards reactively.
- **Devotional Deck Drawing:** Randomly draw cards with 3D flip card animations and progress metrics.
- **Live Admin Preview:** Dual-pane layout on the admin dashboard showing real-time content changes in simulated Mobile, Tablet, and Desktop viewport frames.

## 8. GitHub Setup

The project was initialized as a Git repository and pushed to:

`https://github.com/enochwork123-stack/IFU-app.git`

Ignored files include:
- `node_modules/`
- `dist/`
- `.DS_Store`
- environment files
- debug logs

## 9. Build Verification

The app is verified with:

```bash
npx tsc --noEmit
npm run build
```

The build completes successfully with zero compilation or TypeScript type errors.

## 10. Next Steps

Possible next phases:

- Deploy the GitHub repo to Vercel.
- Sync localStorage client overrides and learner answers to a server-side database (e.g., Supabase).
- Implement cumulative progress tracking and learning analytics across the 12 steps.
