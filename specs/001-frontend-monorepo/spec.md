# Feature Specification: Frontend Monorepo for 3D World Rendering Libraries

**Feature Branch**: `001-frontend-monorepo`
**Created**: 2026-03-06
**Status**: Draft
**Input**: User description: "Create a pnpm/turbo monorepo structure for developing frontend libraries that handle incoming data formats from the Tauri backend and generate the actual 3D universe/world for the LTK Forge application."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Library Developer Sets Up Workspace (Priority: P1)

A library developer clones the repository and needs to install dependencies, build all packages, and run tests across the monorepo with a single set of commands. The workspace must be organized so that each library package is independently versioned, testable, and publishable, while sharing common build configuration and development tooling.

**Why this priority**: Without a functioning monorepo workspace, no library development can begin. This is the foundational infrastructure that everything else depends on.

**Independent Test**: Can be fully tested by cloning the repo, running a single install command, then building and testing all packages. Delivers a working development environment with linting, type-checking, and test execution.

**Acceptance Scenarios**:

1. **Given** a fresh clone of the repository, **When** the developer runs the install command, **Then** all workspace dependencies are resolved and installed correctly across all packages.
2. **Given** an installed workspace, **When** the developer runs the build command, **Then** all packages build successfully in the correct dependency order.
3. **Given** an installed workspace, **When** the developer runs the test command, **Then** tests for all packages execute and report results.
4. **Given** a change in a shared utility package, **When** the developer rebuilds, **Then** only the affected packages and their dependents are rebuilt.

---

### User Story 2 - Frontend Developer Consumes Map Geometry Data (Priority: P1)

A frontend developer working on the Forge editor receives parsed map geometry data from the Tauri backend (environment assets, meshes, vertex/index buffers, submeshes, materials, spatial buckets). They need well-typed data structures on the frontend that faithfully represent this data, along with utilities for traversing, querying, and transforming the data for rendering purposes.

**Why this priority**: The data layer is the contract between the Rust backend and the frontend. Without typed representations of environment assets, meshes, buffers, materials, and spatial structures, no rendering or editing work can proceed.

**Independent Test**: Can be tested by creating mock data conforming to the type definitions, running transformation utilities, and verifying outputs match expected structures. No 3D rendering required.

**Acceptance Scenarios**:

1. **Given** environment asset data from the backend containing meshes and buffers, **When** the frontend receives it, **Then** the data is represented as strongly-typed structures with full type safety.
2. **Given** an environment asset with multiple meshes, **When** a developer queries for a mesh by name, **Then** the correct mesh and its associated submeshes, materials, and buffer references are returned.
3. **Given** mesh data with vertex buffer references and index buffer references, **When** a developer requests the renderable geometry, **Then** the vertex positions, normals, UVs, and indices are accessible in a format suitable for 3D rendering.
4. **Given** environment mesh data with transform matrices, visibility flags, and quality settings, **When** a developer reads these properties, **Then** all properties are correctly typed and accessible.

---

### User Story 3 - Frontend Developer Renders a 3D Map World (Priority: P2)

A frontend developer needs to take the typed map geometry data and render it as an interactive 3D scene. The rendering library should convert environment assets into renderable scene objects, handle material assignment, apply mesh transforms, and support spatial culling using the bucketed geometry structure.

**Why this priority**: The 3D viewport is the core visual output of the editor. Once data types are established, the ability to render the world is the next essential step for the map editor to function.

**Independent Test**: Can be tested by loading a sample environment asset, rendering it to a viewport, and verifying that meshes appear with correct transforms, materials are applied, and the scene is navigable with camera controls.

**Acceptance Scenarios**:

1. **Given** a complete environment asset with meshes, buffers, and materials, **When** it is passed to the rendering library, **Then** a 3D scene is generated with all meshes positioned according to their transform matrices.
2. **Given** meshes with material references and texture channels (diffuse, lightmap, baked paint), **When** the scene is rendered, **Then** materials are resolved and applied to the correct mesh surfaces.
3. **Given** a large map with hundreds of meshes, **When** the user navigates the viewport, **Then** the scene remains interactive by leveraging spatial partitioning data for view culling.
4. **Given** meshes with visibility flags and quality levels, **When** rendering, **Then** meshes respect their visibility and quality settings.

---

### User Story 4 - Frontend Developer Extends with New Data Formats (Priority: P3)

A developer needs to add support for a new data format from the backend (e.g., skinned meshes, particle systems, or animation data). The monorepo structure should make it straightforward to create a new package that follows established conventions, integrates with existing shared utilities, and is automatically included in the build pipeline.

**Why this priority**: The application will eventually support multiple editor modules (model viewer, VFX editor, texture viewer). The monorepo must be extensible to accommodate future data formats without restructuring.

**Independent Test**: Can be tested by creating a new empty package following the documented conventions and verifying it builds, tests, and integrates with the existing workspace without modifying other packages.

**Acceptance Scenarios**:

1. **Given** the existing monorepo structure, **When** a developer creates a new package following the established conventions, **Then** the package is automatically discovered by the build system and included in build/test/lint pipelines.
2. **Given** a new data format package, **When** it depends on shared utilities from the monorepo, **Then** those internal dependencies resolve correctly and changes propagate on rebuild.

