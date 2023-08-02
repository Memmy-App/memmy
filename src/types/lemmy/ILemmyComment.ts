import { CommentReplyView, CommentView } from "lemmy-js-client";
import { ILemmyVote } from "./ILemmyVote";

interface ILemmyComment {
  comment: CommentView | CommentReplyView;
  collapsed: boolean;
  hidden: boolean;
  myVote: ILemmyVote;
  showMoreTop?: boolean;
  showMoreChildren?: boolean;
  startedHiddenTop?: boolean;
  startedHiddenChildren?: boolean;
  displayMore?: boolean;
}

export default ILemmyComment;
