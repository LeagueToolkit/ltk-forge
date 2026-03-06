# Tauri IPC Contract: Map Geometry Data Transfer

**Date**: 2026-03-06 | **Feature**: 001-frontend-monorepo

## Overview

Defines the contract between the Rust Tauri backend and the frontend TypeScript libraries for transferring map geometry data over IPC. Uses a two-channel approach: JSON for structured metadata, binary transfer for bulk buffer data.

## Channel 1: Metadata (JSON over Tauri `invoke`)

### Load Environment Asset

**Command**: `load_environment_asset`
**Input**: `{ path: string }` (path to .mapgeo file)
**Output**: JSON object matching the `EnvironmentAsset` type (see data-model.md), with the following exceptions:
- `vertexBuffers[].data` → replaced with `vertexBufferIds: number[]` (handles returned separately via binary channel)
- `indexBuffers[].data` → replaced with `indexBufferIds: number[]` (handles returned separately via binary channel)

The JSON payload includes all mesh metadata, submesh data, texture channels, scene graphs, planar reflectors, and overrides. Buffer _metadata_ (stride, count, attributes) is included; buffer _data_ (raw bytes) is not.

### Resolve Material

**Command**: `resolve_material`
**Input**: `{ materialName: string }` or `{ materialHash: number }`
**Output**: JSON object with material properties (shader name, texture paths, parameters). Exact structure depends on the materials.bin parser (ltk_ritobin) — to be defined when that integration is built.

## Channel 2: Binary Buffers (Tauri binary commands)

### Get Vertex Buffer

**Command**: `get_vertex_buffer`
**Input**: `{ assetId: string, bufferIndex: number }`
**Output**: Raw `ArrayBuffer` containing vertex data. Frontend wraps as `Float32Array` or interprets per the vertex attribute layout from metadata.

### Get Index Buffer

**Command**: `get_index_buffer`
**Input**: `{ assetId: string, bufferIndex: number }`
**Output**: Raw `ArrayBuffer` containing index data. Frontend wraps as `Uint16Array`.

## Data Flow

```
Frontend                          Backend (Tauri)
   │                                  │
   │─── invoke("load_environment_asset", { path }) ──►│
   │                                  │── Parse .mapgeo via ltk_mapgeo
   │◄── JSON: EnvironmentAsset metadata (no buffer data) ──│
   │                                  │
   │─── invoke("get_vertex_buffer", { assetId, bufferIndex: 0 }) ──►│
   │◄── ArrayBuffer: raw vertex bytes ──│
   │                                  │
   │─── invoke("get_vertex_buffer", { assetId, bufferIndex: 1 }) ──►│
   │◄── ArrayBuffer: raw vertex bytes ──│
   │                                  │
   │─── invoke("get_index_buffer", { assetId, bufferIndex: 0 }) ──►│
   │◄── ArrayBuffer: raw index bytes ──│
   │                                  │
   │   (buffers loaded on demand as meshes come into view)
```

## Serialization Notes

- All numeric types follow JSON conventions: integers as `number`, floats as `number`
- Bitfield enums (quality, visibility, render flags) are serialized as `number` (the raw bitfield value)
- String enums (VisibilityTransitionBehavior) are serialized as lowercase strings (`"instant"`, `"fade"`)
- Mat4 is serialized as a flat array of 16 numbers in column-major order
- Vec2/Vec3/Vec4 are serialized as objects: `{ x, y }`, `{ x, y, z }`, `{ x, y, z, w }`
- AABB is serialized as `{ min: Vec3, max: Vec3 }`
- Null/optional fields use JSON `null`

## Error Handling

- Backend returns Tauri error responses for: file not found, parse errors, invalid buffer indices
- Frontend types include error variants that map to `ParseError` and `BuildError` from ltk_mapgeo
- Binary buffer requests for invalid indices return empty `ArrayBuffer` with an error event
