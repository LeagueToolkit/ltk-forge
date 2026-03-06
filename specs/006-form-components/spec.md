# Feature Specification: Form Components & TanStack Form Integration

**Feature Branch**: `006-form-components`
**Created**: 2026-03-06
**Status**: Draft
**Input**: User description: "We should use TanStack Form for form fields. Additionally we should also create a reusable input component, select, etc."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Build Forms with Reusable Field Components (Priority: P1)

A developer building a form in LTK Forge wants to use pre-built, styled field components (text input, select, checkbox, textarea) that are automatically wired to TanStack Form state. Instead of manually managing `value`, `onChange`, `onBlur`, error display, and labels for each input, the developer uses a single composable field component that handles all of this. The field components match the application's design system (dark theme, consistent sizing, focus states) and provide built-in error message display.

**Why this priority**: Without reusable form-connected field components, every form in the app requires verbose boilerplate to wire inputs to form state, display validation errors, and maintain visual consistency. This is the foundation all other stories build on.

**Independent Test**: Can be tested by building a simple form with text, select, and checkbox fields — submitting valid and invalid data and verifying state management, validation errors, and visual styling all work correctly.

**Acceptance Scenarios**:

1. **Given** a developer creates a form using the app's form hook, **When** they add a text field component with a `name` prop, **Then** the field is automatically connected to form state with value binding, change handling, and blur tracking.
2. **Given** a form field has a validation error, **When** the field is blurred or the form is submitted, **Then** an error message appears below the field in a consistent error style.
3. **Given** a developer uses a select field component, **When** the user picks an option, **Then** the form state updates and the selected value is reflected in the trigger display.
4. **Given** a developer uses a checkbox field component, **When** the user toggles it, **Then** the form state updates with the boolean value.

---

### User Story 2 - Migrate Existing Forms to TanStack Form (Priority: P2)

The existing "New Project" form currently uses raw React state (`useState` per field) with manual validation. A developer migrates this form to use TanStack Form and the new reusable field components, reducing code volume and gaining declarative validation, consistent error display, and field-level dirty/touched tracking.

**Why this priority**: The new-project form is the primary form in the app today. Migrating it validates that the component library works for real use cases and establishes the pattern for all future forms.

**Independent Test**: Can be tested by creating a new project through the migrated form — verifying all fields work (display name, machine name, description, version, author, location), validation triggers correctly, and project creation succeeds as before.

**Acceptance Scenarios**:

1. **Given** the new-project form uses TanStack Form, **When** a user fills in all required fields and submits, **Then** the project is created and the user navigates to the project browser (identical behavior to current).
2. **Given** the new-project form, **When** a user submits with missing required fields, **Then** validation errors appear inline next to each invalid field.
3. **Given** the display name field, **When** the user types a display name, **Then** the machine name field auto-derives a slug (preserving existing behavior).
4. **Given** the form is in a submitting state, **When** the backend call is in progress, **Then** the submit button shows a loading state and fields are disabled.

---

### User Story 3 - Form-Level Validation and Cross-Field Rules (Priority: P3)

A developer needs to enforce validation rules that depend on multiple fields or form-level state. For example, ensuring the machine name follows a specific pattern, or that the version field contains a valid semver string. TanStack Form's validator infrastructure handles both field-level and form-level validation declaratively.

**Why this priority**: While basic field-level validation (required, min length) covers most needs, cross-field and pattern validation ensures data quality for more complex forms that will be added as the application grows.

**Independent Test**: Can be tested by entering invalid data combinations (e.g., invalid machine name characters, malformed version string) and verifying appropriate error messages appear.

**Acceptance Scenarios**:

1. **Given** a field with a pattern validator (e.g., machine name must be alphanumeric with hyphens/underscores), **When** the user enters invalid characters, **Then** a specific error message explains the constraint.
2. **Given** a field with async validation (e.g., checking path availability), **When** validation is running, **Then** a loading indicator appears on the field.
3. **Given** multiple validation errors on a form, **When** the user fixes one field, **Then** only that field's error clears while others remain.

---

### Edge Cases

- What happens when a form field component is used outside of a TanStack Form context? It should render normally but without form-state binding (graceful degradation for standalone use).
- How does the system handle form submission when an async validator is still running? Submission should wait for all pending validations to resolve.
- What happens when a field's default value is `undefined`? The component should treat it as an empty string for text inputs, `false` for checkboxes, and `undefined` (no selection) for selects.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST provide a centralized form hook factory (`createFormHook` pattern) that produces a form hook pre-bound with the application's field components.
- **FR-002**: The system MUST provide form-connected field components for: text input, textarea, select (single-value), and checkbox.
- **FR-003**: Each field component MUST automatically display validation error messages when the field has been touched or the form has been submitted.
- **FR-004**: Each field component MUST support a label, optional description/help text, and required indicator.
- **FR-005**: Field components MUST accept a `size` prop consistent with the existing design system size scale (sm, md, lg).
- **FR-006**: The system MUST support field-level synchronous and asynchronous validators.
- **FR-007**: The system MUST support form-level validation that runs on submit.
- **FR-008**: The form hook MUST provide type-safe field name binding — referencing a non-existent field name should produce a type error.
- **FR-009**: The existing "New Project" form MUST be migrated to use TanStack Form and the new field components.
- **FR-010**: Field components MUST be usable both through the form composition API (form.AppField) and as standalone components for non-form contexts.
- **FR-011**: The system MUST support disabled state for individual fields and entire forms.

### Key Entities

- **Form Hook Factory**: Application-level configuration that binds field components to TanStack Form's composition API, producing a typed `useAppForm` hook.
- **Field Component**: A styled, form-aware UI element (TextField, TextareaField, SelectField, CheckboxField) that combines a label, input control, error display, and help text into a single composable unit.
- **Form Options**: Reusable form configuration (default values, validators) that can be shared and extended across forms.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A new form with 5+ fields can be built with less than 50% of the code required by the current raw-state approach.
- **SC-002**: All form field components render consistently with the application's dark theme and design tokens.
- **SC-003**: Validation errors appear within 100ms of a field being blurred or form being submitted.
- **SC-004**: The migrated "New Project" form passes all existing acceptance scenarios with no regressions.
- **SC-005**: Type errors are surfaced at compile time when a field name doesn't match the form's data shape.

## Assumptions

- TanStack Form's `createFormHook` / `formOptions` API is the recommended composition pattern and is stable for production use.
- Field components will be added to the existing `@ltk-forge/ui` package alongside Button, Input, Select, etc.
- The existing headless Base UI primitives (Input, Select, Checkbox) will be used as the underlying controls inside the form-connected field components.
- Only single-value select is needed initially; multi-select can be added later.
- The `.field-input` CSS class in `app.css` will be deprecated in favor of the new field components.
