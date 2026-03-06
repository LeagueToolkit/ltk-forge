# Quickstart: Frontend Monorepo

**Date**: 2026-03-06 | **Feature**: 001-frontend-monorepo

## Prerequisites

- Node.js 20+
- pnpm 9+ (`corepack enable && corepack prepare pnpm@latest --activate`)
- Git

## Setup

```bash
# Clone and install
git clone <repo-url>
cd ltk-forge
pnpm install

# Type-check all packages
pnpm typecheck

# Lint all packages
pnpm lint

# Run all tests
pnpm test
```

> **Note**: There is no `build` step for library packages. They use the Internal Packages pattern — `exports` point directly at `.ts` source files. The consuming Vite app transpiles them on the fly.

## Workspace Structure

```
packages/
├── ltk-math/           # Math primitives (Vec2, Vec3, Mat4, AABB, etc.)
├── ltk-mapgeo-types/   # TypeScript types for ltk_mapgeo data structures
├── ltk-mapgeo-utils/   # Query and transformation utilities for map data
├── ltk-map-renderer/   # Three.js/R3F rendering components and hooks
└── config/             # Shared ESLint, TypeScript, Vitest configs
```

## Package Dependency Graph

```
ltk-map-renderer
  └── ltk-mapgeo-utils
        └── ltk-mapgeo-types
              └── ltk-math

(config packages are devDependencies of all ltk-* packages)
```

## Common Tasks

### Type-check a single package

```bash
pnpm --filter ltk-math typecheck
```

### Run tests for a single package

```bash
pnpm --filter ltk-mapgeo-types test
```

### Add a dependency to a package

```bash
# External dependency
pnpm --filter ltk-map-renderer add three

# Internal workspace dependency
pnpm --filter ltk-mapgeo-utils add ltk-math --workspace
```

### Create a new package

1. Create directory under `packages/`
2. Add `package.json` with `name`, `version`, `exports` pointing at `./src/index.ts`, and scripts (`typecheck`, `lint`, `test`)
3. Add `tsconfig.json` extending `@ltk-forge/tsconfig/library.json`
4. Register in `pnpm-workspace.yaml` (already covered by `packages/*` glob)
5. Run `pnpm install` to link

## Key Configuration Files

| File                  | Purpose                                          |
|-----------------------|--------------------------------------------------|
| `pnpm-workspace.yaml` | Defines workspace package locations              |
| `turbo.json`          | Task orchestration, caching, task dependencies   |
| `tsconfig.base.json`  | Shared TypeScript compiler options               |
| `package.json` (root) | Workspace scripts, shared devDependencies        |
| `.npmrc`              | pnpm configuration (hoist settings, workspace protocol) |
| `.gitignore`          | Ignores node_modules, .turbo, .claude, .specify  |

## Development Workflow

1. Make changes in a package's `src/` directory
2. Changes are immediately available to dependent packages (no build needed)
3. Run `pnpm typecheck` to verify types across the workspace
4. Run `pnpm test` to verify functionality
5. Import from other packages using workspace protocol: `import { Vec3 } from '@ltk-forge/math'`
