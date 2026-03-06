# Tasks: Component Library & Styling System

**Input**: Design documents from `/specs/004-component-library/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in the feature specification. Test tasks are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize both packages with scaffolding, dependencies, and build configuration

- [x] T001 Create `packages/theme/` directory structure with `package.json` (`name: @ltk-forge/theme`, `type: module`), `tsconfig.json` (extending `@ltk-forge/tsconfig/library.json`), and `tsup.config.ts` (ESM output, CSS entry point) in `packages/theme/`
- [x] T002 Create `packages/ui/` directory structure with `package.json` (`name: @ltk-forge/ui`, `type: module`, dependencies: `@base-ui-components/react`, `tailwind-merge`, peer deps: `react`, `react-dom`), `tsconfig.json` (extending `@ltk-forge/tsconfig/react-library.json`), `tsup.config.ts` (ESM output, external react), and `vitest.config.ts` in `packages/ui/`
- [x] T003 Create shared types file `packages/ui/src/types.ts` defining `Intent` (`"primary" | "info" | "success" | "danger"`) and `Size` (`"sm" | "md" | "lg"`) types per contracts/component-api.md
- [x] T004 Create barrel export file `packages/ui/src/index.ts` (initially empty, will be populated as components are added)
- [x] T005 Run `pnpm install` from repo root to link workspace packages and verify both packages resolve correctly

**Checkpoint**: Both packages scaffolded, dependencies installed, builds succeed with empty output

---

## Phase 2: Foundational — Design Token System (Satisfies User Story 2)

**Purpose**: Create the centralized styling system with all design tokens. This MUST be complete before any component work begins, as components depend on these tokens for styling.

**Goal**: Developers can apply consistent dark slate colors, spacing, typography, radii, and shadows using CSS custom properties from `@ltk-forge/theme`.

**Independent Test**: Import `@ltk-forge/theme/tokens.css` in a page, apply background/text/accent color tokens, and verify the dark slate appearance renders correctly.

- [x] T006 Create `packages/theme/src/tokens.css` with all color tokens: background (`--color-bg-primary` through `--color-bg-overlay`), foreground (`--color-text-primary` through `--color-text-inverse`), border (`--color-border-default`, `--color-border-muted`, `--color-border-focus`) per contracts/theme-api.md. Use slate-900/800/700 range for dark backgrounds, slate-50/200/400 for text.
- [x] T007 Add semantic intent palette tokens to `packages/theme/src/tokens.css`: primary (indigo — aligning with existing `#6366f1` accent), info (sky/cyan), success (emerald), danger (red/rose). Each palette defines shades 50-950 per contracts/theme-api.md.
- [x] T008 Add spacing, typography (font-family, font-size, font-weight), radius, shadow, and transition tokens to `packages/theme/src/tokens.css` per contracts/theme-api.md
- [x] T009 Create `packages/theme/src/index.ts` that re-exports the CSS path for programmatic access (e.g., `export const tokensPath = ...`) and build the package with tsup
- [x] T010 Update `apps/forge/src/styles/app.css` to import `@ltk-forge/theme/tokens.css` and replace existing inline CSS custom properties (`--bg-primary`, `--bg-secondary`, `--bg-tertiary`, `--text-primary`, `--text-secondary`, `--accent`) with references to the new token system. Migrate the existing `:root` theme variables to use the centralized tokens.
- [x] T011 Add `@ltk-forge/theme` and `@ltk-forge/ui` as dependencies in `apps/forge/package.json` and run `pnpm install` to verify workspace linking

**Checkpoint**: Theme package built and consumable. App imports tokens and renders with dark slate appearance using centralized design tokens. US2 acceptance scenarios satisfied.

---

## Phase 3: User Story 1 — Consuming Primitive Components (Priority: P1) 🎯 MVP

**Goal**: Developers can import Button, Input, Checkbox, Select, and Separator from `@ltk-forge/ui` and render fully styled, accessible components matching the dark slate theme without writing custom styles.

**Independent Test**: Import a Button, render it with a label, verify it displays with dark slate styling and is keyboard-accessible.

### Implementation for User Story 1

