# Tasks: Frontend Monorepo for 3D World Rendering Libraries

**Input**: Design documents from `/specs/001-frontend-monorepo/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/tauri-ipc.md

**Tests**: Not explicitly requested. Test tasks omitted. Tests can be added later via a follow-up task.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Monorepo root**: `.gitignore`, `pnpm-workspace.yaml`, `turbo.json`, `package.json`, `tsconfig.base.json`, `.npmrc`
- **Config packages**: `packages/config/eslint-config/`, `packages/config/tsconfig/`, `packages/config/vitest-config/`
- **Domain packages**: `packages/ltk-math/`, `packages/ltk-mapgeo-types/`, `packages/ltk-mapgeo-utils/`, `packages/ltk-map-renderer/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the pnpm + Turborepo monorepo with root configuration and shared tooling packages. After this phase, `pnpm install` works and all shared configs are available.

- [x] T001 Create `.gitignore` at repository root with rules for `node_modules/`, `.turbo/`, `dist/`, `.claude/`, `.specify/`, and standard OS/IDE ignores
- [x] T002 Create `pnpm-workspace.yaml` at repository root defining `packages/*` and `packages/config/*` workspace globs
- [x] T003 Create `.npmrc` at repository root with `shamefully-hoist=true`, `strict-peer-dependencies=false`, and `save-workspace-protocol=rolling`
- [x] T004 Create root `package.json` with workspace name `ltk-forge`, `"private": true`, `"type": "module"`, and scripts for `typecheck`, `lint`, `test` (all via `turbo run`)
- [x] T005 Create `turbo.json` at repository root with Turborepo v2 `tasks` syntax: `typecheck` (dependsOn `^typecheck`), `lint` (no deps), `test` (dependsOn `^typecheck`) — all with empty `outputs`
- [x] T006 Create `tsconfig.base.json` at repository root with shared compiler options: `target: ES2022`, `module: ESNext`, `moduleResolution: bundler`, `strict: true`, `isolatedModules: true`, `noUncheckedIndexedAccess: true`
- [x] T007 [P] Create shared TypeScript config package in `packages/config/tsconfig/package.json` with exports for `base.json`, `library.json`, and `react-library.json`
- [x] T008 [P] Create `packages/config/tsconfig/base.json` extending root `tsconfig.base.json`, `packages/config/tsconfig/library.json` extending base with `composite: true` and `declaration: true`, and `packages/config/tsconfig/react-library.json` extending base with `jsx: react-jsx`
- [x] T009 [P] Create shared ESLint config package in `packages/config/eslint-config/package.json` and `packages/config/eslint-config/index.js` using ESLint v9 flat config with `@typescript-eslint/parser`, `projectService: true`, `consistent-type-imports` rule
- [x] T010 [P] Create shared Vitest config package in `packages/config/vitest-config/package.json` and `packages/config/vitest-config/index.ts` with base config: `globals: true`, `environment: node`, coverage via `v8` provider
- [x] T011 Run `pnpm install` to verify workspace resolution and validate that root scripts (`pnpm typecheck`, `pnpm lint`, `pnpm test`) execute without errors (no packages to process yet, but no errors)

**Checkpoint**: Monorepo infrastructure is ready. Shared configs are installed and resolvable. New packages can be scaffolded.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the `ltk-math` package — shared math primitives used by all domain packages. This MUST be complete before any user story can proceed.

**CRITICAL**: No user story work can begin until this phase is complete.

