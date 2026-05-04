# Design System Strategy: The Reverent Editorial

This document outlines the visual language and implementation guidelines for a "Soft Modern" discipleship experience. Our goal is to move beyond the cold, utilitarian feel of standard mobile apps, instead creating a digital sanctuary that feels like a high-end, tactile editorial journal.

---

### 1. Creative North Star: "The Digital Sanctuary"
The system is built on the concept of **Quiet Authority**. We combine the timeless weight of high-legibility serifs with the expansive "breathing room" of a modern gallery. We reject the "boxed-in" nature of traditional UI. Instead of rigid grids, we use intentional asymmetry, overlapping organic forms, and sophisticated tonal layering to guide the soul, not just the thumb.

---

### 2. Color & Surface Architecture
Our palette transitions from the warmth of aged parchment to the grounded stability of moss.

*   **Primary (`#28351C`):** Used for high-impact grounding and deep-contrast text.
*   **Secondary/Accent (`#795900`):** Our Ochre. Reserved exclusively for "Points of Enlightenment" (CTAs and interactive highlights).
*   **Surface (`#FBF9F5`):** The foundation. A warm, cream-based white that reduces eye strain during long-form reading.

#### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders for sectioning content. Boundaries are defined solely through:
1.  **Tonal Shifts:** Placing a `surface-container-low` (`#F5F3EF`) element on a `surface` (`#FBF9F5`) background.
2.  **Negative Space:** Utilizing our spacing scale (specifically `8` and `10`) to create "islands" of content.

#### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine paper. 
*   **Deepest Level:** `surface-dim` (`#DBDAD6`) for background utility areas.
*   **The Page:** `surface` (`#FBF9F5`) as the primary canvas.
*   **The Inset:** `surface-container-lowest` (`#FFFFFF`) for cards that need to "pop" with a subtle, clean lift.

#### Signature Textures: Glass & Gradients
To avoid a flat, "templated" look, use **Glassmorphism** for navigation bars and floating action buttons. Apply a backdrop-blur (12px–20px) to `surface` tokens at 80% opacity. For primary CTAs, apply a subtle linear gradient from `primary` (`#28351C`) to `primary_container` (`#3E4C31`) at a 135-degree angle to provide a "lit from within" quality.

---

### 3. Typography: Editorial Sophistication
We pair the intellectual depth of **Noto Serif** with the modern, approachable clarity of **Manrope**.

*   **Display & Headline (Noto Serif):** Use `display-lg` (3.5rem) for moments of reflection and `headline-md` (1.75rem) for chapter titles. These should feel like headers in a premium printed book.
*   **Body (Manrope):** Use `body-lg` (1rem) for all scriptural text and long-form discipleship content. The generous line height ensures readability during meditation.
*   **Title (Manrope):** Use `title-sm` (1rem) in Bold/Semi-bold for functional labels to distinguish them clearly from the "soul" of the content (the serif text).

---

### 4. Elevation & Depth
Depth in this system is organic and ambient, mimicking natural light in a quiet room.

*   **The Layering Principle:** Rather than shadows, use the "Stack." A `surface-container-highest` navigation element should sit atop a `surface` background, creating a natural edge through color value alone.
*   **Ambient Shadows:** If a floating element (like a FAB) requires a shadow, use a 32px blur with 6% opacity, tinted with the `primary` color. Never use pure black or grey.
*   **The Ghost Border:** For input fields where structure is mandatory, use `outline-variant` at 20% opacity. It should be felt more than seen.

---

### 5. Component Guidelines

*   **Buttons:**
    *   **Primary:** Ochre (`secondary`) background, pill-shaped (`full` roundedness). Use a subtle inner glow (top-down white gradient at 10% opacity) for a premium "pressed" look.
    *   **Tertiary:** No background, `primary` text, underlined with a 2px stroke of `secondary_fixed` for a sophisticated link feel.
*   **Input Fields:**
    *   Use `surface-container-low` as the field background. No bottom border. The label (`label-md`) sits 0.5rem above the field in `on-surface-variant`.
*   **Cards:**
    *   **Forbid Dividers.** Separate content within cards using `spacing-4` (1.4rem).
    *   Apply `xl` (1.5rem) roundedness to all cards to maintain the "Soft Modern" organic feel.
*   **Progress Indicators (Discipleship Tracking):**
    *   Use organic, non-linear shapes. Instead of a straight bar, use a soft-growing moss-green path or a series of dots that glow in Ochre when completed.