- [x] T012 [P] [US1] Create `packages/ui/src/components/Button/Button.tsx` — wrap Base UI `Button` as compound component (`Button.Root`). Accept `variant` (`solid`/`outline`/`ghost`, default `solid`), `intent` (`Intent`, default `primary`), `size` (`Size`, default `md`) props. Apply dark slate Tailwind classes using `twMerge(defaultClasses, variantClasses, props.className)`. Include focus-visible ring, hover states via Tailwind, disabled state styling via `data-[disabled]`. Export from `packages/ui/src/components/Button/index.ts`.
- [x] T013 [P] [US1] Create `packages/ui/src/components/Input/Input.tsx` — wrap Base UI `Input` as compound component (`Input.Root`). Accept `size` (`Size`, default `md`) prop. Apply dark slate input styling: `--color-bg-input` background, `--color-border-default` border, `--color-text-primary` text, focus border using `--color-border-focus`. Use `twMerge` for className merging. Export from `packages/ui/src/components/Input/index.ts`.
- [x] T014 [P] [US1] Create `packages/ui/src/components/Checkbox/Checkbox.tsx` — wrap Base UI `Checkbox.Root` and `Checkbox.Indicator` as compound components. Accept `size` (`Size`, default `md`) prop. Style with dark slate border, checked state via `data-[checked]` using primary intent color, indicator icon (checkmark). Use `twMerge` for className merging. Export from `packages/ui/src/components/Checkbox/index.ts`.
- [x] T015 [P] [US1] Create `packages/ui/src/components/Select/Select.tsx` — wrap Base UI `Select.Root`, `Select.Trigger`, `Select.Portal`, `Select.Popup`, `Select.Item`, `Select.Value`, `Select.Icon` as compound components. Accept `size` (`Size`, default `md`) on Trigger. Style popup with dark slate background, `data-[highlighted]` item highlighting, CSS transitions on popup using `data-[starting-style]`/`data-[ending-style]`. Use `twMerge` for className merging. Export from `packages/ui/src/components/Select/index.ts`.
- [x] T016 [P] [US1] Create `packages/ui/src/components/Separator/Separator.tsx` — wrap Base UI `Separator` as compound component (`Separator.Root`). Accept `orientation` (`horizontal`/`vertical`, default `horizontal`) prop. Style with `--color-border-muted`. Use `twMerge` for className merging. Export from `packages/ui/src/components/Separator/index.ts`.
- [x] T017 [US1] Update `packages/ui/src/index.ts` to export all US1 components: `Button`, `Input`, `Checkbox`, `Select`, `Separator`, and shared types (`Intent`, `Size` from `types.ts`)
- [x] T018 [US1] Build `@ltk-forge/ui` package with tsup and verify: TypeScript compilation succeeds, type definitions are generated, ESM output is produced, all 5 components are importable from `@ltk-forge/ui`

**Checkpoint**: Button, Input, Checkbox, Select, and Separator are importable from `@ltk-forge/ui`. Each renders with dark slate styling and inherits Base UI accessibility features. US1 acceptance scenarios satisfied.

---

## Phase 4: User Story 3 — Composing Complex Components (Priority: P2)

**Goal**: Developers can build complex UIs by composing Dialog, Tooltip, and Tabs with US1 primitives. Nested components render without style conflicts or layout issues.

**Independent Test**: Compose a Dialog containing Input, Checkbox, Select, and Button components. Verify all render correctly together without style conflicts.

### Implementation for User Story 3

