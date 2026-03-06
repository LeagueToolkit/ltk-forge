# Feature Specification: LTK Forge Tauri App Setup

**Feature Branch**: `002-tauri-app-setup`
**Created**: 2026-03-06
**Status**: Draft
**Input**: User description: "We need to implement the actual LTK Forge Tauri app in the repo. The app should be a Tauri v2 app. Use the LTK Manager repository setup as reference."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Launch the Desktop Application (Priority: P1)

A developer or end user launches the LTK Forge desktop application. The application window opens with a responsive frontend shell and displays an initial landing view. The application is stable, renders correctly, and the Tauri backend is operational.

**Why this priority**: Without a launchable application, no other features can be built or tested. This is the foundational MVP.

**Independent Test**: Can be tested by building the application (`pnpm tauri build`) and launching the resulting binary. Success is confirmed when the window opens and the landing view renders without errors.

**Acceptance Scenarios**:

1. **Given** the application is built, **When** the user launches the executable, **Then** a desktop window opens displaying the LTK Forge landing view
2. **Given** the application is running, **When** the user resizes the window, **Then** the content adapts responsively without layout breakage
3. **Given** the application is running, **When** the user closes the window, **Then** the application process terminates cleanly

---

### User Story 2 - Development Workflow (Priority: P1)

A developer clones the repository and starts the development environment. They can run a single command to launch both the Tauri backend and the frontend dev server with hot-reload, enabling rapid iteration during development.

**Why this priority**: Developer experience is critical for productivity. Without a working dev workflow, no features can be efficiently developed.

**Independent Test**: Can be tested by running `pnpm tauri dev` from the repository root. Success is confirmed when the dev server starts, the Tauri window opens, and changes to frontend code trigger hot-reload.

**Acceptance Scenarios**:

1. **Given** a fresh clone of the repository with dependencies installed, **When** the developer runs the dev command, **Then** the application launches in development mode with hot-reload enabled
2. **Given** the dev server is running, **When** the developer modifies a frontend file, **Then** the changes are reflected in the application without a full restart
3. **Given** the dev server is running, **When** the developer modifies a Rust backend file, **Then** the backend recompiles and the application restarts automatically

---

### User Story 3 - Build Production Binary (Priority: P2)

A developer or CI pipeline builds the LTK Forge application into a distributable binary for the target platform. The build process completes successfully and produces an installable artifact.

**Why this priority**: Production builds are needed for distribution but are secondary to having a working development environment.

**Independent Test**: Can be tested by running `pnpm tauri build`. Success is confirmed when the build completes without errors and produces a platform-appropriate installer/binary.

**Acceptance Scenarios**:

1. **Given** all dependencies are installed, **When** the build command is executed, **Then** a production binary is generated for the current platform
2. **Given** the production binary is built, **When** a user runs the binary on the target platform, **Then** the application launches and functions correctly

---

### User Story 4 - Integration with Existing Monorepo Packages (Priority: P2)

The Tauri application frontend consumes shared packages from the existing monorepo workspace (e.g., shared types, utilities, or components defined in other workspace packages). Changes to shared packages are reflected in the application during development.

**Why this priority**: The application must integrate with the existing monorepo structure to leverage shared code and maintain consistency across the project.

**Independent Test**: Can be tested by importing a type or utility from a workspace package into the Tauri app frontend and verifying it resolves correctly during both development and production builds.

**Acceptance Scenarios**:

1. **Given** a shared workspace package exists, **When** the Tauri app frontend imports from it, **Then** the import resolves correctly during development
2. **Given** a shared workspace package is updated, **When** the dev server is running, **Then** the changes are picked up by the Tauri app frontend

---

### Edge Cases

- What happens when the Rust toolchain is not installed? The build process should provide a clear error message directing the user to install Rust.
- What happens when system dependencies for Tauri are missing (e.g., WebView2 on Windows, webkit2gtk on Linux)? The build should fail with actionable error messages.
- What happens when pnpm workspace dependencies are out of sync? Running `pnpm install` should resolve all dependencies correctly.
- What happens when the frontend dev server port is already in use? The dev server should either use the next available port or provide a clear error message.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The application MUST be a Tauri v2 desktop application with a Rust backend and a web-based frontend
- **FR-002**: The project MUST use a Cargo workspace at the repository root with the Tauri backend as a workspace member
- **FR-003**: The frontend MUST use Vite as the build tool and dev server
- **FR-004**: The application MUST support a development mode with hot-reload for the frontend
- **FR-005**: The application MUST produce a production-ready binary via a build command
- **FR-006**: The Tauri app frontend MUST integrate with the existing pnpm workspace, able to consume shared packages
- **FR-007**: The application window MUST be resizable with a sensible default size (e.g., 1200x800)
- **FR-008**: The project MUST include Tauri capabilities configuration for filesystem, shell, and dialog access
- **FR-009**: The application MUST render a minimal landing view on first launch confirming the app is operational
- **FR-010**: The project structure MUST follow the reference pattern from LTK Manager: `src-tauri/` for Rust backend, frontend source in the monorepo app package

### Key Entities

- **Tauri Application**: The desktop application shell consisting of a Rust backend process and a WebView-based frontend window
- **Cargo Workspace**: The root-level Rust workspace managing the Tauri backend crate and any future Rust crates
- **Frontend App Package**: The pnpm workspace package containing the React/TypeScript frontend for the Tauri application
- **Tauri Capabilities**: Configuration files defining what system-level APIs (filesystem, dialogs, shell) the frontend can access

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can go from fresh clone to running dev environment in under 5 minutes (excluding dependency download time)
- **SC-002**: The application launches and displays the landing view within 3 seconds on a standard development machine
- **SC-003**: Frontend hot-reload reflects changes within 2 seconds during development
- **SC-004**: The production build completes without errors and produces a functional binary
- **SC-005**: All existing monorepo packages remain functional and their tests pass after the Tauri app is added
- **SC-006**: The application window renders correctly on Windows (primary target platform)

## Assumptions

- The primary target platform is Windows, consistent with the existing development environment and League of Legends tooling ecosystem
- The frontend will use React with TypeScript, consistent with the reference LTK Manager project and existing monorepo conventions
- TanStack Router will be used for routing, following the LTK Manager reference pattern
- Tailwind CSS will be used for styling, consistent with the reference project
- The Tauri app will be set up as a pnpm workspace package within the existing monorepo structure
- Zustand will be used for state management, following the reference project's patterns
- The initial landing view will be a simple placeholder page confirming the app is operational; full UI features will be added in subsequent feature branches
