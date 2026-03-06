# Tasks: Form Components & TanStack Form Integration

**Input**: Design documents from `/specs/006-form-components/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add TanStack Form dependency and prepare module structure

- [x] T001 Add `@tanstack/react-form` dependency in `apps/forge/package.json`
- [x] T002 [P] Create form field components directory structure: `apps/forge/src/components/fields/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the FieldWrapper UI primitive and flatten existing component exports — these MUST be complete before any form field components can be built

- [x] T003 Create `FieldWrapper` component in `packages/ui/src/components/FieldWrapper/FieldWrapper.tsx` with label, error, description, required indicator, and size prop
- [x] T004 [P] Export `FieldWrapper` from `packages/ui/src/components/FieldWrapper/index.ts` and `packages/ui/src/index.ts`
- [x] T005 [P] Flatten `Input` component export from `Input.Root` to direct `<Input>` in `packages/ui/src/components/Input/Input.tsx` and update barrel exports
- [x] T006 [P] Flatten `Checkbox` component export from `Checkbox.Root` to direct `<Checkbox>` in `packages/ui/src/components/Checkbox/Checkbox.tsx` and update barrel exports
- [x] T007 Update all existing usages of `Input.Root` and `Checkbox.Root` across `apps/forge/src/` to use the flattened exports
- [x] T008 Create form hook factory with `createFormHook` + `createFormHookContexts` in `apps/forge/src/lib/form.ts`, exporting `useAppForm` and `useFieldContext`

**Checkpoint**: Foundation ready — FieldWrapper exists, exports flattened, form hook factory created

---

## Phase 3: User Story 1 — Build Forms with Reusable Field Components (Priority: P1) MVP

**Goal**: Developers can build forms using pre-built, styled field components that are automatically wired to TanStack Form state with validation error display

**Independent Test**: Build a test form with text, select, and checkbox fields — verify state management, validation errors, and visual styling

- [x] T009 [P] [US1] Create `TextField` component in `apps/forge/src/components/fields/TextField.tsx` using `useFieldContext`, wrapping `FieldWrapper` + `Input`
- [x] T010 [P] [US1] Create `TextareaField` component in `apps/forge/src/components/fields/TextareaField.tsx` using `useFieldContext`, wrapping `FieldWrapper` + styled `<textarea>`
- [x] T011 [P] [US1] Create `SelectField` component in `apps/forge/src/components/fields/SelectField.tsx` using `useFieldContext`, wrapping `FieldWrapper` + `Select` compound component with `options` prop
- [x] T012 [P] [US1] Create `CheckboxField` component in `apps/forge/src/components/fields/CheckboxField.tsx` using `useFieldContext`, wrapping `FieldWrapper` + `Checkbox`
- [x] T013 [P] [US1] Create `SubmitButton` component in `apps/forge/src/components/fields/SubmitButton.tsx` subscribing to `canSubmit` and `isSubmitting` from form context
- [x] T014 [US1] Export all field components from `apps/forge/src/components/fields/index.ts` and register them in the form hook factory in `apps/forge/src/lib/form.ts`

**Checkpoint**: User Story 1 fully functional — field components can be used in any form via `form.AppField`

---

## Phase 4: User Story 2 — Migrate Existing Forms to TanStack Form (Priority: P2)

**Goal**: The "New Project" form uses TanStack Form and reusable field components, reducing code and adding inline validation

**Independent Test**: Create a new project through the migrated form — verify all fields work, validation triggers, and project creation succeeds

- [x] T015 [US2] Define `formOptions` with default values and validators for the new-project form in `apps/forge/src/routes/new-project.tsx`
- [x] T016 [US2] Migrate the new-project form from raw `useState` to `useAppForm` with `form.AppField` components in `apps/forge/src/routes/new-project.tsx`
- [x] T017 [US2] Implement auto-derive machine name from display name using TanStack Form's field listener/onChange in `apps/forge/src/routes/new-project.tsx`
- [x] T018 [US2] Wire form submission to Zustand store's `createProject` action with proper error handling in `apps/forge/src/routes/new-project.tsx`
- [x] T019 [US2] Remove the `.field-input` CSS class from `apps/forge/src/styles/app.css` (replaced by field components)

**Checkpoint**: New Project form fully migrated — same functionality with less code and inline validation

---

## Phase 5: User Story 3 — Form-Level Validation and Cross-Field Rules (Priority: P3)

**Goal**: Support pattern validators, async validators, and cross-field validation rules

**Independent Test**: Enter invalid data (bad machine name characters, malformed version) and verify specific error messages appear

- [x] T020 [US3] Add machine name pattern validator (alphanumeric + hyphens/underscores) to the new-project form in `apps/forge/src/routes/new-project.tsx`
- [x] T021 [US3] Add version field format validator (semver-like pattern) to the new-project form in `apps/forge/src/routes/new-project.tsx`
- [x] T022 [US3] Add loading indicator support to `TextField` for async validation states in `apps/forge/src/components/fields/TextField.tsx`

**Checkpoint**: All user stories independently functional — field-level and form-level validation working

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T023 Verify all field components match dark theme design tokens and size variants (sm, md, lg) across the app
- [ ] T024 Run quickstart.md smoke test checklist: typecheck, FieldWrapper rendering, form state binding, new-project form end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phases 3–5)**: All depend on Foundational phase completion
  - US1 must complete before US2 (US2 uses field components from US1)
  - US3 can proceed after US1 (adds validators to existing components)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — creates all field components
- **User Story 2 (P2)**: Depends on US1 — uses field components to migrate the form
- **User Story 3 (P3)**: Depends on US1 — adds validators to existing field components and form

---

## Parallel Opportunities

### Phase 2 (Foundational)

```text
T003 (FieldWrapper) can run in parallel with:
  T005 (flatten Input)
  T006 (flatten Checkbox)

T004 (FieldWrapper export) depends on T003
T007 (update usages) depends on T005, T006
T008 (form factory) depends on T001
```

### Phase 3 (US1 - Field Components)

```text
All field components can be built in parallel:
  T009 (TextField)
  T010 (TextareaField)
  T011 (SelectField)
  T012 (CheckboxField)
  T013 (SubmitButton)

T014 (register in factory) depends on T009–T013
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup (T001–T002)
2. Complete Phase 2: Foundational (T003–T008)
3. Complete Phase 3: User Story 1 — Field Components (T009–T014)
4. Complete Phase 4: User Story 2 — Migrate New Project Form (T015–T019)
5. **STOP and VALIDATE**: Create a project using the migrated form
6. Demo-ready MVP

---

## Notes

- TanStack Form's `createFormHook` is the composition pattern — field components use `useFieldContext()` for type-safe binding
- FieldWrapper is a UI primitive (no TanStack Form dependency) — lives in `@ltk-forge/ui`
- Form-connected field components live in `apps/forge` (app-specific TanStack Form binding)
- Select keeps its compound pattern (multi-part) while Input and Checkbox get flattened
- The `.field-input` CSS class is deprecated after migration (T019)