- [x] T019 [P] [US3] Create `packages/ui/src/components/Dialog/Dialog.tsx` — wrap Base UI `Dialog.Root`, `Dialog.Trigger`, `Dialog.Portal`, `Dialog.Backdrop`, `Dialog.Popup`, `Dialog.Title`, `Dialog.Description`, `Dialog.Close` as compound components. Style Backdrop with `--color-bg-overlay` and opacity transition. Style Popup with `--color-bg-secondary` background, `--shadow-lg` shadow, `--radius-xl` radius. Add CSS transitions on Popup and Backdrop using `data-[starting-style]`/`data-[ending-style]` (scale + opacity). Use `twMerge` for all className merging. Export from `packages/ui/src/components/Dialog/index.ts`.
- [x] T020 [P] [US3] Create `packages/ui/src/components/Tooltip/Tooltip.tsx` — wrap Base UI `Tooltip.Root`, `Tooltip.Trigger`, `Tooltip.Portal`, `Tooltip.Popup`, `Tooltip.Arrow` as compound components. Style Popup with `--color-bg-tertiary` background, `--shadow-md` shadow, small text. Style Arrow to match popup background. Add CSS transitions using `data-[starting-style]`/`data-[ending-style]` (opacity + slight translate). Use `twMerge` for className merging. Export from `packages/ui/src/components/Tooltip/index.ts`.
- [x] T021 [P] [US3] Create `packages/ui/src/components/Tabs/Tabs.tsx` — wrap Base UI `Tabs.Root`, `Tabs.List`, `Tabs.Tab`, `Tabs.Panel` as compound components. Style List with bottom border. Style Tab with `data-[active]` state using primary intent underline/highlight. Style Panel with appropriate padding. Use `twMerge` for className merging. Export from `packages/ui/src/components/Tabs/index.ts`.
- [x] T022 [US3] Update `packages/ui/src/index.ts` to export `Dialog`, `Tooltip`, `Tabs` components
- [x] T023 [US3] Rebuild `@ltk-forge/ui` package and verify: all 8 MVP components export correctly, Dialog/Tooltip/Tabs can be composed with US1 components (e.g., Dialog.Trigger wrapping Button.Root via `render` prop), no TypeScript errors across component compositions

**Checkpoint**: All 8 MVP components importable. Dialog can contain Input + Button, Tooltip can wrap any trigger, Tabs can contain any panel content. US3 acceptance scenarios satisfied.

---

## Phase 5: User Story 4 — Customizing Component Variants (Priority: P2)

**Goal**: Developers can apply variant props (size, intent, visual style) to customize components within the design system. Consumer className overrides always win via `twMerge`.

**Independent Test**: Render Button with `variant="solid"`, `variant="outline"`, `variant="ghost"` and each `intent` value. Verify each renders with distinct, correct colors from the design system.

### Implementation for User Story 4

- [x] T024 [US4] Review and refine variant styling across all components in `packages/ui/src/components/`. Ensure: Button supports all 3 variants (`solid`/`outline`/`ghost`) x 4 intents (`primary`/`info`/`success`/`danger`) with correct color mappings from design tokens. Each variant x intent combination must be visually distinct. Verify `twMerge` correctly resolves consumer className overrides against variant classes.
- [x] T025 [US4] Verify size prop consistency across Button, Input, Checkbox, Select in `packages/ui/src/components/`. Ensure: `sm` uses `--font-size-sm` and compact padding, `md` uses `--font-size-base` and standard padding, `lg` uses `--font-size-lg` and generous padding. All size values produce proportional, visually consistent results across component types.
- [x] T026 [US4] Verify disabled and focus states across all 8 components in `packages/ui/src/components/`. Ensure: `data-[disabled]` reduces opacity and disables pointer events consistently, focus-visible ring uses `--color-border-focus` consistently, hover states are suppressed when disabled.

**Checkpoint**: All variant/size/state combinations render correctly. Consumer className overrides win. US4 acceptance scenarios satisfied.

---

## Phase 6: User Story 5 — Adding New Components to the Library (Priority: P3)

**Goal**: The library has a clear, repeatable pattern for adding new components. A developer can follow the pattern to add a component that integrates seamlessly.

**Independent Test**: Follow the pattern to verify that adding a new component directory, wrapping a Base UI primitive, and exporting it from the barrel file results in a working, styled component.

### Implementation for User Story 5

- [x] T027 [US5] Verify the component creation pattern is consistent by auditing all 8 component directories in `packages/ui/src/components/`. Ensure each follows the same structure: `ComponentName.tsx` (compound pattern, `twMerge` usage, prop types), `index.ts` (barrel export). Fix any inconsistencies found.
- [x] T028 [US5] Verify `packages/ui/package.json` exports field correctly exposes all component entry points for tree-shaking. Ensure `@ltk-forge/ui` barrel import works AND individual component imports (if configured) work. Build and check output bundle structure.

**Checkpoint**: Component pattern is consistent and documented by example. US5 acceptance scenarios satisfied.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, app integration, and cleanup

