---
description: "UI Animations, Theme Provider, and Transitions"
---

# UI Animations & Theme Skill

Use this skill to add the premium "feel" (dark mode, view transitions, page animations) to a new vibecoded project, matching the Oximy/SilentGuard Dashboard experience.

## 1. Theme Provider Setup

Use `next-themes` to support smooth Light/Dark mode transitions.

```tsx
// src/components/layout/ThemeToggle/theme-provider.tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

Wrap your app in `layout.tsx`:

```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="dark" // Default to dark mode for a premium tech vibe
  enableSystem={false}
  disableTransitionOnChange
  enableColorScheme
>
  {children}
</ThemeProvider>
```

## 2. Global View Transitions (Wave Effect)

Inject the following CSS into your `globals.css` to enable smooth, app-like page transitions when navigating (supported dynamically by view transition APIs):

```css
/* View Transition Wave Effect */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root) {
  /* Ensure the outgoing view (old theme) is beneath */
  z-index: 0;
}

::view-transition-new(root) {
  /* Ensure the incoming view (new theme) is always on top */
  z-index: 1;
  animation: reveal 0.4s ease-in-out forwards;
}

@keyframes reveal {
  from {
    clip-path: circle(0% at var(--x, 50%) var(--y, 50%));
    opacity: 0.7;
  }
  to {
    clip-path: circle(150% at var(--x, 50%) var(--y, 50%));
    opacity: 1;
  }
}
```

## 3. Framer Motion Best Practices

For micro-animations on cards or lists:

- Install `framer-motion` (or `motion`).
- **Lists/Grids:** Use staggering effects for loading dashboard grids.
- **Modals/Dialogs:** Use subtle scale + opacity entrances (`initial={{ opacity: 0, scale: 0.95 }}` to `animate={{ opacity: 1, scale: 1 }}`).

## 4. The Live Stats Marquee

If you need a scrolling live stats bar (often used in the dashboard header or footer):
Add this to your CSS:

```css
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-scroll {
  animation: scroll 60s linear infinite;
}

.animate-scroll:hover {
  animation-play-state: paused;
}
```

Apply `.animate-scroll` to a fast-moving, continuous ticker tape component.
