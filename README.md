# LTK Forge

> Visual editor for League of Legends modding

[![CI](https://img.shields.io/github/actions/workflow/status/LeagueToolkit/ltk-forge/ci.yml?style=flat-square)](https://github.com/LeagueToolkit/ltk-forge/actions)
[![License](https://img.shields.io/badge/license-MIT%2FApache--2.0-blue?style=flat-square)](LICENSE)

LTK Forge is a desktop application for creating and editing League of Legends mods. It provides visual editors for maps, models, VFX, and textures with live preview.

## Features

- 🗺️ **Map Editor** - Edit `.mapgeo` environment files
- 🧍 **Model Viewer** - View skinned meshes with animation playback
- ✨ **VFX Editor** - Create and preview particle effects
- 🖼️ **Texture Viewer** - Preview textures with channel inspection
- 📦 **Build Integration** - Package mods with `league-mod`

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [pnpm](https://pnpm.io/) (v8 or later)
- [Rust](https://www.rust-lang.org/) (latest stable)
- [Tauri prerequisites](https://tauri.app/start/prerequisites/)

### Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Run in development mode:
   ```bash
   pnpm tauri dev
   ```

3. Build for production:
   ```bash
   pnpm tauri build
   ```

### Available Scripts

- `pnpm dev` - Start Vite development server
- `pnpm build` - Build frontend for production
- `pnpm preview` - Preview production build
- `pnpm tauri dev` - Run Tauri app in development mode
- `pnpm tauri build` - Build Tauri app for production
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

## Tech Stack

- **Framework**: Tauri 2.0 with Rust backend
- **Frontend**: React 19 with TypeScript
- **Routing**: TanStack Router
- **Styling**: Tailwind CSS v4 with base-ui components
- **Build Tool**: Vite
- **Linting**: ESLint
- **Formatting**: Prettier

## Related Projects

- [league-toolkit](https://github.com/LeagueToolkit/league-toolkit) - Rust parsing library
- [league-mod](https://github.com/LeagueToolkit/league-mod) - CLI mod build tool
- [Obsidian](https://github.com/LeagueToolkit/Obsidian) - WAD browser

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [Tauri Extension](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## License

Licensed under either of [Apache License, Version 2.0](LICENSE-APACHE) or [MIT license](LICENSE-MIT) at your option.
