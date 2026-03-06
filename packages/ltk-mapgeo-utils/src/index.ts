export {
  findMeshByName,
  getMeshVertexBuffers,
  getMeshIndexBuffer,
  getSubmeshesWithMaterials,
  getMeshCount,
  getVertexBufferCount,
} from "./asset-queries";

export {
  extractPositions,
  extractNormals,
  extractUVs,
  extractIndices,
  getFormatSize,
  getFormatComponents,
} from "./buffer-access";

export {
  type ResolvedDiffuseTexture,
  resolveDiffuseTexture,
  findTextureOverride,
  hasBakedPaintOverride,
  getBakedPaintUVTransform,
} from "./material-resolver";

export {
  getMeshesInBucket,
  getBucketAtPosition,
  getAllBucketBoundingBoxes,
} from "./spatial-queries";
