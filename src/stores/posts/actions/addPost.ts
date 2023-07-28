import { PostView } from "lemmy-js-client";
import { useSettingsStore } from "@src/stores/settings/settingsStore";
import { getBaseUrl } from "@src/helpers/LinkHelper";
import { useAccountStore } from "@src/stores/account/accountStore";
import { usePostsStore } from "../postsStore";

const addPost = (postKey: string, post: PostView) => {
  const { defaultCommentSort } = useSettingsStore.getState().settings;
  const { currentAccount } = useAccountStore.getState();

  usePostsStore.setState((state) => {
    state.posts.set(postKey, {
      post,

      status: {
        loading: false,
        error: false,
        refreshing: false,
      },

      collapsed: false,
      rerenderComments: false,

      communityFullName: `${post.community.name}@${getBaseUrl(
        post.community.actor_id
      )}`,

      isOwn:
        post.creator.name === currentAccount.username &&
        getBaseUrl(post.creator.actor_id) === currentAccount.instance,

      commentsState: {
        commentsLoading: true,
        commentsError: false,
        comments: [],
        commentsSort: defaultCommentSort,
      },
    });
  });
};

export default addPost;
