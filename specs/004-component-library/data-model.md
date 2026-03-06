# Data Model: Component Library & Styling System

**Feature**: 004-component-library
**Date**: 2026-03-06

This feature has no persistent data storage. The "data model" describes the structural entities and their relationships within the component library and styling system.

## Entities

### Design Token

A named CSS custom property representing a design decision.

**Categories**:

| Category            | Token Pattern              | Example Values                                |
| ------------------- | -------------------------- | --------------------------------------------- |
| Color / Background  | `--color-bg-{level}`       | `--color-bg-primary: #0f172a` (slate-900)     |
| Color / Foreground  | `--color-text-{level}`     | `--color-text-primary: #f8fafc` (slate-50)    |
| Color / Border      | `--color-border-{level}`   | `--color-border-default: #334155` (slate-700) |
| Color / Intent      | `--color-{intent}-{shade}` | `--color-primary-500: #6366f1`                |
| Spacing             | `--spacing-{size}`         | `--spacing-2: 0.5rem`                         |
| Typography / Size   | `--font-size-{name}`       | `--font-size-sm: 0.875rem`                    |
| Typography / Weight | `--font-weight-{name}`     | `--font-weight-medium: 500`                   |
| Typography / Family | `--font-family-{name}`     | `--font-family-sans: Inter, sans-serif`       |
| Radius              | `--radius-{size}`          | `--radius-md: 0.375rem`                       |
| Shadow              | `--shadow-{size}`          | `--shadow-md: 0 4px 6px ...`                  |

**Semantic Intent Palettes** (each with shades 50-950):

- `primary` — blue-indigo (action, interactive elements)
- `info` — cyan/sky (informational states)
- `success` — emerald (positive outcomes)
- `danger` — red/rose (destructive, errors)

### Component

A styled wrapper around a Base UI headless primitive.

**Structure** (per component):

```
ComponentName/
├── ComponentName.tsx       # Compound component parts with default styling
├── ComponentName.test.tsx  # Tests for rendering, a11y, variants, className merging
└── index.ts                # Barrel export
```

**Properties** (common across all components):

| Property         | Type     | Description                                               |
| ---------------- | -------- | --------------------------------------------------------- |
| `className`      | `string` | Merged with defaults via `twMerge` — consumer classes win |
| `...baseUiProps` | `varies` | All Base UI props forwarded (ref, render, data-\*, etc.)  |

**Variant dimensions** (component-specific):

| Dimension | Values                                 | Applies To                      |
| --------- | -------------------------------------- | ------------------------------- |
| `variant` | `solid`, `outline`, `ghost`            | Button                          |
| `intent`  | `primary`, `info`, `success`, `danger` | Button, (future: Alert, Badge)  |
| `size`    | `sm`, `md`, `lg`                       | Button, Input, Select, Checkbox |

### Variant

A predefined visual variation mapping to specific Tailwind classes.

**Resolution order** (className merging):

1. Base component classes (always applied)
2. Variant-specific classes (applied based on prop values)
3. Consumer `className` prop (wins all conflicts via tailwind-merge)

## Relationships

```
Theme (tokens.css)
  └── consumed by → Component (via Tailwind classes referencing CSS vars)
  └── consumed by → Application (via direct CSS var usage)

Base UI Primitive
  └── wrapped by → Component (adds default className, forwards props)

Component
  └── composed with → Component (via nesting, render prop)
  └── styled via → twMerge (tailwind-merge)

Variant
  └── maps to → Tailwind class set
  └── resolved by → twMerge within Component
```

## State Transitions

Components delegate state management to Base UI. Relevant states exposed via data attributes:

| State             | Data Attribute                   | Components                      |
| ----------------- | -------------------------------- | ------------------------------- |
| Open/Closed       | `data-open`, `data-closed`       | Dialog, Select, Tooltip         |
| Checked/Unchecked | `data-checked`, `data-unchecked` | Checkbox                        |
| Active/Inactive   | `data-active`                    | Tabs                            |
| Highlighted       | `data-highlighted`               | Select items                    |
| Disabled          | `data-disabled`                  | All interactive components      |
| Entering          | `data-starting-style`            | Dialog, Tooltip, Select (popup) |
| Exiting           | `data-ending-style`              | Dialog, Tooltip, Select (popup) |