- [x] T012 Scaffold `packages/ltk-math/` package: create `package.json` with `name: @ltk-forge/math`, `"private": true`, `"type": "module"`, exports pointing at `./src/index.ts`, devDependencies on `@ltk-forge/tsconfig` and `@ltk-forge/eslint-config`; create `tsconfig.json` extending `@ltk-forge/tsconfig/library.json`; create `eslint.config.js` spreading shared config; create `vitest.config.ts` merging shared config
- [x] T013 [P] Implement `Vec2` type and factory in `packages/ltk-math/src/vec2.ts` — interface with `x, y` fields, `createVec2()` constructor, basic operations (`add`, `sub`, `scale`, `length`, `dot`)
- [x] T014 [P] Implement `Vec3` type and factory in `packages/ltk-math/src/vec3.ts` — interface with `x, y, z` fields, `createVec3()` constructor, operations (`add`, `sub`, `scale`, `length`, `dot`, `cross`, `normalize`)
- [x] T015 [P] Implement `Vec4` type and factory in `packages/ltk-math/src/vec4.ts` — interface with `x, y, z, w` fields, `createVec4()` constructor
- [x] T016 [P] Implement `Mat4` type and factory in `packages/ltk-math/src/mat4.ts` — interface with `elements: Float32Array` (16 values, column-major), `createMat4()`, `identity()`, `multiply()`, `fromArray()`
- [x] T017 [P] Implement `AABB` type and factory in `packages/ltk-math/src/aabb.ts` — interface with `min: Vec3, max: Vec3`, `createAABB()`, `containsPoint()`, `intersectsAABB()`
- [x] T018 [P] Implement `Color` type in `packages/ltk-math/src/color.ts` — interface with `r, g, b, a` fields (0.0-1.0), `createColor()` constructor
- [x] T019 Create barrel export in `packages/ltk-math/src/index.ts` re-exporting all types and factories from vec2, vec3, vec4, mat4, aabb, color
- [x] T020 Run `pnpm --filter @ltk-forge/math typecheck` to verify the package compiles without errors

**Checkpoint**: `@ltk-forge/math` is complete and type-checks. All domain packages can now depend on it.

---

## Phase 3: User Story 1 - Library Developer Sets Up Workspace (Priority: P1) MVP

**Goal**: All domain packages are scaffolded with correct Internal Packages configuration, workspace dependencies resolve, and `pnpm typecheck`, `pnpm lint`, `pnpm test` execute across the entire workspace.

**Independent Test**: Clone the repo, run `pnpm install`, then `pnpm typecheck && pnpm lint && pnpm test` — all must pass.

### Implementation for User Story 1

- [x] T021 [P] [US1] Scaffold `packages/ltk-mapgeo-types/` package: create `package.json` with `name: @ltk-forge/mapgeo-types`, exports at `./src/index.ts`, dependency on `@ltk-forge/math` via `workspace:*`; create `tsconfig.json`, `eslint.config.js`, `vitest.config.ts` following same pattern as ltk-math
- [x] T022 [P] [US1] Scaffold `packages/ltk-mapgeo-utils/` package: create `package.json` with `name: @ltk-forge/mapgeo-utils`, exports at `./src/index.ts`, dependencies on `@ltk-forge/math` and `@ltk-forge/mapgeo-types` via `workspace:*`; create `tsconfig.json`, `eslint.config.js`, `vitest.config.ts`
- [x] T023 [P] [US1] Scaffold `packages/ltk-map-renderer/` package: create `package.json` with `name: @ltk-forge/map-renderer`, exports at `./src/index.ts`, dependencies on `@ltk-forge/math`, `@ltk-forge/mapgeo-types`, `@ltk-forge/mapgeo-utils` via `workspace:*`, plus `three` and `@react-three/fiber` as dependencies; create `tsconfig.json` extending `react-library.json`, `eslint.config.js`, `vitest.config.ts`
- [x] T024 [US1] Create minimal `src/index.ts` stub in each scaffolded package (`ltk-mapgeo-types`, `ltk-mapgeo-utils`, `ltk-map-renderer`) exporting a placeholder comment or empty object so typecheck passes
- [x] T025 [US1] Run `pnpm install` from root to link all workspace packages, then run `pnpm typecheck && pnpm lint` to verify all packages resolve and pass
- [x] T026 [US1] Verify incremental behavior: modify a file in `@ltk-forge/math`, run `pnpm typecheck`, confirm Turborepo only re-checks affected packages (check turbo cache output)

