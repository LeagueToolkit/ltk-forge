# Tasks: LTK Forge Tauri App Setup

**Input**: Design documents from `/specs/002-tauri-app-setup/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in the feature specification. Test tasks are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize project structure and root-level configuration for both the Cargo workspace and the new `apps/forge` pnpm workspace package.

- [x] T001 Create root Cargo workspace file at `Cargo.toml` with `[workspace]` containing member `src-tauri` and `resolver = "2"`
- [x] T002 Update `pnpm-workspace.yaml` to add `"apps/*"` to the packages list alongside existing `"packages/*"` and `"packages/config/*"`
- [x] T003 Update root `package.json` to add `tauri` convenience scripts: `"tauri": "tauri"`, `"dev": "tauri dev"`, `"build:app": "tauri build"`
- [x] T004 Update `turbo.json` to add `dev` and `build` task definitions (dev: `cache: false, persistent: true`; build: `dependsOn: ["^typecheck"], outputs: ["dist/**"]`)

**Checkpoint**: Root configuration is ready for both Rust and frontend workspaces

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the Tauri Rust backend and the frontend app package skeleton. These MUST be complete before any user story can be verified.

**CRITICAL**: No user story work can begin until this phase is complete.

### Rust Backend (src-tauri)

- [x] T005 Create `src-tauri/Cargo.toml` with Tauri v2 dependencies: `tauri` (features: `devtools`), `tauri-build` (build dep), `serde`/`serde_json`, `tauri-plugin-shell`, `tauri-plugin-dialog`, `tauri-plugin-fs`, `tauri-plugin-process`; package name `ltk-forge`, version `0.1.0`, edition `2021`
- [x] T006 Create `src-tauri/build.rs` with `tauri_build::build()` call and dummy dist/index.html creation for cargo package verification (see LTK Manager reference)
- [x] T007 Create `src-tauri/tauri.conf.json` with: app identifier `dev.leaguetoolkit.forge`, version `0.1.0`, window config (1200x800 default, 900x600 min, no decorations, centered), frontend dev URL `http://localhost:5173`, dist dir `../apps/forge/dist`, before-dev-command `pnpm dev --filter @ltk-forge/app`, before-build-command `pnpm build --filter @ltk-forge/app`
- [x] T008 Create `src-tauri/capabilities/default.json` with permissions for: core window management (minimize, maximize, close, start-dragging), shell:allow-open, dialog (open, save, message), fs (read, write, exists, mkdir, remove, rename), process (restart, exit)
- [x] T009 Create `src-tauri/src/main.rs` with minimal Tauri app setup: register plugins (shell, dialog, fs, process), `get_app_info` IPC command returning `AppInfo { name: "LTK Forge", version }`, and `tauri::Builder::default()` with `invoke_handler` and `run`

### Frontend App Package (apps/forge)

- [x] T010 [P] Create `apps/forge/package.json` with name `@ltk-forge/app`, private, type module, scripts (`dev`: `vite`, `build`: `tsc && vite build`, `tauri`: `tauri`, `typecheck`: `tsc --noEmit`, `lint`: `eslint src/`), dependencies (react, react-dom, @tanstack/react-router, zustand, @tauri-apps/api, @tauri-apps/plugin-shell, @tauri-apps/plugin-dialog, @tauri-apps/plugin-fs, @tauri-apps/plugin-process), devDependencies (@types/react, @types/react-dom, @vitejs/plugin-react, vite, @tailwindcss/vite, tailwindcss, typescript, @tauri-apps/cli, @tanstack/react-router-plugin, @ltk-forge/eslint-config, @ltk-forge/vitest-config, @ltk-forge/tsconfig)
- [x] T011 [P] Create `apps/forge/tsconfig.json` extending `@ltk-forge/tsconfig/react-library.json` with `compilerOptions.paths` mapping `@/*` to `./src/*`, include `src`, references to `tsconfig.node.json`; and `apps/forge/tsconfig.node.json` for Vite config files
- [x] T012 [P] Create `apps/forge/vite.config.ts` with React plugin, TanStack Router plugin (with auto code-splitting), Tailwind CSS v4 plugin, path alias `@` → `./src`, server port 5173 (strict), watch ignoring `src-tauri/`, env prefix `["VITE_", "TAURI_"]`, build target `chrome105` for Windows
- [x] T013 [P] Create `apps/forge/eslint.config.js` extending `@ltk-forge/eslint-config` with additional ignores for `src-tauri/`, `dist/`, and `routeTree.gen.ts`
- [x] T014 [P] Create `apps/forge/index.html` with `<div id="root"></div>` and `<script type="module" src="/src/main.tsx"></script>`

