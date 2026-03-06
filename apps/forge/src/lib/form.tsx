import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./form-context";
import { TextField } from "../components/fields/TextField";
import { TextareaField } from "../components/fields/TextareaField";
import { SelectField } from "../components/fields/SelectField";
import { CheckboxField } from "../components/fields/CheckboxField";
import { SubmitButton } from "../components/fields/SubmitButton";

export { useFieldContext, useFormContext } from "./form-context";

export const { useAppForm, withForm } = createFormHook({
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
