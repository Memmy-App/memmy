import { CommentSortType, SortType } from "lemmy-js-client";

export const overallSortOptions: Record<
  SortType,
  { display: string; icon: string }
> = {
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
  NewComments: {
    display: "New Comments",
    icon: "message.badge",
  },
  Old: {
    display: "Old",
    icon: "hourglass",
  },
};

export const feedSortOptions: Record<
  string,
  { display: string; icon: string }
> = {
  TopAll: {
    display: "Top",
    icon: "clock",
  },
  Hot: overallSortOptions.Hot,
  Active: overallSortOptions.Active,
  New: overallSortOptions.New,
  MostComments: overallSortOptions.MostComments,
  NewComments: overallSortOptions.NewComments,
  Old: overallSortOptions.Old,
};

export const sortTopOptions: Record<string, { display: string; icon: string }> =
  {
    TopHour: overallSortOptions.TopHour,
    TopSixHour: overallSortOptions.TopSixHour,
    TopTwelveHour: overallSortOptions.TopTwelveHour,
    TopDay: overallSortOptions.TopDay,
    TopWeek: overallSortOptions.TopWeek,
    TopMonth: overallSortOptions.TopMonth,
    TopYear: overallSortOptions.TopYear,
    TopAll: overallSortOptions.TopAll,
  };

export type CommentSortOption = [key: CommentSortType, display: string];

export const commentSortOptions: Record<
  CommentSortType,
  { display: string; icon: string }
> = {
  Top: {
    display: "Top",
    icon: "clock",
  },
  Hot: {
    display: "Hot",
    icon: "flame",
  },
  New: {
    display: "New",
    icon: "alarm",
  },
  Old: {
    display: "Old",
    icon: "hourglass",
  },
};
