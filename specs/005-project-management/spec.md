# Feature Specification: Project Management & Mod Integration

**Feature Branch**: `005-project-management`
**Created**: 2026-03-06
**Status**: Draft
**Input**: User description: "Setup project management features for LTK Forge. Integrate with league-mod project infrastructure to create, scan, and pack mod projects. Support editor-only scratch data for the map editor stored deterministically on the filesystem."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Create a New Mod Project (Priority: P1)

A modder opens LTK Forge and creates a new mod project. They provide a project name, description, and select a location on their filesystem. LTK Forge initializes a valid `league-mod` project directory with the correct structure (`mod.config.json`, `content/` with a default base layer, etc.) so the project is immediately recognized by both LTK Forge and LTK Manager.

**Why this priority**: Without the ability to create a project, no other features can function. This is the entry point for every user workflow.

**Independent Test**: Can be fully tested by creating a new project via the UI and verifying the resulting directory matches the `league-mod` specification. The project should be openable by LTK Manager without modification.

**Acceptance Scenarios**:

1. **Given** LTK Forge is open with no project loaded, **When** the user creates a new project with a valid name and location, **Then** a correctly structured `league-mod` project directory is created at the specified path with a valid `mod.config.json`.
2. **Given** the user attempts to create a project in a non-empty directory, **Then** the system warns the user and prevents overwriting existing files.
3. **Given** the user provides a project name with invalid filesystem characters, **Then** the system sanitizes or rejects the name with a clear error message.

---

### User Story 2 - Open and Scan an Existing Mod Project (Priority: P1)

A modder opens an existing `league-mod` project directory in LTK Forge. The application scans the project structure, reads the `mod.config.json`, discovers all layers and their assets (organized under WAD file identifiers like `Map11.wad.client`), and presents the project contents in a navigable asset browser. The modder can see what assets exist and begin working with them immediately.

**Why this priority**: Opening existing projects is equally critical to creating them. Modders will frequently return to in-progress work, and the ability to scan and display project contents is the foundation for all editing workflows.

**Independent Test**: Can be tested by pointing LTK Forge at a valid `league-mod` project directory and verifying the asset tree is correctly populated. Each layer and its assets should appear in the browser.

**Acceptance Scenarios**:

1. **Given** a valid `league-mod` project directory exists, **When** the user opens it in LTK Forge, **Then** the project metadata and all discoverable assets across all layers are displayed.
2. **Given** the user opens a directory that is not a valid mod project (missing `mod.config.json`), **Then** the system displays a clear error explaining why the directory is invalid.
3. **Given** a project has multiple layers with overlapping assets, **Then** the scanner correctly identifies which layer each asset belongs to and shows the effective priority resolution.

---

### User Story 3 - Pack Project into a Distributable Mod (Priority: P2)

A modder has finished editing their mod and wants to test it in-game via LTK Manager. They invoke a "Pack" action in LTK Forge. The system processes all layers, applies any configured transformers, and produces a `.modpkg` file that LTK Manager can install and apply to the game.

**Why this priority**: Packing is the bridge between editing and testing. Without it, no iteration cycle exists. It is secondary to project creation/opening because packing requires a project to already exist.

**Independent Test**: Can be tested by packing a project with known assets and verifying LTK Manager can install the resulting `.modpkg` without errors. The packed mod should contain all expected assets.

**Acceptance Scenarios**:

1. **Given** a valid mod project is open, **When** the user triggers the pack action, **Then** a `.modpkg` file is produced in the project's build directory containing all layer assets with correct priority resolution.
2. **Given** the project contains no content assets, **When** the user packs, **Then** the system warns that the mod is empty and either produces an empty package or aborts with explanation.
3. **Given** a pack operation encounters a corrupt or unreadable asset, **Then** the system reports which asset failed and does not produce a partial package.

---

### User Story 4 - Editor Scratch Data for Map Editor (Priority: P2)

A modder is using the map editor within LTK Forge. The editor generates intermediate data (e.g., undo history, viewport states, brush configurations, terrain mesh caches, scene graph snapshots) that must persist across sessions but are not part of the final mod. This data is stored in a dedicated, deterministic location within the project directory so it can be reliably located, cleaned up, and excluded from mod packaging.

**Why this priority**: The map editor is a primary use case for LTK Forge. Without persistent scratch data, the editor cannot support session continuity, undo across restarts, or cache large computed results. This is foundational infrastructure for the editor experience.

**Independent Test**: Can be tested by performing map editing operations, closing the application, reopening, and verifying scratch data is intact. Packing the project should confirm scratch data is excluded from the output.

**Acceptance Scenarios**:

1. **Given** the map editor generates scratch data during a session, **When** the application closes and reopens, **Then** the scratch data is still present and the editor can resume from the previous state.
2. **Given** a project with scratch data exists, **When** the user packs the project, **Then** the scratch data is excluded from the `.modpkg` output.
3. **Given** scratch data grows large over time, **When** the user invokes a cleanup action, **Then** stale or orphaned scratch data is removed while preserving data for active editor sessions.

