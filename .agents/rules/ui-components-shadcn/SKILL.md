---
description: "Shadcn UI Components Configuration & Standards"
---

# UI Components (Shadcn) Setup Skill

Use this skill when installing or managing UI components in a new vibecoded project to ensure they match the premium Oximy/SilentGuard standard.

## 1. Init `components.json`

Run `npx shadcn@latest init` or manually create `components.json` at the root of the project with these exact configurations:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

## 2. Core Dependencies

Always ensure you have the `class-variance-authority`, `clsx`, and `tailwind-merge` packages installed as they are required for Shadcn.

Your `lib/utils.ts` should look like this:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## 3. Component Styling Preferences

When adding standard Shadcn components, apply the follow vibecoding design tweaks if you are rendering them:

- **Cards (`Card`, `CardHeader`, `CardContent`)**: Instead of plain solid background cards, strongly prefer using the `.glass-card` utility (from globals.css) via the `className` prop to give them a premium, slightly translucent, hoverable feel.
  ```tsx
  <Card className="glass-card">...</Card>
  ```
- **Inputs & Textareas**: Ensure they use `bg-background/50 backdrop-blur-sm` for a slightly refined hollow input look.
- **Buttons**: If the primary color is the AI-selected dynamic OKLCH color, standard `<Button>` will look great. Use `variant="outline"` combined with a `backdrop-blur-sm` for a premium secondary button.

## 4. Dashboard Naming Conventions

- Base UI components go into `@/components/ui/` (e.g., button, dialog, card).
- Layout structural components go into `@/components/layout/` (e.g., sidebar, header, theme-provider).
- Feature specific blocks go into `@/components/blocks/` or `@/components/features/`.
