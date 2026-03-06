/** Visibility layer flags (bitfield) */
export const EnvironmentVisibility = {
  LAYER_0: 0x01,
  LAYER_1: 0x02,
  LAYER_2: 0x04,
  LAYER_3: 0x08,
  LAYER_4: 0x10,
  LAYER_5: 0x20,
  LAYER_6: 0x40,
  LAYER_7: 0x80,
} as const;

export type EnvironmentVisibility = number;

/** How visibility transitions between layers */
export const VisibilityTransitionBehavior = {
  INSTANT: "instant",
  FADE: "fade",
} as const;

export type VisibilityTransitionBehavior =
  (typeof VisibilityTransitionBehavior)[keyof typeof VisibilityTransitionBehavior];
