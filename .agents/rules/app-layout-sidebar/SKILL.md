---
description: "Application Layout Setup (Sidebar, Header, Layouts)"
---

# App Layout & Sidebar Setup Skill

Use this skill when building the main layout wrapper for a vibe-coded project to match the Oximy/SilentGuard sidebar and unified app feel.

## 1. Sidebar Component Usage

Use Shadcn's Sidebar component block (`npx shadcn@latest add sidebar`).

- Keep the sidebar collapsible (`collapsible="icon"`).
- Make sure to use the `<SidebarProvider>` wrapping your entire application inside your `layout.tsx` (usually inside a `<Providers>` wrapper).

## 2. Sidebar Theming

To ensure the sidebar matches the dark mode premium feel, make sure these variables are set in `globals.css` (they are usually covered by the Foundation skill, but ensure they are mapped). **The AI should dynamically choose the background shading (Zinc, Slate, or a tinted dark background depending on the primary brand color)**:

```css
/* Sidebar Variables */
--sidebar: oklch(0.985 0 0);
--sidebar-foreground: oklch(0.145 0 0);
--sidebar-accent: oklch(0.97 0 0);
--sidebar-border: oklch(0.922 0 0);

.dark {
  --sidebar: oklch(0.205 0 0); /* Dark zinc background */
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0); /* Subtle hover state */
  --sidebar-border: oklch(1 0 0 / 10%); /* Subtle border */
}
```

## 3. Top Navigation / Header

If using a top header next to the sidebar:

- Add a subtle backdrop blur: `className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"`
- Inside the header, include `Breadcrumbs` dynamically showing the current route.

## 4. User Profile & Organization Dropdowns

In the `SidebarFooter`:

- Use `DropdownMenu` or `Popover` components.
- Style the trigger button to look like a clean, bordered item: `className="border-sidebar-border/50 bg-sidebar-accent/50 data-[state=open]:bg-sidebar-accent"`
- Always include the Theme Toggle inside the user profile setting dropdown to keep the UI clean.
