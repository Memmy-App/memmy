export interface ICommentInfo {
  postId: number;
  commentId: number;
  replies: ICommentInfo[] | undefined;
  depth: number;
  hidden: boolean;
  collapsed: boolean;
  path: string;
  topId: number;
  parentId?: number;

  showInPost: boolean;
  showLoadMore: boolean;
}
