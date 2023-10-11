export const hapticStrengthOptions = [
  'light',
  'medium',
  'strong',
] as const;

export type IHapticStrengthOption = typeof hapticStrengthOptions[number];
