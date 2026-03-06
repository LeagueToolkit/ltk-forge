# Quickstart: LTK Forge Tauri App Setup

## Prerequisites

- **Node.js** 22+
- **pnpm** 9.15+
- **Rust** (stable toolchain, install via [rustup](https://rustup.rs/))
- **Windows**: WebView2 (pre-installed on Windows 10/11)
- **Linux**: `webkit2gtk-4.1`, `libappindicator3-1`, `librsvg2-dev` (see [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/))

## Setup

```bash
# Clone and install dependencies
git clone https://github.com/LeagueToolkit/ltk-forge.git
cd ltk-forge
pnpm install
```

## Development

```bash
# Start the Tauri dev environment (frontend hot-reload + Rust backend)
pnpm tauri dev

# Or run from the app directory
cd apps/forge
pnpm tauri dev
```

The dev server starts Vite on port 5173 and launches the Tauri window. Frontend changes hot-reload automatically. Rust changes trigger a recompile and app restart.

## Build

```bash
# Production build
pnpm tauri build
```

The built binary is output to `src-tauri/target/release/bundle/`.

## Project Structure

```
ltk-forge/
├── apps/
│   └── forge/                    # Tauri frontend app
│       ├── src/                  # React/TypeScript source
│       │   ├── components/       # UI components
│       │   ├── routes/           # TanStack Router routes
│       │   ├── stores/           # Zustand stores
│       │   ├── styles/           # Tailwind CSS
│       │   └── main.tsx          # Entry point
│       ├── index.html            # HTML entry
│       ├── package.json
│       ├── vite.config.ts
│       ├── tsconfig.json
│       └── eslint.config.js
├── src-tauri/                    # Tauri Rust backend
│       ├── src/
│       │   └── main.rs           # Rust entry point
│       ├── capabilities/         # Security capabilities
│       ├── icons/                # App icons
│       ├── Cargo.toml
│       ├── build.rs
│       └── tauri.conf.json
├── packages/                     # Shared libraries
│   ├── ltk-math/
│   ├── ltk-mapgeo-types/
│   ├── ltk-mapgeo-utils/
│   └── ltk-map-renderer/
├── Cargo.toml                    # Cargo workspace root
├── package.json                  # pnpm workspace root
├── pnpm-workspace.yaml
└── turbo.json
```

## Key Commands

| Command | Description |
|---------|-------------|
| `pnpm tauri dev` | Start development environment |
| `pnpm tauri build` | Build production binary |
| `pnpm typecheck` | Type-check all packages |
| `pnpm lint` | Lint all packages |
| `pnpm test` | Run all tests |
