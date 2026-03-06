import { useFieldContext } from "../../lib/form-context";
import { FieldWrapper, Checkbox } from "@ltk-forge/ui";

export interface CheckboxFieldProps {
  label: string;
  description?: string;
}

export function CheckboxField({ label, description }: CheckboxFieldProps) {
  const field = useFieldContext<boolean>();

  const errors = field.state.meta.errors;
  const error =
    field.state.meta.isTouched && errors.length > 0
      ? errors.map((e) => (typeof e === "string" ? e : String(e))).join(", ")
      : undefined;

  return (
    <FieldWrapper description={description} error={error}>
      <div className="flex items-center gap-2">
        <Checkbox
          checked={field.state.value ?? false}
          onCheckedChange={(checked) => {
            field.handleChange(checked as boolean);
            field.handleBlur();
          }}
        />
        <label className="text-[length:var(--font-size-sm)] text-[var(--color-text-primary)] select-none cursor-pointer">
          {label}
        </label>
      </div>
    </FieldWrapper>
  );
}
