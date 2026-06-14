# Login Page Design Spec
> Christianity-themed login page, loosely inspired by the provided app screenshot layout.
> **Colour scheme and font styles must match the existing website's design system** — do not introduce new colours or typefaces.

---

## Layout Overview

A single-column, full-viewport mobile-first page divided into two zones:

```
┌─────────────────────────┐
│                         │
│      [HERO IMAGE]       │  ~55% of viewport height
│                         │
├─────────────────────────┤
│      [HEADER]           │
│      [DESCRIPTION]      │  ~45% of viewport height
│      [LOGIN BUTTON]     │
└─────────────────────────┘
```

On desktop, cap the card width at **420px**, centred horizontally and vertically on the page.

---

## Components

### 1. Hero Image

| Property | Value |
|---|---|
| Width | 100% of container |
| Height | 55vh (mobile) / 320px (desktop) |
| Position | Top of page, flush to all edges |
| Object-fit | `cover`, anchored to top-centre |
| Content | A serene, faith-themed illustration or photo (e.g. soft light through a stained glass window, an open Bible, a cross on a hillside). Should feel warm and inviting, not austere. |
| Overlay | Optional: subtle dark gradient at bottom (transparent → 20% black) so the image transitions softly into the white content zone below |

---

### 2. Content Card (below image)

| Property | Value |
|---|---|
| Width | 100% on mobile; 420px max on desktop |
| Background | White (or site's primary background colour) |
| Border radius | 16px top-left and top-right only, creating a "sheet rising over" the image |
| Padding | 28px horizontal, 32px top, 40px bottom |
| Vertical rhythm | 12px gap between header and description; 32px gap between description and button |

---

### 3. Header Text

| Property | Value |
|---|---|
| Content | e.g. *"Welcome. You are known."* or *"Begin your walk with faith."* |
| Font | **Inherit from existing website's heading font** |
| Font size | 26px (mobile) / 30px (desktop) |
| Font weight | Bold (700) |
| Colour | **Inherit from existing website's primary text colour** |
| Width | 100% of content card |
| Alignment | Left-aligned |

---

### 4. Description Text

| Property | Value |
|---|---|
| Content | One short line — e.g. *"Sign in to continue your journey."* |
| Font | **Inherit from existing website's body font** |
| Font size | 15px |
| Font weight | Regular (400) |
| Colour | **Inherit from existing website's secondary/muted text colour** |
| Width | 100% of content card |
| Alignment | Left-aligned |
| Max lines | 2 |

---

### 5. Sign in with Google Button

| Property | Value |
|---|---|
| Width | 100% of content card |
| Height | 52px |
| Border radius | 10px |
| Style | Follow [Google's official OAuth branding guidelines](https://developers.google.com/identity/branding-guidelines) — white background, Google logo on left, "Sign in with Google" label centred |
| Font | Google Sans or existing website body font, 15px, medium (500) |
| Border | 1px solid `#DADCE0` |
| Shadow | `0 1px 3px rgba(0,0,0,0.10)` |
| Hover state | Background shifts to `#F8F8F8`, shadow deepens slightly |
| Position | Bottom of content card, full-width |

> ⚠️ Per Google's brand policy, do **not** recolour the button to match site brand colours. Keep it white with the standard Google logo.

---

## Spacing Summary

```
[Top of page]
  Hero image — 55vh
  ↕ 0px (card overlaps image via negative margin or border-radius lift)
  Content card starts
    ↕ 32px top padding
    Header
    ↕ 12px
    Description
    ↕ 32px
    Sign in with Google button
    ↕ 40px bottom padding
[Bottom of page]
```

---

## Notes for Implementation

- **Colours:** Pull all colours (background, text, accents) directly from the existing site's CSS variables or design tokens. Do not hardcode new values.
- **Fonts:** Use the same `font-family` declarations already defined in the site's global stylesheet.
- **Illustration/Photo:** Choose imagery that reflects the site's tone — warm and welcoming rather than formal or religious-institutional.
- **OAuth:** Wire the button to Google OAuth 2.0. On success, redirect to the site's authenticated home/dashboard route.
- **Accessibility:** Button must have visible focus ring; image must have descriptive `alt` text; colour contrast for all text must meet WCAG AA (4.5:1 minimum).
