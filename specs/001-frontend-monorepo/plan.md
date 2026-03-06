# Implementation Plan: Frontend Monorepo for 3D World Rendering Libraries

**Branch**: `001-frontend-monorepo` | **Date**: 2026-03-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-frontend-monorepo/spec.md`

## Summary

Create a pnpm + Turborepo monorepo workspace containing TypeScript libraries for handling League map geometry data from the Tauri backend and rendering interactive 3D worlds via Three.js / @react-three/fiber. The monorepo also establishes shared tooling (ESLint, TypeScript, Vitest configs), a .gitignore for AI tooling directories (.claude, .specify), and a package structure designed for incremental builds and easy extensibility.

## Technical Context

**Language/Version**: TypeScript 5.x, targeting ES2022+
**Primary Dependencies**: pnpm (workspace management), Turborepo v2 (task orchestration), Three.js + @react-three/fiber (3D rendering), Vitest (testing), ESLint v9 + Prettier (linting/formatting). No build step for library packages (Internal Packages pattern — Vite transpiles .ts source directly).
**Storage**: N/A (in-memory data from Tauri IPC; no database)
**Testing**: Vitest with workspace-level configuration, per-package test suites
**Target Platform**: Tauri 2.0 WebView (Chromium-based), desktop (Windows/macOS/Linux)
**Project Type**: Library monorepo (internal packages consumed by a Tauri + React desktop application)
**Performance Goals**: 30+ FPS rendering 500+ mesh scenes, <10s incremental rebuilds, <2min full workspace build
**Constraints**: Internal packages only (not published to npm), must align with Tauri IPC serialization (JSON + binary buffers), must match Rust backend `glam` math types
**Scale/Scope**: 5-6 packages initially, growing as new editor modules are added

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution is not yet configured (template only). No gates to enforce at this time. Proceeding with industry-standard practices for TypeScript monorepo development.

**Post-Phase 1 re-check**: Still N/A - constitution remains unconfigured.

## Project Structure

### Documentation (this feature)

```text
specs/001-frontend-monorepo/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── tauri-ipc.md     # IPC contract between Rust backend and frontend packages
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
.gitignore                    # Git ignore rules (including .claude/, .specify/)
pnpm-workspace.yaml           # pnpm workspace definition
turbo.json                     # Turborepo pipeline configuration
package.json                   # Root package.json with workspace scripts
tsconfig.base.json             # Shared TypeScript base config

packages/
├── ltk-math/                  # Shared math primitives (Vec2, Vec3, Mat4, AABB, etc.)
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── index.ts
│   │   ├── vec2.ts
│   │   ├── vec3.ts
│   │   ├── vec4.ts
│   │   ├── mat4.ts
│   │   ├── aabb.ts
│   │   └── color.ts
│   └── tests/
│       └── *.test.ts
│
├── ltk-mapgeo-types/          # TypeScript type definitions for ltk_mapgeo data
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── index.ts
│   │   ├── environment-asset.ts
│   │   ├── environment-mesh.ts
│   │   ├── environment-submesh.ts
│   │   ├── vertex-buffer.ts
│   │   ├── index-buffer.ts
│   │   ├── texture-channel.ts
│   │   ├── texture-override.ts
│   │   ├── planar-reflector.ts
│   │   ├── visibility.ts
│   │   ├── quality.ts
│   │   ├── render-flags.ts
│   │   └── scene-graph/
│   │       ├── index.ts
│   │       ├── bucketed-geometry.ts
│   │       ├── bucket-grid-config.ts
│   │       └── geometry-bucket.ts
│   └── tests/
│       └── *.test.ts
│
├── ltk-mapgeo-utils/          # Query, traversal, and transformation utilities
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── index.ts
│   │   ├── asset-queries.ts        # findMesh, getMeshBuffers, etc.
│   │   ├── buffer-access.ts        # vertex/index buffer unpacking
│   │   ├── material-resolver.ts    # resolve diffuse texture, texture overrides
│   │   └── spatial-queries.ts      # bucket lookups, frustum vs bucket tests
│   └── tests/
│       └── *.test.ts
│
├── ltk-map-renderer/          # Three.js/R3F rendering of map geometry
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── index.ts
│   │   ├── scene-builder.ts        # Convert EnvironmentAsset -> Three.js scene
│   │   ├── mesh-factory.ts         # Create BufferGeometry from vertex/index buffers
│   │   ├── material-factory.ts     # Create Three.js materials from texture channels
│   │   ├── bucket-culler.ts        # Spatial culling using BucketedGeometry
│   │   ├── components/             # R3F React components
│   │   │   ├── MapScene.tsx
│   │   │   ├── EnvironmentMeshObject.tsx
│   │   │   └── BucketDebugView.tsx
│   │   └── hooks/
│   │       ├── useMapScene.ts
│   │       └── useBucketCulling.ts
│   └── tests/
│       └── *.test.ts
│
└── config/                    # Shared configuration packages
    ├── eslint-config/
    │   ├── package.json
    │   └── index.js
    ├── tsconfig/
    │   ├── package.json
    │   ├── base.json
    │   ├── library.json
    │   └── react-library.json
    └── vitest-config/
        ├── package.json
        └── index.ts
```

**Structure Decision**: Monorepo with `packages/` directory for domain libraries and `packages/config/` for shared tooling configs. Uses the **Internal Packages pattern** — library packages export `.ts` source directly (no build/dist step), consumed by Vite which transpiles on the fly. Turborepo orchestrates `typecheck`, `lint`, and `test` tasks only. Each `ltk-*` package maps to a distinct concern: math primitives, data types, data utilities, and rendering.

## Complexity Tracking

No constitution violations to justify - structure follows standard monorepo conventions with the minimum number of packages needed to separate concerns (types, utilities, rendering, math).
