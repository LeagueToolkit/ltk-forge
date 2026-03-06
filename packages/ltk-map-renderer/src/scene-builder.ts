import { Group, Mesh, Matrix4 } from "three";
import type { EnvironmentAsset } from "@ltk-forge/mapgeo-types";
import { getMeshVertexBuffers, getMeshIndexBuffer } from "@ltk-forge/mapgeo-utils";
import { createBufferGeometry } from "./mesh-factory";
import { createMeshMaterial } from "./material-factory";
import { BucketCuller } from "./bucket-culler";

export interface BuiltScene {
  readonly group: Group;
  readonly culler: BucketCuller | null;
}

/**
 * Build a Three.js scene from an EnvironmentAsset.
 * Creates a Group containing all meshes with correct transforms and materials.
 */
export function buildScene(asset: EnvironmentAsset): BuiltScene {
  const group = new Group();
  group.name = "environment-asset";

  for (const envMesh of asset.meshes) {
    const vertexBuffers = getMeshVertexBuffers(asset, envMesh);
    const indexBuffer = getMeshIndexBuffer(asset, envMesh);

    if (!indexBuffer || vertexBuffers.length === 0) continue;

    // Create a mesh for each submesh (each has its own material)
    for (const submesh of envMesh.submeshes) {
      const geometry = createBufferGeometry(vertexBuffers, indexBuffer, submesh);
      const material = createMeshMaterial(envMesh, submesh.materialHash);

      const mesh = new Mesh(geometry, material);
      mesh.name = `${envMesh.name}_${submesh.material}`;

      // Apply the mesh transform
      const matrix = new Matrix4().fromArray(envMesh.transform.elements);
      mesh.applyMatrix4(matrix);

      // Optimize: static meshes don't need per-frame matrix updates
      mesh.matrixAutoUpdate = false;

      // Store metadata for selection/inspection
      mesh.userData = {
        environmentMeshName: envMesh.name,
        material: submesh.material,
        materialHash: submesh.materialHash,
        visibility: envMesh.visibility,
        quality: envMesh.quality,
      };

      group.add(mesh);
    }
  }

  // Create bucket culler if scene graphs are available
  let culler: BucketCuller | null = null;
  if (asset.sceneGraphs.length > 0) {
    const sceneGraph = asset.sceneGraphs[0];
    if (sceneGraph) {
      culler = new BucketCuller(sceneGraph, group);
    }
  }

  return { group, culler };
}
