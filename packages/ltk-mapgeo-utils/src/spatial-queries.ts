import type {
  EnvironmentAsset,
  EnvironmentMesh,
  BucketedGeometry,
  GeometryBucket,
} from "@ltk-forge/mapgeo-types";
import type { AABB } from "@ltk-forge/math";

/** Get the meshes referenced by a specific bucket */
export function getMeshesInBucket(
  asset: EnvironmentAsset,
  bucket: GeometryBucket,
): EnvironmentMesh[] {
  return bucket.meshIndices
    .map((idx) => asset.meshes[idx])
    .filter((mesh): mesh is EnvironmentMesh => mesh !== undefined);
}

/** Get the bucket at a specific world position (XZ plane) */
export function getBucketAtPosition(
  geometry: BucketedGeometry,
  x: number,
  z: number,
): GeometryBucket | undefined {
  const { config } = geometry;

  if (x < config.minX || x > config.maxX || z < config.minZ || z > config.maxZ) {
    return undefined;
  }

  const col = Math.floor((x - config.minX) / config.cellSizeX);
  const row = Math.floor((z - config.minZ) / config.cellSizeZ);

  const clampedCol = Math.min(col, config.countX - 1);
  const clampedRow = Math.min(row, config.countZ - 1);

  const index = clampedRow * config.countX + clampedCol;
  return geometry.buckets[index];
}

/** Get all bucket bounding boxes for debug visualization */
export function getAllBucketBoundingBoxes(
  geometry: BucketedGeometry,
): readonly AABB[] {
  return geometry.buckets.map((bucket) => bucket.boundingBox);
}
