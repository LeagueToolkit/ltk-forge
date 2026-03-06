# Implementation Plan: Component Library & Styling System

**Branch**: `004-component-library` | **Date**: 2026-03-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-component-library/spec.md`

## Summary

Create two new monorepo packages — `@ltk-forge/theme` (design tokens as CSS custom properties) and `@ltk-forge/ui` (styled component library) — to provide a reusable, composable component system for LTK Forge. Components wrap Base UI headless primitives using the compound/parts pattern, styled with Tailwind CSS v4 utility classes and a dark slate design language. `twMerge` from tailwind-merge handles className merging directly so consumer overrides always win. The initial release includes 8 MVP components: Button, Input, Checkbox, Select, Dialog, Tooltip, Tabs, and Separator.

## Technical Context

**Language/Version**: TypeScript 5.7, targeting ES2022+ (ESM)
**Primary Dependencies**: @base-ui-components/react, tailwind-merge, Tailwind CSS v4, React 19
**Storage**: N/A (no persistent storage)
**Testing**: Vitest 3.0 + @testing-library/react
**Target Platform**: Desktop (Tauri v2 — Chrome 105+ on Windows, Safari 13+ on macOS)
**Project Type**: Library (two packages consumed by desktop app)
**Performance Goals**: <50KB gzipped for 10 components (tree-shaking), smooth CSS transitions
**Constraints**: Dark-only theme, no theme switching infrastructure, compound/parts API pattern
**Scale/Scope**: 8 MVP components, ~50 design tokens, 4 semantic intent palettes

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

The project constitution is unconfigured (contains only template placeholders). No gates to enforce. Proceeding.

**Post-Phase 1 re-check**: Still unconfigured — no violations possible. Pass.

## Project Structure

### Documentation (this feature)

```text
specs/004-component-library/
├── plan.md              # This file
├── research.md          # Phase 0 output — technology decisions and rationale
├── data-model.md        # Phase 1 output — entity definitions and relationships
├── quickstart.md        # Phase 1 output — setup and usage guide
├── contracts/
│   ├── component-api.md # Component prop interfaces and contract rules
│   └── theme-api.md     # Design token definitions and naming conventions
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
packages/
├── theme/                          # @ltk-forge/theme — design tokens package
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsup.config.ts
│   └── src/
│       ├── index.ts                # JS exports (if any token utilities needed)
│       └── tokens.css              # All design tokens as CSS custom properties
│
├── ui/                             # @ltk-forge/ui — component library package
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsup.config.ts
│   ├── vitest.config.ts
│   └── src/
│       ├── index.ts                # Barrel export for all components
│       └── components/
│           ├── Button/
│           │   ├── Button.tsx
│           │   ├── Button.test.tsx
│           │   └── index.ts
│           ├── Input/
│           │   ├── Input.tsx
│           │   ├── Input.test.tsx
│           │   └── index.ts
│           ├── Checkbox/
│           │   ├── Checkbox.tsx
│           │   ├── Checkbox.test.tsx
│           │   └── index.ts
│           ├── Select/
│           │   ├── Select.tsx
│           │   ├── Select.test.tsx
│           │   └── index.ts
│           ├── Dialog/
│           │   ├── Dialog.tsx
│           │   ├── Dialog.test.tsx
│           │   └── index.ts
│           ├── Tooltip/
│           │   ├── Tooltip.tsx
│           │   ├── Tooltip.test.tsx
│           │   └── index.ts
│           ├── Tabs/
│           │   ├── Tabs.tsx
│           │   ├── Tabs.test.tsx
│           │   └── index.ts
│           └── Separator/
│               ├── Separator.tsx
│               ├── Separator.test.tsx
│               └── index.ts
│
└── config/                         # Existing config packages (unchanged)
    ├── tsconfig/
    ├── eslint-config/
    └── vitest-config/

apps/
└── forge/                          # Existing app (updated to consume new packages)
    └── src/
        └── styles/
            └── app.css             # Updated to import @ltk-forge/theme tokens
```

**Structure Decision**: Two new packages under `packages/` following the established monorepo convention. The theme package is separate from the UI package so design tokens can be consumed independently. The app at `apps/forge` imports both packages and integrates the theme via CSS `@import`.

## Complexity Tracking

No constitution violations to justify — constitution is unconfigured.