**Checkpoint**: Full monorepo workspace is operational. All 4 domain packages + 3 config packages are scaffolded, linked, type-checking, and linting. SC-001 (install + build < 2min) and SC-004 (incremental < 10s) are verifiable.

---

## Phase 4: User Story 2 - Frontend Developer Consumes Map Geometry Data (Priority: P1)

**Goal**: `@ltk-forge/mapgeo-types` contains all typed representations of ltk_mapgeo data structures, and `@ltk-forge/mapgeo-utils` provides query/traversal/transformation utilities. A developer can import types and utilities to work with map geometry data without any rendering dependency.

**Independent Test**: Create mock EnvironmentAsset data, use utilities to query meshes by name, resolve buffer references, iterate submeshes — all with full type safety and no runtime errors.

### Implementation for User Story 2 — Types Package

- [x] T027 [P] [US2] Implement enum types in `packages/ltk-mapgeo-types/src/quality.ts` (EnvironmentQuality bitfield), `packages/ltk-mapgeo-types/src/visibility.ts` (EnvironmentVisibility bitfield, VisibilityTransitionBehavior enum), `packages/ltk-mapgeo-types/src/render-flags.ts` (EnvironmentMeshRenderFlags bitfield) per data-model.md
- [x] T028 [P] [US2] Implement vertex types in `packages/ltk-mapgeo-types/src/vertex-buffer.ts` — `VertexAttributeName` enum, `VertexAttributeFormat` enum, `VertexAttribute` interface, `VertexBuffer` interface (data: ArrayBuffer, stride, count, attributes)
- [x] T029 [P] [US2] Implement `IndexBuffer` interface in `packages/ltk-mapgeo-types/src/index-buffer.ts` — data: Uint16Array, count
- [x] T030 [P] [US2] Implement `EnvironmentAssetChannel` interface in `packages/ltk-mapgeo-types/src/texture-channel.ts` — samplerHash, texturePath, scaleU/V, offsetU/V
- [x] T031 [P] [US2] Implement `MeshTextureOverride` and `ShaderTextureOverride` interfaces in `packages/ltk-mapgeo-types/src/texture-override.ts` per data-model.md
- [x] T032 [P] [US2] Implement `PlanarReflector` interface in `packages/ltk-mapgeo-types/src/planar-reflector.ts` — normal: Vec3, position: Vec3, extent: Vec2
- [x] T033 [P] [US2] Implement `EnvironmentSubmesh` interface in `packages/ltk-mapgeo-types/src/environment-submesh.ts` — material, materialHash, startIndex, indexCount, minVertex, maxVertex; include `MAX_SUBMESH_COUNT = 64` constant and derived helper types for vertexCount/triangleCount
- [x] T034 [US2] Implement `EnvironmentMesh` interface in `packages/ltk-mapgeo-types/src/environment-mesh.ts` — all fields per data-model.md, importing from quality, visibility, render-flags, texture-channel, texture-override, environment-submesh, and `@ltk-forge/math` (Mat4, AABB, Vec3)
- [x] T035 [P] [US2] Implement scene graph types in `packages/ltk-mapgeo-types/src/scene-graph/bucket-grid-config.ts` (BucketGridConfig), `packages/ltk-mapgeo-types/src/scene-graph/geometry-bucket.ts` (GeometryBucket with meshIndices and boundingBox), `packages/ltk-mapgeo-types/src/scene-graph/bucketed-geometry.ts` (BucketedGeometry with config, buckets, flags)
- [x] T036 [US2] Create scene graph barrel in `packages/ltk-mapgeo-types/src/scene-graph/index.ts` re-exporting all scene graph types
- [x] T037 [US2] Implement `EnvironmentAsset` interface in `packages/ltk-mapgeo-types/src/environment-asset.ts` — meshes, vertexBuffers, indexBuffers, sceneGraphs, planarReflectors, shaderTextureOverrides
- [x] T038 [US2] Create barrel export in `packages/ltk-mapgeo-types/src/index.ts` re-exporting all types, interfaces, enums, and constants from all modules

