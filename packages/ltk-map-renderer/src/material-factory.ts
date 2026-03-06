import { MeshStandardMaterial, DoubleSide, FrontSide } from "three";
import type { EnvironmentMesh } from "@ltk-forge/mapgeo-types";

/** Cached materials by material hash */
const materialCache = new Map<number, MeshStandardMaterial>();

/**
 * Create or retrieve a Three.js material for a mesh.
 * Uses MeshStandardMaterial with diffuse (stationaryLight), lightMap (bakedLight).
 * Materials are cached by submesh materialHash.
 */
export function createMeshMaterial(
  mesh: EnvironmentMesh,
  materialHash: number,
): MeshStandardMaterial {
  const cached = materialCache.get(materialHash);
  if (cached) return cached;

  const material = new MeshStandardMaterial({
    side: mesh.disableBackfaceCulling ? DoubleSide : FrontSide,
    roughness: 1.0,
    metalness: 0.0,
  });

  // Textures will be loaded asynchronously when texture loading is implemented.
  // For now, the material is created with default properties.
  // The stationaryLight, bakedLight, and bakedPaint channels provide
  // texture paths that can be loaded via a texture loader.

  materialCache.set(materialHash, material);
  return material;
}

/** Clear the material cache and dispose all materials */
export function disposeMaterialCache(): void {
  for (const material of materialCache.values()) {
    material.dispose();
  }
  materialCache.clear();
}

/** Get the number of cached materials */
export function getMaterialCacheSize(): number {
  return materialCache.size;
}
