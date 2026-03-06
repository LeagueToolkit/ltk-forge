# ltk-forge Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-06

## Active Technologies

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

- 004-component-library: Added TypeScript 5.7, targeting ES2022+ (ESM) + @base-ui-components/react, tailwind-merge, clsx, Tailwind CSS v4, React 19

- 003-commitlint-release-workflow: Added TypeScript 5.x (frontend), Rust 2021 edition (backend), YAML (CI workflows) + lefthook (git hooks), @commitlint/cli + @commitlint/config-conventional (commit validation), git-cliff (changelog generation via GitHub Action), Tauri v2 (build/release)
- 002-tauri-app-setup: Added TypeScript 5.x (frontend), Rust 2021 edition (backend) + Tauri v2, React 19, Vite 6, TanStack Router, Tailwind CSS v4, Zustand, tauri-plugin-{shell,dialog,fs,process}

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
