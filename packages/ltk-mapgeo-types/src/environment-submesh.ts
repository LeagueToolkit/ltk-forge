/** Maximum number of submeshes per mesh */
export const MAX_SUBMESH_COUNT = 64;

/** A drawable portion of a mesh with its own material */
export interface EnvironmentSubmesh {
  readonly material: string;
  readonly materialHash: number;
  readonly startIndex: number;
  readonly indexCount: number;
  readonly minVertex: number;
  readonly maxVertex: number;
}

/** Compute the number of vertices used by a submesh */
export function getSubmeshVertexCount(submesh: EnvironmentSubmesh): number {
  return submesh.maxVertex - submesh.minVertex + 1;
}

/** Compute the number of triangles in a submesh */
export function getSubmeshTriangleCount(submesh: EnvironmentSubmesh): number {
  return submesh.indexCount / 3;
}
