# Data Model: Frontend Monorepo for 3D World Rendering Libraries

**Date**: 2026-03-06 | **Feature**: 001-frontend-monorepo

## Overview

This data model defines the TypeScript type representations for data received from the Tauri backend's `ltk_mapgeo` crate. All types mirror the Rust backend structures to ensure a 1:1 mapping across the IPC boundary.

## Core Entities

### EnvironmentAsset

The root container for all map geometry data.

| Field                    | Type                       | Description                                      |
|--------------------------|----------------------------|--------------------------------------------------|
| meshes                   | EnvironmentMesh[]          | All renderable mesh objects in the map            |
| vertexBuffers            | VertexBuffer[]             | Shared vertex data buffers                        |
| indexBuffers             | IndexBuffer[]              | Shared triangle index buffers (u16)               |
| sceneGraphs              | BucketedGeometry[]         | Spatial partitioning structures                   |
| planarReflectors         | PlanarReflector[]          | Reflection plane definitions                      |
| shaderTextureOverrides   | ShaderTextureOverride[]    | Global sampler texture replacements               |

### EnvironmentMesh

A single renderable object within the map.

| Field                        | Type                           | Description                                              |
|------------------------------|--------------------------------|----------------------------------------------------------|
| name                         | string                         | Unique identifier for the mesh                           |
| transform                    | Mat4                           | 4x4 world transform matrix                               |
| boundingBox                  | AABB                           | Axis-aligned bounding box                                |
| submeshes                    | EnvironmentSubmesh[]           | Draw ranges with material assignments                    |
| vertexBufferIds              | number[]                       | Indices into parent asset's vertex buffers               |
| indexBufferId                | number                         | Index into parent asset's index buffers                  |
| baseVertexDeclarationId      | number                         | Base vertex format descriptor index                      |
| vertexCount                  | number                         | Total vertices used by this mesh                         |
| indexCount                   | number                         | Total indices used by this mesh                          |
| quality                      | EnvironmentQuality             | Quality level flags (bitfield)                           |
| visibility                   | EnvironmentVisibility          | Visibility layer flags (bitfield)                        |
| layerTransitionBehavior      | VisibilityTransitionBehavior   | How visibility transitions between layers                |
| renderFlags                  | EnvironmentMeshRenderFlags     | Render configuration flags (bitfield)                    |
| disableBackfaceCulling       | boolean                        | Whether backface culling is disabled                     |
| stationaryLight              | EnvironmentAssetChannel        | Stationary light / diffuse texture binding               |
| bakedLight                   | EnvironmentAssetChannel        | Baked lightmap texture binding                           |
| bakedPaint                   | EnvironmentAssetChannel        | Baked paint channel binding                              |
| textureOverrides             | MeshTextureOverride[]          | Per-mesh texture substitutions                           |
| pointLight                   | Vec3 | null                    | Point light position (legacy, versions < 7)              |
| sphericalHarmonics           | Vec3[] | null                  | SH coefficients array of 9 (legacy, versions < 9)       |
| visibilityControllerPathHash | number                         | Hash referencing scene graph visibility controller       |

### EnvironmentSubmesh

A drawable portion of a mesh with its own material.

| Field         | Type   | Description                                          |
|---------------|--------|------------------------------------------------------|
| material      | string | Material name (StaticMaterialDef reference)          |
| materialHash  | number | FNV-1a hash of the material name                     |
| startIndex    | number | Starting position in the index buffer                |
| indexCount    | number | Number of indices to render                          |
| minVertex     | number | Lowest vertex index in this submesh                  |
| maxVertex     | number | Highest vertex index in this submesh                 |

**Derived**: `vertexCount = maxVertex - minVertex + 1`, `triangleCount = indexCount / 3`

### VertexBuffer

Shared buffer of vertex attribute data.

