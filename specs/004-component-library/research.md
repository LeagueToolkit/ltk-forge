# Research: Component Library & Styling System

**Feature**: 004-component-library
**Date**: 2026-03-06

## 1. Package Location & Monorepo Integration

**Decision**: Create two new packages: `packages/ui` (component library) and `packages/theme` (styling system/design tokens).

**Rationale**: The monorepo already follows the `packages/*` convention with shared config packages under `packages/config/*`. Separating the component library from the theme allows the theme to be consumed independently (e.g., for custom layouts that don't use library components). The app at `apps/forge` will consume both.

**Alternatives considered**:

- Single `packages/ui` package containing both components and theme — rejected because the theme (design tokens, CSS) is a concern separable from components, and other packages may want tokens without component dependencies.
- Placing inside `apps/forge/src/components` — rejected because the spec requires a shared, importable package (FR-001).

## 2. Styling Architecture

**Decision**: Use Tailwind CSS v4 utility classes applied directly to Base UI components via `className` props and `data-*` attribute selectors. Design tokens defined as CSS custom properties in the `@ltk-forge/theme` package and consumed via Tailwind's `@theme` directive.

**Rationale**: The app already uses Tailwind CSS v4 with the `@tailwindcss/vite` plugin. Base UI is designed to work with Tailwind — its `className` prop accepts strings or state callbacks, and its `data-*` attributes can be targeted with Tailwind's `data-[attr]` modifier. This approach requires no additional CSS-in-JS runtime.

**Alternatives considered**:

- CSS Modules — rejected because Tailwind is already established in the project, and CSS Modules add build complexity without clear benefit.
- CSS-in-JS (styled-components, Emotion) — rejected due to runtime overhead and misalignment with Tailwind v4's approach.

## 3. Component API Pattern

**Decision**: Use Base UI's compound/parts pattern directly (e.g., `Select.Root`, `Select.Trigger`, `Select.Popup`). Components are thin wrappers that apply default Tailwind classes and forward all Base UI props.

**Rationale**: Clarification session confirmed compound pattern (Q2). Base UI's `render` prop enables deep composition. The wrapper layer adds default styling and allows consumer overrides through `className` prop merging with `twMerge`.

**Alternatives considered**:

- Single-component wrappers hiding compound structure — rejected because it limits composability (FR-008) and fights Base UI's design.
- Re-exporting Base UI components without wrappers — rejected because no styling would be applied by default.

## 4. Class Merging Strategy

**Decision**: Use `twMerge` from tailwind-merge directly for all className composition. No wrapper utility or additional libraries needed.

**Rationale**: Clarification sessions mandated tailwind-merge (user input) and explicitly rejected a cn() wrapper. `twMerge` handles string-based class merging and conflict resolution natively. Conditional class logic is handled with standard JS (ternaries, template literals, array filter/join) — no clsx dependency needed.

**Alternatives considered**:

- cn() utility (clsx + tailwind-merge) — rejected per user direction; adds unnecessary abstraction and an extra dependency when twMerge + standard JS suffices.
- clsx alone — rejected because it doesn't resolve Tailwind class conflicts.

## 5. Animation Approach

**Decision**: CSS transitions using Base UI's `data-[starting-style]` and `data-[ending-style]` attributes, targeted via Tailwind's `data-[attr]` modifiers.

**Rationale**: Clarification session confirmed CSS-based transitions (Q5). Base UI natively supports this pattern — it applies `data-starting-style` on mount and `data-ending-style` before unmount, allowing CSS transitions to animate between states. No JS animation library needed.

**Alternatives considered**:

- Framer Motion / Motion — rejected due to bundle size and complexity for the transitions needed.
- CSS @keyframes animations — viable but CSS transitions are simpler for open/close patterns and can be cancelled mid-animation.

## 6. Design Token Structure

**Decision**: Define tokens as CSS custom properties in `packages/theme/src/tokens.css`. Expose semantic color scales (slate base + intent palettes), spacing, typography, radii, and shadows.

**Rationale**: FR-012 requires CSS custom properties. Tailwind CSS v4 consumes CSS variables natively via `@theme` or direct `var()` usage. Dark-only (FR-014) means a single set of tokens with no theme switching infrastructure.

**Alternatives considered**:

- JavaScript token objects (e.g., style-dictionary) — rejected because CSS custom properties are the native web platform solution and Tailwind v4 consumes them directly.
- Tailwind config-only tokens — rejected because tokens need to be usable outside Tailwind contexts (plain CSS, inline styles).

## 7. Build & Export Strategy

**Decision**: Use tsup for bundling `packages/ui` and `packages/theme`. ESM output only. Each component exported from a barrel file with per-component entry points for tree-shaking.

**Rationale**: The project already uses tsup for library bundling (per CLAUDE.md: "tsup (library bundling)"). Per-component entry points (e.g., `@ltk-forge/ui/button`) enable tree-shaking (FR-010). ESM-only aligns with the project's `"type": "module"` convention.

**Alternatives considered**:

- Vite library mode — viable but tsup is already the established tool.
- No bundling (direct source imports via workspace protocol) — viable for development but doesn't validate the package boundary or tree-shaking.

## 8. Testing Strategy

**Decision**: Use Vitest with @testing-library/react for component tests. Each component gets a test file verifying rendering, accessibility attributes, variant props, and className merging.

**Rationale**: Vitest is already configured (packages/config/vitest-config). @testing-library/react aligns with testing components from the user's perspective. Accessibility testing via jest-axe or vitest-axe for SC-002.

**Alternatives considered**:

- Storybook-based testing — complementary but not a replacement for unit tests; can be added later.
- Playwright component tests — heavier setup for unit-level concerns.

## 9. Initial Component Set (MVP)

**Decision**: 8 components for initial release: Button, Input, Checkbox, Select, Dialog, Tooltip, Tabs, Separator.

**Rationale**: Clarification session confirmed MVP scope (Q3). These cover the most common UI patterns: actions (Button), data entry (Input, Checkbox, Select), feedback (Dialog, Tooltip), navigation (Tabs), and layout (Separator).

**Deferred components**: Popover, Accordion, Menu, Switch, Radio, Toggle, Scroll Area — to be added incrementally.

## 10. Dark Slate Color Palette

**Decision**: Base palette built on slate grays (slate-50 through slate-950) with semantic intent colors:

- **Primary**: Blue-indigo tones (aligns with existing `#6366f1` accent in app.css)
- **Info**: Cyan/sky tones
- **Success**: Emerald/green tones
- **Danger**: Red/rose tones

**Rationale**: The existing app.css already defines `--accent: #6366f1` (indigo). Extending with semantic intents (FR-006) using Tailwind's default color palette values ensures visual harmony. Dark slate backgrounds use slate-800/850/900/950 range.

**Alternatives considered**:

- Custom color palette from scratch — rejected because Tailwind's carefully designed color scales provide accessible contrast ratios out of the box.
- Radix Colors — well-designed but adds an external dependency when Tailwind colors suffice.
