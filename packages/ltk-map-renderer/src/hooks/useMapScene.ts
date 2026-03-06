import { useMemo } from "react";
import type { Group } from "three";
import type { EnvironmentAsset } from "@ltk-forge/mapgeo-types";
import { buildScene } from "../scene-builder";
import type { BucketCuller } from "../bucket-culler";

export interface MapSceneResult {
  readonly scene: Group;
  readonly culler: BucketCuller | null;
}

/**
 * Hook that builds a Three.js scene from an EnvironmentAsset.
 * Memoized so the scene is only rebuilt when the asset changes.
 */
export function useMapScene(asset: EnvironmentAsset | null): MapSceneResult | null {
  return useMemo(() => {
    if (!asset) return null;

    const { group, culler } = buildScene(asset);
    return { scene: group, culler };
  }, [asset]);
}
