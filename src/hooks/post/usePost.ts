import { useCallback } from "react";
import { PostView } from "lemmy-js-client";
import { useRoute } from "@react-navigation/core";
import {
  PostCommentsState,
  PostState,
  useCurrentPost,
  useCurrentPostState,
  usePostComments,
} from "../../stores/posts/postsStore";
import { setPostCollapsed } from "../../stores/posts/actions";
import loadPostComments from "../../stores/posts/actions/loadPostComments";

export interface UsePost {
  postKey: string;
  postState: PostState;
  post: PostView;

  commentsState: PostCommentsState;

  currentPost: PostView;

  doLoad: () => void;
  onPostPress: () => void;
}

const usePost = (): UsePost => {
  // Get the things we need from the route
  const route = useRoute<any>();
  const { postKey } = route.params;
  // Select the current post from the store

  const postState = useCurrentPostState(postKey);
  const post = useCurrentPost(postKey);
  const commentsState = usePostComments(postKey);

  /**
   * Load the Comments for the current Post
   */
  const doLoad = useCallback(() => {
    loadPostComments(postKey, {
      sortType: "Top",
    }).then();
  }, [post.post.id]);

  /**
   * Vote on the current Post
   * @param value
   */

  const onPostPress = useCallback(() => {
    setPostCollapsed(postKey);
  }, [post.post.id]);

  return {
    postKey,
    postState,
    post,

    commentsState,

    currentPost: post,

    doLoad,

    onPostPress,
  };
};

export default usePost;
