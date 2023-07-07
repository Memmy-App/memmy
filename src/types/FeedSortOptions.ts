import { SortType } from "lemmy-js-client";

export type SortOption = [key: SortType, display: string];
export type SortTopOption = [key: SortOption, display: string];

export const sortOptions: SortOption[] = [
  ["TopDay", "Top Day"],
  ["TopWeek", "Top Week"],
  ["TopHour", "Top Hour"],
  ["TopSixHour", "Top Six Hours"],
  ["TopTwelveHour", "Top Twelve Hours"],
  ["Hot", "Hot"],
  ["Active", "Active"],
  ["New", "New"],
  ["MostComments", "Most Comments"],
];

export const feedSortOptions: SortOption[] = [
  ["TopAll", "Top"],
  ["Hot", "Hot"],
  ["Active", "Active"],
  ["New", "New"],
  ["MostComments", "Most Comments"],
];

export const sortTopOptions: SortOption[] = [
  ["TopHour", "Hour"],
  ["TopSixHour", "Six Hours"],
  ["TopTwelveHour", "Twelve Hours"],
  ["TopDay", "Day"],
  ["TopWeek", "Week"],
  ["TopMonth", "Month"],
  ["TopYear", "Year"],
  ["TopAll", "All Time"],
];
