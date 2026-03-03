---
description: "User Feedback (Toasts, Modals, Empty States)"
---

# Feedback UI Skill

Use this skill to implement user feedback mechanisms (Toasts, Modals, Loaders) ensuring they align with the SilentGuard standard.

## 1. Toast Notifications (Sonner)

Always use `sonner` for toast notifications (`npx shadcn@latest add sonner`).

- Place `<Toaster />` at the root `<ErrorBoundary>` inside `layout.tsx`.
- Default to using the standard success/error variants:
  `toast.success("Action completed")`
  `toast.error("Failed to perform action")`
- **Styling overrides:** Ensure the Toaster adapts correctly to dark mode. The `components.json` setup should handle this, but verify `theme="system"` is passed to the Sonner component if it isn't automatically picking up the `next-themes` value.

## 2. Modals and Dialogs

- **Backgrounds:** Wrap dialog contents in the standard glass effect or just ensure `DialogContent` utilizes the `bg-background` with a solid border.
- **Backdrop Blur:** Ensure the `DialogOverlay` contains `backdrop-blur-sm` for an app-like focus effect:
  ```tsx
  <DialogOverlay className="bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out" />
  ```
- **Action Buttons:** In the `DialogFooter`, always place the primary (destructive/submit) action on the right, and the "Cancel" (ghost/outline) action on the left.

## 3. Loading States & Skeletons

- Protect against janky loading. Use the `Skeleton` component (`npx shadcn@latest add skeleton`) for cards and tables.
- **Table Skeleton Pattern:** Render rows of skeletons holding `h-4 w-full` divs inside table cells.
- **Card Skeleton Pattern:** Use `<Skeleton className="h-32 w-full rounded-xl" />`
- Use generic `PageSkeleton` components for highly dynamic routes to prevent layout shift.
