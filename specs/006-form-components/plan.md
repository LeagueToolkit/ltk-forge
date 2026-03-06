# Implementation Plan: Form Components & TanStack Form Integration

**Branch**: `006-form-components` | **Date**: 2026-03-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-form-components/spec.md`

## Summary

Integrate TanStack Form as the form state management solution for LTK Forge. Create a `FieldWrapper` UI primitive for consistent field layout (label, error, description). Build form-connected field components (`TextField`, `TextareaField`, `SelectField`, `CheckboxField`, `SubmitButton`) using TanStack Form's `createFormHook` composition API. Migrate the existing "New Project" form from raw `useState` to the new form system. Flatten `Input` and `Checkbox` component exports to match the recently simplified `Button` pattern.

## Technical Context

**Language/Version**: TypeScript 5.7 (frontend)
**Primary Dependencies**: `@tanstack/react-form` (new), `@base-ui/react` (existing), `class-variance-authority` (existing), `tailwind-merge` (existing)
**Storage**: N/A
**Testing**: Vitest (unit), manual smoke testing
**Target Platform**: Tauri v2 desktop app (Windows/Mac/Linux)
**Project Type**: Desktop app (monorepo: `apps/forge` + `packages/ui`)
**Performance Goals**: Form interactions must feel instant (< 16ms re-renders)
**Constraints**: Field components must work with existing dark theme design tokens
**Scale/Scope**: 4 field component types, 1 form migration, ~15 new/modified files

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Constitution is not yet customized for this project (template placeholders only). No gates to evaluate. Proceeding.

**Post-Phase 1 re-check**: No violations. Design follows existing patterns (two-layer architecture: UI primitives in `packages/ui`, app-specific wiring in `apps/forge`).

## Project Structure

### Documentation (this feature)

```text
specs/006-form-components/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Research findings
├── data-model.md        # Entity definitions
├── quickstart.md        # Verification guide
├── contracts/
│   └── component-api.md # Component interface contracts
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
packages/ui/src/
├── components/
│   ├── Button/          # Already migrated to flat export
│   ├── Input/           # Flatten to direct export (remove .Root)
│   ├── Checkbox/        # Flatten to direct export (remove .Root)
│   ├── Select/          # Keep compound pattern (multi-part component)
│   └── FieldWrapper/    # NEW: label + error + description layout
│       ├── FieldWrapper.tsx
│       └── index.ts
└── index.ts             # Add FieldWrapper export

apps/forge/src/
├── lib/
│   └── form.ts          # NEW: createFormHook factory (useAppForm)
├── components/
│   └── fields/          # NEW: form-connected field components
│       ├── TextField.tsx
│       ├── TextareaField.tsx
│       ├── SelectField.tsx
│       ├── CheckboxField.tsx
│       ├── SubmitButton.tsx
│       └── index.ts
└── routes/
    └── new-project.tsx  # MODIFIED: migrate to TanStack Form
```

**Structure Decision**: Two-layer architecture. UI primitives stay in `packages/ui` (form-library agnostic). Form-connected wrappers live in `apps/forge` (TanStack Form specific). The form hook factory (`useAppForm`) is app-level since it binds specific field components.
