/** Quality tier flags for selective rendering (bitfield) */
export const EnvironmentQuality = {
  LOW: 0x01,
  MEDIUM: 0x02,
  HIGH: 0x04,
  VERY_HIGH: 0x08,
} as const;

export type EnvironmentQuality = number;
