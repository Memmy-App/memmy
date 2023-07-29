enum ESwipeLeftSecondOptions {
  NONE = "None",
  COLLAPSE = "Collapse",
  SAVE = "Save",
}

export type SwipeLeftSecondOptions = `${ESwipeLeftSecondOptions}`;
export const swipeLeftSecondOptionsArr = Object.values(ESwipeLeftSecondOptions);
