import { IAccount } from '@src/types';
import { DraftState, useDraftStore } from '@src/state/draft/draftStore';

interface GetDraftOptions {
  forComment?: number;
  forPost?: number;
  forCommunity?: number;
  account: IAccount;
}

export const getCommentDraft = (
  options: GetDraftOptions,
): DraftState | undefined => {
  const state = useDraftStore.getState();

  return state.commentDrafts.find(
    (d) =>
      d.forPost === options.forPost &&
      d.forComment === options.forComment &&
      d.account.fullUsername.toLowerCase() ===
        options.account.fullUsername.toLowerCase(),
  );
};

export const getPostDraft = (
  options: GetDraftOptions,
): DraftState | undefined => {
  const state = useDraftStore.getState();

  return state.postDrafts.find(
    (d) =>
      d.forCommunity === options.forCommunity &&
      d.account.fullUsername.toLowerCase() ===
        options.account.fullUsername.toLowerCase(),
  );
};
