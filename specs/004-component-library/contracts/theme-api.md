# Theme API Contract

**Package**: `@ltk-forge/theme`
**Date**: 2026-03-06

## Token File

`@ltk-forge/theme/tokens.css` — importable CSS file defining all design tokens as CSS custom properties on `:root`.

## Color Tokens

### Background

| Token                  | Description                           |
| ---------------------- | ------------------------------------- |
| `--color-bg-primary`   | Main application background (darkest) |
| `--color-bg-secondary` | Card/panel background                 |
| `--color-bg-tertiary`  | Elevated surface background           |
| `--color-bg-input`     | Input field background                |
| `--color-bg-overlay`   | Dialog/modal backdrop                 |

### Foreground (Text)

| Token                    | Description                      |
| ------------------------ | -------------------------------- |
| `--color-text-primary`   | Primary text (highest contrast)  |
| `--color-text-secondary` | Secondary/muted text             |
| `--color-text-tertiary`  | Placeholder/disabled text        |
| `--color-text-inverse`   | Text on light/accent backgrounds |

### Border

| Token                    | Description      |
| ------------------------ | ---------------- |
| `--color-border-default` | Standard border  |
| `--color-border-muted`   | Subtle border    |
| `--color-border-focus`   | Focus ring color |

### Semantic Intent Palettes

Each intent has shades: `50`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`, `950`.

| Prefix                    | Intent  | Use Case                              |
| ------------------------- | ------- | ------------------------------------- |
| `--color-primary-{shade}` | Primary | Actions, interactive elements, links  |
| `--color-info-{shade}`    | Info    | Informational states, hints           |
| `--color-success-{shade}` | Success | Positive outcomes, confirmations      |
| `--color-danger-{shade}`  | Danger  | Destructive actions, errors, warnings |

## Spacing Tokens

| Token           | Value      |
| --------------- | ---------- |
| `--spacing-0`   | `0`        |
| `--spacing-0.5` | `0.125rem` |
| `--spacing-1`   | `0.25rem`  |
| `--spacing-1.5` | `0.375rem` |
| `--spacing-2`   | `0.5rem`   |
| `--spacing-3`   | `0.75rem`  |
| `--spacing-4`   | `1rem`     |
| `--spacing-5`   | `1.25rem`  |
| `--spacing-6`   | `1.5rem`   |
| `--spacing-8`   | `2rem`     |
| `--spacing-10`  | `2.5rem`   |
| `--spacing-12`  | `3rem`     |

## Typography Tokens

### Font Family

| Token                | Value                          |
| -------------------- | ------------------------------ |
| `--font-family-sans` | `Inter, system-ui, sans-serif` |
| `--font-family-mono` | `JetBrains Mono, monospace`    |

### Font Size

| Token              | Value      |
| ------------------ | ---------- |
| `--font-size-xs`   | `0.75rem`  |
| `--font-size-sm`   | `0.875rem` |
| `--font-size-base` | `1rem`     |
| `--font-size-lg`   | `1.125rem` |
| `--font-size-xl`   | `1.25rem`  |
| `--font-size-2xl`  | `1.5rem`   |

### Font Weight

| Token                    | Value |
| ------------------------ | ----- |
| `--font-weight-normal`   | `400` |
| `--font-weight-medium`   | `500` |
| `--font-weight-semibold` | `600` |
| `--font-weight-bold`     | `700` |

## Radius Tokens

| Token           | Value      |
| --------------- | ---------- |
| `--radius-sm`   | `0.25rem`  |
| `--radius-md`   | `0.375rem` |
| `--radius-lg`   | `0.5rem`   |
| `--radius-xl`   | `0.75rem`  |
| `--radius-full` | `9999px`   |

## Shadow Tokens

| Token         | Value                               |
| ------------- | ----------------------------------- |
| `--shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.3)`      |
| `--shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.4)`   |
| `--shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.5)` |

## Transition Tokens

| Token                 | Value   |
| --------------------- | ------- |
| `--transition-fast`   | `100ms` |
| `--transition-normal` | `150ms` |
| `--transition-slow`   | `250ms` |

## Contract Rules

1. **All tokens are CSS custom properties** on `:root` — no JavaScript runtime required.
2. **Dark-only** — no light theme variants or switching mechanism.
3. **Additive changes only** — existing tokens must not be renamed or removed without a major version bump.
4. **Consumers can override** — any token can be overridden by redefining the custom property in a more specific scope.