*   **Reflection Trays (Bottom Sheets):**
    *   Must use Glassmorphism (80% `surface` + blur). This keeps the user connected to the text they are reflecting upon while providing a dedicated space for notes.

---

### 6. Do’s and Don’ts

**Do:**
*   **Embrace Asymmetry:** Offset images or decorative organic shapes behind text to create a sense of movement.
*   **Respect the Margin:** Stick to the `spacing-8` (2.75rem / ~44px) gutter for mobile edges to ensure the UI feels expansive.
*   **Use Tonal Transitions:** Change background colors slowly as the user scrolls to signal a change in "mood" (e.g., from a lesson to a prayer).

**Don’t:**
*   **Don't use 100% Black:** Never use `#000000`. Use `primary` for text to maintain the "mossy" warmth.
*   **Don't use Hard Corners:** Avoid `none` or `sm` roundedness. The system should feel "soft" to the touch.
*   **Don't Overcrowd:** If you feel the need to add a divider line, try adding `spacing-6` of white space instead. If it still feels cluttered, remove content.

---

### 7. Current 初信栽培 Implementation Notes

The first two 初信栽培 lessons are implemented as guided-study pages, not plain articles. Their structure should preserve the exact source wording from the Notion materials while using the app's mobile-first study patterns: scripture reveal panels, saved response areas, expandable appendices, and separate extension-learning routes.

#### Core Lesson Routes

*   **得救的確據:** `/journey/salvation-assurance`
    *   Includes numbered reflection/study prompts.
    *   Scripture panels are click-to-expand/collapse.
    *   User answers are typed into textarea blocks and saved in `localStorage`.
    *   `附件A : 與神和好的褔音` opens as a modal-style expandable review.
    *   Extension modules link to separate pages.
*   **靈修:** `/journey/quiet-time`
    *   Follows the question numbering from the Notion lesson.
    *   All scriptures are click-to-expand/collapse.
    *   Each question or sub-question has a saved answer block.
    *   `附件A : 聖經書卷目錄與縮寫` expands inline.
    *   The appendix uses two separate tables:
        *   `舊約聖經書卷 (共39)`
        *   `新約聖經書卷 (共27)`
    *   Each table has three columns: short Chinese form, full Chinese name, and full English name.

#### Extension Learning Routes

*   **《得救的確據》延伸學習 (A) : 你到底得救了嗎？**
    *   Route: `/journey/salvation-assurance/are-you-saved`
    *   Source: Notion page `A-2e5098befcef8060b12ceec548f69b93`
    *   Preserves the article's reflection prompts, sections, sub-sections, quotes, and teaching structure.
*   **《得救的確據》延伸學習 (B) : 確信 vs 迷信**
    *   Route: `/journey/salvation-assurance/faith-vs-superstition`
    *   Source: Notion page `B-vs-2e5098befcef8008b7ffddcb2f8ce321`
    *   Preserves the DT-Chat instructions, numbered steps, example prompts, and image placeholders.
*   **《靈修》延伸學習 (A) : 七分鐘與神獨處**
    *   Route: `/journey/quiet-time/seven-minutes-with-god`
    *   Source: Notion page `A-2e5098befcef802d862ed566fbbb967d`
    *   Preserves the reflection prompts, article sections, ACTS prayer steps, seven-minute summary table, and Cambridge Seven material.
*   **《靈修》延伸學習 (B) : If Quiet Time is New to You**
    *   Route: `/journey/quiet-time/new-to-you`
    *   Source: Notion page `B-If-Quiet-Time-is-New-to-You-2e5098befcef8089ae2de060ea656789`
    *   Preserves the English article's reflection prompts, headings, bullet lists, practical suggestions, problem/solution sections, and closing exhortation.

#### Interaction Patterns To Preserve

*   **Scripture Reveal Panels:** Use tappable rounded panels with the book name, reference, and expand/collapse icon. Expanded content should show the exact Chinese and, where provided, English scripture wording.
*   **Saved Answers:** Use textarea answer blocks under every question or sub-question. Save locally with stable `localStorage` keys so refreshes keep learner responses.
*   **Expandable Modules:** Use inline expansion for shorter appendices and modal-style expansion for long review material.
*   **Extension Cards:** Keep extension learning as separate route cards rather than embedding long extension articles inside the core lesson page.