- [x] T029 [P] Verify tree-shaking works: import only Button from `@ltk-forge/ui` in a test build and confirm other components are excluded from the bundle output
- [x] T030 [P] Verify accessibility: run automated a11y audit (e.g., `vitest-axe` or manual check) on all 8 components ensuring ARIA attributes, keyboard navigation, and focus management work correctly per FR-009
- [x] T031 Update `apps/forge/src/routes/__root.tsx` to use `@ltk-forge/ui` Button component for the window control buttons (minimize, maximize, close) in the TitleBar, replacing the existing inline-styled buttons
- [x] T032 Run full build from repo root (`pnpm run build`) and verify: both packages build without errors, app builds consuming both packages, no TypeScript errors across the workspace
- [x] T033 Run quickstart.md validation: follow the setup and usage examples in `specs/004-component-library/quickstart.md` to verify all documented patterns work correctly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational / US2 (Phase 2)**: Depends on Setup completion — BLOCKS all component work
- **US1 (Phase 3)**: Depends on Phase 2 (needs design tokens for component styling)
- **US3 (Phase 4)**: Depends on Phase 3 (Dialog/Tooltip/Tabs compose with US1 primitives)
- **US4 (Phase 5)**: Depends on Phase 4 (refines variants across all components)
- **US5 (Phase 6)**: Depends on Phase 5 (audits final component patterns)
- **Polish (Phase 7)**: Depends on Phase 6

### User Story Dependencies

- **User Story 2 (P1)**: Foundational — no dependency on other stories. Creates the token system all components need.
- **User Story 1 (P1)**: Depends on US2 (tokens must exist). Delivers 5 primitive components.
- **User Story 3 (P2)**: Depends on US1 (composes with primitives). Delivers 3 complex components.
- **User Story 4 (P2)**: Depends on US3 (all components must exist to refine variants). Cross-cutting refinement.
- **User Story 5 (P3)**: Depends on US4 (patterns must be finalized). Validates consistency.

### Within Each User Story

- Components within a phase marked [P] can be built in parallel (different files)
- Barrel export update and build verification must follow component creation
- Each phase checkpoint validates independently before proceeding

### Parallel Opportunities

- T001 and T002 can run in parallel (different packages)
- T006, T007, T008 can run in parallel (different sections of same file — but same file, so sequential is safer)
- T012, T013, T014, T015, T016 can ALL run in parallel (different component directories)
- T019, T020, T021 can ALL run in parallel (different component directories)
- T029, T030 can run in parallel (different validation concerns)

---

## Parallel Example: User Story 1

```bash
# Launch all US1 component implementations together (different directories):
Task: "Create Button component in packages/ui/src/components/Button/Button.tsx"
Task: "Create Input component in packages/ui/src/components/Input/Input.tsx"
Task: "Create Checkbox component in packages/ui/src/components/Checkbox/Checkbox.tsx"
Task: "Create Select component in packages/ui/src/components/Select/Select.tsx"
Task: "Create Separator component in packages/ui/src/components/Separator/Separator.tsx"

# Then sequentially:
Task: "Update barrel export in packages/ui/src/index.ts"
Task: "Build and verify package"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup (scaffolding)
2. Complete Phase 2: Foundational / US2 (design tokens)
3. Complete Phase 3: US1 (5 primitive components)
4. **STOP and VALIDATE**: Import Button in the app, verify dark slate styling, accessibility
5. Deploy/demo if ready — MVP delivers a functional component library with 5 primitives

### Incremental Delivery

1. Setup + Foundational → Token system live in app
2. Add US1 → 5 primitives available → Test + Demo (MVP!)
3. Add US3 → 8 components, composition works → Test + Demo
4. Add US4 → All variants polished → Test + Demo
5. Add US5 → Pattern validated → Test + Demo
6. Polish → Tree-shaking, a11y, app integration verified

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: Button + Input + Checkbox (US1)
   - Developer B: Select + Separator (US1)
3. Once US1 complete:
   - Developer A: Dialog + Tooltip (US3)
   - Developer B: Tabs (US3)
4. US4 and US5 are cross-cutting reviews — best done by one developer

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- US2 is implemented as the Foundational phase since all components depend on design tokens
- All components use `twMerge` directly (no cn() wrapper or clsx) per clarification
- Components follow compound/parts pattern matching Base UI's native API
- CSS transitions use Base UI's `data-[starting-style]`/`data-[ending-style]` attributes
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
