import * as React from "react";
import { Input as BaseInput } from "@base-ui/react/input";
import { twMerge } from "tailwind-merge";
import type { Size } from "../../types";

const sizeClasses: Record<Size, string> = {
  sm: "px-2.5 py-1 text-[length:var(--font-size-sm)]",
  md: "px-3 py-1.5 text-[length:var(--font-size-base)]",
  lg: "px-4 py-2.5 text-[length:var(--font-size-lg)]",
};

export interface InputProps extends Omit<
  BaseInput.Props,
  "className" | "size"
> {
  size?: Size;
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ size = "md", className, ...props }, ref) {
    return (
      <BaseInput
        ref={ref}
        className={twMerge(
          "w-full rounded-[var(--radius-md)]",
          "bg-[var(--color-bg-input)] text-[var(--color-text-primary)]",
          "border border-[var(--color-border-default)]",
          "placeholder:text-[var(--color-text-tertiary)]",
          "transition-colors duration-[var(--transition-fast)]",
          "focus:border-[var(--color-border-focus)] focus:outline-none",
          "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);
