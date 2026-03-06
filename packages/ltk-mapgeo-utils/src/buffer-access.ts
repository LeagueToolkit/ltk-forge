import {
  type VertexBuffer,
  type IndexBuffer,
  type EnvironmentSubmesh,
  VertexAttributeName,
  VertexAttributeFormat,
} from "@ltk-forge/mapgeo-types";

/** Decode a 16-bit half-precision float to a 32-bit float */
function decodeFloat16(bits: number): number {
  const sign = (bits >>> 15) & 1;
  const exponent = (bits >>> 10) & 0x1f;
  const mantissa = bits & 0x3ff;

  if (exponent === 0) {
    // Subnormal or zero
    return (sign ? -1 : 1) * (mantissa / 1024) * 2 ** -14;
  }
  if (exponent === 0x1f) {
    // Infinity or NaN
    return mantissa === 0
      ? sign
        ? -Infinity
        : Infinity
      : NaN;
  }

  return (sign ? -1 : 1) * 2 ** (exponent - 15) * (1 + mantissa / 1024);
}

/** Get the byte size of a vertex attribute format */
function getFormatSize(format: string): number {
  switch (format) {
    case VertexAttributeFormat.FLOAT2:
      return 8;
    case VertexAttributeFormat.FLOAT3:
      return 12;
    case VertexAttributeFormat.FLOAT4:
      return 16;
    case VertexAttributeFormat.HALF2:
      return 4;
    case VertexAttributeFormat.HALF4:
      return 8;
    case VertexAttributeFormat.UBYTE4N:
      return 4;
    default:
      return 0;
  }
}

/** Get the component count of a vertex attribute format */
function getFormatComponents(format: string): number {
  switch (format) {
    case VertexAttributeFormat.FLOAT2:
      return 2;
    case VertexAttributeFormat.FLOAT3:
      return 3;
    case VertexAttributeFormat.FLOAT4:
      return 4;
    case VertexAttributeFormat.HALF2:
      return 2;
    case VertexAttributeFormat.HALF4:
      return 4;
    case VertexAttributeFormat.UBYTE4N:
      return 4;
    default:
      return 0;
  }
}

/** Extract a float attribute from a vertex buffer into a flat Float32Array */
function extractAttribute(
  buffer: VertexBuffer,
  attributeName: string,
): Float32Array | null {
  const attr = buffer.attributes.find((a) => a.name === attributeName);
  if (!attr) return null;

  const components = getFormatComponents(attr.format);
  const result = new Float32Array(buffer.count * components);
  const view = new DataView(buffer.data);

  for (let i = 0; i < buffer.count; i++) {
    const byteOffset = i * buffer.stride + attr.offset;

    if (attr.format === VertexAttributeFormat.UBYTE4N) {
      for (let c = 0; c < components; c++) {
        result[i * components + c] = view.getUint8(byteOffset + c) / 255;
      }
    } else if (
      attr.format === VertexAttributeFormat.HALF2 ||
      attr.format === VertexAttributeFormat.HALF4
    ) {
      for (let c = 0; c < components; c++) {
        const bits = view.getUint16(byteOffset + c * 2, true);
        result[i * components + c] = decodeFloat16(bits);
      }
    } else {
      for (let c = 0; c < components; c++) {
        result[i * components + c] = view.getFloat32(
          byteOffset + c * 4,
          true,
        );
      }
    }
  }

  return result;
}

/** Extract vertex positions from a buffer as Float32Array (xyz interleaved) */
export function extractPositions(buffer: VertexBuffer): Float32Array | null {
  return extractAttribute(buffer, VertexAttributeName.POSITION);
}

/** Extract vertex normals from a buffer as Float32Array (xyz interleaved) */
export function extractNormals(buffer: VertexBuffer): Float32Array | null {
  return extractAttribute(buffer, VertexAttributeName.NORMAL);
}

/** Extract texture coordinates from a buffer (channel 0 = uv, channel 1 = uv2) */
export function extractUVs(
  buffer: VertexBuffer,
  channel: 0 | 1 = 0,
): Float32Array | null {
  const name =
    channel === 0 ? VertexAttributeName.UV : VertexAttributeName.UV2;
  return extractAttribute(buffer, name);
}

/** Extract index data for a specific submesh */
export function extractIndices(
  indexBuffer: IndexBuffer,
  submesh: EnvironmentSubmesh,
): Uint16Array {
  return indexBuffer.data.slice(
    submesh.startIndex,
    submesh.startIndex + submesh.indexCount,
  );
}

export { getFormatSize, getFormatComponents };
