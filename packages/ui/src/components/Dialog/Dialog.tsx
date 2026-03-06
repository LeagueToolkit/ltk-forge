import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { twMerge } from "tailwind-merge";

// Root — no styling
const DialogRoot = BaseDialog.Root;

// Trigger — no default styling, consumers compose via render prop
const DialogTrigger = BaseDialog.Trigger;

// Portal
const DialogPortal = BaseDialog.Portal;

// Backdrop
const DialogBackdrop = React.forwardRef<
  HTMLDivElement,
  Omit<BaseDialog.Backdrop.Props, "className"> & { className?: string }
>(function DialogBackdrop({ className, ...props }, ref) {
  return (
    <BaseDialog.Backdrop
      ref={ref}
      className={twMerge(
        "fixed inset-0 bg-[var(--color-bg-overlay)]",
        "transition-opacity duration-[var(--transition-normal)]",
        "data-[starting-style]:opacity-0",
        "data-[ending-style]:opacity-0",
        className,
      )}
      {...props}
    />
  );
});

// Popup
const DialogPopup = React.forwardRef<
  HTMLDivElement,
  Omit<BaseDialog.Popup.Props, "className"> & { className?: string }
>(function DialogPopup({ className, ...props }, ref) {
  return (
    <BaseDialog.Popup
      ref={ref}
      className={twMerge(
        "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        "w-full max-w-lg p-6",
        "bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]",
        "rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)]",
        "border border-[var(--color-border-default)]",
        "outline-none",
        "transition-[transform,opacity] duration-[var(--transition-normal)]",
        "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
        "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
        className,
      )}
      {...props}
    />
  );
});

// Title
const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  Omit<BaseDialog.Title.Props, "className"> & { className?: string }
>(function DialogTitle({ className, ...props }, ref) {
  return (
    <BaseDialog.Title
      ref={ref}
      className={twMerge(
        "text-[length:var(--font-size-lg)] font-[number:var(--font-weight-semibold)]",
        "text-[var(--color-text-primary)]",
        className,
      )}
      {...props}
    />
  );
});

// Description
const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  Omit<BaseDialog.Description.Props, "className"> & { className?: string }
>(function DialogDescription({ className, ...props }, ref) {
  return (
    <BaseDialog.Description
      ref={ref}
      className={twMerge(
        "mt-2 text-[length:var(--font-size-sm)] text-[var(--color-text-secondary)]",
        className,
      )}
      {...props}
    />
  );
});

// Close
const DialogClose = BaseDialog.Close;

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Backdrop: DialogBackdrop,
  Popup: DialogPopup,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
};
