import { CommentView } from 'lemmy-js-client';
import { useCommentStore } from '@src/state/comment/commentStore';
import { useSiteStore } from '@src/state/site/siteStore';
import { usePostStore } from '@src/state/post/postStore';

export const addComment = (comment: CommentView): void => {
  const pathArr = comment.comment.path.split('.');
  const parentId = Number(pathArr[pathArr.length - 2]);

  const isPostReply = parentId === 0;

  const moderated = useSiteStore.getState().moderatedIds;

  useCommentStore.setState((state) => {
    const postComments = state.postComments.get(comment.post.id);

    if (postComments == null) return;

    state.comments.set(comment.comment.id, {
      view: comment,
      isOwnComment: true,
      moderates: moderated?.includes(comment.community.id) ?? false,
    });

    const index = postComments.indexOf(parentId);

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

    usePostStore.setState((state) => {
      const post = state.posts.get(comment.post.id);

      if (post == null) return;

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

      const index = post.commentInfo?.findIndex(
        (c) => c.commentId === parentId,
      );

      if (index == null || index === -1) {
        post.commentInfo = [newInfo, ...(post.commentInfo ?? [])];
      } else {
        post.commentInfo = [
          ...post.commentInfo!.slice(0, index + 1),
          newInfo,
          ...post.commentInfo!.slice(index + 1),
        ];
      }
    });
  });
};

export const addComments = (comments: CommentView[]): void => {
  const moderated = useSiteStore.getState().moderatedIds;
  const userId =
    useSiteStore.getState().site?.my_user?.local_user_view.local_user.person_id;

  useCommentStore.setState((state) => {
    const postComments = [];

    for (const comment of comments) {
      postComments.push(comment.comment.id);
      state.comments.set(comment.comment.id, {
        view: comment,
        moderates: moderated?.includes(comment.community.id) ?? false,
        isOwnComment: userId === comment.comment.creator_id,
      });
    }

    state.postComments.set(comments[0].post.id, postComments);
  });
};
