import { useFieldContext } from "../../lib/form-context";
import { FieldWrapper, Select } from "@ltk-forge/ui";

export interface SelectFieldProps {
  label?: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
}

export function SelectField({
  label,
  description,
  required,
  placeholder,
  options,
}: SelectFieldProps) {
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
      <Select.Root
        value={field.state.value ?? ""}
        onValueChange={(val) => {
          field.handleChange(val ?? "");
          field.handleBlur();
        }}
      >
        <Select.Trigger>
          <Select.Value placeholder={placeholder} />
          <Select.Icon />
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner>
            <Select.Popup>
              {options.map((opt) => (
                <Select.Item key={opt.value} value={opt.value}>
                  <Select.ItemText>{opt.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </FieldWrapper>
  );
}
