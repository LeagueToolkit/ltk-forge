import { Vector3 } from "three";

/** Vec3 - alias for Three.js Vector3, matching glam::Vec3 from the Rust backend */
export type Vec3 = Vector3;

export function createVec3(x = 0, y = 0, z = 0): Vec3 {
  return new Vector3(x, y, z);
}

export { Vector3 };
