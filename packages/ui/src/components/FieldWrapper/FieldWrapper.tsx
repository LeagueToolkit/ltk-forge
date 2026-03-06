import * as React from "react";
import { twMerge } from "tailwind-merge";
import type { Size } from "../../types";

const labelSizeClasses: Record<Size, string> = {
  sm: "text-[length:var(--font-size-xs)]",
  md: "text-[length:var(--font-size-xs)]",
  lg: "text-[length:var(--font-size-sm)]",
};

const messageSizeClasses: Record<Size, string> = {
  sm: "text-[length:var(--font-size-xs)]",
  md: "text-[length:var(--font-size-xs)]",
  lg: "text-[length:var(--font-size-xs)]",
};

export interface FieldWrapperProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

export function FieldWrapper({
  label,
  description,
  error,
  required,
  disabled,
  size = "md",
  className,
  children,
}: FieldWrapperProps) {
  return (
    <div
      className={twMerge(
        "flex flex-col gap-1",
        disabled && "opacity-50",
        className,
      )}
    >
      {label && (
        <label
          className={twMerge(
            "font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)]",
            labelSizeClasses[size],
          )}
        >
          {label}
          {required && (
            <span className="text-[var(--color-danger-400)] ml-0.5">*</span>
          )}
        </label>
      )}
      {children}
      {error ? (
        <p
          className={twMerge(
            "text-[var(--color-danger-400)]",
            messageSizeClasses[size],
          )}
        >
          {error}
        </p>
      ) : description ? (
        <p
          className={twMerge(
            "text-[var(--color-text-tertiary)]",
            messageSizeClasses[size],
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
