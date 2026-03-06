# Data Model: LTK Forge Tauri App Setup

This feature is primarily infrastructure setup. The data model is minimal for the initial app shell.

## Entities

### TauriApplication

The desktop application shell. No persistent data model at this stage.

- **Window State**: Position, size (managed by Tauri runtime, not persisted in v1)
- **App Identifier**: `dev.leaguetoolkit.forge`
- **Version**: `0.1.0`

### Capabilities

Tauri security capabilities defining what system APIs the frontend can access.

| Capability | Scope | Purpose |
|-----------|-------|---------|
| Window management | main window | Minimize, maximize, close, drag |
| Shell open | default | Open URLs in system browser |
| Dialog | open, save, message | File picker dialogs |
| Filesystem | read, write, exists, mkdir | File operations for mod/map files |
| Process | restart, exit | Application lifecycle |

### Frontend App State

Managed by Zustand stores. Initial setup includes only:

- **AppStore**: Application-level state (app version, initialization status)

Future stores (not in this feature's scope):
- Settings, Editor state, Project state, etc.

## Relationships

```
Cargo Workspace (root)
  └── src-tauri (Tauri backend crate)

pnpm Workspace (root)
  ├── apps/forge (frontend app)
  │   ├── imports from → @ltk-forge/math
  │   ├── imports from → @ltk-forge/mapgeo-types
  │   ├── imports from → @ltk-forge/mapgeo-utils
  │   └── imports from → @ltk-forge/map-renderer
  ├── packages/ltk-math
  ├── packages/ltk-mapgeo-types
  ├── packages/ltk-mapgeo-utils
  └── packages/ltk-map-renderer
```

## State Transitions

None for initial setup. The app launches → renders landing view → user closes. No complex state machines.
