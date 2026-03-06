/** Configuration for the spatial partitioning grid */
export interface BucketGridConfig {
  readonly minX: number;
  readonly minZ: number;
  readonly maxX: number;
  readonly maxZ: number;
  readonly cellSizeX: number;
  readonly cellSizeZ: number;
  readonly countX: number;
  readonly countZ: number;
}
