import type { AABB } from "@ltk-forge/math";

/** A single cell in the spatial partitioning grid */
export interface GeometryBucket {
  readonly meshIndices: readonly number[];
  readonly boundingBox: AABB;
}
