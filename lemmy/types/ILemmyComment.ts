import {CommentView} from "lemmy-js-client";

interface ILemmyComment {
    top: CommentView,
    replies: ILemmyComment[]
}

export default ILemmyComment;