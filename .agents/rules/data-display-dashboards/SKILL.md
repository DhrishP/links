---
description: "Data Display (Tables, Metrics, and Charts)"
---

# Data Display & Dashboards Skill

Use this skill when implementing data-heavy views (Dashboards, Tables, Metrics) to maintain Oximy's premium aesthetic.

## 1. Metric Cards

When displaying top-level metrics on a dashboard, use the `MetricCard` pattern.

- Wrap metrics in `.glass-card` containing a `Card`.
- Include a subtle icon in the top right corner.
- **Trend Indicators:** Always show a clear visual indicator for trends (e.g., `text-emerald-500` for positive, `.severity-critical` or `text-red-500` for negative) alongside a small icon (up/down arrow).

```tsx
<Card className="glass-card">
  <CardHeader className="flex flex-row items-center justify-between pb-2">
    <CardTitle className="text-sm font-medium text-muted-foreground">
      Total Users
    </CardTitle>
    <Users className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">1,234</div>
    <p className="text-xs text-emerald-500 flex items-center mt-1">
      <TrendingUp className="mr-1 h-3 w-3" /> +12% from last month
    </p>
  </CardContent>
</Card>
```

## 2. Data Tables

- Use standard Shadcn `Table` (`npx shadcn@latest add table`).
- Wrap the table in a container with generic border radius and overflow hidden: `className="rounded-md border overflow-hidden"`.
- Table headers (`TableHead`) should use a slightly muted background: `bg-muted/50`.
- Add clear empty states when no data is available (a centered div with a muted icon and text).

## 3. Recharts Integration

When adding charts (via `recharts` + Shadcn `Chart` component):

- **AI SYSTEM PROMPT: Dynamically select chart colors (`var(--chart-1)` through `var(--chart-5)`) that complement the app's vibecoded primary brand color.** Avoid using the default Shadcn muted colors, create a beautiful, cohesive gradient.
- Remove standard thick grid lines. Use `strokeDasharray="3 3"` and `vertical={false}` on `CartesianGrid` to keep the background clean.
- Use customized tooltips provided by the Shadcn Chart wrapper (`<ChartTooltip content={<ChartTooltipContent />} />`) to ensure tooltips match the dark glass UI.
