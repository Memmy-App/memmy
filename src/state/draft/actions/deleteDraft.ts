import { IAccount } from '@src/types';
import { useDraftStore } from '@src/state';

export const deleteCommentDraft = (
  postId: number,
  account: IAccount,
  commentId?: number,
): void => {
  useDraftStore.setState((state) => {
    const index = state.commentDrafts.findIndex(
      (d) =>
        d.forPost === postId &&
        d.forComment === commentId &&
        d.account.fullUsername.toLowerCase() ===
          account.fullUsername.toLowerCase(),
    );

    if (index > -1) {
      state.commentDrafts.splice(index, 1);
    }
  });
};

export const deletePostDraft = (
  communityId: number,
  account: IAccount,
): void => {
  useDraftStore.setState((state) => {
    const index = state.postDrafts.findIndex(
      (d) =>
        d.forCommunity === communityId &&
        d.account.fullUsername.toLowerCase() ===
          account.fullUsername.toLowerCase(),
    );

    if (index > -1) {
      state.commentDrafts.splice(index, 1);
    }
  });
};
