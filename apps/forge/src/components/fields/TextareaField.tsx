import { twMerge } from "tailwind-merge";
import { useFieldContext } from "../../lib/form-context";
import { FieldWrapper } from "@ltk-forge/ui";

export interface TextareaFieldProps {
  label?: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
}

export function TextareaField({
  label,
  description,
  required,
  placeholder,
  rows = 3,
}: TextareaFieldProps) {
  const field = useFieldContext<string>();

  const errors = field.state.meta.errors;
  const error =
    field.state.meta.isTouched && errors.length > 0
      ? errors.map((e) => (typeof e === "string" ? e : String(e))).join(", ")
      : undefined;

  return (
    <FieldWrapper
      label={label}
      description={description}
      error={error}
      required={required}
    >
      <textarea
        placeholder={placeholder}
        rows={rows}
        value={field.state.value ?? ""}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        className={twMerge(
          "w-full rounded-[var(--radius-md)] resize-none",
          "bg-[var(--color-bg-input)] text-[var(--color-text-primary)]",
          "border border-[var(--color-border-default)]",
          "placeholder:text-[var(--color-text-tertiary)]",
          "transition-colors duration-[var(--transition-fast)]",
          "focus:border-[var(--color-border-focus)] focus:outline-none",
          "px-3 py-1.5 text-[length:var(--font-size-base)]",
        )}
      />
    </FieldWrapper>
  );
}
