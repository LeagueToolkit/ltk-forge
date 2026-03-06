import * as React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import type { Intent, Size } from "../../types";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "font-[number:var(--font-weight-medium)]",
    "rounded-[var(--radius-md)]",
    "select-none cursor-pointer",
    "transition-[background-color,border-color,box-shadow] duration-[var(--transition-fast)]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]",
    "data-[disabled]:opacity-40 data-[disabled]:pointer-events-none data-[disabled]:shadow-none",
    "active:translate-y-px",
  ],
  {
    variants: {
      variant: {
        filled: "",
        light: "",
        outline: "border bg-transparent",
        subtle: "bg-transparent",
        default: [
          "border border-[var(--color-border-default)] bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]",
          "hover:bg-[color-mix(in_srgb,var(--color-bg-tertiary)_80%,white_5%)] hover:border-[var(--color-border-default)]",
          "active:bg-[var(--color-bg-secondary)]",
        ],
        ghost: "",
      },
      intent: {
        primary: "",
        info: "",
        success: "",
        danger: "",
      },
      size: {
        sm: "h-7 px-2.5 text-[length:var(--font-size-xs)] gap-1",
        md: "h-8.5 px-3.5 text-[length:var(--font-size-sm)] gap-1.5",
        lg: "h-10.5 px-5 text-[length:var(--font-size-base)] gap-2",
      },
      compact: {
        true: "",
        false: "",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },

    compoundVariants: [
      {
        compact: true,
        size: "sm",
        class: "h-5.5 px-1.5 text-[length:var(--font-size-xs)] gap-0.5",
      },
      {
        compact: true,
        size: "md",
        class: "h-7 px-2 text-[length:var(--font-size-xs)] gap-1",
      },
      {
        compact: true,
        size: "lg",
        class: "h-8.5 px-3 text-[length:var(--font-size-sm)] gap-1.5",
      },

      {
        variant: "filled",
        intent: "primary",
        class:
          "bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-700)] active:bg-[var(--color-primary-800)]",
      },
      {
        variant: "filled",
        intent: "info",
        class:
          "bg-[var(--color-info-600)] text-white hover:bg-[var(--color-info-700)] active:bg-[var(--color-info-800)]",
      },
      {
        variant: "filled",
        intent: "success",
        class:
          "bg-[var(--color-success-600)] text-white hover:bg-[var(--color-success-700)] active:bg-[var(--color-success-800)]",
      },
      {
        variant: "filled",
        intent: "danger",
        class:
          "bg-[var(--color-danger-600)] text-white hover:bg-[var(--color-danger-700)] active:bg-[var(--color-danger-800)]",
      },

      {
        variant: "light",
        intent: "primary",
        class:
          "bg-[var(--color-primary-950)] text-[var(--color-primary-300)] hover:bg-[color-mix(in_srgb,var(--color-primary-900)_40%,transparent)] active:bg-[color-mix(in_srgb,var(--color-primary-900)_60%,transparent)]",
      },
      {
        variant: "light",
        intent: "info",
        class:
          "bg-[var(--color-info-950)] text-[var(--color-info-300)] hover:bg-[color-mix(in_srgb,var(--color-info-900)_40%,transparent)] active:bg-[color-mix(in_srgb,var(--color-info-900)_60%,transparent)]",
      },
      {
        variant: "light",
        intent: "success",
        class:
          "bg-[var(--color-success-950)] text-[var(--color-success-300)] hover:bg-[color-mix(in_srgb,var(--color-success-900)_40%,transparent)] active:bg-[color-mix(in_srgb,var(--color-success-900)_60%,transparent)]",
      },
      {
        variant: "light",
        intent: "danger",
        class:
          "bg-[var(--color-danger-950)] text-[var(--color-danger-300)] hover:bg-[color-mix(in_srgb,var(--color-danger-900)_40%,transparent)] active:bg-[color-mix(in_srgb,var(--color-danger-900)_60%,transparent)]",
      },

      {
        variant: "outline",
        intent: "primary",
        class:
          "border-[var(--color-primary-700)] text-[var(--color-primary-400)] hover:bg-[var(--color-primary-950)] active:bg-[color-mix(in_srgb,var(--color-primary-900)_30%,transparent)]",
      },
      {
        variant: "outline",
        intent: "info",
        class:
          "border-[var(--color-info-700)] text-[var(--color-info-400)] hover:bg-[var(--color-info-950)] active:bg-[color-mix(in_srgb,var(--color-info-900)_30%,transparent)]",
      },
      {
        variant: "outline",
        intent: "success",
        class:
          "border-[var(--color-success-700)] text-[var(--color-success-400)] hover:bg-[var(--color-success-950)] active:bg-[color-mix(in_srgb,var(--color-success-900)_30%,transparent)]",
      },
      {
        variant: "outline",
        intent: "danger",
        class:
          "border-[var(--color-danger-700)] text-[var(--color-danger-400)] hover:bg-[var(--color-danger-950)] active:bg-[color-mix(in_srgb,var(--color-danger-900)_30%,transparent)]",
      },

      {
        variant: "subtle",
        intent: "primary",
        class:
          "text-[var(--color-primary-400)] hover:bg-[var(--color-primary-950)] active:bg-[color-mix(in_srgb,var(--color-primary-900)_30%,transparent)]",
      },
      {
        variant: "subtle",
        intent: "info",
        class:
          "text-[var(--color-info-400)] hover:bg-[var(--color-info-950)] active:bg-[color-mix(in_srgb,var(--color-info-900)_30%,transparent)]",
      },
      {
        variant: "subtle",
        intent: "success",
        class:
          "text-[var(--color-success-400)] hover:bg-[var(--color-success-950)] active:bg-[color-mix(in_srgb,var(--color-success-900)_30%,transparent)]",
      },
      {
        variant: "subtle",
        intent: "danger",
        class:
          "text-[var(--color-danger-400)] hover:bg-[var(--color-danger-950)] active:bg-[color-mix(in_srgb,var(--color-danger-900)_30%,transparent)]",
      },

      {
        variant: "ghost",
        intent: ["primary", "info", "success", "danger"],
        class:
          "text-[var(--color-text-secondary)] bg-transparent hover:bg-[var(--color-bg-tertiary)] active:bg-[color-mix(in_srgb,var(--color-bg-tertiary)_80%,black_10%)]",
      },
    ],

    defaultVariants: {
      variant: "filled",
      intent: "primary",
      size: "md",
      compact: false,
      fullWidth: false,
    },
  },
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

type ButtonVariant = NonNullable<ButtonVariantProps["variant"]> | "solid";

export interface ButtonProps extends Omit<BaseButton.Props, "className"> {
  variant?: ButtonVariant;
  intent?: Intent;
  size?: Size;
  compact?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const Button = React.forwardRef<HTMLElement, ButtonProps>(
  function Button(
    {
      variant = "filled",
      intent = "primary",
      size = "md",
      compact = false,
      fullWidth = false,
      className,
      ...props
    },
    ref,
  ) {
    const resolvedVariant = variant === "solid" ? "filled" : variant;

    return (
      <BaseButton
        ref={ref}
        className={twMerge(
          buttonVariants({
            variant: resolvedVariant,
            intent,
            size,
            compact,
            fullWidth,
          }),
          className,
        )}
        {...props}
      />
    );
  },
);
