# Quickstart: Form Components & TanStack Form Integration

**Date**: 2026-03-06
**Feature**: 006-form-components

## Prerequisites

- Node.js, pnpm installed
- LTK Forge repo cloned, dependencies installed (`pnpm install`)
- On branch `006-form-components`

## Verify TanStack Form is Installed

```bash
pnpm --filter @ltk-forge/app list @tanstack/react-form
```

Should show `@tanstack/react-form` in the dependency list.

## Test 1: FieldWrapper Renders Correctly

1. Open storybook or a test route
2. Render a `FieldWrapper` with label, error, and description props
3. Verify: label appears above, error appears below in red, required indicator shows

## Test 2: Form Hook Factory Works

1. Create a minimal form using `useAppForm` from `apps/forge/src/lib/form.ts`
2. Add a `TextField` via `form.AppField`
3. Type in the field → form state updates
4. Blur the field with empty value (if required) → error appears
5. Submit → `onSubmit` callback fires with typed values

## Test 3: New Project Form Migration

1. Run the app: `pnpm --filter @ltk-forge/app dev`
2. Click "New Project" on the landing page
3. Leave all fields empty and click "Create Project"
4. Verify: inline validation errors appear on required fields
5. Fill in all required fields (Display Name, Machine Name, Author, Location)
6. Verify: machine name auto-derives from display name
7. Click "Create Project"
8. Verify: project is created and navigates to project browser

## Test 4: Field Components Render with Design System

1. Check that all field components (TextField, TextareaField, SelectField, CheckboxField) use design tokens
2. Verify dark theme styling: input backgrounds, borders, focus rings, error colors
3. Verify size prop works (sm, md, lg)
4. Verify disabled state dims the field

## Smoke Test Checklist

- [ ] `pnpm --filter @ltk-forge/ui typecheck` passes
- [ ] `pnpm --filter @ltk-forge/app typecheck` passes
- [ ] FieldWrapper displays label, error, description correctly
- [ ] TextField binds to form state (value, onChange, onBlur)
- [ ] Validation errors appear on blur for required fields
- [ ] New Project form creates projects successfully
- [ ] All fields match dark theme design system
