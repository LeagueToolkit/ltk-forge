import * as React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { twMerge } from "tailwind-merge";
import { LuCheck } from "react-icons/lu";
import type { Size } from "../../types";

const sizeClasses: Record<Size, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

const indicatorSizeClasses: Record<Size, string> = {
  sm: "h-3 w-3",
  md: "h-3.5 w-3.5",
  lg: "h-4 w-4",
};

export interface CheckboxProps extends Omit<
  BaseCheckbox.Root.Props,
  "className"
> {
  size?: Size;
  className?: string;
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  function Checkbox({ size = "md", className, ...props }, ref) {
    return (
      <BaseCheckbox.Root
        ref={ref}
        className={twMerge(
          "inline-flex items-center justify-center rounded-[var(--radius-sm)]",
          "border border-[var(--color-border-default)]",
          "bg-[var(--color-bg-input)]",
          "transition-colors duration-[var(--transition-fast)]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]",
          "data-[checked]:bg-[var(--color-primary-600)] data-[checked]:border-[var(--color-primary-600)]",
          "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        <BaseCheckbox.Indicator
          className={twMerge(
            "flex items-center justify-center text-white",
            indicatorSizeClasses[size],
          )}
        >
          <LuCheck className="h-full w-full" />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
    );
  },
);
