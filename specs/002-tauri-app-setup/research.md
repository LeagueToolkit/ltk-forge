# Research: LTK Forge Tauri App Setup

## Decision 1: Project Structure — Tauri App as Workspace Package vs Standalone

**Decision**: The Tauri app frontend will be an `apps/forge` pnpm workspace package. The Rust backend lives in `src-tauri/` at the repo root, managed by a root-level Cargo workspace.

**Rationale**:
- The existing monorepo uses `packages/*` for shared libraries. Adding `apps/*` follows the standard monorepo convention of separating applications from libraries.
- The Cargo workspace must be at the repo root (Tauri CLI expects `src-tauri/` relative to where it's invoked), matching the LTK Manager pattern.
- The frontend app package (`apps/forge`) contains the Vite config, index.html, React entry point, and app-specific source code.
- Tauri's `tauri.conf.json` points to the frontend dev server and build output.

**Alternatives considered**:
- Putting everything at root level (like LTK Manager): Rejected because ltk-forge already has an established monorepo with shared packages. The app should be a workspace member.
- Putting `src-tauri/` inside `apps/forge/`: Rejected because Tauri CLI and Cargo workspace conventions work best with `src-tauri/` accessible from where `pnpm tauri` is invoked. The root Cargo.toml workspace approach is cleaner.

## Decision 2: Frontend Tech Stack

**Decision**: React 19 + TypeScript 5.x + Vite 6 + TanStack Router + Tailwind CSS v4 + Zustand

**Rationale**: Directly mirrors the LTK Manager reference project. These are the exact versions and libraries used there, providing consistency across LeagueToolkit projects.

**Alternatives considered**:
- SolidJS, Svelte: Rejected for consistency with LTK Manager and the existing React-based `ltk-map-renderer` package.
- Next.js/Remix: Rejected as Tauri apps don't need SSR frameworks.

## Decision 3: Tauri Plugin Selection (Initial)

**Decision**: Start with a minimal plugin set: `tauri-plugin-shell`, `tauri-plugin-dialog`, `tauri-plugin-fs`, `tauri-plugin-process`

**Rationale**: These cover the basic system interactions needed for a desktop app (file dialogs, filesystem access, shell operations, process management). The updater and global-shortcut plugins from LTK Manager are deferred until those features are needed.

**Alternatives considered**:
- Including all plugins from LTK Manager: Rejected to keep initial scope minimal. Plugins can be added incrementally as features require them.

## Decision 4: Monorepo Integration Pattern

**Decision**:
- Add `"apps/*"` to `pnpm-workspace.yaml`
- Add `dev` and `build` Turbo tasks for the app
- The app imports workspace packages via `workspace:*` protocol
- Tauri commands (`tauri dev`, `tauri build`) are run from the app directory or via root scripts

**Rationale**: This preserves the existing monorepo conventions while adding the app as a first-class workspace member. Turbo orchestrates all tasks consistently.

**Alternatives considered**:
- Running Tauri from root only: Rejected because the Vite config and frontend source should be scoped to the app package, not the root.

## Decision 5: Window Configuration

**Decision**: 1200x800 default, 900x600 minimum, no decorations (custom title bar), centered on launch.

**Rationale**: Matches LTK Manager exactly. Custom title bar (no decorations) provides a modern desktop app feel and is standard for Tauri apps with draggable regions.

**Alternatives considered**:
- Native decorations: Simpler but less polished. Can be revisited but matching the reference project is preferred.

## Decision 6: Rust Edition and Toolchain

**Decision**: Rust 2021 edition, stable toolchain.

**Rationale**: Matches LTK Manager. Rust 2021 is the current stable edition with full Tauri v2 support.

## Decision 7: TypeScript Bindings Generation

**Decision**: Defer ts-rs type generation to a future feature. The initial setup will use manual TypeScript types for any IPC commands.

**Rationale**: ts-rs requires Rust types to be defined first. The initial app has minimal IPC (just a health check or app info command at most). Automated type generation can be added when the Rust backend grows.

**Alternatives considered**:
- Setting up ts-rs immediately: Rejected as premature — no substantial Rust types exist yet.
