import { useDataStore, useHistoryStore, useAccountStore } from '@src/state';

interface AddRecentPostParams {
  postId: number;
}

const MAX_RECENT_POST_HISTORY = 99;

export const addRecentPost = ({ postId }: AddRecentPostParams): void => {
  const currentAccount = useAccountStore.getState().currentAccount;
  if (currentAccount == null || currentAccount.fullUsername.length === 0) {
    return;
  }

  const post = useDataStore.getState().posts.get(postId);

  if (post == null) return;
  console.log('post wtf');
  useHistoryStore.setState((state) => {
    state.reset();

    // For some reason creating a store with Map field in immer, the Map turns into an object...
    // console.log('is map?', state.userScoped instanceof Map);

    // if (state.userScoped.has(currentAccount.fullUsername)) {
    //   state.userScoped.set(currentAccount.fullUsername, {
    //     recentPosts: [],
    //   });
    // }
    if (!(currentAccount.fullUsername in state.userScoped)) {
      state.userScoped[currentAccount.fullUsername] = {
        recentPosts: [],
      };
    }

    // const history = state.userScoped.get(currentAccount.fullUsername)!;
    const history = state.userScoped[currentAccount.fullUsername];
    const existingIndex = history.recentPosts.findIndex(
      (p) => postId === p.post.id,
    );

    if (existingIndex > -1) return;

    history.recentPosts.unshift(post.view);
    while (history.recentPosts.length > MAX_RECENT_POST_HISTORY) {
      history.recentPosts.pop();
    }
  });
};
