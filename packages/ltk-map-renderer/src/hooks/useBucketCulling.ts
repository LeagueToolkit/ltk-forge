import { useRef } from "react";
import { Frustum, Matrix4 } from "three";
import { useFrame } from "@react-three/fiber";
import type { BucketCuller } from "../bucket-culler";

/**
 * Hook that updates bucket-based visibility culling each frame.
 * Pre-allocates frustum and matrix to avoid GC pressure.
 */
export function useBucketCulling(culler: BucketCuller | null): void {
  const frustumRef = useRef(new Frustum());
  const matrixRef = useRef(new Matrix4());

  useFrame(({ camera }) => {
    if (!culler) return;

    matrixRef.current.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse,
    );
    frustumRef.current.setFromProjectionMatrix(matrixRef.current);
    culler.updateVisibility(frustumRef.current);
  });
}
