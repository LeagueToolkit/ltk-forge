/** Shared buffer of triangle indices */
export interface IndexBuffer {
  readonly data: Uint16Array;
  readonly count: number;
}