**Checkpoint**: Foundation ready — Rust backend and frontend package skeleton exist. Run `pnpm install` to link everything.

---

## Phase 3: User Story 1 — Launch the Desktop Application (Priority: P1) MVP

**Goal**: The application launches as a desktop window displaying a minimal landing view confirming the app is operational.

**Independent Test**: Build with `pnpm tauri build` (or dev with `pnpm tauri dev`), launch the binary, verify the window opens and the landing view renders.

### Implementation for User Story 1

- [x] T015 [P] [US1] Create `apps/forge/src/styles/app.css` with Tailwind CSS v4 base imports (`@import "tailwindcss"`) and custom CSS variables for the LTK Forge theme (dark theme defaults)
- [x] T016 [P] [US1] Create `apps/forge/src/main.tsx` with React 19 `createRoot`, import `app.css`, render `RouterProvider` with TanStack Router instance, wrap in `StrictMode`
- [x] T017 [P] [US1] Create `apps/forge/src/routes/__root.tsx` as the root layout component with a full-height container, Tauri window drag region in the title bar area, and window control buttons (minimize, maximize, close) using `@tauri-apps/api/window`
- [x] T018 [US1] Create `apps/forge/src/routes/index.tsx` as the landing page route displaying app name "LTK Forge", version (from `get_app_info` IPC command via `invoke()`), and a status indicator confirming the backend is operational
- [x] T019 [US1] Generate Tauri default app icons by running `pnpm tauri icon` or manually placing default icon files in `src-tauri/icons/` (32x32.png, 128x128.png, icon.ico, icon.png)

**Checkpoint**: `pnpm tauri dev` launches a window showing the LTK Forge landing view with app info from the Rust backend. Window is resizable and closes cleanly.

---

## Phase 4: User Story 2 — Development Workflow (Priority: P1)

**Goal**: A developer can run a single command to launch the full dev environment with hot-reload.

**Independent Test**: Run `pnpm tauri dev` from repo root, verify the app launches, modify a frontend file, confirm hot-reload works.

### Implementation for User Story 2

- [x] T020 [US2] Verify and fix `src-tauri/tauri.conf.json` dev configuration so that `pnpm tauri dev` from repo root starts both the Vite dev server (port 5173) and the Tauri Rust backend; ensure `beforeDevCommand` runs `pnpm --filter @ltk-forge/app dev` and `devUrl` is `http://localhost:5173`
- [x] T021 [US2] Add a `README.md` section or update `specs/002-tauri-app-setup/quickstart.md` with verified dev workflow instructions: prerequisites (Rust, Node, pnpm), setup steps (`pnpm install`), and dev command (`pnpm tauri dev`)
- [x] T022 [US2] Verify hot-reload works end-to-end: modify a component in `apps/forge/src/`, confirm the change appears in the Tauri window without manual restart; fix any Vite watch/HMR issues

**Checkpoint**: `pnpm tauri dev` from repo root starts the full dev environment. Frontend changes hot-reload. Rust changes trigger recompile.

---

## Phase 5: User Story 3 — Build Production Binary (Priority: P2)

**Goal**: The build command produces a distributable binary for the target platform.

**Independent Test**: Run `pnpm tauri build`, verify the binary is produced in `src-tauri/target/release/bundle/`, launch it and confirm it works.

### Implementation for User Story 3

- [x] T023 [US3] Verify and fix `src-tauri/tauri.conf.json` build configuration: ensure `beforeBuildCommand` runs `pnpm --filter @ltk-forge/app build`, `frontendDist` points to `../apps/forge/dist`, and bundle targets include `nsis` for Windows
- [x] T024 [US3] Run `pnpm tauri build` end-to-end and fix any build errors (missing icons, CSP issues, path resolution, signing config); ensure the build completes successfully and produces an installer/binary

