import * as React from "react";
import { Separator as BaseSeparator } from "@base-ui/react/separator";
import { twMerge } from "tailwind-merge";

interface SeparatorRootProps extends Omit<BaseSeparator.Props, "className"> {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

const SeparatorRoot = React.forwardRef<HTMLHRElement, SeparatorRootProps>(
  function SeparatorRoot(
    { orientation = "horizontal", className, ...props },
    ref,
  ) {
    return (
      <BaseSeparator
        ref={ref}
        className={twMerge(
          "border-none bg-[var(--color-border-muted)]",
          orientation === "horizontal" ? "h-px w-full" : "w-px h-full",
          className,
        )}
        {...props}
      />
    );
  },
);

export const Separator = {
  Root: SeparatorRoot,
};
