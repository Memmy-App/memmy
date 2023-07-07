import { CommentReplyView, CommentView } from "lemmy-js-client";
import { ILemmyVote } from "./ILemmyVote";

interface ILemmyComment {
  comment: CommentView | CommentReplyView;
  collapsed: boolean;
  hidden: boolean;
  myVote: ILemmyVote;
}

export default ILemmyComment;
