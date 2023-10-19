import { useAppStore } from '@src/state';

export const setNewPostId = (id?: number): void => {
  useAppStore.setState((state) => {
    state.newPostId = id;
  });
};

export const setNewCommentId = (id?: number): void => {
  useAppStore.setState((state) => {
    state.newCommentId = id;
  });
};
