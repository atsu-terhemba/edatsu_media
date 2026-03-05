# Edatsu UI Design Concept

A design system reference for replicating the Edatsu Technology visual language across any application or platform.

---

## 1. Design Philosophy

The Edatsu UI follows an **Apple-inspired minimalist aesthetic** — clean, spacious, and typography-driven. The design prioritizes whitespace, subtle contrast, and restrained use of color. Every element earns its place on the page.

**Core principles:**
- **Minimalism over decoration** — no gradients on UI elements, no heavy shadows, no ornamental borders
- **Typography as design** — large bold headings do the visual heavy lifting
- **Black and white as a system** — color is used sparingly and intentionally (only orange as an accent)
- **Generous whitespace** — sections breathe with large padding (96px / `py-24` vertical rhythm)
- **Subtle interactivity** — hover states are gentle transitions, not dramatic transformations

---

## 2. Color Palette

### Primary Colors

| Role | Value | Usage |
|------|-------|-------|
| **Background (White)** | `#ffffff` | Default page background, cards |
| **Foreground (Black)** | `#000000` | Primary text, primary buttons, dark sections |
| **Light Gray** | `#f5f5f7` | Alternate section backgrounds (Apple's signature gray) |
| **Medium Gray** | `#86868b` | Secondary/body text |
| **Accent (Orange)** | `orange-500` / `#f97316` | Eyebrow underlines only — never used for large fills |

### Opacity System (Dark Backgrounds)

On dark/black backgrounds, white text uses opacity levels to create hierarchy:

| Level | Opacity | Usage |
|-------|---------|-------|
| Primary | `text-white` (100%) | Headings, important labels |
| Secondary | `text-white/90` | Subheadings |
| Tertiary | `text-white/60` | Body text, descriptions |
| Quaternary | `text-white/50` | Eyebrows, labels |
| Muted | `text-white/40` | Footer text, disabled states |
| Subtle | `text-white/30` | Hints, fine print |

### Opacity System (Light Backgrounds)

| Level | Class | Usage |
|-------|-------|-------|
| Primary | `text-black` | Headings, card titles |
| Secondary | `text-gray-600` | Body text, descriptions |
| Tertiary | `text-gray-500` | Supporting text, labels |

### Section Backgrounds

The site alternates between three section types to create visual rhythm:

| Section Type | Background | Text |
|--------------|------------|------|
| **White** | `#ffffff` | Black text |
| **Light** | `#f5f5f7` | Black text |
| **Dark** | `#000000` | White text (with opacity hierarchy) |

Sections typically alternate: white > light > dark > white, or use background images with dark overlays.

---

## 3. Typography

### Font Stack

```
Primary: 'Poppins', sans-serif
Fallback: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif
Code: 'SF Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace
```

**Base body weight:** 400 (Regular) — applied globally via `poppins-regular`

**Global letter-spacing:** `-0.01em` (very slight tightening for a modern feel)

**Font smoothing:** antialiased (`-webkit-font-smoothing: antialiased`)

### Type Scale

#### Headings

| Element | Size | Weight | Letter Spacing | Line Height | Usage |
|---------|------|--------|----------------|-------------|-------|
| **Hero H1** | `text-4xl md:text-5xl lg:text-6xl` (36/48/60px) | 600 (semibold) | Default (-0.01em inherited) | `leading-tight` (1.25) | Page hero titles |
| **Section H2** | `text-3xl md:text-4xl` (30/36px) | 600 (semibold) | Default | Default | Section titles |
| **Card H3** | `text-base` or `text-lg` (16/18px) | 600 (semibold) | Default | Default | Card titles, feature names |

#### Body Text

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| **Hero subtitle** | `text-base md:text-lg` (16/18px) | 300 (light) | Default | Hero tagline (e.g., "Fintech, Cloud Compute and AI") |
| **Hero description** | `text-sm md:text-base` (14/16px) | 400 (regular) | `leading-relaxed` (1.625) | Hero body paragraph |
| **Body / descriptions** | `text-sm` (14px) | 400 (regular) | `leading-relaxed` (1.625) | Card descriptions, section body text |
| **Eyebrow** | `text-xs` (12px) or `text-sm` (14px) | 400-500 | `tracking-[0.2em]` or `tracking-wide` | Section labels above headings |
| **Fine print** | `text-xs` (12px) | 400 | Default | Footer text, legal, timestamps |

#### Responsive Headline Scale (CSS classes — legacy, available for use)

```
.headline-large:  clamp(32px, 8vw, 80px)  — weight 600, spacing -0.015em, line-height 1.05
.headline-medium: clamp(28px, 5vw, 56px)  — weight 600, spacing -0.015em, line-height 1.1
.headline-small:  clamp(24px, 3vw, 40px)  — weight 600, spacing -0.01em,  line-height 1.15
.body-large:      clamp(17px, 2vw, 21px)  — weight 400, spacing 0.011em,  line-height 1.47
.body-medium:     17px                     — weight 400, spacing -0.022em, line-height 1.47
```

### Key Typography Rules

1. **Headings are always semibold (600)** — never bold (700) for headings
2. **Body text is always regular (400)** — occasionally medium (500) for emphasis
3. **All caps is reserved for eyebrows only** — with wide letter-spacing (`tracking-wide` or `tracking-[0.2em]`)
4. **No underlines on links** — hover states use color transitions instead
5. **Text sizes stay small** — body text is predominantly `text-sm` (14px), keeping things clean and compact

---

## 4. Spacing & Layout

### Page Structure

```
Page top padding: pt-14 (56px) — accounts for fixed header
Max content width: max-w-7xl (1280px)
Horizontal padding: px-6 lg:px-8 (24px / 32px)
Section vertical padding: py-24 (96px)
```

### Spacing Rhythm

| Context | Value | Usage |
|---------|-------|-------|
| **Between sections** | `py-24` (96px) | Every page section |
| **Section header to content** | `mb-12` (48px) | Below SectionHeader component |
| **Between heading and text** | `mb-4` to `mb-5` (16-20px) | H1/H2 to paragraph |
| **Between text and CTA** | `mb-8` to `mb-10` (32-40px) | Paragraph to button group |
| **Card grid gap** | `gap-6` (24px) | Between cards in a grid |
| **Card internal padding** | `p-8` (32px) | Inside cards |
| **Button gap in groups** | `gap-4` (16px) | Between side-by-side buttons |

### Grid System

- **4-column grids** for value cards, benefit cards, stats: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- **3-column grids** for service cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **2-column grids** for feature showcases: `grid-cols-1 lg:grid-cols-2 gap-16`
- **Single column** centered for CTAs and forms: `max-w-3xl mx-auto`

---

## 5. Component Patterns

### Eyebrow + Orange Underline

Every section starts with this signature pattern — a small uppercase label with a short orange bar underneath:

```
Structure:
  [EYEBROW TEXT]
  [====] ← orange bar (25% of text width, 2-3px tall)

Styling:
  - Text: uppercase, text-xs or text-sm, font-medium or font-normal
  - Tracking: tracking-wide or tracking-[0.2em]
  - Color: text-gray-500 (light bg) or text-white/50 (dark bg)
  - Orange bar: w-[25%], h-[2px] or h-[3px], bg-orange-500, rounded-full
  - Bar margin: mt-2
```

This is the most distinctive visual element of the Edatsu design. It should appear above every section heading.

### Hero Sections

Two hero variants used throughout:

**Full Hero (landing pages):**
```
- Height: min-h-[90vh] or min-h-[60vh]
- Background: full-bleed image with CSS background-image
- Overlay: bg-gradient-to-b from-black/80 via-black/60 to-black/80
- Content: centered, max-w-4xl, flex flex-col items-center text-center
- Includes: eyebrow, H1, subtitle, description, button group
- Bottom: animated scroll indicator (bouncing dot in a rounded pill)
```

**Image overlay section (mid-page):**
```
- Background image with overlay: from-black/75 via-black/65 to-black/75
- Content: centered, max-w-2xl
- Used for: callout sections (Digital Nomads, Team preview)
```

### Scroll Indicator

A minimal scroll hint at the bottom of hero sections:

```
Container: w-5 h-8, rounded-full, border border-white/20
Inner dot: w-1 h-2, rounded-full, bg-white/40, animate-bounce
Position: absolute bottom-8, centered horizontally
```

### Cards

**Standard card:**
```
Container: p-8, rounded-2xl, bg-white, border border-gray-100
Hover: hover:border-gray-200, hover:shadow-xl
Transition: transition-all duration-300
Icon: w-12 h-12 circle, bg-black, white icon inside
Icon hover: group-hover:scale-110, transition-transform duration-300
Title: text-base font-semibold text-black
Description: text-sm text-gray-600 leading-relaxed
```

**Feature list item:**
```
Container: p-4, rounded-xl, bg-white, border border-gray-100
Hover: hover:border-gray-200, hover:shadow-sm
Icon: w-10 h-10 circle, bg-black, centered
Label: font-medium text-black text-sm
Layout: horizontal flex with gap-4
```

### Buttons

**Primary button (light background):**
```
px-8 py-3, text-sm font-medium
text-white bg-black, rounded-full
hover:bg-gray-800, transition-colors
Optional: inline-flex items-center gap-1 (with arrow icon)
```

**Primary button (dark background):**
```
px-8 py-3, text-sm font-medium
text-black bg-white, rounded-full
hover:bg-gray-100, transition-all
hover:shadow-lg hover:shadow-white/20
```

**Secondary/outline button (light):**
```
px-8 py-3, text-sm font-medium
text-black, border border-gray-200, rounded-full
hover:border-black hover:bg-black hover:text-white, transition-all
```

**Secondary/outline button (dark):**
```
px-8 py-3, text-sm font-medium
text-white/90, border border-white/20, rounded-full
hover:bg-white/10, transition-all
```

**Key button rules:**
- Always `rounded-full` (pill shape) — never square or slightly rounded
- Always `text-sm` (14px) with `font-medium` (500)
- Always `px-8 py-3` for consistent sizing
- Arrow icons use `text-sm` Material Symbols Outlined

### Navigation Header

```
Position: fixed top-0, z-50
Background: bg-black/80, backdrop-blur-2xl
Border: border-b border-white/[0.06]
Height: h-14 (56px)
Link style: text-[13px], text-white/60, hover:text-white
CTA button: px-4 py-1.5, text-[13px], text-black bg-white, rounded-full
```

Optional top banner above nav:
```
Background: linear-gradient (warm orange tones)
Text: text-[11px], black text
```

### Footer

```
Background: bg-black
Padding: py-16
Grid: 4 columns (company info, products, services, company links)
Section titles: text-xs, uppercase, tracking-widest, text-white/40
Links: text-sm, text-gray-500, hover:text-white
Divider: border-t border-white/5
Copyright: text-xs, text-gray-600
```

### Form Inputs

```
Container: w-full px-4 py-3
Border: rounded-xl, border border-gray-200 (light) or border-white/10 (dark)
Text: text-sm, text-black (light) or text-white (dark)
Placeholder: placeholder:text-gray-400 (light) or placeholder-white/30 (dark)
Focus: focus:outline-none focus:border-black (light) or focus:border-white/30 (dark)
Labels: text-xs font-medium text-gray-600 (light) or text-white/70 (dark), mb-1.5 or mb-2
```

### FAQ / Accordion

```
Container: rounded-2xl, bg-white, border border-gray-100
Hover: hover:border-gray-200
Summary: p-6, text-sm font-medium text-black
Expand icon: Material icon "expand_more", rotates 180deg on open
Content: px-6 pb-6, text-sm text-gray-600 leading-relaxed
```

---

## 6. Iconography

**System:** Google Material Symbols Outlined

```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
```

**Configuration:**
```css
font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
```

**Usage rules:**
- Always outlined style (FILL 0), never filled
- Icon size matches text: `text-sm` for inline, `text-xl` for card icons, `text-lg` for feature icons
- Icons inside circles: black circle background, white icon
- Arrow icons (`arrow_forward`) are used as button suffixes

---

## 7. Image Treatment

### Background Images

```
- Full-bleed: absolute inset-0, bg-cover bg-center bg-no-repeat
- Always paired with gradient overlay for text readability
- Gradient: bg-gradient-to-b from-black/80 via-black/60 to-black/80
```

### Content Images

```
- Rounded: rounded-3xl
- Height: h-[400px] or h-[500px], object-cover
- Subtle overlay: absolute inset-0, bg-gradient-to-t from-black/20 to-transparent
```

---

## 8. Motion & Transitions

**General approach:** Subtle and functional — no flashy animations.

| Element | Property | Duration | Easing |
|---------|----------|----------|--------|
| Links / text color | `transition-colors` | 150ms (default) | ease |
| Buttons | `transition-all` | 150ms | ease |
| Cards (shadow + border) | `transition-all` | 300ms | `duration-300` |
| Icon scale on hover | `transition-transform` | 300ms | `duration-300` |
| Card hover lift | `translateY(-4px)` + shadow | 300ms | ease |
| Dropdown rotation | `transition-transform` | 200ms | `duration-200` |
| Scroll indicator | `animate-bounce` | Infinite | Built-in Tailwind |

---

## 9. Responsive Breakpoints

Following Tailwind CSS defaults:

| Breakpoint | Width | Usage |
|------------|-------|-------|
| **Base** | 0px+ | Single column, mobile-first |
| **md** | 768px+ | 2-column grids, larger text |
| **lg** | 1024px+ | Full grid layouts (3-4 columns), desktop nav |

**Key responsive patterns:**
- Hero text: `text-4xl md:text-5xl lg:text-6xl`
- Grids: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` (or 4)
- Button groups: `flex-col sm:flex-row` (stack on mobile, inline on desktop)
- Navigation: hidden on mobile (`hidden lg:flex`), hamburger menu below `lg`

---

## 10. Dark Mode Surfaces (within dark sections)

When building UI elements on dark (`#000000`) backgrounds:

| Element | Background | Border |
|---------|------------|--------|
| Subtle card | `bg-white/[0.03]` | `border-white/[0.06]` |
| Card hover | `bg-white/[0.05]` | `border-white/[0.1]` |
| Input field | `bg-white/5` | `border-white/10` |
| Pill / tag | `bg-white/5` | `border-white/10` |
| Dropdown | `bg-[#1a1a1a]/95` | `border-white/[0.08]` |
| Divider | — | `border-white/[0.06]` |

---

## 11. Quick Reference — Replication Checklist

To replicate the Edatsu look in another application:

1. **Font:** Load Poppins from Google Fonts (weights 300, 400, 500, 600)
2. **Icons:** Load Material Symbols Outlined from Google Fonts
3. **Colors:** Black/white primary, `#f5f5f7` for light sections, `#f97316` orange accent sparingly
4. **Body text:** 14px regular, `-0.01em` letter-spacing, antialiased
5. **Headings:** Semibold (600), never bold (700)
6. **Buttons:** Always pill-shaped (`border-radius: 9999px`), 14px medium text
7. **Cards:** 32px padding, 16px border-radius, 1px light gray border, shadow on hover
8. **Spacing:** 96px between sections, 48px below section headers
9. **Section rhythm:** Alternate white / light gray / black backgrounds
10. **Eyebrows:** Uppercase, wide-tracked, with a short orange underline bar
11. **Images:** Always rounded (24px radius), with subtle gradient overlays
12. **Transitions:** 150ms for colors, 300ms for transforms/shadows
13. **Whitespace:** When in doubt, add more space — the design breathes
