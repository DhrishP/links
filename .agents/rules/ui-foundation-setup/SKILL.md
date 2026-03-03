---
description: "Core UI Foundation Setup (Next.js 15 + Tailwind v4 + Delight Font)"
---

# UI Foundation Setup Skill

Use this skill when initializing a new vibecoded project to ensure a consistent, premium UI foundation matching the preferred dashboard style.

## 1. Initial Tech Stack Setup

When starting a new Next.js project, ensure the following core tools are used:

- **Framework:** Next.js (App Router, usually v15+)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss`)
- **Icons:** `lucide-react` or `@phosphor-icons/react`

## 2. Global CSS & Theme Tokens (`src/app/globals.css`)

Replace the default `globals.css` with the following foundation. This defines the premium OKLCH color palette, the "Delight" font, and custom UI utilities (like `glass` and `glass-card`).

```css
@import "tailwindcss";
@import "tw-animate-css"; /* If using animations */

@custom-variant dark (&:is(.dark *));

/* 1. Delight Font Setup */
@font-face {
  font-family: "Delight";
  src: url("/fonts/Delight-Regular.otf") format("opentype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Delight";
  src: url("/fonts/Delight-Medium.otf") format("opentype");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Delight";
  src: url("/fonts/Delight-SemiBold.otf") format("opentype");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Delight";
  src: url("/fonts/Delight-Bold.otf") format("opentype");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

/* 2. Core Theme Tokens (Light Mode) */
:root {
  --radius: 0.5rem;
  --font-sans: "Delight", ui-sans-serif, system-ui, sans-serif;

  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);

  /* AI Dynamic Primary Brand Colors */
  /* SYSTEM PROMPT: When vibecoding, determine a unique primary and accent OKLCH color palette that fits the app's purpose. Replace these with your chosen OKLCH values. */
  --primary: oklch(
    0.696 0.17 162.48
  ); /* AI: REPLACE with dynamic brand color */
  --primary-foreground: oklch(0.985 0 0); /* Ensure high contrast */

  --secondary: oklch(
    0.97 0 0
  ); /* AI: REPLACE with dynamic secondary if needed */
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);

  --destructive: oklch(0.577 0.245 27.325);
  --warning: oklch(0.769 0.188 70.08);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);

  /* Spacing & Radius System */
  --spacing-section: 2rem;
  --spacing-card: 1rem;
  --spacing-inner: 0.75rem;
  --radius-card: 0.5rem;
}

/* 3. Dark Mode */
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.269 0 0);
  --popover-foreground: oklch(0.985 0 0);

  /* AI Dynamic Primary Brand Colors (Dark Mode) */
  /* SYSTEM PROMPT: Pick a vivid, beautiful OKLCH color for dark mode that matches the app's vibe */
  --primary: oklch(
    0.696 0.17 162.48
  ); /* AI: REPLACE with dynamic dark mode brand color */
  --primary-foreground: oklch(0.205 0 0); /* Ensure high contrast */

  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.371 0 0);
  --accent-foreground: oklch(0.985 0 0);

  --destructive: oklch(0.704 0.191 22.216);
  --warning: oklch(0.769 0.188 70.08);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
}

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
}

/* 4. Base HTML/Body & Premium Utilities */
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground overflow-x-hidden;
    font-family: var(--font-sans);
  }
}

@layer utilities {
  .text-page-title {
    @apply text-xl font-semibold;
  }
  .text-section-header {
    @apply text-sm font-medium;
  }
  .text-body {
    @apply text-sm font-normal;
  }
  .text-label {
    @apply text-xs font-medium;
  }
  .text-caption {
    @apply text-xs font-normal;
  }

  /* Premium Glassmorphism */
  .glass {
    @apply border border-white/20 bg-white/70 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-black/40;
  }
  .glass-card {
    @apply bg-card/60 border-border/50 hover:bg-card/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg;
  }

  /* Custom Clean Scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    @apply bg-muted-foreground/30 hover:bg-muted-foreground/50 rounded-full transition-colors;
  }
}
```

## 3. Font Installation Check

Ensure you remind the user or script the downloading of `Delight` font files (.otf or .ttf) into the `public/fonts/` directory.

## 4. Layout Application (`src/app/layout.tsx`)

Ensure the `body` tag strictly applies the sans font and antialiased utility:

```tsx
<body className={cn("bg-background font-sans antialiased")}>{children}</body>
```
