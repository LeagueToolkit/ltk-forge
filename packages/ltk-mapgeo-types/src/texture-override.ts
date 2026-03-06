/** Per-mesh texture substitution */
export interface MeshTextureOverride {
  readonly samplerIndex: number;
  readonly texturePath: string;
}

/** Global shader sampler replacement */
export interface ShaderTextureOverride {
  readonly samplerHash: number;
  readonly texturePath: string;
}