**Checkpoint**: `pnpm tauri build` produces a working Windows binary/installer.

---

## Phase 6: User Story 4 — Integration with Existing Monorepo Packages (Priority: P2)

**Goal**: The Tauri app frontend can import and use shared workspace packages (`@ltk-forge/math`, etc.).

**Independent Test**: Import a type from `@ltk-forge/mapgeo-types` in the app, verify it resolves in dev and build.

### Implementation for User Story 4

- [x] T025 [US4] Add workspace dependencies to `apps/forge/package.json`: `@ltk-forge/math`, `@ltk-forge/mapgeo-types`, `@ltk-forge/mapgeo-utils`, `@ltk-forge/map-renderer` as `workspace:*` dependencies
- [x] T026 [US4] Create a verification import in `apps/forge/src/routes/index.tsx` (or a dedicated component) that imports a type or utility from a workspace package (e.g., `import type { Vec3 } from "@ltk-forge/math"`) and displays it in the landing view to confirm workspace resolution works
- [x] T027 [US4] Verify that `pnpm tauri dev` and `pnpm tauri build` both work correctly with workspace package imports; fix any Vite resolve or TypeScript path issues

**Checkpoint**: Workspace packages are consumable by the Tauri app in both dev and production builds.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup across all stories.

- [x] T028 [P] Run `pnpm typecheck` from repo root and fix any TypeScript errors across all packages (ensure existing packages still pass)
- [x] T029 [P] Run `pnpm lint` from repo root and fix any linting errors across all packages
- [x] T030 [P] Run `pnpm test` from repo root and verify all existing package tests still pass (SC-005)
- [x] T031 Add `src-tauri/target/` to `.gitignore` if not already present; verify `apps/forge/dist/` is also gitignored
- [x] T032 Validate quickstart.md by following the steps on a clean environment: clone, install, dev, build

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational (Phase 2) — the MVP
- **US2 (Phase 4)**: Depends on US1 (Phase 3) — dev workflow needs a launchable app to verify
- **US3 (Phase 5)**: Depends on US1 (Phase 3) — build needs a buildable app
- **US4 (Phase 6)**: Depends on US1 (Phase 3) — integration needs a working app to import into
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational — No dependencies on other stories
- **US2 (P1)**: Depends on US1 being functional (needs an app to launch in dev mode)
- **US3 (P2)**: Depends on US1 being functional (needs an app to build)
- **US4 (P2)**: Depends on US1 being functional (needs an app to import packages into)
- **US3 and US4**: Can run in parallel after US1

### Within Each User Story

- Core implementation before integration/verification
- Story complete before moving to next priority

### Parallel Opportunities

- T010–T014 (frontend package skeleton files) can all run in parallel
- T015–T017 (styles, main.tsx, root layout) can run in parallel
- T023–T024 (US3) and T025–T027 (US4) can run in parallel after US1
- T028–T030 (polish checks) can all run in parallel

---

## Parallel Example: Phase 2 (Foundational)

```text
# Rust backend (sequential — files reference each other):
T005 → T006 → T007 → T008 → T009

# Frontend package (parallel — independent files):
T010 + T011 + T012 + T013 + T014
```

## Parallel Example: User Story 1

```text
# Parallel (independent files):
T015 + T016 + T017

# Sequential (depends on above):
T018 (needs root layout and main.tsx)
T019 (icons, can happen anytime)
```

## Parallel Example: After US1 Complete

```text
# US3 and US4 can run in parallel:
Stream A: T023 → T024 (US3: production build)
Stream B: T025 → T026 → T027 (US4: workspace integration)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T004)
2. Complete Phase 2: Foundational (T005–T014)
3. Run `pnpm install` to link everything
4. Complete Phase 3: User Story 1 (T015–T019)
5. **STOP and VALIDATE**: Run `pnpm tauri dev` — window should open with landing view
6. The app is now launchable — MVP achieved

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. User Story 1 → Launchable app (MVP)
3. User Story 2 → Dev workflow verified
4. User Story 3 + 4 (parallel) → Production build + workspace integration
5. Polish → All checks pass, docs validated

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- The `src-tauri/tauri.conf.json` is touched in multiple phases (T007, T020, T023) — each phase refines it for its story's needs
