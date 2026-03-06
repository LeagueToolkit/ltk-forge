import { Box3 } from "three";
import type { Vector3, Frustum, Group } from "three";
import type { BucketedGeometry } from "@ltk-forge/mapgeo-types";

/**
 * Performs CPU-side spatial culling using the bucketed geometry grid.
 * Tests each bucket's bounding box against the camera frustum
 * and toggles mesh visibility accordingly.
 */
export class BucketCuller {
  private readonly bucketBoxes: Box3[];
  private readonly bucketMeshIndices: readonly (readonly number[])[];
  private readonly sceneGroup: Group;

  constructor(geometry: BucketedGeometry, sceneGroup: Group) {
    this.sceneGroup = sceneGroup;
    this.bucketMeshIndices = geometry.buckets.map((b) => b.meshIndices);

    // Pre-compute Three.js Box3 for each bucket
    this.bucketBoxes = geometry.buckets.map((bucket) => {
      const box = new Box3();
      box.min.copy(bucket.boundingBox.min as Vector3);
      box.max.copy(bucket.boundingBox.max as Vector3);
      return box;
    });
  }

  /**
   * Update mesh visibility based on camera frustum.
   * Call this each frame or on camera movement.
   */
  updateVisibility(frustum: Frustum): void {
    // First, hide all meshes
    const children = this.sceneGroup.children;
    for (const child of children) {
      child.visible = false;
    }

    // Then show meshes in visible buckets
    for (let i = 0; i < this.bucketBoxes.length; i++) {
      const box = this.bucketBoxes[i];
      if (!box || !frustum.intersectsBox(box)) continue;

      const meshIndices = this.bucketMeshIndices[i];
      if (!meshIndices) continue;

      for (const idx of meshIndices) {
        const child = children[idx];
        if (child) {
          child.visible = true;
        }
      }
    }
  }

  /** Get the number of buckets */
  get bucketCount(): number {
    return this.bucketBoxes.length;
  }
}
