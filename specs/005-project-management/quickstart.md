# Quickstart: Project Management & Mod Integration

**Feature**: 005-project-management
**Date**: 2026-03-06

## Prerequisites

- Rust toolchain (2021 edition)
- Node.js 18+ with pnpm 9.15+
- Tauri v2 CLI (`cargo install tauri-cli`)
- The `ltk_modpkg` and `ltk_mod_project` crates must be accessible (crates.io or git dependency)

## Setup

### 1. Add Rust Dependencies

In `src-tauri/Cargo.toml`, add:

```toml
[dependencies]
ltk_modpkg = { version = "0.3", features = ["project"] }
ltk_mod_project = "0.3"
xxhash-rust = { version = "0.8", features = ["xxh3"] }
```

### 2. Create the Project Module

```
src-tauri/src/
├── main.rs              # Add project commands to handler
└── project/
    ├── mod.rs           # Module exports
    ├── commands.rs      # Tauri command handlers
    ├── scanner.rs       # Asset scanning logic
    ├── packer.rs        # Pack orchestration
    └── scratch.rs       # .forge/ directory management
```

### 3. Register Commands

In `main.rs`, register the new commands:

```rust
tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
        get_app_info,
        project::commands::create_project,
        project::commands::open_project,
        project::commands::scan_assets,
        project::commands::pack_project,
        project::commands::get_recent_projects,
        project::commands::remove_recent_project,
        project::commands::cleanup_scratch,
    ])
```

### 4. Frontend Store

Create `apps/forge/src/stores/project-store.ts` with Zustand to hold:

- Current project state (config, layers, assets)
- Loading/error states
- Recent projects cache

### 5. Frontend Routes

Add TanStack Router file-based routes:

- `routes/new-project.tsx` — Project creation form
- `routes/project/route.tsx` — Project layout (wraps child routes)
- `routes/project/browser.tsx` — Asset tree browser
- Update `routes/index.tsx` — Show recent projects

## Development Workflow

```bash
# Terminal 1: Run the Tauri dev server
pnpm tauri dev

# Terminal 2: Run Rust tests
cd src-tauri && cargo test

# Terminal 3: Run frontend tests
pnpm --filter @ltk-forge/forge test
```

## Testing a Project Round-Trip

1. Launch the app with `pnpm tauri dev`
2. Create a new project via the UI (or invoke `create_project` from dev tools)
3. Verify `mod.config.json` is valid by opening it in a text editor
4. Add a test asset: create `content/base/Map11.wad.client/data/test.bin`
5. Open the project — verify the asset appears in the browser
6. Pack the project — verify `.modpkg` is created in `build/`
7. (Optional) Open the `.modpkg` in LTK Manager to verify compatibility

## Key Files Reference

| File                                                       | Purpose                                |
| ---------------------------------------------------------- | -------------------------------------- |
| `src-tauri/src/project/commands.rs`                        | All Tauri command handlers             |
| `src-tauri/src/project/scanner.rs`                         | Filesystem walking and asset discovery |
| `src-tauri/src/project/packer.rs`                          | `.modpkg` creation via `ltk_modpkg`    |
| `src-tauri/src/project/scratch.rs`                         | `.forge/` directory CRUD and cleanup   |
| `apps/forge/src/stores/project-store.ts`                   | Frontend project state                 |
| `apps/forge/src/lib/tauri-commands.ts`                     | Typed invoke wrappers                  |
| `apps/forge/src/routes/project/browser.tsx`                | Asset tree UI                          |
| `specs/005-project-management/contracts/tauri-commands.md` | IPC contract reference                 |
