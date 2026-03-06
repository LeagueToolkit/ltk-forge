import { Matrix4 } from "three";

/** Mat4 - alias for Three.js Matrix4, matching glam::Mat4 from the Rust backend */
export type Mat4 = Matrix4;

export function createMat4(): Mat4 {
  return new Matrix4();
}

export function identity(): Mat4 {
  return new Matrix4().identity();
}

/**
 * Create a Mat4 from a flat array of 16 numbers.
 * Three.js uses column-major order, matching glam's convention.
 */
export function fromArray(elements: ArrayLike<number>): Mat4 {
  return new Matrix4().fromArray(elements);
}

export { Matrix4 };
