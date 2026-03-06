# Data Model: Form Components & TanStack Form Integration

**Date**: 2026-03-06
**Feature**: 006-form-components

## Entities

### FieldWrapper

A layout wrapper that provides consistent structure around any form input.

- **label** (string, optional): Text label displayed above the field
- **description** (string, optional): Help text displayed below the field
- **error** (string, optional): Validation error message displayed below the field (replaces description when present)
- **required** (boolean, default: false): Shows a required indicator on the label
- **size** (Size: "sm" | "md" | "lg", default: "md"): Controls label and description text sizing
- **disabled** (boolean, default: false): Dims the entire field wrapper
- **children** (ReactNode): The actual input control

### TextField

Form-connected text input field.

- **name** (form field path): TanStack Form field name binding
- **label** (string, optional)
- **description** (string, optional)
- **required** (boolean)
- **placeholder** (string, optional)
- **type** (string, default: "text"): HTML input type (text, email, password, url, etc.)
- **validators** (TanStack Form validators): onBlur, onChange, onSubmit

### TextareaField

Form-connected textarea field.

- **name** (form field path)
- **label** (string, optional)
- **description** (string, optional)
- **required** (boolean)
- **placeholder** (string, optional)
- **rows** (number, default: 3)
- **validators** (TanStack Form validators)

### SelectField

Form-connected select field.

- **name** (form field path)
- **label** (string, optional)
- **description** (string, optional)
- **required** (boolean)
- **options** (array of { value: string, label: string })
- **placeholder** (string, optional)
- **validators** (TanStack Form validators)

### CheckboxField

Form-connected checkbox field.

- **name** (form field path)
- **label** (string): Always required for checkboxes (accessibility)
- **description** (string, optional)
- **validators** (TanStack Form validators)

### Form Hook Factory (App-Level)

- **fieldComponents**: Registry of TextField, TextareaField, SelectField, CheckboxField
- **formComponents**: Registry of SubmitButton (reactive submit with canSubmit/isSubmitting)
- **Returns**: `useAppForm` hook with `form.AppField` and `form.AppForm` pre-bound

## Relationships

```
FormHookFactory
  ├── registers → TextField → wraps → FieldWrapper + Input (UI primitive)
  ├── registers → TextareaField → wraps → FieldWrapper + <textarea>
  ├── registers → SelectField → wraps → FieldWrapper + Select (UI primitive)
  ├── registers → CheckboxField → wraps → FieldWrapper + Checkbox (UI primitive)
  └── registers → SubmitButton → wraps → Button (UI primitive)

useAppForm (produced by factory)
  └── form.AppField → renders registered field component with type-safe name binding
```
