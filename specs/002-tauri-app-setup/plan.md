# Implementation Plan: LTK Forge Tauri App Setup

**Branch**: `002-tauri-app-setup` | **Date**: 2026-03-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-tauri-app-setup/spec.md`

## Summary

Set up the LTK Forge Tauri v2 desktop application within the existing pnpm monorepo. This adds a Cargo workspace at the repo root with a `src-tauri/` Rust backend, and an `apps/forge` frontend package using React 19, Vite 6, TanStack Router, Tailwind CSS v4, and Zustand. The result is a launchable desktop app with a minimal landing view, working dev workflow with hot-reload, and production build capability.

## Technical Context

**Language/Version**: TypeScript 5.x (frontend), Rust 2021 edition (backend)
**Primary Dependencies**: Tauri v2, React 19, Vite 6, TanStack Router, Tailwind CSS v4, Zustand, tauri-plugin-{shell,dialog,fs,process}
**Storage**: N/A (no persistent storage in initial setup)
**Testing**: Vitest (frontend), cargo test (backend)
**Target Platform**: Windows (primary), Linux/macOS (secondary)
**Project Type**: Desktop application (Tauri v2)
**Performance Goals**: App launch < 3 seconds, hot-reload < 2 seconds
**Constraints**: Must integrate with existing pnpm monorepo and Turborepo build orchestration
**Scale/Scope**: Single application window with landing view; foundation for future editor features

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The constitution file is an unfilled template with no active gates or principles defined. No violations possible. **PASS**.

**Post-Phase 1 re-check**: Still no active gates. **PASS**.

## Project Structure

### Documentation (this feature)

```text
specs/002-tauri-app-setup/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Research decisions
├── data-model.md        # Data model (minimal)
├── quickstart.md        # Developer quickstart guide
├── contracts/
│   └── ipc-commands.md  # IPC command interface contracts
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Task breakdown (created by /speckit.tasks)
```

### Source Code (repository root)

```text
ltk-forge/
├── apps/
│   └── forge/                        # Tauri frontend app (NEW)
│       ├── src/
│       │   ├── components/           # Shared UI components
│       │   ├── routes/               # TanStack Router file-based routes
│       │   │   ├── __root.tsx        # Root layout
│       │   │   └── index.tsx         # Landing page route
│       │   ├── stores/               # Zustand state stores
│       │   ├── styles/
│       │   │   └── app.css           # Tailwind CSS entry
│       │   └── main.tsx              # React entry point
│       ├── index.html                # HTML entry point
│       ├── package.json              # App package with Tauri scripts
│       ├── vite.config.ts            # Vite config (Tauri-aware)
│       ├── tsconfig.json             # TypeScript config
│       └── eslint.config.js          # ESLint config
├── src-tauri/                        # Tauri Rust backend (NEW)
│   ├── src/
│   │   └── main.rs                   # Rust entry point with IPC commands
│   ├── capabilities/
│   │   └── default.json              # Security capabilities
│   ├── icons/                        # App icons (Tauri defaults)
│   ├── build.rs                      # Tauri build script
│   ├── Cargo.toml                    # Rust dependencies
│   └── tauri.conf.json               # Tauri configuration
├── packages/                         # Existing shared packages (unchanged)
│   ├── config/
│   │   ├── eslint-config/
│   │   ├── tsconfig/
│   │   └── vitest-config/
│   ├── ltk-math/
│   ├── ltk-mapgeo-types/
│   ├── ltk-mapgeo-utils/
│   └── ltk-map-renderer/
├── Cargo.toml                        # Cargo workspace root (NEW)
├── package.json                      # pnpm workspace root (MODIFIED)
├── pnpm-workspace.yaml               # Workspace config (MODIFIED)
└── turbo.json                        # Turborepo config (MODIFIED)
```

**Structure Decision**: Desktop app pattern — `apps/forge` for the React frontend as a pnpm workspace package, `src-tauri/` at repo root for the Rust backend managed by a root Cargo workspace. This preserves the existing `packages/*` structure for shared libraries while adding the application layer. Matches the LTK Manager reference with adaptations for the monorepo context.

## Complexity Tracking

No constitution violations to justify. The structure is straightforward:
- 1 new pnpm workspace package (`apps/forge`)
- 1 new Cargo workspace member (`src-tauri`)
- 3 modified root config files