### Implementation for User Story 2 — Utils Package

- [x] T039 [P] [US2] Implement asset query functions in `packages/ltk-mapgeo-utils/src/asset-queries.ts` — `findMeshByName(asset, name)`, `getMeshVertexBuffers(asset, mesh)`, `getMeshIndexBuffer(asset, mesh)`, `getSubmeshesWithMaterials(mesh)`, `getMeshCount(asset)`, `getVertexBufferCount(asset)`
- [x] T040 [P] [US2] Implement buffer access functions in `packages/ltk-mapgeo-utils/src/buffer-access.ts` — `extractPositions(buffer)`, `extractNormals(buffer)`, `extractUVs(buffer, channel)`, `extractIndices(indexBuffer, submesh)` — unpacking raw ArrayBuffer data into typed Float32Array/Uint16Array based on VertexAttribute layout
- [x] T041 [P] [US2] Implement material resolver functions in `packages/ltk-mapgeo-utils/src/material-resolver.ts` — `resolveDiffuseTexture(mesh, defaultDiffuse)`, `findTextureOverride(mesh, samplerIndex)`, `hasBakedPaintOverride(mesh)`, `getBakedPaintUVTransform(mesh)`
- [x] T042 [P] [US2] Implement spatial query functions in `packages/ltk-mapgeo-utils/src/spatial-queries.ts` — `getMeshesInBucket(asset, bucket)`, `getBucketAtPosition(geometry, x, z)`, `getAllBucketBoundingBoxes(geometry)`
- [x] T043 [US2] Create barrel export in `packages/ltk-mapgeo-utils/src/index.ts` re-exporting all utility functions from asset-queries, buffer-access, material-resolver, spatial-queries
- [x] T044 [US2] Run `pnpm typecheck` from root to verify all types and utils packages compile correctly with no errors

**Checkpoint**: `@ltk-forge/mapgeo-types` has 100% field coverage of ltk_mapgeo data structures (SC-002). `@ltk-forge/mapgeo-utils` provides query/traversal utilities. All types are build-time checked (SC-007).

---

## Phase 5: User Story 3 - Frontend Developer Renders a 3D Map World (Priority: P2)

**Goal**: `@ltk-forge/map-renderer` converts typed map data into an interactive Three.js/R3F scene with mesh transforms, material assignment, visibility filtering, and bucket-based spatial culling.

**Independent Test**: Pass a mock EnvironmentAsset to the MapScene component, verify meshes render with correct transforms, materials resolve, and bucket culling toggles visibility.

### Implementation for User Story 3

