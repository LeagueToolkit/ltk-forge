import type { BucketGridConfig } from "./bucket-grid-config";
import type { GeometryBucket } from "./geometry-bucket";

/** Flags for bucketed geometry configuration (bitfield) */
export type BucketedGeometryFlags = number;

/** Spatial partitioning for efficient visibility queries and culling */
export interface BucketedGeometry {
  readonly config: BucketGridConfig;
  readonly buckets: readonly GeometryBucket[];
  readonly flags: BucketedGeometryFlags;
}
