import { CommentSortType } from "lemmy-js-client";

export type CommentSortOption = [key: CommentSortType, display: string];

export const commentSortOptions = [
  "Top",
  "Hot",
  "New",
  "Old",
] satisfies CommentSortType[];
