import { ILoadCommentsOptions } from "../types/ILoadCommentsOptions";
import { lemmyAuthToken, lemmyInstance } from "../../../LemmyInstance";
import { PostsStore, usePostsStore } from "../postsStore";
import { buildComments } from "../../../helpers/LemmyCommentsHelper";
import ILemmyComment from "../../../types/lemmy/ILemmyComment";
import NestedComment from "../../../types/lemmy/NestedComment";
import { ILemmyVote } from "../../../types/lemmy/ILemmyVote";
import { handleLemmyError } from "../../../helpers/LemmyErrorHelper";

const loadPostComments = async (
  postKey: string,
  options: ILoadCommentsOptions
) => {
  const postState = usePostsStore.getState().posts.get(postKey);

  // Set comments to loading

  usePostsStore.setState((state) => {
    const prev = state.posts.get(postKey).commentsState;

    prev.commentsLoading = true;
    prev.commentsError = false;
  });

  try {
    const res = await lemmyInstance.getComments({
      auth: lemmyAuthToken,
      post_id: postState.post.post.id,
      max_depth: 10,
      type_: "All",
      sort: options.sortType,
      parent_id: options.parentId,
    });

    const ordered = buildComments(res.comments);

    const betterComments: ILemmyComment[] = [];

    const getChildren = (comment: NestedComment) => {
      const replyComments: ILemmyComment[] = [];
      for (const item of comment.replies) {
        replyComments.push({
          comment: item.comment,
          myVote: item.comment.my_vote as ILemmyVote,
          collapsed: false,
          hidden: false,
        });
        replyComments.push(...getChildren(item));
      }
      return replyComments;
    };

    for (const item of ordered) {
      betterComments.push({
        comment: item.comment,
        myVote: item.comment.my_vote as ILemmyVote,
        collapsed: false,
        hidden: false,
      });
      betterComments.push(...getChildren(item));
    }

    usePostsStore.setState((state: PostsStore) => {
      const prev = state.posts.get(postKey);

      if (!prev) return;

      prev.commentsState.commentsLoading = false;
      prev.commentsState.comments = betterComments;
      prev.rerenderComments = !prev.rerenderComments;
    });
  } catch (e) {
    // setPostCommentsLoading(postKey, false, true).then();
    handleLemmyError(e.toString());
  }
};

export default loadPostComments;
