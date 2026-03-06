# Quickstart: Component Library & Styling System

**Feature**: 004-component-library
**Date**: 2026-03-06

## Package Overview

| Package            | Path              | Purpose                                                                           |
| ------------------ | ----------------- | --------------------------------------------------------------------------------- |
| `@ltk-forge/theme` | `packages/theme/` | Design tokens (CSS custom properties), dark slate palette, semantic intent colors |
| `@ltk-forge/ui`    | `packages/ui/`    | Styled component library built on Base UI with Tailwind CSS                       |

## Setup

### 1. Install dependencies in new packages

```bash
# Theme package (no runtime dependencies)
cd packages/theme
pnpm add -D tsup typescript @ltk-forge/tsconfig

# UI package
cd packages/ui
pnpm add @base-ui/react tailwind-merge react-icons
pnpm add -D typescript react react-dom @types/react @types/react-dom @ltk-forge/tsconfig @ltk-forge/eslint-config @ltk-forge/vitest-config @ltk-forge/theme
```

### 2. Consume in the app

```bash
cd apps/forge
pnpm add @ltk-forge/ui @ltk-forge/theme
```

In `apps/forge/src/styles/app.css`:

```css
@import "tailwindcss";
@import "@ltk-forge/theme/tokens.css";
```

## Usage Examples

### Import a component

```tsx
import { Button } from "@ltk-forge/ui";

function MyPage() {
  return (
    <Button.Root variant="solid" intent="primary" size="md">
      Save Changes
    </Button.Root>
  );
}
```

### Compose components

```tsx
import { Dialog, Button, Input } from "@ltk-forge/ui";

function ConfirmDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        render={<Button.Root variant="outline">Edit</Button.Root>}
      />
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup>
          <Dialog.Title>Edit Item</Dialog.Title>
          <Input.Root placeholder="Item name" />
          <Dialog.Close
            render={<Button.Root intent="primary">Save</Button.Root>}
          />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

### Override styles

```tsx
import { Button } from "@ltk-forge/ui";

// Consumer className wins via tailwind-merge
<Button.Root variant="solid" className="rounded-full px-8">
  Custom Shape
</Button.Root>;
```

### Use design tokens directly

```tsx
// In any CSS or Tailwind class
<div className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
  Uses design tokens directly
</div>
```

## Development

```bash
# Run all tests
pnpm run test

# Type check
pnpm run typecheck

# Dev mode (from root)
pnpm run dev
```

## Adding a New Component

1. Create `packages/ui/src/components/ComponentName/`
2. Add `ComponentName.tsx` wrapping the Base UI primitive with compound pattern
3. Apply default Tailwind classes using `twMerge` from tailwind-merge
4. Add barrel export in `index.ts`
5. Export from `packages/ui/src/index.ts`
