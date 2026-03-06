import * as React from "react";
import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { twMerge } from "tailwind-merge";

// Root — no styling
const TabsRoot = BaseTabs.Root;

// List
const TabsList = React.forwardRef<
  HTMLDivElement,
  Omit<BaseTabs.List.Props, "className"> & { className?: string }
>(function TabsList({ className, ...props }, ref) {
  return (
    <BaseTabs.List
      ref={ref}
      className={twMerge(
        "flex items-center gap-1",
        "border-b border-[var(--color-border-muted)]",
        className,
      )}
      {...props}
    />
  );
});

// Tab
const TabsTab = React.forwardRef<
  HTMLButtonElement,
  Omit<BaseTabs.Tab.Props, "className"> & { className?: string }
>(function TabsTab({ className, ...props }, ref) {
  return (
    <BaseTabs.Tab
      ref={ref}
      className={twMerge(
        "px-3 py-2 text-[length:var(--font-size-sm)]",
        "font-[number:var(--font-weight-medium)]",
        "text-[var(--color-text-secondary)]",
        "border-b-2 border-transparent -mb-px",
        "transition-colors duration-[var(--transition-fast)]",
        "hover:text-[var(--color-text-primary)]",
        "data-[selected]:text-[var(--color-primary-400)] data-[selected]:border-[var(--color-primary-500)]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]",
        "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
        "select-none cursor-default",
        className,
      )}
      {...props}
    />
  );
});

// Indicator
const TabsIndicator = BaseTabs.Indicator;

// Panel
const TabsPanel = React.forwardRef<
  HTMLDivElement,
  Omit<BaseTabs.Panel.Props, "className"> & { className?: string }
>(function TabsPanel({ className, ...props }, ref) {
  return (
    <BaseTabs.Panel
      ref={ref}
      className={twMerge("pt-4", className)}
      {...props}
    />
  );
});

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Tab: TabsTab,
  Indicator: TabsIndicator,
  Panel: TabsPanel,
};
