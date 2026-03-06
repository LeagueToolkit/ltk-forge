/** Semantic name for a vertex attribute */
export const VertexAttributeName = {
  POSITION: "position",
  NORMAL: "normal",
  UV: "uv",
  UV2: "uv2",
  COLOR: "color",
  TANGENT: "tangent",
} as const;

export type VertexAttributeName =
  (typeof VertexAttributeName)[keyof typeof VertexAttributeName];

/** Data format for a vertex attribute */
export const VertexAttributeFormat = {
  FLOAT2: "float2",
  FLOAT3: "float3",
  FLOAT4: "float4",
  HALF2: "half2",
  HALF4: "half4",
  UBYTE4N: "ubyte4n",
} as const;

export type VertexAttributeFormat =
  (typeof VertexAttributeFormat)[keyof typeof VertexAttributeFormat];

/** Describes a single attribute within a vertex buffer */
export interface VertexAttribute {
  readonly name: VertexAttributeName;
  readonly format: VertexAttributeFormat;
  readonly offset: number;
}

/** Shared buffer of vertex attribute data */
export interface VertexBuffer {
  readonly data: ArrayBuffer;
  readonly stride: number;
  readonly count: number;
  readonly attributes: readonly VertexAttribute[];
}
