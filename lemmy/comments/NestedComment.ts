import { CommentReplyView, CommentView } from "lemmy-js-client";
import { ILemmyVote } from "../types/ILemmyVote";

export interface NestedComment {
  comment: CommentView | CommentReplyView;
  replies: NestedComment[];
  collapsed: boolean;
  myVote: ILemmyVote;
}

export default NestedComment;
