export interface ICommentInfo {
  postId: number;
  commentId: number;
  replies: ICommentInfo[];
  depth: number;
  hidden: boolean;
  collapsed: boolean;
  path: string;
}