| Field      | Type         | Description                                    |
|------------|--------------|------------------------------------------------|
| data       | ArrayBuffer  | Raw vertex data (binary transfer from backend) |
| stride     | number       | Bytes per vertex                               |
| count      | number       | Number of vertices                             |
| attributes | VertexAttribute[] | Layout describing each attribute          |

### VertexAttribute

Describes a single attribute within a vertex buffer.

| Field    | Type                | Description                          |
|----------|---------------------|--------------------------------------|
| name     | VertexAttributeName | Semantic name (Position, Normal, UV, etc.) |
| format   | VertexAttributeFormat | Data format (Float2, Float3, etc.)  |
| offset   | number              | Byte offset within vertex stride     |

### IndexBuffer

Shared buffer of triangle indices.

| Field | Type         | Description                                |
|-------|--------------|--------------------------------------------|
| data  | Uint16Array  | Index data (binary transfer from backend)  |
| count | number       | Number of indices                          |

### EnvironmentAssetChannel (TextureChannel)

A texture binding for a mesh.

| Field       | Type   | Description                              |
|-------------|--------|------------------------------------------|
| samplerHash | number | Hash identifying the texture sampler     |
| texturePath | string | Path to the texture resource             |
| scaleU      | number | UV scale in U direction                  |
| scaleV      | number | UV scale in V direction                  |
| offsetU     | number | UV offset in U direction                 |
| offsetV     | number | UV offset in V direction                 |

### MeshTextureOverride

Per-mesh texture substitution.

| Field        | Type   | Description                                  |
|--------------|--------|----------------------------------------------|
| samplerIndex | number | Index of the sampler being overridden        |
| texturePath  | string | Replacement texture path                     |

### ShaderTextureOverride

Global shader sampler replacement.

| Field        | Type   | Description                                  |
|--------------|--------|----------------------------------------------|
| samplerHash  | number | Hash of the sampler being overridden         |
| texturePath  | string | Replacement texture path                     |

### PlanarReflector

Reflection plane definition.

| Field    | Type  | Description                                |
|----------|-------|--------------------------------------------|
| normal   | Vec3  | Plane normal direction                     |
| position | Vec3  | Point on the reflection plane              |
| extent   | Vec2  | Size of the reflective area                |

## Scene Graph Entities

### BucketedGeometry

Spatial partitioning for efficient visibility queries.

| Field      | Type                   | Description                                  |
|------------|------------------------|----------------------------------------------|
| config     | BucketGridConfig       | Grid dimensions and cell sizing              |
| buckets    | GeometryBucket[]       | Individual spatial cells                     |
| flags      | BucketedGeometryFlags  | Configuration flags (bitfield)               |

### BucketGridConfig

Configuration for the spatial grid.

| Field    | Type   | Description                          |
|----------|--------|--------------------------------------|
| minX     | number | Grid origin X                        |
| minZ     | number | Grid origin Z                        |
| maxX     | number | Grid extent X                        |
| maxZ     | number | Grid extent Z                        |
| cellSizeX| number | Width of each cell                   |
| cellSizeZ| number | Depth of each cell                   |
| countX   | number | Number of cells in X                 |
| countZ   | number | Number of cells in Z                 |

### GeometryBucket

A single cell in the spatial grid.

| Field       | Type     | Description                                      |
|-------------|----------|--------------------------------------------------|
| meshIndices | number[] | Indices into EnvironmentAsset.meshes              |
| boundingBox | AABB     | Bounding box of this bucket's contents           |

## Math Primitives (ltk-math)

| Type  | Fields                           | Description                        |
|-------|----------------------------------|------------------------------------|
| Vec2  | x: number, y: number            | 2D vector                         |
| Vec3  | x: number, y: number, z: number | 3D vector                         |
| Vec4  | x: number, y: number, z: number, w: number | 4D vector / quaternion  |
| Mat4  | elements: Float32Array (16)      | 4x4 column-major matrix           |
| AABB  | min: Vec3, max: Vec3             | Axis-aligned bounding box         |
| Color | r: number, g: number, b: number, a: number | RGBA color (0.0-1.0)  |

