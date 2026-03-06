# IPC Command Contracts: LTK Forge Tauri App

Tauri IPC commands define the interface between the React frontend and the Rust backend. These are invoked via `@tauri-apps/api/core` `invoke()` function.

## Initial Commands (Minimal Setup)

### `get_app_info`

Returns basic application metadata. Used by the landing view to confirm the backend is operational.

**Direction**: Frontend → Backend → Frontend

**Request**: None (no arguments)

**Response**:
```typescript
interface AppInfo {
  name: string;       // "LTK Forge"
  version: string;    // e.g., "0.1.0"
}
```

**Error Cases**: None expected (always succeeds)

---

## Future Commands (Not in Scope)

The following command categories will be added in subsequent features:
- File operations (open/save map files)
- Project management
- Settings persistence
- Editor state synchronization

## Convention

All IPC commands follow these conventions (aligned with LTK Manager):
- Command names use `snake_case`
- Commands are registered via `tauri::generate_handler![]` in `main.rs`
- Commands return `Result<T, String>` for error handling
- Complex types use `serde::Serialize`/`Deserialize`
