# Research: Frontend Monorepo for 3D World Rendering Libraries

**Date**: 2026-03-06 | **Feature**: 001-frontend-monorepo

## R1: Monorepo Tooling (pnpm + Turborepo)

**Decision**: pnpm workspaces + Turborepo for workspace orchestration

**Rationale**:
- pnpm provides efficient disk usage via content-addressable storage and strict dependency isolation
- Turborepo handles task orchestration with dependency-aware caching, incremental builds, and parallel execution
- Both are the current industry standard for TypeScript monorepos (2025/2026)
- pnpm `workspace:*` protocol ensures internal packages always resolve to local versions
- Turborepo's `turbo.json` pipeline model maps cleanly to build → typecheck → lint → test flow

**Alternatives considered**:
- **Nx**: More feature-rich but heavier, better suited for large enterprise monorepos. Overkill for 5-6 packages.
- **Lerna (standalone)**: Largely superseded by native pnpm workspaces + Turborepo.
- **npm workspaces + custom scripts**: Lacks caching and incremental build support.

## R2: TypeScript Library Build Tool

**Decision**: Internal Packages pattern (no build step) — point `exports` directly at `.ts` source files. Fallback to tsup if a build step becomes necessary.

**Rationale**:
- Since the consuming app (Tauri + Vite) transpiles TypeScript natively, library packages don't need a separate build step
- `exports` in each package.json points at `./src/index.ts` instead of `./dist/index.js`
- Turborepo only orchestrates `typecheck`, `lint`, and `test` tasks — no `build` task for library packages
- This eliminates build-time entirely for library packages, making incremental "rebuilds" instant (SC-004)
- If a build step is later needed (e.g., for publishing or non-Vite consumers), tsup can be added per-package

**Alternatives considered**:
- **tsup**: Fast esbuild-based bundler. Good if build step needed, but unnecessary for internal-only packages consumed by Vite.
- **tsc only**: Slower, no bundling. Viable for `.d.ts` generation but adds overhead for internal packages.
- **unbuild**: Similar to tsup, Rollup-based. More opaque configuration.

## R3: Testing Framework

**Decision**: Vitest with workspace configuration

**Rationale**:
- Native ESM support, fast execution via Vite's transform pipeline
- First-class TypeScript support without separate compilation step
- Workspace mode (`vitest.workspace.ts`) runs tests across all packages from root
- Compatible with jsdom/happy-dom for Three.js component testing
- Same assertion API as Jest (familiar to most developers)

**Alternatives considered**:
- **Jest**: Slower TypeScript transform, requires ts-jest or @swc/jest. Still viable but more configuration overhead.
- **node:test**: Too barebones for component and integration testing needs.

## R4: Three.js Geometry from Raw Buffers

**Decision**: Create `BufferGeometry` instances directly from typed arrays via `BufferAttribute`

**Rationale**:
- Three.js `BufferGeometry` + `BufferAttribute` accepts raw `Float32Array` (positions, normals, UVs) and `Uint16Array` (indices) directly
- This maps 1:1 to the vertex/index buffers from `ltk_mapgeo`
- The Tauri backend can serialize buffers as binary (base64 or ArrayBuffer transfer) for zero-copy on the frontend
- Key setup: `geometry.setAttribute('position', new BufferAttribute(positions, 3))` etc.
- Index buffer: `geometry.setIndex(new BufferAttribute(indices, 1))`

**Pattern**:
```typescript
function createGeometry(vertices: Float32Array, normals: Float32Array, uvs: Float32Array, indices: Uint16Array): BufferGeometry {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(vertices, 3));
  geometry.setAttribute('normal', new BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new BufferAttribute(uvs, 2));
  geometry.setIndex(new BufferAttribute(indices, 1));
  geometry.computeBoundingSphere();
  return geometry;
}
```

## R5: Rendering Large Static Scenes (500-2000 meshes)

**Decision**: Individual mesh objects with frustum culling + optional geometry merging for static batches

