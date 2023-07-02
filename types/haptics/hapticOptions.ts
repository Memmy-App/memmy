enum EHapticOptions {
  OFF = "Off",
  LIGHT = "Light",
  MEDIUM = "Medium",
  HEAVY = "Heavy",
}

export type HapticOptions = `${EHapticOptions}`;
export const HapticOptionsArr = Object.values(EHapticOptions);
