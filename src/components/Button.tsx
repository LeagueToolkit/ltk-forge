import { Button as BaseButton } from "@base-ui/react/button";
import clsx from "clsx";
import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function Button({
  children,
  variant = "primary",
  className,
  onClick,
  type = "button",
}: ButtonProps) {
  return (
    <BaseButton
      type={type}
      onClick={onClick}
      className={clsx(
        "px-4 py-2 rounded-lg font-medium transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900",
        variant === "primary" && "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
        variant === "secondary" && "bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500",
        className
      )}
    >
      {children}
    </BaseButton>
  );
}