---

### Edge Cases

- What happens when the backend sends malformed or incomplete geometry data (e.g., mesh references a buffer index that doesn't exist)?
- How does the system handle environment assets with zero meshes or empty buffer arrays?
- What happens when a mesh has no submeshes or references a missing material?
- How does rendering behave when vertex buffers contain different vertex attribute layouts (e.g., some have normals, others don't)?
- What happens when spatial bucketing data is absent or empty?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The monorepo MUST organize frontend libraries as independent, separately buildable packages within a single workspace.
- **FR-002**: The workspace MUST support incremental builds where only changed packages and their dependents are rebuilt.
- **FR-003**: The workspace MUST provide a shared configuration for linting, formatting, and type-checking that applies consistently across all packages.
- **FR-004**: A data types package MUST define typed representations for all map geometry structures received from the Tauri backend, including: environment assets, environment meshes, environment submeshes, vertex buffers, index buffers, mesh render flags, quality levels, visibility flags, texture channels, texture overrides, planar reflectors, and bucketed geometry (spatial partitioning).
- **FR-005**: A data utilities package MUST provide functions for traversing, querying, and transforming map geometry data (e.g., finding meshes by name, resolving buffer references, iterating submeshes with their materials).
- **FR-006**: A 3D rendering package MUST convert typed map geometry data into renderable 3D scene objects with correct mesh transforms, material assignments, and spatial organization.
- **FR-007**: The rendering package MUST support view frustum culling using the spatial bucketing data from the environment asset's scene graph.
- **FR-008**: The rendering package MUST handle mesh visibility flags and quality level filtering.
- **FR-009**: The rendering package MUST resolve and apply material textures including diffuse, lightmap (baked light), stationary light, and baked paint channels.
- **FR-010**: Each package MUST be independently testable with its own test suite.
- **FR-011**: The data types MUST support all vertex attribute layouts present in mapgeo data (positions, normals, UVs, secondary UVs for lightmaps).
- **FR-012**: The workspace MUST include a shared math/primitives package for common types such as vectors, matrices, bounding boxes, and color values that align with the backend's `glam` types.

### Key Entities

- **EnvironmentAsset**: The root container representing all geometry data for a League map. Contains collections of meshes, vertex buffers, index buffers, scene graphs (spatial partitions), planar reflectors, and shader texture overrides.
- **EnvironmentMesh**: A single renderable object within the map. Has a name, transform matrix, bounding box, submeshes, vertex/index buffer references, visibility flags, quality level, render flags, and texture channels (stationary light, baked light, baked paint).
- **EnvironmentSubmesh**: A drawable portion of a mesh defining a material reference (by name/hash), start index, index count, and vertex range within the parent mesh's buffers.
- **VertexBuffer**: Shared buffer containing vertex data (positions, normals, texture coordinates). Referenced by index from meshes.
- **IndexBuffer**: Shared buffer of triangle indices (u16). Referenced by index from meshes.
- **BucketedGeometry**: Spatial partitioning structure that divides the map into a grid of buckets for efficient visibility queries and culling. Contains a grid configuration and a collection of geometry buckets.
- **GeometryBucket**: A single cell in the spatial grid containing references to the meshes that overlap that region.
- **TextureChannel**: Represents a texture binding for a mesh (e.g., diffuse, lightmap, baked paint), identified by a sampler name/hash and a texture path.
- **PlanarReflector**: Defines a reflection plane in the environment for water or mirror-like surfaces.
- **Material**: A named material definition referenced by submeshes via name hash, defining the visual appearance of a surface.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new developer can clone, install, and build the entire workspace in under 2 minutes on a standard development machine.
- **SC-002**: All map geometry data structures from the backend have corresponding typed frontend representations with 100% field coverage.
- **SC-003**: A sample environment asset with 500+ meshes renders in the 3D viewport at 30+ frames per second with camera navigation.
- **SC-004**: Incremental rebuilds after a single-package change complete in under 10 seconds.
- **SC-005**: Adding a new package to the monorepo requires no modifications to existing packages or root build configuration beyond standard workspace registration.
- **SC-006**: All packages achieve 80%+ test coverage for their public interfaces.
- **SC-007**: Type mismatches between backend data and frontend representations are caught at build time, not at runtime.

### Assumptions

- The Tauri backend serializes map geometry data as JSON over the IPC bridge, with binary buffer data (vertices, indices) transferred separately as typed arrays or base64-encoded blobs.
- The project follows the technology stack defined in the DESIGN.md: React 18 + TypeScript for the frontend, Three.js + @react-three/fiber for 3D rendering, with Zustand for state management.
- The monorepo packages are consumed internally by the Forge application and are not published to a public package registry at this stage.
- The `glam` math types used in the Rust backend (Vec2, Vec3, Vec4, Mat4, AABB) have straightforward mappings to equivalent frontend representations.
- Material definitions are referenced by hash from submeshes and resolved against a separate materials data source (materials.bin parsed by the backend).
