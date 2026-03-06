# Research: Project Management & Mod Integration

**Feature**: 005-project-management
**Date**: 2026-03-06

## R1: league-mod Crate Ecosystem

**Decision**: Use `ltk_modpkg` ^0.3.0 and `ltk_mod_project` ^0.3.0 as direct Rust dependencies.

**Rationale**: These are the official LeagueToolkit crates that define the mod project format. `ltk_mod_project` handles project configuration parsing (`mod.config.json`) and layer definitions. `ltk_modpkg` provides the builder/reader API for `.modpkg` packaging with Zstd compression and xxh3_64 checksums.

**Alternatives considered**:

- Implementing format parsing from scratch — rejected (duplicates maintained upstream code, format may evolve)
- Shelling out to the `league-mod` CLI — rejected (fragile, requires CLI installation, poor error propagation)

## R2: mod.config.json Schema

**Decision**: Parse using `ltk_mod_project`'s `ModProject` struct via serde.

**Rationale**: The crate already defines the complete schema:

- `name`, `display_name`, `version`, `description` (required metadata)
- `authors` (string or `{name, role}` objects)
- `license` (SPDX string or `{name, url}`)
- `tags`, `champions`, `maps` (categorization arrays)
- `layers` (name, priority, description, string_overrides)
- `transformers` (name, patterns, files, options)

**Alternatives considered**:

- Custom schema definition — rejected (must stay compatible with upstream)

## R3: Asset Discovery Strategy

**Decision**: Recursive filesystem walk under `content/<layer>/<WAD>.wad.client/` directories. Hash paths with xxh3_64 to match the modpkg chunk addressing scheme.

**Rationale**: Assets are organized by WAD identifier under each layer directory. Walking the filesystem is the canonical approach — the `pack_from_project` function in `ltk_modpkg` does the same. Hashing paths enables direct lookup compatibility with the `.modpkg` format.

**Alternatives considered**:

- Index file / manifest per layer — rejected (not part of league-mod spec, adds sync burden)
- Watching filesystem for changes — deferred (can be added later for live-reload)

## R4: Scratch Data Directory Convention

**Decision**: Use `.forge/` at the project root with deterministic subdirectory structure:

```
.forge/
├── map-editor/
│   ├── <asset-hash>/           # Per-asset scratch data
│   │   ├── undo-history.bin
│   │   ├── viewport-state.json
│   │   └── mesh-cache/
│   └── global/                 # Editor-wide state
│       └── brush-config.json
├── vfx-editor/
│   └── <asset-hash>/
└── .forge-meta.json            # Scratch directory metadata (version, last-cleanup)
```

**Rationale**:

- Deterministic paths (editor-type + asset-hash) mean no index file is needed to locate data
- Asset hash derived from WAD path + relative file path ensures uniqueness
- `.forge-meta.json` tracks scratch directory version for migration and cleanup scheduling
- `.forge/` is easily excluded from packaging via path prefix check
- Convention mirrors `.vscode/`, `.idea/` patterns familiar to developers

**Alternatives considered**:

- App-local data directory (outside project) — rejected (scratch data should travel with the project for portability)
- SQLite database for scratch data — rejected (overkill for file-based editor caches, harder to inspect/debug)
- Storing in OS temp directory — rejected (no persistence guarantees across reboots)

## R5: Recent Projects Storage

**Decision**: Store in Tauri's app data directory as `recent-projects.json` using `tauri-plugin-fs`.

**Rationale**: App-level data (not project-specific) belongs in the OS app data path. Tauri provides `app_data_dir()` for this. A simple JSON array with `{path, name, last_opened}` entries is sufficient. Cap at 20 entries.

**Alternatives considered**:

- OS-specific recent files APIs — rejected (not cross-platform, more complex)
- In-memory only — rejected (spec requires persistence across restarts)

## R6: Pack Operation Architecture

**Decision**: Use `ltk_modpkg::pack_from_project()` directly, wrapped in a Tauri async command with progress reporting via events.

**Rationale**: The crate provides a high-level `pack_from_project()` function that handles layer resolution, chunk creation, Zstd compression, and metadata embedding. Wrapping it in an async command prevents UI blocking. Tauri events (`app.emit()`) enable progress reporting to the frontend.

**Alternatives considered**:

- Custom packing logic — rejected (duplicates crate functionality)
- Synchronous blocking call — rejected (freezes UI for large projects)

## R7: Tauri Command Pattern

**Decision**: Use `#[tauri::command]` with structured request/response types serialized via serde. Group commands in a `project` module registered via `tauri::generate_handler![]`.

**Rationale**: Standard Tauri v2 pattern. All project commands share the same module namespace. Frontend calls via `invoke("plugin:project|command_name", args)` or plain `invoke("command_name", args)`.

**Alternatives considered**:

- Tauri plugin architecture — deferred (heavier abstraction, not needed for built-in features)
- REST-like HTTP server — rejected (Tauri IPC is more efficient and secure)
