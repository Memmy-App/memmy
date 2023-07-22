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

    const betterComments: (ILemmyComment | number | string)[] = [];

    // Set the current value for our children
    let current = 1;

    const getChildren = (comment: NestedComment) => {
      // Create an array for replies
      const replyComments: (ILemmyComment | string)[] = [];

      // Get the depth
      const depth = comment.comment.comment.path.split(".").length - 1;

      // Loop through the nest
      for (const item of comment.replies) {
        // If the depth is equal to four, we don't want to show more, so we will display a "Show More" box
        if (depth === 4) {
          replyComments.push("showMoreChild");
        }

        // If the depth is equal to two and the current is equal to five, we don't want to show more, and we
        // will show a Show More box
        if (depth === 2) {
          if (current === 5) {
            replyComments.push("showMoreTop");
          }

          // We also want to increment the current afterward
          current += 1;
        }

        // Figure out if the comment will be hidden or not
        let hidden = false;

        if (depth >= 4 || current >= 4) {
          hidden = true;
        }

        replyComments.push({
          comment: item.comment,
          myVote: item.comment.my_vote as ILemmyVote,
          collapsed: false,
          hidden,
        });
        replyComments.push(...getChildren(item));
      }
      return replyComments;
    };

    // Loop through each nest
    for (const item of ordered) {
      // Add in the item number. This will make skipping a lot easier
      betterComments.push(item.comment.comment.id);

      // Push in the top comment
      betterComments.push({
        comment: item.comment,
        myVote: item.comment.my_vote as ILemmyVote,
        collapsed: false,
        hidden: false,
      });

      // Add in the rest of the comments
      betterComments.push(...getChildren(item));

      // Reset the value of current for the next batch
      current = 1;
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
