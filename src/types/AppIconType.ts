export type AppIconType =
  | "purple"
  | "blue"
  | "red"
  | "green"
  | "yellow"
  | "brown"
  | "pink"
  | "darkgray"
  | "lightgray"
  | "orange"
  | "pride"
  | "pridenew"
  | "transpride";
export type AppIconOption = [key: AppIconType, display: string];

export const appIconOptions: AppIconOption[] = [
  ["purple", "Default"],
  ["blue", "Blue"],
  ["red", "Red"],
  ["green", "Green"],
  ["yellow", "Yellow"],
  ["pink", "Pink"],
  ["orange", "Orange"],
  ["lightgray", "Light Gray"],
  ["darkgray", "Dark Gray"],
  ["brown", "Brown"],
  ["pride", "Pride"],
  ["pridenew", "Pride (New)"],
  ["transpride", "Trans Pride"],
];
