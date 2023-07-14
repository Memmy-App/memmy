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

export const feedSortOptions: Record<
  string,
  { display: string; icon: string }
> = {
  TopAll: {
    display: "Top",
    icon: "clock",
  },
  Hot: {
    display: "Hot",
    icon: "flame",
  },
  Active: {
    display: "Active",
    icon: "bolt",
  },
  New: {
    display: "New",
    icon: "alarm",
  },
  MostComments: {
    display: "Most Comments",
    icon: "text.bubble",
  },
};

export const sortTopOptions: Record<string, { display: string; icon: string }> =
  {
    TopHour: {
      display: "Hour",
      icon: "clock",
    },
    TopSixHour: {
      display: "Six Hours",
      icon: "clock",
    },
    TopTwelveHour: {
      display: "Twelve Hours",
      icon: "clock",
    },
    TopDay: {
      display: "Day",
      icon: "calendar",
    },
    TopWeek: {
      display: "Week",
      icon: "calendar",
    },
    TopMonth: {
      display: "Month",
      icon: "calendar",
    },
    TopYear: {
      display: "Year",
      icon: "calendar",
    },
    TopAll: {
      display: "All Time",
      icon: "calendar",
    },
  };
