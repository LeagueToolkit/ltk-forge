import { Vector2 } from "three";

/** Vec2 - alias for Three.js Vector2, matching glam::Vec2 from the Rust backend */
export type Vec2 = Vector2;

export function createVec2(x = 0, y = 0): Vec2 {
  return new Vector2(x, y);
}

export { Vector2 };
