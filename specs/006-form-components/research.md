# Research: Form Components & TanStack Form Integration

**Date**: 2026-03-06
**Feature**: 006-form-components

## R1: TanStack Form Composition API

**Decision**: Use `createFormHook` + `createFormHookContexts` pattern for app-level form factory.

**Rationale**: TanStack Form's recommended approach for reusable field components is:

1. `createFormHookContexts()` → creates `fieldContext` and `formContext` React contexts
2. Build field components that call `useFieldContext()` from that context to get field state
3. `createFormHook({ fieldContext, formContext, fieldComponents, formComponents })` → produces `useAppForm` hook
4. Forms use `useAppForm()` and `form.AppField` (pre-bound with registered components)

This gives type-safe field name binding, pre-registered UI components, and eliminates per-form boilerplate.

**Alternatives considered**:

- Raw `useForm` + `form.Field` with render props: Works but requires repeating label/error/layout wrappers in every form. No component reuse.
- `withForm` HOC: Older pattern, still supported but `createFormHook` is the current recommendation.

## R2: Validation Strategy

**Decision**: Use `onBlur` for field-level validation, `onSubmit` for form-level validation.

**Rationale**: TanStack Form supports `onChange`, `onBlur`, `onSubmit`, and `onMount` validators. `onBlur` provides good UX — errors appear after the user finishes interacting with a field, not while typing. `onSubmit` catches form-level concerns. After first submit, TanStack Form defaults to `onChange` revalidation so errors clear immediately when fixed.

**Alternatives considered**:

- `onChange`: Too aggressive — shows errors while user is still typing
- `onSubmit` only: Too late — user doesn't know about errors until they try to submit

## R3: Where to Place Form Hook Factory

**Decision**: Create the form hook factory in `apps/forge/src/lib/form.ts` (app-level), not in `@ltk-forge/ui`.

**Rationale**: The `createFormHook` call binds specific field components to a form context. This is application-specific — different apps might register different field components. The UI package provides the raw field components; the app wires them into TanStack Form via the factory.

Field components in `@ltk-forge/ui` will be designed to work both:

- Standalone (without TanStack Form) — accepting standard props like `value`, `onChange`, `error`
- With TanStack Form — via thin wrapper components in the app that use `useFieldContext()`

**Alternatives considered**:

- Factory in `@ltk-forge/ui`: Would couple the UI package to TanStack Form, reducing reusability
- No factory, use `form.Field` render props directly: Works but doesn't leverage composition

## R4: Field Component Architecture

**Decision**: Two layers — primitive components in `@ltk-forge/ui`, form-connected wrappers in the app.

**Rationale**:

- **UI primitives** (already exist: `Input`, `Select`, `Checkbox`): Headless-styled components. Accept standard React props. No form library dependency.
- **Form field wrappers** (new, in app): `TextField`, `TextareaField`, `SelectField`, `CheckboxField`. Use `useFieldContext()` to bind to TanStack Form state. Wrap the UI primitive with label, error display, and description.

This two-layer approach keeps `@ltk-forge/ui` form-library agnostic while providing zero-boilerplate form usage in the app.

**Alternatives considered**:

- Single layer (field components with optional form binding): More complex component API, harder to tree-shake
- Everything in UI package: Forces TanStack Form as a dependency of the UI library

## R5: Existing Component Migration

**Decision**: Flatten namespace exports for Input, Select, Checkbox to match new Button pattern.

**Rationale**: Button was just migrated from `Button.Root` to `<Button>`. Input currently uses `Input.Root`, Select uses `Select.Root`/`Select.Trigger`/etc. For consistency:

- `Input` should export as a flat component (like Button)
- `Select` keeps compound pattern (`Select.Root`, `Select.Trigger`, etc.) because it has multiple sub-components
- `Checkbox` should export as a flat component

This matches the pattern established by the Button refactor.
