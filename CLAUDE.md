# ltk-forge Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-06

## Active Technologies

- Rust 2021 (backend), TypeScript 5.7 (frontend) + `ltk_modpkg` ^0.3.0, `ltk_mod_project` ^0.3.0 (Rust); `@tauri-apps/api` ^2.0.0, `zustand` ^5.0.0, `@tanstack/react-router` ^1.114.0 (frontend) (005-project-management)
- Filesystem only — mod project directories, `.forge/` scratch data, app-local JSON for recent projects (005-project-management)
- TypeScript 5.7 (frontend) + `@tanstack/react-form` (new), `@base-ui/react` (existing), `class-variance-authority` (existing), `tailwind-merge` (existing) (006-form-components)

- TypeScript 5.7, targeting ES2022+ (ESM) + @base-ui-components/react, tailwind-merge, clsx, Tailwind CSS v4, React 19 (004-component-library)
- N/A (no persistent storage) (004-component-library)

- TypeScript 5.x (frontend), Rust 2021 edition (backend) + Tauri v2, React 19, Vite 6, TanStack Router, Tailwind CSS v4, Zustand, tauri-plugin-{shell,dialog,fs,process} (002-tauri-app-setup)
- N/A (no persistent storage in initial setup) (002-tauri-app-setup)
- TypeScript 5.x (frontend), Rust 2021 edition (backend), YAML (CI workflows) + lefthook (git hooks), @commitlint/cli + @commitlint/config-conventional (commit validation), git-cliff (changelog generation via GitHub Action), Tauri v2 (build/release) (003-commitlint-release-workflow)
- N/A (configuration-only feature) (003-commitlint-release-workflow)

- TypeScript 5.x, targeting ES2022+ + pnpm (workspace management), Turborepo (build orchestration), Three.js + @react-three/fiber (3D rendering), Vitest (testing), tsup (library bundling), ESLint + Prettier (linting/formatting) (001-frontend-monorepo)

## Project Structure

```text
src/
tests/
```

## Commands

npm test; npm run lint

## Code Style

TypeScript 5.x, targeting ES2022+: Follow standard conventions

## Recent Changes

- 006-form-components: Added TypeScript 5.7 (frontend) + `@tanstack/react-form` (new), `@base-ui/react` (existing), `class-variance-authority` (existing), `tailwind-merge` (existing)
- 005-project-management: Added Rust 2021 (backend), TypeScript 5.7 (frontend) + `ltk_modpkg` ^0.3.0, `ltk_mod_project` ^0.3.0 (Rust); `@tauri-apps/api` ^2.0.0, `zustand` ^5.0.0, `@tanstack/react-router` ^1.114.0 (frontend)

- 004-component-library: Added TypeScript 5.7, targeting ES2022+ (ESM) + @base-ui-components/react, tailwind-merge, clsx, Tailwind CSS v4, React 19

<!-- MANUAL ADDITIONS START -->

## TanStack Documentation

**MANDATORY**: When working with TanStack packages (Router, Form, Query, Start, etc.), always use the `tanstack` CLI to fetch current documentation. Do NOT rely on training data — TanStack APIs change frequently.

### Key Commands

```bash
# Fetch a specific doc page
tanstack doc <library> <path> --json
# Examples:
tanstack doc router framework/react/guide/data-loading --json
tanstack doc form framework/react/overview --json
tanstack doc query framework/react/overview --json

# Search docs
tanstack search-docs "<query>" --library <id> --framework react --json
# Examples:
tanstack search-docs "loaders" --library router --framework react --json
tanstack search-docs "validation" --library form --framework react --json

# List available libraries
tanstack libraries --json

# Ecosystem partners (auth, database, etc.)
tanstack ecosystem --category <category> --json
```

Always use `--json` for deterministic parsing of output.

<!-- MANUAL ADDITIONS END -->
