import { CommentView } from "lemmy-js-client";
import { ILemmyVote } from "./ILemmyVote";

interface ILemmyComment {
  comment: CommentView;
  collapsed: boolean;
  hidden: boolean;
  myVote: ILemmyVote;
}

export default ILemmyComment;
