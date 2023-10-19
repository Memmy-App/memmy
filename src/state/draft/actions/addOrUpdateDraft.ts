import { DraftState, useDraftStore } from '@src/state';

export const addOrUpdateDraft = (draftState: DraftState): void => {
  useDraftStore.setState((state) => {
    let currentIndex;

    if (draftState.forComment != null || draftState.forPost != null) {
      currentIndex = state.commentDrafts.findIndex(
        (d) =>
          d.forPost === draftState.forPost &&
          d.forComment === draftState.forComment &&
          d.account.fullUsername.toLowerCase() ===
            draftState.account.fullUsername.toLowerCase(),
      );
    } else {
      currentIndex = state.postDrafts.findIndex(
        (d) =>
          d.forCommunity === draftState.forCommunity &&
          d.account.fullUsername.toLowerCase() ===
            draftState.account.fullUsername.toLowerCase(),
      );
    }

    if (currentIndex === -1) {
      if (draftState.forComment != null || draftState.forPost != null) {
        state.commentDrafts.push(draftState);
      } else {
        state.postDrafts.push(draftState);
      }
    } else {
      if (draftState.forComment != null || draftState.forPost != null) {
        state.commentDrafts[currentIndex] = draftState;
      } else {
        state.postDrafts[currentIndex] = draftState;
      }
    }
  });
};