- [x] T045 [P] [US3] Implement mesh factory in `packages/ltk-map-renderer/src/mesh-factory.ts` — `createBufferGeometry(vertexBuffers, indexBuffer, submesh)` using Three.js `BufferGeometry` + `BufferAttribute` from raw typed arrays; handle position, normal, uv, uv2 attributes; call `computeBoundingSphere()`
- [x] T046 [P] [US3] Implement material factory in `packages/ltk-map-renderer/src/material-factory.ts` — `createMeshMaterial(mesh, textureLoader?)` returning `MeshStandardMaterial` with `map` (diffuse from stationaryLight channel), `lightMap` (from bakedLight channel); handle `disableBackfaceCulling` via `side: DoubleSide`; include material cache (Map by materialHash)
- [x] T047 [US3] Implement scene builder in `packages/ltk-map-renderer/src/scene-builder.ts` — `buildScene(asset)` that iterates `asset.meshes`, creates BufferGeometry per submesh via mesh-factory, creates materials via material-factory, applies `mesh.transform` as Three.js `Matrix4`, respects `mesh.visibility` and `mesh.quality` flags, sets `matrixAutoUpdate = false` on static meshes
- [x] T048 [US3] Implement bucket culler in `packages/ltk-map-renderer/src/bucket-culler.ts` — `BucketCuller` class that takes `BucketedGeometry`, provides `updateVisibility(frustum: THREE.Frustum)` method testing each bucket's AABB against the frustum and toggling `mesh.visible` for all meshes in non-visible buckets
- [x] T049 [P] [US3] Implement `useMapScene` hook in `packages/ltk-map-renderer/src/hooks/useMapScene.ts` — accepts `EnvironmentAsset`, returns `{ scene: THREE.Group, culler: BucketCuller }` using `useMemo` to build scene from asset data
- [x] T050 [P] [US3] Implement `useBucketCulling` hook in `packages/ltk-map-renderer/src/hooks/useBucketCulling.ts` — accepts `BucketCuller`, uses `useFrame` to update bucket visibility each frame based on camera frustum
- [x] T051 [US3] Implement `MapScene` React component in `packages/ltk-map-renderer/src/components/MapScene.tsx` — accepts `EnvironmentAsset` prop, uses `useMapScene` and `useBucketCulling` hooks, renders the scene group as R3F `<primitive>`
- [x] T052 [P] [US3] Implement `EnvironmentMeshObject` component in `packages/ltk-map-renderer/src/components/EnvironmentMeshObject.tsx` — renders a single EnvironmentMesh as R3F `<mesh>` with geometry, material, and transform; memoized with `React.memo`
- [x] T053 [P] [US3] Implement `BucketDebugView` component in `packages/ltk-map-renderer/src/components/BucketDebugView.tsx` — visualizes bucket grid as wireframe boxes using `<lineSegments>`, toggled via prop
- [x] T054 [US3] Create barrel export in `packages/ltk-map-renderer/src/index.ts` re-exporting scene-builder, mesh-factory, material-factory, bucket-culler, all components, and all hooks
- [x] T055 [US3] Run `pnpm typecheck` from root to verify the renderer package and all dependencies compile cleanly

**Checkpoint**: `@ltk-forge/map-renderer` can take an EnvironmentAsset and render an interactive 3D scene. Bucket culling provides spatial optimization. SC-003 (30+ FPS with 500+ meshes) is targetable.

---

## Phase 6: User Story 4 - Frontend Developer Extends with New Data Formats (Priority: P3)

**Goal**: The monorepo structure demonstrably supports adding new packages without modifying existing code or root configuration.

**Independent Test**: Create a new skeleton package, run `pnpm install`, verify it resolves workspace dependencies and is included in `pnpm typecheck && pnpm lint && pnpm test`.

### Implementation for User Story 4

- [ ] T056 [US4] Verify extensibility by creating a minimal test package `packages/ltk-example/` with `package.json` (name `@ltk-forge/example`, exports at `./src/index.ts`, dependency on `@ltk-forge/math` via `workspace:*`), `tsconfig.json`, `eslint.config.js`, a minimal `src/index.ts` that imports and re-exports a type from `@ltk-forge/math`
- [ ] T057 [US4] Run `pnpm install && pnpm typecheck && pnpm lint` from root and verify the new package is automatically discovered and passes all checks without any modifications to root config or other packages
- [x] T058 [US4] Remove the test `packages/ltk-example/` directory after verification (it was only for validation, not a permanent package)

**Checkpoint**: SC-005 (new package requires no root config changes) is verified.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, cleanup, and cross-cutting improvements

- [x] T059 Validate full workspace by running `pnpm install && pnpm typecheck && pnpm lint && pnpm test` from a clean state (delete `node_modules` and `.turbo` first)
- [x] T060 [P] Verify `.gitignore` correctly excludes `.claude/`, `.specify/`, `node_modules/`, `.turbo/`, and `dist/` directories
- [x] T061 [P] Verify Turborepo caching works: run `pnpm typecheck` twice, confirm second run hits cache for unchanged packages
- [x] T062 Run quickstart.md validation: follow the quickstart guide step-by-step on a fresh workspace to confirm accuracy

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) — scaffolds all domain packages
- **User Story 2 (Phase 4)**: Depends on User Story 1 (Phase 3) — needs scaffolded packages to fill with types/utils
- **User Story 3 (Phase 5)**: Depends on User Story 2 (Phase 4) — renderer needs types and utils
- **User Story 4 (Phase 6)**: Depends on User Story 1 (Phase 3) — only needs working workspace
- **Polish (Phase 7)**: Depends on all user stories

