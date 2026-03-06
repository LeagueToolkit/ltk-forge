import * as React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { twMerge } from "tailwind-merge";
import type { Intent, Size } from "../../types";

const sizeClasses: Record<Size, string> = {
  sm: "px-2.5 py-1 text-[length:var(--font-size-sm)] gap-1",
  md: "px-3.5 py-1.5 text-[length:var(--font-size-base)] gap-1.5",
  lg: "px-5 py-2.5 text-[length:var(--font-size-lg)] gap-2",
};

const solidIntentClasses: Record<Intent, string> = {
  primary:
    "bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-500)]",
  info: "bg-[var(--color-info-600)] text-white hover:bg-[var(--color-info-500)]",
  success:
    "bg-[var(--color-success-600)] text-white hover:bg-[var(--color-success-500)]",
  danger:
    "bg-[var(--color-danger-600)] text-white hover:bg-[var(--color-danger-500)]",
};

const outlineIntentClasses: Record<Intent, string> = {
  primary:
    "border border-[var(--color-primary-600)] text-[var(--color-primary-400)] hover:bg-[var(--color-primary-950)]",
  info: "border border-[var(--color-info-600)] text-[var(--color-info-400)] hover:bg-[var(--color-info-950)]",
  success:
    "border border-[var(--color-success-600)] text-[var(--color-success-400)] hover:bg-[var(--color-success-950)]",
  danger:
    "border border-[var(--color-danger-600)] text-[var(--color-danger-400)] hover:bg-[var(--color-danger-950)]",
};

const ghostIntentClasses: Record<Intent, string> = {
  primary:
    "text-[var(--color-primary-400)] hover:bg-[var(--color-primary-950)]",
  info: "text-[var(--color-info-400)] hover:bg-[var(--color-info-950)]",
  success:
    "text-[var(--color-success-400)] hover:bg-[var(--color-success-950)]",
  danger: "text-[var(--color-danger-400)] hover:bg-[var(--color-danger-950)]",
};

const variantIntentMap = {
  solid: solidIntentClasses,
  outline: outlineIntentClasses,
  ghost: ghostIntentClasses,
} as const;

type ButtonVariant = "solid" | "outline" | "ghost";

interface ButtonRootProps extends Omit<BaseButton.Props, "className"> {
  variant?: ButtonVariant;
  intent?: Intent;
  size?: Size;
  className?: string;
}

const ButtonRoot = React.forwardRef<HTMLElement, ButtonRootProps>(
  function ButtonRoot(
    { variant = "solid", intent = "primary", size = "md", className, ...props },
    ref,
  ) {
    return (
      <BaseButton
        ref={ref}
        className={twMerge(
          "inline-flex items-center justify-center font-[number:var(--font-weight-medium)] rounded-[var(--radius-md)] select-none",
          "transition-colors duration-[var(--transition-fast)]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]",
          "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
          sizeClasses[size],
          variantIntentMap[variant][intent],
          className,
        )}
        {...props}
      />
    );
  },
);

export const Button = {
  Root: ButtonRoot,
};
