import React, { useMemo } from "react";
import { Matrix4 } from "three";
import type {
  EnvironmentMesh,
  EnvironmentAsset,
} from "@ltk-forge/mapgeo-types";
import { getMeshVertexBuffers, getMeshIndexBuffer } from "@ltk-forge/mapgeo-utils";
import { createBufferGeometry } from "../mesh-factory";
import { createMeshMaterial } from "../material-factory";

export interface EnvironmentMeshObjectProps {
  readonly asset: EnvironmentAsset;
  readonly envMesh: EnvironmentMesh;
}

/**
 * R3F component that renders a single EnvironmentMesh.
 * Creates geometry and material, applies the mesh transform.
 */
export const EnvironmentMeshObject: React.FC<EnvironmentMeshObjectProps> =
  React.memo(function EnvironmentMeshObject({ asset, envMesh }) {
    const meshObjects = useMemo(() => {
      const vertexBuffers = getMeshVertexBuffers(asset, envMesh);
      const indexBuffer = getMeshIndexBuffer(asset, envMesh);

      if (!indexBuffer || vertexBuffers.length === 0) return [];

      return envMesh.submeshes.map((submesh) => {
        const geometry = createBufferGeometry(
          vertexBuffers,
          indexBuffer,
          submesh,
        );
        const material = createMeshMaterial(envMesh, submesh.materialHash);
        const matrix = new Matrix4().fromArray(envMesh.transform.elements);

        return { geometry, material, matrix, key: submesh.material };
      });
    }, [asset, envMesh]);

    return (
      <group name={envMesh.name}>
        {meshObjects.map((obj) => (
          <mesh
            key={obj.key}
            geometry={obj.geometry}
            material={obj.material}
            matrixAutoUpdate={false}
            matrix={obj.matrix}
          />
        ))}
      </group>
    );
  });