### User Story Dependencies

- **US1 (Workspace Setup)**: After Phase 2 — no dependencies on other stories
- **US2 (Data Types & Utils)**: After US1 — needs scaffolded packages
- **US3 (3D Rendering)**: After US2 — needs typed data structures and utilities
- **US4 (Extensibility)**: After US1 — only needs functioning workspace (can run in parallel with US2/US3)

### Within Each Phase

- Tasks marked [P] can run in parallel (different files, no shared state)
- Unmarked tasks must run sequentially in listed order
- Barrel exports (index.ts) must come after all modules they re-export

### Parallel Opportunities

**Phase 1**: T007, T008, T009, T010 (all config packages) can run in parallel
**Phase 2**: T013-T018 (all math type implementations) can run in parallel
**Phase 4 Types**: T027-T032, T033, T035 (all independent type files) can run in parallel
**Phase 4 Utils**: T039-T042 (all util modules) can run in parallel
**Phase 5**: T045+T046 (mesh/material factories) in parallel, T049+T050 (hooks) in parallel, T052+T053 (components) in parallel

---

## Parallel Example: Phase 2 (Math Package)

```
# Launch all math type implementations together:
Task T013: "Implement Vec2 in packages/ltk-math/src/vec2.ts"
Task T014: "Implement Vec3 in packages/ltk-math/src/vec3.ts"
Task T015: "Implement Vec4 in packages/ltk-math/src/vec4.ts"
Task T016: "Implement Mat4 in packages/ltk-math/src/mat4.ts"
Task T017: "Implement AABB in packages/ltk-math/src/aabb.ts"
Task T018: "Implement Color in packages/ltk-math/src/color.ts"

# Then sequentially:
Task T019: "Create barrel export in packages/ltk-math/src/index.ts"
Task T020: "Run typecheck"
```

## Parallel Example: Phase 4 (Types Package)

```
# Launch all independent type files together:
Task T027: "Enum types (quality, visibility, render-flags)"
Task T028: "Vertex buffer types"
Task T029: "Index buffer type"
Task T030: "Texture channel type"
Task T031: "Texture override types"
Task T032: "Planar reflector type"
Task T033: "Submesh type"
Task T035: "Scene graph types"

# Then sequentially (depends on above):
Task T034: "EnvironmentMesh (imports from all above)"
Task T037: "EnvironmentAsset (imports EnvironmentMesh)"
Task T038: "Barrel export"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup (monorepo infrastructure)
2. Complete Phase 2: Foundational (`@ltk-forge/math`)
3. Complete Phase 3: US1 (scaffold all packages, verify workspace)
4. Complete Phase 4: US2 (fill types and utils)
5. **STOP and VALIDATE**: All types match data-model.md, utils pass typecheck
6. Deliver: Working typed data layer ready for rendering work

### Full Delivery

1. Setup + Foundational + US1 + US2 -> Data layer complete
2. US3 -> 3D rendering complete
3. US4 -> Extensibility verified
4. Polish -> Final validation

### Parallel Team Strategy

With multiple developers after Phase 2:
- Developer A: US1 (scaffold) -> US2 types -> US3 renderer
- Developer B: US1 (scaffold) -> US2 utils -> US4 extensibility

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Internal Packages pattern: no `build` scripts in library packages, `exports` point to `.ts` source
- All packages use `workspace:*` protocol for internal dependencies
- Turborepo orchestrates `typecheck`, `lint`, `test` only (no `build` task for libraries)
- Commit after each task or logical group
- Stop at any checkpoint to validate independently
