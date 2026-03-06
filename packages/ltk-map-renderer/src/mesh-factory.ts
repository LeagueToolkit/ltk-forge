import {
  BufferGeometry,
  Float32BufferAttribute,
  Uint16BufferAttribute,
} from "three";
import type {
  VertexBuffer,
  IndexBuffer,
  EnvironmentSubmesh,
} from "@ltk-forge/mapgeo-types";
import {
  extractPositions,
  extractNormals,
  extractUVs,
  extractIndices,
} from "@ltk-forge/mapgeo-utils";

/**
 * Create a Three.js BufferGeometry from vertex/index buffers for a specific submesh.
 */
export function createBufferGeometry(
  vertexBuffers: readonly VertexBuffer[],
  indexBuffer: IndexBuffer,
  submesh: EnvironmentSubmesh,
): BufferGeometry {
  const geometry = new BufferGeometry();
  const primaryBuffer = vertexBuffers[0];

  if (!primaryBuffer) return geometry;

  // Extract vertex attributes from the primary buffer
  const positions = extractPositions(primaryBuffer);
  if (positions) {
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  }

  const normals = extractNormals(primaryBuffer);
  if (normals) {
    geometry.setAttribute("normal", new Float32BufferAttribute(normals, 3));
  }

  const uvs = extractUVs(primaryBuffer, 0);
  if (uvs) {
    geometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  }

  // Secondary UVs for lightmaps (may be in a different buffer)
  const lightmapBuffer = vertexBuffers[1] ?? primaryBuffer;
  const uv2s = extractUVs(lightmapBuffer, 1);
  if (uv2s) {
    geometry.setAttribute("uv2", new Float32BufferAttribute(uv2s, 2));
  }

  // Extract indices for this submesh
  const indices = extractIndices(indexBuffer, submesh);
  geometry.setIndex(new Uint16BufferAttribute(indices, 1));

  // Compute bounding volumes for frustum culling
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();

  return geometry;
}
