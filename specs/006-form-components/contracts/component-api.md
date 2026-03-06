# Component API Contracts: Form Components

**Date**: 2026-03-06
**Feature**: 006-form-components

## UI Primitives (`@ltk-forge/ui`)

### FieldWrapper

Layout wrapper providing label, error, and description around any input.

```tsx
interface FieldWrapperProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

<FieldWrapper label="Email" error="Invalid email" required>
  <Input ... />
</FieldWrapper>
```

### Input (existing, to be flattened)

```tsx
// Current: <Input.Root inputSize="md" ... />
// New:     <Input inputSize="md" ... />
interface InputProps extends Omit<BaseInput.Props, "className" | "size"> {
  inputSize?: Size;
  className?: string;
}
```

### Checkbox (existing, to be flattened)

```tsx
// Current: <Checkbox.Root size="md" ... />
// New:     <Checkbox size="md" ... />
interface CheckboxProps extends Omit<BaseCheckbox.Root.Props, "className"> {
  size?: Size;
  className?: string;
}
```

### Select (existing, keeps compound pattern)

```tsx
// Unchanged — compound component with sub-parts
<Select.Root value={v} onValueChange={setV}>
  <Select.Trigger>
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Portal>
    <Select.Positioner>
      <Select.Popup>
        <Select.Item value="a">
          <Select.ItemText>A</Select.ItemText>
        </Select.Item>
      </Select.Popup>
    </Select.Positioner>
  </Select.Portal>
</Select.Root>
```

## Form-Connected Fields (`apps/forge/src/components/fields/`)

All form field components use `useFieldContext()` from the app's form hook context. They are registered with `createFormHook` and used via `form.AppField`.

### TextField

```tsx
interface TextFieldProps {
  label?: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  type?: string; // "text" | "email" | "password" | "url" | etc.
}

// Usage via form.AppField:
<form.AppField name="email" children={(field) => <TextField label="Email" required />} />

// Or with pre-bound component:
<form.AppField name="email">
  {(field) => <TextField label="Email" required />}
</form.AppField>
```

### TextareaField

```tsx
interface TextareaFieldProps {
  label?: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
}
```

### SelectField

```tsx
interface SelectFieldProps {
  label?: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
}
```

### CheckboxField

```tsx
interface CheckboxFieldProps {
  label: string; // Required for accessibility
  description?: string;
}
```

### SubmitButton

```tsx
interface SubmitButtonProps {
  children?: React.ReactNode;
  loadingText?: string;
}

// Subscribes to form.canSubmit and form.isSubmitting
// Renders Button with disabled state and loading text
```

## Form Hook Factory (`apps/forge/src/lib/form.ts`)

```tsx
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

const { fieldContext, formContext, useFieldContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextareaField,
    SelectField,
    CheckboxField,
  },
  formComponents: {
    SubmitButton,
  },
});

export { useAppForm, useFieldContext };
```

## Usage Pattern (New Project Form)

```tsx
const formOpts = formOptions({
  defaultValues: {
    displayName: "",
    name: "",
    description: "",
    version: "1.0.0",
    author: "",
    projectPath: "",
  },
});

function NewProjectForm() {
  const form = useAppForm({
    ...formOpts,
    onSubmit: async ({ value }) => {
      await createProject(value);
      navigate({ to: "/project/browser" });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.AppField name="displayName">
        {(field) => <TextField label="Display Name" required />}
      </form.AppField>
      <form.AppField name="name">
        {(field) => <TextField label="Machine Name" required />}
      </form.AppField>
      {/* ... */}
      <form.AppForm>
        {(FormCtx) => <SubmitButton>Create Project</SubmitButton>}
      </form.AppForm>
    </form>
  );
}
```
