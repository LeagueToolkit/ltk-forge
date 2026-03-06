import type { Vec2, Vec3 } from "@ltk-forge/math";

/** Defines a reflection plane in the environment */
export interface PlanarReflector {
  readonly normal: Vec3;
  readonly position: Vec3;
  readonly extent: Vec2;
}
