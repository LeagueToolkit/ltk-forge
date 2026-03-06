# Tauri Command Contracts: Project Management

**Feature**: 005-project-management
**Date**: 2026-03-06

These contracts define the IPC interface between the React frontend and Rust backend via `tauri::invoke()`.

---

## `create_project`

Creates a new mod project directory with valid league-mod structure.

**Request**:

```typescript
{
  name: string;           // Machine-readable name (alphanumeric, hyphens, underscores)
  display_name: string;   // Human-readable display name
  description: string;    // Project description
  version: string;        // Semver string (default: "1.0.0")
  path: string;           // Absolute path to create the project directory
  authors: Author[];      // At least one author
}

type Author = string | { name: string; role: string };
```

**Response**:

```typescript
{
  root_path: string; // Absolute path to the created project
  config: ModProjectConfig;
}
```

**Errors**:

- `directory_not_empty` — Target directory exists and is not empty
- `invalid_name` — Name contains invalid characters
- `invalid_path` — Path is not writable or parent doesn't exist
- `io_error` — Filesystem error during creation

---

## `open_project`

Opens and scans an existing mod project directory.

**Request**:

```typescript
{
  path: string; // Absolute path to the project root
}
```

**Response**:

```typescript
{
  root_path: string;
  config: ModProjectConfig;
  layers: LayerInfo[];
  scratch_info: ScratchInfo | null;
}

type LayerInfo = {
  name: string;
  priority: number;
  description: string | null;
  asset_count: number;
  total_size_bytes: number;
};

type ScratchInfo = {
  version: number;
  total_size_bytes: number;
  last_cleanup: string | null;  // ISO 8601 datetime
};
```

**Errors**:

- `not_a_directory` — Path doesn't exist or isn't a directory
- `missing_config` — No `mod.config.json` found
- `invalid_config` — Config file exists but is malformed
- `io_error` — Filesystem error during scan

---

## `scan_assets`

Returns the full asset tree for an open project. Separated from `open_project` to allow lazy loading for large projects.

**Request**:

```typescript
{
  project_path: string; // Project root path
}
```

**Response**:

```typescript
{
  assets: ResolvedAssetInfo[];
  total_count: number;
  scan_duration_ms: number;
}

type ResolvedAssetInfo = {
  wad_name: string;
  relative_path: string;
  path_hash: string;         // Hex-encoded u64
  effective_layer: string;
  all_layers: string[];      // Ordered by priority (highest first)
  size_bytes: number;
};
```

**Errors**:

- `project_not_found` — No project at the given path
- `io_error` — Filesystem error during scan

---

## `pack_project`

Packs the project into a `.modpkg` file. Emits progress events during operation.

**Request**:

```typescript
{
  project_path: string; // Project root path
  output_path: string | null; // Custom output path (default: build/<name>.modpkg)
}
```

**Response**:

```typescript
{
  output_path: string; // Absolute path to the produced .modpkg
  asset_count: number; // Number of assets packed
  file_size_bytes: number; // Size of the output file
  duration_ms: number; // Total pack time
}
```

**Progress Event** (`project:pack-progress`):

```typescript
{
  stage: "scanning" | "compressing" | "writing" | "complete";
  progress: number; // 0.0 to 1.0
  current_asset: string | null; // Currently processing asset path
}
```

**Errors**:

- `project_not_found` — No project at the given path
- `empty_project` — No content assets found
- `asset_error` — Specific asset could not be read (includes asset path)
- `pack_error` — Error during modpkg construction
- `io_error` — Filesystem error writing output

---

## `get_recent_projects`

Returns the list of recently opened projects.

**Request**: None

**Response**:

```typescript
{
  projects: RecentProjectInfo[];
}

type RecentProjectInfo = {
  path: string;
  name: string;
  last_opened: string;     // ISO 8601 datetime
  exists: boolean;         // Whether the directory still exists
};
```

**Errors**:

- `io_error` — Error reading the recent projects file

---

## `remove_recent_project`

Removes a project from the recent projects list.

**Request**:

```typescript
{
  path: string; // Project path to remove
}
```

**Response**: `null`

**Errors**:

- `io_error` — Error writing the recent projects file

---

## `cleanup_scratch`

Removes stale scratch data from a project's `.forge/` directory.

**Request**:

```typescript
{
  project_path: string; // Project root path
  dry_run: boolean; // If true, report what would be deleted without deleting
}
```

**Response**:

```typescript
{
  removed_entries: ScratchEntryInfo[];
  freed_bytes: number;
  remaining_bytes: number;
}

type ScratchEntryInfo = {
  editor_type: string;
  asset_hash: string;
  size_bytes: number;
  reason: "orphaned" | "stale";  // Why it was removed
};
```

**Errors**:

- `project_not_found` — No project at the given path
- `no_scratch_dir` — No `.forge/` directory exists
- `io_error` — Filesystem error during cleanup

---

## Shared Types

```typescript
type ModProjectConfig = {
  name: string;
  display_name: string;
  version: string;
  description: string;
  authors: (string | { name: string; role: string })[];
  license: string | { name: string; url: string };
  tags: string[];
  champions: string[];
  maps: string[];
  layers: LayerConfig[];
  transformers: TransformerConfig[];
};

type LayerConfig = {
  name: string;
  priority: number;
  description: string | null;
};

type TransformerConfig = {
  name: string;
  patterns: string[];
  files: string[];
  options: Record<string, unknown> | null;
};
```
