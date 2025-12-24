# LTK Forge

> Visual editor for League of Legends modding

[![CI](https://img.shields.io/github/actions/workflow/status/LeagueToolkit/ltk-forge/ci.yml?style=flat-square)](https://github.com/LeagueToolkit/ltk-forge/actions)
[![License](https://img.shields.io/badge/license-MIT%2FApache--2.0-blue?style=flat-square)](LICENSE)

LTK Forge is a desktop application for creating and editing League of Legends mods. It provides visual editors for maps, models, VFX, and textures with live preview.

## Prerequisites

Before getting started, ensure you have the following installed:

- **Node.js** (v20 or higher)
- **pnpm** (v10 or higher) - Install with `npm install -g pnpm`
- **Rust** (latest stable) - Install from [rustup.rs](https://rustup.rs/)
- **Tauri prerequisites** for your OS:
  - **Linux**: See [Tauri Linux prerequisites](https://tauri.app/guides/prerequisites/#linux)
  - **macOS**: Xcode command line tools
  - **Windows**: Microsoft C++ Build Tools

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/LeagueToolkit/ltk-forge.git
cd ltk-forge

# Install dependencies
pnpm install
```

### Development

```bash
# Run the Vite frontend dev server
pnpm dev

# Run the Tauri desktop app in development mode
pnpm tauri dev
```

The frontend will be available at `http://localhost:1420`.

### Building

```bash
# Build the Tauri application for production
pnpm tauri build
```

The built application will be in `src-tauri/target/release`.

## Code Quality

### Linting

```bash
# Run ESLint
pnpm lint
```

### Formatting

```bash
# Format code with Prettier
pnpm format

# Check formatting without modifying files
pnpm format:check
```

### Type Checking

```bash
# Run TypeScript type checker
pnpm typecheck
```

## Features

- 🗺️ **Map Editor** - Edit `.mapgeo` environment files
- 🧍 **Model Viewer** - View skinned meshes with animation playback
- ✨ **VFX Editor** - Create and preview particle effects
- 🖼️ **Texture Viewer** - Preview textures with channel inspection
- 📦 **Build Integration** - Package mods with `league-mod`

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Desktop**: Tauri v2
- **Routing**: TanStack Router (file-based)
- **Styling**: Tailwind CSS v4
- **UI Components**: Base UI
- **Linting**: ESLint (flat config)
- **Formatting**: Prettier

## Project Structure

```
ltk-forge/
├── src/                  # Frontend source code
│   ├── routes/           # TanStack Router file-based routes
│   │   ├── __root.tsx    # Root route layout
│   │   └── index.tsx     # Index route
│   ├── main.tsx          # React entry point
│   └── index.css         # Global styles (Tailwind)
├── src-tauri/            # Tauri backend (Rust)
│   ├── src/              # Rust source code
│   └── tauri.conf.json   # Tauri configuration
├── public/               # Static assets
└── package.json          # Node.js dependencies and scripts
```

## Related Projects

- [league-toolkit](https://github.com/LeagueToolkit/league-toolkit) - Rust parsing library
- [league-mod](https://github.com/LeagueToolkit/league-mod) - CLI mod build tool
- [Obsidian](https://github.com/LeagueToolkit/Obsidian) - WAD browser

## License

Licensed under either of [Apache License, Version 2.0](LICENSE-APACHE) or [MIT license](LICENSE-MIT) at your option.
