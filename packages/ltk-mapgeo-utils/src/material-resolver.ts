import type {
  EnvironmentMesh,
  MeshTextureOverride,
} from "@ltk-forge/mapgeo-types";

/** Resolved diffuse texture information */
export interface ResolvedDiffuseTexture {
  readonly texturePath: string;
  readonly isOverride: boolean;
}

/** Resolve the diffuse texture for a mesh, considering texture overrides */
export function resolveDiffuseTexture(
  mesh: EnvironmentMesh,
  defaultDiffuse: string,
): ResolvedDiffuseTexture {
  // Check for texture overrides on the stationary light sampler
  const override = mesh.textureOverrides.find(
    (o) => o.samplerIndex === mesh.stationaryLight.samplerHash,
  );

  if (override) {
    return { texturePath: override.texturePath, isOverride: true };
  }

  // Use the stationary light texture path if available
  if (mesh.stationaryLight.texturePath) {
    return { texturePath: mesh.stationaryLight.texturePath, isOverride: false };
  }

  return { texturePath: defaultDiffuse, isOverride: false };
}

/** Find a texture override for a specific sampler index */
export function findTextureOverride(
  mesh: EnvironmentMesh,
  samplerIndex: number,
): MeshTextureOverride | undefined {
  return mesh.textureOverrides.find((o) => o.samplerIndex === samplerIndex);
}

/** Check if a mesh has a baked paint texture override */
export function hasBakedPaintOverride(mesh: EnvironmentMesh): boolean {
  return mesh.textureOverrides.some(
    (o) => o.samplerIndex === mesh.bakedPaint.samplerHash,
  );
}

/**
 * Get the baked paint UV transform (scale + bias).
 * Returns [scaleU, scaleV, offsetU, offsetV] or null if no baked paint.
 */
export function getBakedPaintUVTransform(
  mesh: EnvironmentMesh,
): readonly [number, number, number, number] | null {
  if (!mesh.bakedPaint.texturePath) return null;

  return [
    mesh.bakedPaint.scaleU,
    mesh.bakedPaint.scaleV,
    mesh.bakedPaint.offsetU,
    mesh.bakedPaint.offsetV,
  ] as const;
}