## Enums and Flags

### EnvironmentQuality (bitfield)

Represents quality tier flags for selective rendering.

| Flag   | Value | Description       |
|--------|-------|-------------------|
| LOW    | 0x01  | Low quality tier  |
| MEDIUM | 0x02  | Medium quality    |
| HIGH   | 0x04  | High quality      |
| VERY_HIGH | 0x08 | Very high quality |

### EnvironmentVisibility (bitfield)

Layer visibility flags.

| Flag    | Value | Description            |
|---------|-------|------------------------|
| LAYER_0 | 0x01  | Default layer          |
| LAYER_1 | 0x02  | Secondary layer        |
| LAYER_2 | 0x04  | Tertiary layer         |
| (etc.)  | ...   | Up to 8 layers         |

### VisibilityTransitionBehavior (enum)

| Value      | Description                              |
|------------|------------------------------------------|
| INSTANT    | Immediately show/hide                    |
| FADE       | Fade in/out over time                    |

### EnvironmentMeshRenderFlags (bitfield)

| Flag             | Value | Description                     |
|------------------|-------|---------------------------------|
| UNKNOWN_1        | 0x01  | Reserved/unknown flag           |
| UNKNOWN_2        | 0x02  | Reserved/unknown flag           |

### VertexAttributeName (enum)

| Value    | Description                          |
|----------|--------------------------------------|
| POSITION | Vertex position (Vec3)               |
| NORMAL   | Vertex normal (Vec3)                 |
| UV       | Primary texture coordinates (Vec2)   |
| UV2      | Secondary UV (lightmaps) (Vec2)      |
| COLOR    | Vertex color (Vec4)                  |
| TANGENT  | Tangent vector (Vec4)                |

### VertexAttributeFormat (enum)

| Value    | Description                    |
|----------|--------------------------------|
| FLOAT2   | 2x float32 (8 bytes)          |
| FLOAT3   | 3x float32 (12 bytes)         |
| FLOAT4   | 4x float32 (16 bytes)         |
| UBYTE4N  | 4x uint8 normalized (4 bytes) |

## Entity Relationships

```
EnvironmentAsset
├── meshes[] ──────────────── EnvironmentMesh
│   ├── submeshes[] ────────── EnvironmentSubmesh
│   │   └── material ────────── (string name, resolved externally)
│   ├── vertexBufferIds[] ──── references VertexBuffer[]
│   ├── indexBufferId ─────── references IndexBuffer
│   ├── stationaryLight ───── EnvironmentAssetChannel
│   ├── bakedLight ─────────── EnvironmentAssetChannel
│   ├── bakedPaint ─────────── EnvironmentAssetChannel
│   └── textureOverrides[] ── MeshTextureOverride
├── vertexBuffers[] ────────── VertexBuffer
│   └── attributes[] ──────── VertexAttribute
├── indexBuffers[] ─────────── IndexBuffer
├── sceneGraphs[] ──────────── BucketedGeometry
│   ├── config ──────────────── BucketGridConfig
│   └── buckets[] ──────────── GeometryBucket
│       └── meshIndices[] ──── references EnvironmentMesh (by index)
├── planarReflectors[] ──────── PlanarReflector
└── shaderTextureOverrides[] ── ShaderTextureOverride
```

## Validation Rules

1. `EnvironmentMesh.vertexBufferIds` entries must be valid indices into `EnvironmentAsset.vertexBuffers`
2. `EnvironmentMesh.indexBufferId` must be a valid index into `EnvironmentAsset.indexBuffers`
3. `EnvironmentSubmesh.startIndex + indexCount` must not exceed the referenced index buffer's count
4. `EnvironmentSubmesh.maxVertex` must not exceed the referenced vertex buffer's count
5. `GeometryBucket.meshIndices` entries must be valid indices into `EnvironmentAsset.meshes`
6. `EnvironmentMesh.submeshes` array length must not exceed `MAX_SUBMESH_COUNT` (64)
