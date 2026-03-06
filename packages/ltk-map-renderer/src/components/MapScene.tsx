import React from "react";
import type { EnvironmentAsset } from "@ltk-forge/mapgeo-types";
import { useMapScene } from "../hooks/useMapScene";
import { useBucketCulling } from "../hooks/useBucketCulling";

export interface MapSceneProps {
  readonly asset: EnvironmentAsset | null;
}

/**
 * R3F component that renders an entire EnvironmentAsset as a 3D scene.
 * Handles scene building and bucket-based frustum culling.
 */
export const MapScene: React.FC<MapSceneProps> = React.memo(
  function MapScene({ asset }) {
    const result = useMapScene(asset);
    useBucketCulling(result?.culler ?? null);

    if (!result) return null;

    return <primitive object={result.scene} />;
  },
);
