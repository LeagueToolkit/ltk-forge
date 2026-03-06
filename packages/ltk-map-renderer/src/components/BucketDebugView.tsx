import React, { useMemo } from "react";
import {
  BufferGeometry,
  Float32BufferAttribute,
  LineBasicMaterial,
  type ColorRepresentation,
} from "three";
import type { BucketedGeometry } from "@ltk-forge/mapgeo-types";
import { getAllBucketBoundingBoxes } from "@ltk-forge/mapgeo-utils";

export interface BucketDebugViewProps {
  readonly geometry: BucketedGeometry;
  readonly visible?: boolean;
  readonly color?: ColorRepresentation;
}

/**
 * R3F component that visualizes the bucket grid as wireframe boxes.
 */
export const BucketDebugView: React.FC<BucketDebugViewProps> = React.memo(
  function BucketDebugView({ geometry, visible = true, color = 0x00ff00 }) {
    const lineGeometry = useMemo(() => {
      const boxes = getAllBucketBoundingBoxes(geometry);
      const vertices: number[] = [];

      for (const box of boxes) {
        const { min, max } = box;
        // 12 edges of a box
        const corners = [
          [min.x, min.y, min.z],
          [max.x, min.y, min.z],
          [max.x, min.y, max.z],
          [min.x, min.y, max.z],
          [min.x, max.y, min.z],
          [max.x, max.y, min.z],
          [max.x, max.y, max.z],
          [min.x, max.y, max.z],
        ];

        // Bottom face
        const edges = [
          [0, 1], [1, 2], [2, 3], [3, 0],
          // Top face
          [4, 5], [5, 6], [6, 7], [7, 4],
          // Verticals
          [0, 4], [1, 5], [2, 6], [3, 7],
        ];

        for (const [a, b] of edges) {
          const ca = corners[a!]!;
          const cb = corners[b!]!;
          vertices.push(ca[0]!, ca[1]!, ca[2]!, cb[0]!, cb[1]!, cb[2]!);
        }
      }

      const geo = new BufferGeometry();
      geo.setAttribute(
        "position",
        new Float32BufferAttribute(new Float32Array(vertices), 3),
      );
      return geo;
    }, [geometry]);

    const material = useMemo(
      () => new LineBasicMaterial({ color }),
      [color],
    );

    if (!visible) return null;

    return <lineSegments geometry={lineGeometry} material={material} />;
  },
);
