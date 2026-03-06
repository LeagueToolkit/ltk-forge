import { Vector4 } from "three";

/** Vec4 - alias for Three.js Vector4, matching glam::Vec4 from the Rust backend */
export type Vec4 = Vector4;

export function createVec4(x = 0, y = 0, z = 0, w = 0): Vec4 {
  return new Vector4(x, y, z, w);
}

export { Vector4 };
