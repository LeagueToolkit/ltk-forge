import type { EnvironmentMesh } from "./environment-mesh";
import type { VertexBuffer } from "./vertex-buffer";
import type { IndexBuffer } from "./index-buffer";
import type { BucketedGeometry } from "./scene-graph/index";
import type { PlanarReflector } from "./planar-reflector";
import type { ShaderTextureOverride } from "./texture-override";

/** Root container for all map geometry data */
export interface EnvironmentAsset {
  readonly meshes: readonly EnvironmentMesh[];
  readonly vertexBuffers: readonly VertexBuffer[];
  readonly indexBuffers: readonly IndexBuffer[];
  readonly sceneGraphs: readonly BucketedGeometry[];
  readonly planarReflectors: readonly PlanarReflector[];
  readonly shaderTextureOverrides: readonly ShaderTextureOverride[];
}
