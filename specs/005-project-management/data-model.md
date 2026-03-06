# Data Model: Project Management & Mod Integration

**Feature**: 005-project-management
**Date**: 2026-03-06

## Entities

### ModProject

Represents a loaded mod project in memory. Wraps the `ltk_mod_project` crate's configuration with additional runtime state.

| Field     | Type             | Description                                 |
| --------- | ---------------- | ------------------------------------------- |
| root_path | Path             | Absolute path to the project root directory |
| config    | ModProjectConfig | Parsed `mod.config.json` content            |
| layers    | Layer[]          | Discovered layers with scanned assets       |
| is_dirty  | bool             | Whether unsaved changes exist               |

**Validation rules**:

- `root_path` must exist and be a directory
- `root_path` must contain a valid `mod.config.json`
- `config.name` must be non-empty, alphanumeric with hyphens/underscores only
- `config.version` must be valid semver

---

### ModProjectConfig

Direct mapping from `mod.config.json`. Uses `ltk_mod_project`'s `ModProject` struct.

| Field        | Type                | Required | Description                       |
| ------------ | ------------------- | -------- | --------------------------------- |
| name         | string              | yes      | Machine-readable identifier       |
| display_name | string              | yes      | Human-readable name               |
| version      | string              | yes      | Semantic version                  |
| description  | string              | yes      | Project description               |
| authors      | Author[]            | yes      | List of contributors              |
| license      | string or License   | yes      | SPDX identifier or custom license |
| tags         | string[]            | no       | Categorization tags               |
| champions    | string[]            | no       | Targeted champions                |
| maps         | string[]            | no       | Targeted maps                     |
| layers       | LayerConfig[]       | yes      | Layer definitions (at least base) |
| transformers | TransformerConfig[] | no       | Build-time transformers           |

---

### Layer

A content layer within a project, populated by scanning the filesystem.

| Field       | Type    | Description                         |
| ----------- | ------- | ----------------------------------- |
| name        | string  | Layer identifier matching config    |
| priority    | i32     | Override priority (higher wins)     |
| description | string? | Optional description                |
| assets      | Asset[] | Discovered assets in this layer     |
| path        | Path    | Absolute path to `content/<layer>/` |

**State transitions**: None (read-only after scan)

---

### Asset

A single file within a layer, identified by its WAD context and file path.

| Field         | Type   | Description                               |
| ------------- | ------ | ----------------------------------------- |
| wad_name      | string | WAD identifier (e.g., `Map11.wad.client`) |
| relative_path | string | Path within the WAD directory             |
| absolute_path | Path   | Full filesystem path                      |
| path_hash     | u64    | xxh3_64 hash of the canonical path        |
| size_bytes    | u64    | File size                                 |
| layer_name    | string | Owning layer name                         |

**Validation rules**:

- `wad_name` must match pattern `*.wad.client` or `*.wad`
- `relative_path` must not be empty
- `absolute_path` must exist and be a file

---

### ResolvedAsset

An asset with layer priority resolution applied. Used for display and packing.

| Field           | Type     | Description                                           |
| --------------- | -------- | ----------------------------------------------------- |
| wad_name        | string   | WAD identifier                                        |
| relative_path   | string   | Path within the WAD directory                         |
| path_hash       | u64      | xxh3_64 hash                                          |
| effective_layer | string   | Highest-priority layer containing this asset          |
| all_layers      | string[] | All layers containing this asset, ordered by priority |

---

### ScratchDirectory

Metadata for the `.forge/` scratch data directory.

| Field            | Type      | Description                         |
| ---------------- | --------- | ----------------------------------- |
| root_path        | Path      | Absolute path to `.forge/`          |
| version          | u32       | Scratch directory format version    |
| last_cleanup     | datetime? | Timestamp of last cleanup           |
| total_size_bytes | u64       | Computed total size of scratch data |

---

### ScratchEntry

A single scratch data item for a specific editor and asset.

| Field         | Type     | Description                                          |
| ------------- | -------- | ---------------------------------------------------- |
| editor_type   | string   | Editor identifier (e.g., `map-editor`, `vfx-editor`) |
| asset_hash    | string   | Hex-encoded hash of the associated asset path        |
| path          | Path     | Absolute path to the scratch entry directory         |
| last_modified | datetime | Most recent modification time                        |
| size_bytes    | u64      | Total size of this entry                             |

**Staleness rule**: An entry is stale if its `asset_hash` does not match any asset in the current project scan.

---

### RecentProject

An entry in the persistent recent projects list.

| Field       | Type     | Description                         |
| ----------- | -------- | ----------------------------------- |
| path        | string   | Absolute path to the project root   |
| name        | string   | Display name from `mod.config.json` |
| last_opened | datetime | When the project was last opened    |

**Validation rules**:

- List capped at 20 entries
- Entries with non-existent paths are marked invalid (not auto-removed until user action)

---

## Relationships

```
ModProject 1──* Layer 1──* Asset
     │                        │
     │                   ResolvedAsset (computed from all layers)
     │
     ├── 1──1 ScratchDirectory 1──* ScratchEntry
     │
     └── 1──1 ModProjectConfig
           ├── 1──* LayerConfig
           └── 1──* TransformerConfig

RecentProject (independent, app-level)
```

## Filesystem Layout

```
<project-root>/
├── mod.config.json
├── content/
│   ├── base/                              # Layer (priority 0)
│   │   ├── Map11.wad.client/
│   │   │   └── data/
│   │   │       └── maps/shipping/map11/   # Asset files
│   │   └── Champions.wad.client/
│   │       └── ...
│   └── high_res/                          # Layer (priority 10)
│       └── ...
├── build/                                 # Pack output
│   └── <name>.modpkg
└── .forge/                                # Scratch data (excluded from pack)
    ├── .forge-meta.json
    ├── map-editor/
    │   ├── <asset-hash>/
    │   │   ├── undo-history.bin
    │   │   ├── viewport-state.json
    │   │   └── mesh-cache/
    │   └── global/
    └── vfx-editor/
        └── <asset-hash>/
```
