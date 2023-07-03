export const FontWeightLabelMap = new Map<string, number>([
  ["Regular", 400],
  ["Medium", 500],
  ["Semi-Bold", 600],
  ["Bold", 700]
]);

export const FontWeightMap = new Map<number, string>(Array.from(FontWeightLabelMap.entries()).map(([k, v]) => [v, k]));
