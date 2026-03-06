# Implementation Plan: Project Management & Mod Integration

**Branch**: `005-project-management` | **Date**: 2026-03-06 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/005-project-management/spec.md`

## Summary

Add project management capabilities to LTK Forge: create, open, scan, and pack `league-mod` mod projects via Tauri commands exposed to the React frontend. Integrate the `ltk_modpkg` and `ltk_mod_project` Rust crates for mod project I/O and `.modpkg` packaging. Implement a `.forge/` scratch directory convention for editor-only intermediate data. Add Zustand stores and UI routes for project creation, browsing, and packing.

## Technical Context

**Language/Version**: Rust 2021 (backend), TypeScript 5.7 (frontend)
**Primary Dependencies**: `ltk_modpkg` ^0.3.0, `ltk_mod_project` ^0.3.0 (Rust); `@tauri-apps/api` ^2.0.0, `zustand` ^5.0.0, `@tanstack/react-router` ^1.114.0 (frontend)
**Storage**: Filesystem only — mod project directories, `.forge/` scratch data, app-local JSON for recent projects
**Testing**: `cargo test` (Rust), Vitest (frontend)
**Target Platform**: Windows desktop (Tauri v2), macOS/Linux secondary
**Project Type**: Desktop application (Tauri — Rust backend + React frontend)
**Performance Goals**: Scan 1,000+ assets in <5 seconds; pack operations complete in <60 seconds for typical mods
**Constraints**: Offline-capable, no network dependencies for core project operations
**Scale/Scope**: Single-user desktop app; projects up to ~10,000 assets; scratch data up to hundreds of MB

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Constitution file contains only template placeholders — no gates defined. **PASS** (no constraints to enforce).

## Project Structure

### Documentation (this feature)

```text
specs/005-project-management/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (Tauri command contracts)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src-tauri/
├── Cargo.toml                    # Add ltk_modpkg, ltk_mod_project deps
├── src/
│   ├── main.rs                   # Register new command modules
│   ├── project/
│   │   ├── mod.rs                # Module root
│   │   ├── commands.rs           # Tauri commands: create, open, scan, pack, recent
│   │   ├── scanner.rs            # Asset discovery and layer scanning
│   │   ├── packer.rs             # Pack orchestration using ltk_modpkg
│   │   └── scratch.rs            # .forge/ scratch data management
│   └── error.rs                  # Shared error types

apps/forge/
├── src/
│   ├── stores/
│   │   └── project-store.ts      # Zustand store for project state
│   ├── routes/
│   │   ├── index.tsx             # Update: show recent projects on landing
│   │   ├── project/
│   │   │   ├── route.tsx         # Project layout route
│   │   │   ├── browser.tsx       # Asset browser view
│   │   │   └── settings.tsx      # Project settings/metadata view
│   │   └── new-project.tsx       # Project creation form
│   ├── lib/
│   │   └── tauri-commands.ts     # Typed wrappers for Tauri invoke calls
│   └── components/
│       ├── project-browser/      # Asset tree components
│       └── recent-projects/      # Recent projects list components
```

**Structure Decision**: Follows the existing Tauri monorepo layout. Rust backend code goes in `src-tauri/src/project/` as a new module. Frontend code extends the existing `apps/forge/` app with new routes, stores, and components. No new packages needed — this is core app functionality, not a reusable library.

## Complexity Tracking

No constitution violations to justify.
