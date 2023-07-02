import { SortType } from "lemmy-js-client";

export type SortOption = [key: SortType, display: string];

export const sortOptions = [
  ["TopDay", "Top Day"],
  ["TopWeek", "Top Week"],
  ["Hot", "Hot"],
  ["Active", "Active"],
  ["New", "New"],
  ["MostComments", "Most Comments"],
] satisfies SortOption[];
