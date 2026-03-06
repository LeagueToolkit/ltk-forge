# Component API Contracts

**Package**: `@ltk-forge/ui`
**Date**: 2026-03-06

## Shared Types

```typescript
type Intent = "primary" | "info" | "success" | "danger";
type Size = "sm" | "md" | "lg";
```

All components forward Base UI's native props (including `className`, `style`, `render`, `ref`). The types below show only the additional props introduced by the library wrappers.

## Class Merging

Components use `twMerge` from tailwind-merge directly to merge default classes with consumer-provided `className`. No wrapper utility is used.

```typescript
import { twMerge } from "tailwind-merge";

// Inside components:
className={twMerge(defaultClasses, variantClasses, props.className)}
```

## Button

```typescript
// Compound: Button.Root

interface ButtonRootProps extends BaseUI.Button.Props {
  variant?: "solid" | "outline" | "ghost"; // default: "solid"
  intent?: Intent; // default: "primary"
  size?: Size; // default: "md"
  className?: string;
}
```

## Input

```typescript
// Compound: Input.Root

interface InputRootProps extends BaseUI.Input.Props {
  size?: Size; // default: "md"
  className?: string;
}
```

## Checkbox

```typescript
// Compound: Checkbox.Root, Checkbox.Indicator

interface CheckboxRootProps extends BaseUI.Checkbox.Root.Props {
  size?: Size; // default: "md"
  className?: string;
}

interface CheckboxIndicatorProps extends BaseUI.Checkbox.Indicator.Props {
  className?: string;
}
```

## Select

```typescript
// Compound: Select.Root, Select.Trigger, Select.Portal, Select.Popup,
//           Select.Item, Select.Value, Select.Icon

interface SelectTriggerProps extends BaseUI.Select.Trigger.Props {
  size?: Size; // default: "md"
  className?: string;
}

interface SelectPopupProps extends BaseUI.Select.Popup.Props {
  className?: string; // default includes transition classes
}

interface SelectItemProps extends BaseUI.Select.Item.Props {
  className?: string;
}
```

## Dialog

```typescript
// Compound: Dialog.Root, Dialog.Trigger, Dialog.Portal, Dialog.Backdrop,
//           Dialog.Popup, Dialog.Title, Dialog.Description, Dialog.Close

interface DialogBackdropProps extends BaseUI.Dialog.Backdrop.Props {
  className?: string; // default includes transition classes
}

interface DialogPopupProps extends BaseUI.Dialog.Popup.Props {
  className?: string; // default includes transition classes
}

interface DialogTitleProps extends BaseUI.Dialog.Title.Props {
  className?: string;
}

interface DialogDescriptionProps extends BaseUI.Dialog.Description.Props {
  className?: string;
}
```

## Tooltip

```typescript
// Compound: Tooltip.Root, Tooltip.Trigger, Tooltip.Portal,
//           Tooltip.Popup, Tooltip.Arrow

interface TooltipPopupProps extends BaseUI.Tooltip.Popup.Props {
  className?: string; // default includes transition classes
}

interface TooltipArrowProps extends BaseUI.Tooltip.Arrow.Props {
  className?: string;
}
```

## Tabs

```typescript
// Compound: Tabs.Root, Tabs.List, Tabs.Tab, Tabs.Panel

interface TabsListProps extends BaseUI.Tabs.List.Props {
  className?: string;
}

interface TabsTabProps extends BaseUI.Tabs.Tab.Props {
  className?: string;
}

interface TabsPanelProps extends BaseUI.Tabs.Panel.Props {
  className?: string;
}
```

## Separator

```typescript
// Compound: Separator.Root

interface SeparatorRootProps extends BaseUI.Separator.Props {
  orientation?: "horizontal" | "vertical"; // default: "horizontal"
  className?: string;
}
```

## Contract Rules

1. **All Base UI props are forwarded** — the library never swallows props from the underlying Base UI component.
2. **`className` always merges** — default classes are combined with consumer classes via `twMerge`, with consumer classes winning conflicts.
3. **`render` prop is always available** — consumers can replace the rendered element per Base UI's composition pattern.
4. **`ref` is always forwarded** — all components support React refs.
5. **Variant defaults** — if a variant prop is omitted, the documented default is applied.
