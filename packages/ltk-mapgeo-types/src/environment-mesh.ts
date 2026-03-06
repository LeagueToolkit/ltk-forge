import type { Mat4, AABB, Vec3 } from "@ltk-forge/math";
import type { EnvironmentQuality } from "./quality";
import type { EnvironmentVisibility, VisibilityTransitionBehavior } from "./visibility";
import type { EnvironmentMeshRenderFlags } from "./render-flags";
import type { EnvironmentAssetChannel } from "./texture-channel";
import type { MeshTextureOverride } from "./texture-override";
import type { EnvironmentSubmesh } from "./environment-submesh";

/** A single renderable object within the map */
export interface EnvironmentMesh {
  readonly name: string;
  readonly transform: Mat4;
  readonly boundingBox: AABB;
  readonly submeshes: readonly EnvironmentSubmesh[];
  readonly vertexBufferIds: readonly number[];
  readonly indexBufferId: number;
  readonly baseVertexDeclarationId: number;
  readonly vertexCount: number;
  readonly indexCount: number;
  readonly quality: EnvironmentQuality;
  readonly visibility: EnvironmentVisibility;
  readonly layerTransitionBehavior: VisibilityTransitionBehavior;
  readonly renderFlags: EnvironmentMeshRenderFlags;
  readonly disableBackfaceCulling: boolean;
  readonly stationaryLight: EnvironmentAssetChannel;
  readonly bakedLight: EnvironmentAssetChannel;
  readonly bakedPaint: EnvironmentAssetChannel;
  readonly textureOverrides: readonly MeshTextureOverride[];
  readonly pointLight: Vec3 | null;
  readonly sphericalHarmonics: readonly Vec3[] | null;
  readonly visibilityControllerPathHash: number;
}
