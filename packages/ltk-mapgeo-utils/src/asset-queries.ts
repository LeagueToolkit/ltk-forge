import type {
  EnvironmentAsset,
  EnvironmentMesh,
  EnvironmentSubmesh,
  VertexBuffer,
  IndexBuffer,
} from "@ltk-forge/mapgeo-types";

/** Find a mesh by name within an environment asset */
export function findMeshByName(
  asset: EnvironmentAsset,
  name: string,
): EnvironmentMesh | undefined {
  return asset.meshes.find((mesh) => mesh.name === name);
}

/** Get the vertex buffers referenced by a mesh */
export function getMeshVertexBuffers(
  asset: EnvironmentAsset,
  mesh: EnvironmentMesh,
): VertexBuffer[] {
  return mesh.vertexBufferIds
    .map((id) => asset.vertexBuffers[id])
    .filter((buf): buf is VertexBuffer => buf !== undefined);
}

/** Get the index buffer referenced by a mesh */
export function getMeshIndexBuffer(
  asset: EnvironmentAsset,
  mesh: EnvironmentMesh,
): IndexBuffer | undefined {
  return asset.indexBuffers[mesh.indexBufferId];
}

/** Get submeshes with their material names */
export function getSubmeshesWithMaterials(
  mesh: EnvironmentMesh,
): readonly { submesh: EnvironmentSubmesh; material: string }[] {
  return mesh.submeshes.map((submesh) => ({
    submesh,
    material: submesh.material,
  }));
}

/** Get the total number of meshes in an asset */
export function getMeshCount(asset: EnvironmentAsset): number {
  return asset.meshes.length;
}

/** Get the total number of vertex buffers in an asset */
export function getVertexBufferCount(asset: EnvironmentAsset): number {
  return asset.vertexBuffers.length;
}
