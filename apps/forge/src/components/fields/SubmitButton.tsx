import { useFormContext } from "../../lib/form-context";
import { Button } from "@ltk-forge/ui";
import type { ButtonProps } from "@ltk-forge/ui";

export interface SubmitButtonProps extends Omit<
  ButtonProps,
  "type" | "disabled"
> {
  loadingText?: string;
}

export function SubmitButton({
  children = "Submit",
  loadingText = "Submitting...",
  ...props
}: SubmitButtonProps) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button type="submit" disabled={!canSubmit || isSubmitting} {...props}>
          {isSubmitting ? loadingText : children}
        </Button>
      )}
    </form.Subscribe>
  );
}
