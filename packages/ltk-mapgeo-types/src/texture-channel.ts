/** A texture binding for a mesh (sampler + texture path + UV transform) */
export interface EnvironmentAssetChannel {
  readonly samplerHash: number;
  readonly texturePath: string;
  readonly scaleU: number;
  readonly scaleV: number;
  readonly offsetU: number;
  readonly offsetV: number;
}