---

### User Story 5 - Recent Projects & Quick Access (Priority: P3)

A modder launches LTK Forge and sees a list of recently opened projects. They can click to reopen any project without navigating the filesystem. The list persists across application restarts.

**Why this priority**: Quality-of-life feature that improves the day-to-day workflow but is not strictly necessary for core functionality.

**Independent Test**: Can be tested by opening several projects, restarting the app, and verifying the recent projects list is populated and functional.

**Acceptance Scenarios**:

1. **Given** the user has previously opened projects, **When** they launch LTK Forge, **Then** a list of recently opened projects is displayed with project name, path, and last-opened date.
2. **Given** a recent project's directory has been deleted or moved, **When** the user attempts to open it from the list, **Then** the system notifies the user and offers to remove the entry.

---

### Edge Cases

- What happens when the project directory becomes read-only or permissions change mid-session?
- How does the system handle concurrent access to the same project from multiple LTK Forge instances?
- What happens if the `league-mod` project format evolves (version mismatch between LTK Forge and the project)?
- How does scratch data behave when the project is moved to a different filesystem path?
- What happens when disk space runs out during a pack operation or scratch data write?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST create new `league-mod` compatible project directories with valid `mod.config.json`, a default base content layer, and the standard directory structure.
- **FR-002**: System MUST read and parse `mod.config.json` (JSON format) to extract project metadata, layer definitions, and transformer configurations.
- **FR-003**: System MUST recursively scan content layers to discover all assets organized under WAD file identifiers (e.g., `Map11.wad.client`, `Aatrox.wad.client`).
- **FR-004**: System MUST resolve layer priority to determine the effective version of assets that appear in multiple layers.
- **FR-005**: System MUST pack a project's content into a `.modpkg` file compatible with LTK Manager, applying Zstd compression and embedding metadata.
- **FR-006**: System MUST store editor-only scratch data in a dedicated `.forge/` directory at the project root, excluded from mod packaging.
- **FR-007**: Scratch data MUST be organized deterministically by editor type and asset identifier so that files can be reliably located without an index.
- **FR-008**: System MUST provide a cleanup mechanism to remove stale scratch data that is no longer associated with active editor content.
- **FR-009**: System MUST maintain a persistent list of recently opened projects across application restarts.
- **FR-010**: System MUST validate project structure on open and report clear errors for missing or malformed required files.
- **FR-011**: System MUST exclude the `.forge/` scratch directory when packing the project.
- **FR-012**: System MUST support the `league-mod` transformer pipeline during pack operations.

### Key Entities

- **Mod Project**: A filesystem directory conforming to the `league-mod` specification. Contains metadata (`mod.config.json`), content layers, and optionally a `.forge/` scratch directory. Identified by its root path.
- **Layer**: A named content partition within a project with a priority level. Contains assets organized under WAD identifiers. Higher-priority layers override lower ones for duplicate assets.
- **Asset**: A single file within a layer, identified by its WAD path and relative file path. Represents a game resource (texture, model, data file, etc.).
- **Mod Package (.modpkg)**: The distributable output format. A compressed archive containing resolved assets from all layers with embedded project metadata.
- **Scratch Data**: Editor-generated intermediate files stored in `.forge/` that persist across sessions but are excluded from the final mod. Organized by editor type (e.g., `.forge/map-editor/`, `.forge/vfx-editor/`).
- **Project Manifest (mod.config.json)**: The configuration file describing the mod project's identity, layer structure, and transformer pipeline.

## Assumptions

- The `league-mod` project format uses `mod.config.json` as the manifest file based on the current repository specification.
- Assets within content layers follow the WAD-based directory convention (e.g., `content/<layer>/<WadName>.wad.client/<path>`).
- The `.modpkg` format uses Zstd compression with chunk-based storage as described in the `league-mod` specification.
- LTK Manager is the primary consumer of packed `.modpkg` files and defines compatibility requirements.
- The `.forge/` directory name is a reasonable convention for editor scratch data, following the pattern of tools like `.vscode/`, `.idea/`, etc.
- Scratch data for the map editor may include large binary files (terrain meshes, cached textures) potentially reaching hundreds of megabytes per project.
- The project root is the single source of truth; no external database or registry is needed for project state.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can create a new mod project and have it recognized by LTK Manager without manual file editing.
- **SC-002**: Opening a project with 1,000+ assets completes scanning and displays the asset tree within 5 seconds.
- **SC-003**: Packing a project produces a `.modpkg` file that LTK Manager can install without errors on the first attempt.
- **SC-004**: Editor scratch data persists correctly across application restarts with zero data loss for active sessions.
- **SC-005**: Scratch data is never included in packed mod output, verified by inspecting the `.modpkg` contents.
- **SC-006**: Users can go from launching the app to editing an existing project in under 3 clicks via the recent projects list.
- **SC-007**: Project creation from start to ready-to-edit state completes in under 30 seconds.
