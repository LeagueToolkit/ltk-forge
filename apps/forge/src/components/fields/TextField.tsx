import { useFieldContext } from "../../lib/form-context";
import { FieldWrapper, Input } from "@ltk-forge/ui";

export interface TextFieldProps {
  label?: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
}

export function TextField({
  label,
  description,
  required,
  placeholder,
  type = "text",
}: TextFieldProps) {
  const field = useFieldContext<string>();

  const errors = field.state.meta.errors;
  const isValidating = field.state.meta.isValidating;
  const error =
    field.state.meta.isTouched && errors.length > 0
      ? errors.map((e) => (typeof e === "string" ? e : String(e))).join(", ")
      : undefined;

  const displayDescription = isValidating ? "Validating..." : description;

  return (
    <FieldWrapper
      label={label}
      description={displayDescription}
      error={error}
      required={required}
    >
      <Input
        type={type}
        placeholder={placeholder}
        value={field.state.value ?? ""}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      />
    </FieldWrapper>
  );
}