**Rationale**:
- Each `EnvironmentMesh` has a unique transform, material, and visibility flags — cannot use `InstancedMesh` (that's for many instances of the *same* geometry)
- Three.js has built-in per-object frustum culling (`mesh.frustumCulled = true` by default)
- For additional performance, bucket-level culling can skip entire grid regions: toggle `mesh.visible = false` for meshes in off-screen buckets
- Geometry merging (`BufferGeometryUtils.mergeGeometries`) can reduce draw calls for meshes sharing the same material, but makes per-mesh selection/editing impossible — defer to a later optimization pass

**Alternatives considered**:
- **InstancedMesh**: Not applicable — meshes have different geometries
- **Full scene graph merge**: Loses per-mesh editability, incompatible with editor requirements
- **GPU-side culling (compute shader)**: Overkill for initial implementation, consider in Phase 3 (GPU baking)

## R6: Material System for Map Rendering

**Decision**: `MeshStandardMaterial` with custom texture map assignments for initial implementation

**Rationale**:
- League materials use standard PBR-like channels: diffuse (albedo), lightmap, baked paint
- `MeshStandardMaterial` supports `map` (diffuse), `lightMap`, and `aoMap` which approximate the needed channels
- Baked paint can be applied as a secondary UV set via `uv2` attribute
- For advanced shader features (e.g., terrain splatting, custom blend modes), `ShaderMaterial` or `onBeforeCompile` hooks can be used later
- Material resolution: submesh `material()` name → lookup in materials data → create Three.js material with resolved textures

**Alternatives considered**:
- **Custom ShaderMaterial from scratch**: Full control but much more work. Defer until specific League shader effects are needed.
- **NodeMaterial (Three.js)**: Promising for complex materials but still maturing in the ecosystem.

## R7: Spatial Culling via Bucketed Geometry

**Decision**: CPU-side bucket visibility testing against the camera frustum

**Rationale**:
- `BucketedGeometry` divides the map into a grid; each `GeometryBucket` holds mesh references
- On each frame (or on camera move), test each bucket's bounding box against the camera frustum
- Toggle `mesh.visible` for all meshes in non-visible buckets
- This is a coarse-grained cull that works in tandem with Three.js's per-object frustum culling
- Bucket grid is typically 32x32 or 64x64 cells — testing 1024-4096 bounding boxes per frame is trivial on CPU

**Pattern**:
```typescript
function updateBucketVisibility(buckets: GeometryBucket[], frustum: Frustum) {
  for (const bucket of buckets) {
    const visible = frustum.intersectsBox(bucket.boundingBox);
    for (const meshRef of bucket.meshRefs) {
      meshRef.object3d.visible = visible;
    }
  }
}
```

## R8: Tauri IPC Data Transfer Strategy

**Decision**: JSON for metadata, binary ArrayBuffer transfer for vertex/index buffers

**Rationale**:
- Tauri 2.0 IPC supports both JSON serialization and raw binary transfer
- Mesh metadata (names, transforms, materials, flags) is well-suited to JSON — small payload, easy to type
- Vertex and index buffer data can be large (MBs for full maps) — binary transfer avoids JSON encoding overhead
- The frontend receives `ArrayBuffer` from Tauri binary commands and wraps in typed arrays (`Float32Array`, `Uint16Array`)
- This two-channel approach (JSON metadata + binary buffers) maximizes type safety for structured data while maintaining performance for bulk geometry

**Alternatives considered**:
- **All JSON (with arrays)**: Simple but extremely slow for large buffer data due to number serialization
- **MessagePack/CBOR**: Requires additional serialization libraries on both sides. Marginal benefit over JSON + binary split.
- **Shared memory**: Not supported in Tauri WebView context

## R9: .gitignore for AI Tooling Directories

**Decision**: Add `.claude/` and `.specify/` to `.gitignore`

**Rationale**:
- `.claude/` contains Claude Code session data and project-specific AI context — machine/user-specific, should not be committed
- `.specify/` contains speckit templates, scripts, and memory — tooling infrastructure that lives alongside but separate from the project source
- Both follow the convention of dotfile directories for tooling (like `.vscode/`, `.idea/`)

**Note**: User explicitly requested this. The `specs/` directory (without dot prefix) IS committed — it contains the actual feature specifications.

## R10: Turborepo v2 Configuration

**Decision**: Use Turborepo v2 `tasks` syntax (not legacy `pipeline`)

**Rationale**:
- Turborepo v2 renamed `pipeline` to `tasks` in `turbo.json`
- With the Internal Packages pattern, `build` task is only needed for the app, not library packages
- `typecheck`, `lint`, and `test` tasks use `"dependsOn": ["^typecheck"]` to respect dependency order
- `inputs` narrowing prevents cache invalidation from irrelevant file changes

**Key configuration pattern**:
```jsonc
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "typecheck": { "dependsOn": ["^typecheck"], "outputs": [] },
    "lint": { "dependsOn": [], "outputs": [] },
    "test": { "dependsOn": ["^typecheck"], "outputs": [] }
  }
}
```

## R11: Editor Rendering Modes

**Decision**: Two rendering modes — edit mode (per-object meshes) and optional preview mode (merged geometry)

**Rationale**:
- **Edit mode**: Individual `<mesh>` per EnvironmentMesh for selection/transform gizmos. ~2000 draw calls is acceptable with frustum culling for interactive editing.
- **Preview mode** (future): Merge geometries by material using `BufferGeometryUtils.mergeGeometries()` to reduce to ~20-50 draw calls. Loses per-mesh identity.
- Static meshes should set `matrixAutoUpdate = false` and compose the matrix once, eliminating per-frame matrix recomputation.
- `React.memo` on mesh components prevents unnecessary React reconciliation.

**Key performance patterns**:
- Always call `computeBoundingSphere()` after geometry creation (enables frustum culling)
- Pre-allocate vectors/matrices outside `useFrame` loops (avoid GC pressure)
- Share geometry objects when the same source mesh appears multiple times
- Use `MaterialRegistry` pattern — cache materials by hash, share across meshes with same material

## R12: ESLint v9 Flat Config

**Decision**: Use ESLint v9 flat config format (ESLint v8 is EOL)

**Rationale**:
- ESLint v9 uses flat config (`eslint.config.js`) as the default — `eslintrc` is deprecated
- Shared config exported as an array of config objects from `@ltk-forge/eslint-config`
- Consumer packages spread the config: `export default [...baseConfig]`
- `@typescript-eslint/parser` with `projectService: true` for type-aware linting
