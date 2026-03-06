import * as React from "react";
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { twMerge } from "tailwind-merge";

// Root — no styling
const TooltipRoot = BaseTooltip.Root;

// Trigger — no default styling
const TooltipTrigger = BaseTooltip.Trigger;

// Portal
const TooltipPortal = BaseTooltip.Portal;

// Positioner
const TooltipPositioner = React.forwardRef<
  HTMLDivElement,
  Omit<BaseTooltip.Positioner.Props, "className"> & { className?: string }
>(function TooltipPositioner({ className, ...props }, ref) {
  return (
    <BaseTooltip.Positioner
      ref={ref}
      className={twMerge("z-50", className)}
      {...props}
    />
  );
});

// Popup
const TooltipPopup = React.forwardRef<
  HTMLDivElement,
  Omit<BaseTooltip.Popup.Props, "className"> & { className?: string }
>(function TooltipPopup({ className, ...props }, ref) {
  return (
    <BaseTooltip.Popup
      ref={ref}
      className={twMerge(
        "px-3 py-1.5 rounded-[var(--radius-md)]",
        "bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]",
        "text-[length:var(--font-size-sm)]",
        "shadow-[var(--shadow-md)]",
        "border border-[var(--color-border-default)]",
        "transition-[opacity,transform] duration-[var(--transition-fast)]",
        "data-[starting-style]:opacity-0 data-[starting-style]:translate-y-0.5",
        "data-[ending-style]:opacity-0 data-[ending-style]:translate-y-0.5",
        className,
      )}
      {...props}
    />
  );
});

// Arrow
const TooltipArrow = React.forwardRef<
  HTMLDivElement,
  Omit<BaseTooltip.Arrow.Props, "className"> & { className?: string }
>(function TooltipArrow({ className, ...props }, ref) {
  return (
    <BaseTooltip.Arrow
      ref={ref}
      className={twMerge(
        "fill-[var(--color-bg-tertiary)] stroke-[var(--color-border-default)]",
        "[stroke-width:1px]",
        className,
      )}
      {...props}
    />
  );
});

export const Tooltip = {
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Portal: TooltipPortal,
  Positioner: TooltipPositioner,
  Popup: TooltipPopup,
  Arrow: TooltipArrow,
};
