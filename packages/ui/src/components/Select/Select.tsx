import * as React from "react";
import { Select as BaseSelect } from "@base-ui/react/select";
import { twMerge } from "tailwind-merge";
import { LuChevronDown } from "react-icons/lu";
import type { Size } from "../../types";

const triggerSizeClasses: Record<Size, string> = {
  sm: "px-2.5 py-1 text-[length:var(--font-size-sm)]",
  md: "px-3 py-1.5 text-[length:var(--font-size-base)]",
  lg: "px-4 py-2.5 text-[length:var(--font-size-lg)]",
};

// Root - no styling needed, just re-export
const SelectRoot = BaseSelect.Root;

// Trigger
interface SelectTriggerProps extends Omit<
  BaseSelect.Trigger.Props,
  "className"
> {
  size?: Size;
  className?: string;
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  function SelectTrigger({ size = "md", className, ...props }, ref) {
    return (
      <BaseSelect.Trigger
        ref={ref}
        className={twMerge(
          "inline-flex items-center justify-between gap-2 rounded-[var(--radius-md)]",
          "bg-[var(--color-bg-input)] text-[var(--color-text-primary)]",
          "border border-[var(--color-border-default)]",
          "transition-colors duration-[var(--transition-fast)]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]",
          "data-[popup-open]:border-[var(--color-border-focus)]",
          "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
          "select-none",
          triggerSizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);

// Value
const SelectValue = React.forwardRef<
  HTMLSpanElement,
  Omit<BaseSelect.Value.Props, "className"> & { className?: string }
>(function SelectValue({ className, ...props }, ref) {
  return (
    <BaseSelect.Value
      ref={ref}
      className={twMerge("truncate", className)}
      {...props}
    />
  );
});

// Icon
const SelectIcon = React.forwardRef<
  HTMLSpanElement,
  Omit<BaseSelect.Icon.Props, "className"> & { className?: string }
>(function SelectIcon({ className, children, ...props }, ref) {
  return (
    <BaseSelect.Icon
      ref={ref}
      className={twMerge(
        "flex items-center text-[var(--color-text-secondary)]",
        className,
      )}
      {...props}
    >
      {children ?? <LuChevronDown />}
    </BaseSelect.Icon>
  );
});

// Portal
const SelectPortal = BaseSelect.Portal;

// Positioner
const SelectPositioner = React.forwardRef<
  HTMLDivElement,
  Omit<BaseSelect.Positioner.Props, "className"> & { className?: string }
>(function SelectPositioner({ className, ...props }, ref) {
  return (
    <BaseSelect.Positioner
      ref={ref}
      className={twMerge("z-50", className)}
      {...props}
    />
  );
});

// Popup
const SelectPopup = React.forwardRef<
  HTMLDivElement,
  Omit<BaseSelect.Popup.Props, "className"> & { className?: string }
>(function SelectPopup({ className, ...props }, ref) {
  return (
    <BaseSelect.Popup
      ref={ref}
      className={twMerge(
        "rounded-[var(--radius-lg)] py-1",
        "bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]",
        "shadow-[var(--shadow-lg)]",
        "border border-[var(--color-border-default)]",
        "outline-none",
        "transition-[transform,scale,opacity] duration-[var(--transition-normal)]",
        "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
        "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
        className,
      )}
      {...props}
    />
  );
});

// Item
const SelectItem = React.forwardRef<
  HTMLDivElement,
  Omit<BaseSelect.Item.Props, "className"> & { className?: string }
>(function SelectItem({ className, ...props }, ref) {
  return (
    <BaseSelect.Item
      ref={ref}
      className={twMerge(
        "flex items-center px-3 py-1.5 text-[length:var(--font-size-sm)]",
        "cursor-default select-none outline-none",
        "data-[highlighted]:bg-[var(--color-primary-600)] data-[highlighted]:text-white",
        className,
      )}
      {...props}
    />
  );
});

// ItemText
const SelectItemText = BaseSelect.ItemText;

// ItemIndicator
const SelectItemIndicator = React.forwardRef<
  HTMLSpanElement,
  Omit<BaseSelect.ItemIndicator.Props, "className"> & { className?: string }
>(function SelectItemIndicator({ className, ...props }, ref) {
  return (
    <BaseSelect.ItemIndicator
      ref={ref}
      className={twMerge("mr-2 flex items-center", className)}
      {...props}
    />
  );
});

export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Icon: SelectIcon,
  Portal: SelectPortal,
  Positioner: SelectPositioner,
  Popup: SelectPopup,
  Item: SelectItem,
  ItemText: SelectItemText,
  ItemIndicator: SelectItemIndicator,
};
