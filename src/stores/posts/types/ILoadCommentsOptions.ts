import { CommentSortType } from "lemmy-js-client";

export interface ILoadCommentsOptions {
  parentId?: number;
  sortType?: CommentSortType;
}
