# Tasks: Project Management & Mod Integration

**Input**: Design documents from `/specs/005-project-management/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**NOTE**: Packing/modpkg functionality removed — reserved for LTK Manager. LTK Forge operates at the mod project directory level only.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add dependencies, create module structure, define shared types

- [x] T001 Add `ltk_mod_project`, `xxhash-rust` (with "xxh3" feature), and `chrono` dependencies in `src-tauri/Cargo.toml`
- [x] T002 Create Rust project module structure: `src-tauri/src/project/mod.rs`, `src-tauri/src/project/commands.rs`, `src-tauri/src/project/scanner.rs`, `src-tauri/src/project/scratch.rs` with module declarations
- [x] T003 Create shared error types with Tauri-serializable error enum in `src-tauri/src/error.rs` covering: `DirectoryNotEmpty`, `InvalidName`, `InvalidPath`, `MissingConfig`, `InvalidConfig`, `ProjectNotFound`, `AssetError`, `NoScratchDir`, `IoError`
- [x] T004 Register the `project` module and error module in `src-tauri/src/main.rs`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T005 Define Rust request/response structs for all Tauri commands in `src-tauri/src/project/commands.rs`: `CreateProjectRequest`, `CreateProjectResponse`, `OpenProjectResponse`, `ScanAssetsResponse`, `RecentProjectInfo`, `CleanupScratchResponse`
- [x] T006 [P] Create typed Tauri invoke wrappers in `apps/forge/src/lib/tauri-commands.ts` with TypeScript types matching all command contracts
- [x] T007 [P] Create Zustand project store in `apps/forge/src/stores/project-store.ts` with state: `currentProject`, `assets`, `isLoading`, `error`, and actions: `createProject`, `openProject`, `scanAssets`, `reset`
- [x] T008 [P] Create project layout route in `apps/forge/src/routes/project/route.tsx` with sidebar and `<Outlet />` for child routes

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 — Create a New Mod Project (Priority: P1) MVP

**Goal**: Users can create a new `league-mod` project directory via the UI, producing a valid `mod.config.json` and directory structure

- [x] T009 [US1] Implement `create_project` Tauri command in `src-tauri/src/project/commands.rs`
- [x] T010 [US1] Implement project creation form route in `apps/forge/src/routes/new-project.tsx`
- [x] T011 [US1] Wire creation form to Zustand store — on success, navigate to `project/browser`
- [x] T012 [US1] Register `create_project` command in `tauri::generate_handler![]` in `src-tauri/src/main.rs`

**Checkpoint**: User Story 1 fully functional — new projects can be created via UI

---

## Phase 4: User Story 2 — Open and Scan an Existing Mod Project (Priority: P1)

**Goal**: Users can open an existing mod project, see its metadata, and browse all assets organized by WAD and layer with priority resolution

- [x] T013 [US2] Implement asset scanner in `src-tauri/src/project/scanner.rs`
- [x] T014 [US2] Implement `open_project` Tauri command in `src-tauri/src/project/commands.rs`
- [x] T015 [US2] Implement `scan_assets` Tauri command in `src-tauri/src/project/commands.rs`
- [x] T016 [P] [US2] Create asset tree components in `apps/forge/src/components/project-browser/AssetTree.tsx`
- [x] T017 [US2] Create asset browser route in `apps/forge/src/routes/project/browser.tsx`
- [x] T018 [US2] Add "Open Project" action to landing page in `apps/forge/src/routes/index.tsx`
- [x] T019 [US2] Register `open_project` and `scan_assets` commands in `tauri::generate_handler![]` in `src-tauri/src/main.rs`

**Checkpoint**: User Stories 1 AND 2 both work independently — projects can be created and opened

---

## Phase 5: User Story 3 — Editor Scratch Data for Map Editor (Priority: P2)

**Goal**: Editor-generated intermediate data persists in `.forge/` directory, organized deterministically, with cleanup support

- [x] T020 [US3] Implement scratch data manager in `src-tauri/src/project/scratch.rs`
- [x] T021 [US3] Implement `cleanup_scratch` Tauri command in `src-tauri/src/project/commands.rs`
- [x] T022 [US3] Add scratch data info display and cleanup UI in `apps/forge/src/routes/project/settings.tsx`
- [x] T023 [US3] Register `cleanup_scratch` command in `tauri::generate_handler![]` in `src-tauri/src/main.rs`

**Checkpoint**: Scratch data infrastructure ready for map editor and VFX editor to use

---

## Phase 6: User Story 4 — Recent Projects & Quick Access (Priority: P3)

**Goal**: Landing page shows recently opened projects, persisted across restarts, with stale entry handling

- [x] T024 [US4] Implement recent projects storage in `src-tauri/src/project/commands.rs`
- [x] T025 [US4] Implement `get_recent_projects` and `remove_recent_project` Tauri commands in `src-tauri/src/project/commands.rs`
- [x] T026 [P] [US4] Create recent projects list component in `apps/forge/src/components/recent-projects/RecentProjectsList.tsx`
- [x] T027 [US4] Update landing page in `apps/forge/src/routes/index.tsx` to show recent projects list
- [x] T028 [US4] Wire `open_project` flow to automatically add/update recent projects entry (integrated into `open_project` backend command)
- [x] T029 [US4] Register `get_recent_projects` and `remove_recent_project` commands in `tauri::generate_handler![]` in `src-tauri/src/main.rs`

**Checkpoint**: All user stories independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T030 [P] Add input validation helpers for project name in `src-tauri/src/project/commands.rs`
- [x] T031 Add `field-input` CSS class for consistent form inputs in `apps/forge/src/styles/app.css`
- [ ] T032 Run quickstart.md round-trip validation: create project, add test asset, open project, scan assets

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phases 3–6)**: All depend on Foundational phase completion
  - US1 and US2 can proceed in parallel (both P1)
  - US3 can proceed in parallel with US1/US2 (independent scratch data)
  - US4 depends on US2 (hooks into open_project flow)
- **Polish (Phase 7)**: Depends on all user stories being complete

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup (T001–T004)
2. Complete Phase 2: Foundational (T005–T008)
3. Complete Phase 3: User Story 1 — Create Project (T009–T012)
4. Complete Phase 4: User Story 2 — Open & Scan (T013–T019)
5. **STOP and VALIDATE**: Create a project, open it, browse assets
6. Demo-ready MVP

---

## Notes

- Packing is handled by LTK Manager, not LTK Forge
- `ltk_mod_project` crate handles the config format — our code is orchestration and UI
- `get_scratch_path` and `ensure_scratch_dir` are public API for future editor modules
