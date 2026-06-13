# IFU App Build Process Overview

## 1. Project Goal

This app was built as a mobile-first interactive discipleship learning tool. The first release focuses on the opening modules of **初信栽培**, helping new believers learn through scripture, reflection questions, saved responses, and extension readings.

## 2. Technology Stack

- **Frontend:** React
- **Routing:** React Router
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Content Source:** Notion lesson materials
- **Storage:** Browser `localStorage` for learner answers
- **Deployment Target:** GitHub repo, later deployable to Vercel

## 3. Design Direction

The visual style follows a “soft modern discipleship journal” approach:

- Warm cream surfaces for long-form reading
- Deep green primary color for calm authority
- Ochre accent color for calls to action and highlights
- Rounded cards, soft shadows, and spacious mobile layouts
- Serif headings for an editorial/devotional feel
- Compact interaction patterns suitable for phone use

The design strategy is documented in `lumina_path/DESIGN.md`.

## 4. Core App Structure

The app is organized around reusable layout and learning components:

- `AppShell` controls the app frame and bottom navigation.
- `PageHeader` provides consistent page titles and back navigation.
- `JourneyPager` handles previous/next lesson movement.
- `ScriptureCard` and custom scripture reveal panels present Bible passages.
- Screen components under `src/screens/` define each learning page.
- Shared course data lives in `src/data/appContent.js`.

## 5. Built Learning Pages

### Main 初信栽培 Pages

- **得救的確據**
  - Route: `/journey/salvation-assurance`
  - Includes scripture study, reflection questions, saved answer blocks, and an expandable gospel appendix.

- **靈修**
  - Route: `/journey/quiet-time`
  - Includes numbered Notion questions, scripture reveal panels, saved answer blocks, and an expandable Bible-book abbreviation appendix.

### Extension Learning Pages

- **《得救的確據》延伸學習 (A) : 你到底得救了嗎？**
  - Route: `/journey/salvation-assurance/are-you-saved`

- **《得救的確據》延伸學習 (B) : 確信 vs 迷信**
  - Route: `/journey/salvation-assurance/faith-vs-superstition`

- **《靈修》延伸學習 (A) : 七分鐘與神獨處**
  - Route: `/journey/quiet-time/seven-minutes-with-god`

- **《靈修》延伸學習 (B) : If Quiet Time is New to You**
  - Route: `/journey/quiet-time/new-to-you`

## 6. Content Workflow

The source materials were provided as Notion pages. The build process was:

1. Extract the exact lesson wording and structure from Notion.
2. Identify scriptures, questions, appendices, and extension-learning sections.
3. Convert long-form Notion material into mobile-friendly learning screens.
4. Preserve original wording wherever possible.
5. Add interaction only where it improves learning, such as scripture toggles and saved answers.

## 7. Key Learning Interactions

- **Click-to-expand scriptures:** Learners can reveal or hide Bible passages as needed.
- **Saved answer blocks:** Reflection answers are typed directly into the page and stored locally.
- **Expandable appendices:** Long reference materials are hidden until needed.
- **Separate extension pages:** Longer readings are linked as dedicated pages instead of crowding the main lesson.
- **Guided navigation:** Lesson cards and pager buttons help users move through the discipleship journey.

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

The app was verified with:

```bash
npm run build
```

The build completed successfully after the learning pages, extension routes, markdown documentation, and GitHub setup were added.

## 10. Next Steps

Possible next phases:

- Deploy the GitHub repo to Vercel.
- Add more 初信栽培 lessons.
- Add progress tracking across lessons.
- Sync answers to a backend or account system instead of local-only storage.
- Improve media handling for Notion images and linked resources.
