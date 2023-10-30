import { CommentView } from 'lemmy-js-client';
import { useDataStore } from '@src/state';

interface AddCommentParams {
  comment: CommentView;
}

export const addComment = ({ comment }: AddCommentParams): void => {
  const pathArr = comment.comment.path.split('.');
  const parentId = Number(pathArr[pathArr.length - 2]);

  const isPostReply = parentId === 0;

  useDataStore.setState((state) => {
    // Get the post comments and make sure the post exists
    const postComments = state.postComments.get(comment.post.id);
    if (postComments == null) return;

    // Add the comment to the store
    state.comments.set(comment.comment.id, {
      view: comment,
      isOwnComment: true,
      moderates:
        state.site?.moderatedIds?.includes(comment.community.id) ?? false,
    });

    // Get the index of the parent in our array
    const index = postComments.indexOf(parentId);

    // Determine where we want to add the comment
    if (isPostReply || index === -1) {
      state.postComments.set(comment.post.id, [
        comment.comment.id,
        ...postComments,
      ]);
    } else {
      state.postComments.set(comment.post.id, [
        ...postComments.slice(0, index),
        comment.comment.id,
        ...postComments.slice(index),
      ]);
    }

    // Update the post with the new comment as well
    const post = state.posts.get(comment.post.id);
    if (post == null) return;

    // TODO This should be refactored. There's no reason for us to store the comment IDs in `postComments` then have
    // the post store also contain the comment info. It should all be inside `postComments` (or vice versa)

    const depth = comment.comment.path.split('.').length - 2;

    const newInfo = {
      postId: comment.post.id,
      commentId: comment.comment.id,
      replies: [],
      depth,
      hidden: false,
      collapsed: false,
      path: comment.comment.path,
      topId: 0,
      showInPost: true,
      showLoadMore: false,
    };

    const indexx = post.commentInfo?.findIndex((c) => c.commentId === parentId);

    if (indexx == null || indexx === -1) {
      post.commentInfo = [newInfo, ...(post.commentInfo ?? [])];
    } else {
      post.commentInfo = [
        ...post.commentInfo!.slice(0, indexx + 1),
        newInfo,
        ...post.commentInfo!.slice(indexx + 1),
      ];
    }
  });
};

interface AddCommentsParams {
  comments: CommentView[];
  postId?: number;
}

export const addComments = ({ comments, postId }: AddCommentsParams): void => {
  const postComments: number[] = [];

  useDataStore.setState((state) => {
    const moderated = state.site?.moderatedIds;
    const userId =
      state.site.site?.my_user?.local_user_view.local_user.person_id;

    for (const comment of comments) {
      postComments.push(comment.comment.id);
      state.comments.set(comment.comment.id, {
        view: comment,
        moderates: moderated?.includes(comment.community.id) ?? false,
        isOwnComment: userId === comment.comment.creator_id,
      });
    }

    if (postId != null) {
      state.postComments.set(postId, postComments);
    }
  });
};
