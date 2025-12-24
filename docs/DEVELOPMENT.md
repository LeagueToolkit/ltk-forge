# Development Setup

This guide will help you set up your development environment for LTK Forge.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- **Node.js** (v18 or later) - [Download](https://nodejs.org/)
- **pnpm** (v8 or later) - Install with `npm install -g pnpm`
- **Rust** (latest stable) - [Install](https://www.rust-lang.org/tools/install)
- **Git** - [Download](https://git-scm.com/downloads)

### Tauri System Dependencies

Tauri requires platform-specific system dependencies. Follow the installation guide for your operating system:

#### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

#### macOS

```bash
xcode-select --install
```

#### Windows

Install [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)

For more detailed information, see the [Tauri Prerequisites Guide](https://tauri.app/start/prerequisites/).

## Project Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/LeagueToolkit/ltk-forge.git
   cd ltk-forge
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

## Development Workflow

### Running the Application

Start the development server with hot-reload:

```bash
pnpm tauri dev
```

This will:
1. Start the Vite development server on `http://localhost:1420`
2. Build and launch the Tauri application
3. Enable hot-reload for both frontend and backend changes

### Building for Production

Build the application for production:

```bash
pnpm tauri build
```

The built application will be in `src-tauri/target/release/`.

### Code Quality

#### Linting

Check for code quality issues:

```bash
pnpm lint
```

Fix auto-fixable issues:

```bash
pnpm lint:fix
```

#### Formatting

Format code with Prettier:

```bash
pnpm format
```

Check code formatting:

```bash
pnpm format:check
```

#### Type Checking

TypeScript type checking is run as part of the build:

```bash
pnpm build
```

## Project Structure

```
ltk-forge/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── routes/             # TanStack Router routes
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── src-tauri/              # Tauri backend (Rust)
│   ├── src/
│   │   ├── main.rs         # Tauri application entry
│   │   └── lib.rs          # Core application logic
│   ├── Cargo.toml          # Rust dependencies
│   └── tauri.conf.json     # Tauri configuration
├── public/                 # Static assets
├── package.json            # Node.js dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── eslint.config.js        # ESLint configuration
├── .prettierrc             # Prettier configuration
└── tsr.config.json         # TanStack Router configuration
```

## Tech Stack

### Frontend

- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **TanStack Router** - Type-safe routing
- **Tailwind CSS v4** - Utility-first CSS framework
- **base-ui** - Headless UI components

### Backend

- **Tauri 2.0** - Cross-platform desktop framework
- **Rust** - System programming language
- **Tokio** - Async runtime (via Tauri)

### Development Tools

- **ESLint** - JavaScript/TypeScript linter
- **Prettier** - Code formatter
- **pnpm** - Fast, disk-efficient package manager

## Troubleshooting

### Port 1420 Already in Use

If you get an error that port 1420 is already in use, either:
1. Stop the process using that port
2. Change the port in `src-tauri/tauri.conf.json` (update both `devUrl` and the Vite port in `vite.config.ts`)

### Rust Compilation Errors

If you encounter Rust compilation errors:
1. Make sure you have the latest Rust toolchain: `rustup update`
2. Clean the build cache: `cargo clean` (in `src-tauri/` directory)
3. Rebuild: `pnpm tauri dev`

### Missing System Dependencies (Linux)

If you get errors about missing libraries on Linux:
```bash
# Ubuntu/Debian
sudo apt install libwebkit2gtk-4.1-dev libayatana-appindicator3-dev

# Fedora
sudo dnf install webkit2gtk4.1-devel libappindicator-gtk3-devel

# Arch
sudo pacman -S webkit2gtk-4.1 libappindicator-gtk3
```

### Frontend Build Errors

If the frontend fails to build:
1. Delete `node_modules` and `pnpm-lock.yaml`
2. Run `pnpm install` again
3. Try `pnpm build` to see detailed errors

## IDE Setup

### VS Code (Recommended)

Install these extensions:
- [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

### Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[rust]": {
    "editor.defaultFormatter": "rust-lang.rust-analyzer"
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Contributing

1. Create a new branch for your feature: `git checkout -b feature/my-feature`
2. Make your changes
3. Run linting and formatting: `pnpm lint:fix && pnpm format`
4. Test your changes: `pnpm tauri dev`
5. Commit your changes: `git commit -m "Add my feature"`
6. Push to your branch: `git push origin feature/my-feature`
7. Create a Pull Request

## Resources

- [Tauri Documentation](https://tauri.app/)
- [React Documentation](https://react.dev/)
- [TanStack Router Documentation](https://tanstack.com/router)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Rust Book](https://doc.rust-lang.org/book/)
