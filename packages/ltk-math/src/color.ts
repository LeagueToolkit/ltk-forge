import { Color as ThreeColor } from "three";

/**
 * RGBA color with components in 0.0-1.0 range.
 * Three.js Color only stores RGB, so we extend with alpha.
 */
export interface ColorRGBA {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;
}

export function createColor(r = 0, g = 0, b = 0, a = 1): ColorRGBA {
  return { r, g, b, a };
}

export { ThreeColor as Color };
