import { Box3, Vector3 } from "three";

/** AABB - alias for Three.js Box3, matching glam::AABB / ltk_primitives::AABB */
export type AABB = Box3;

export function createAABB(
  min = new Vector3(-Infinity, -Infinity, -Infinity),
  max = new Vector3(Infinity, Infinity, Infinity),
): AABB {
  return new Box3(min, max);
}

export { Box3 };
