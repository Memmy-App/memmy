import { useCallback } from "react";
import { useRoute } from "@react-navigation/core";
import { CommentSortType } from "lemmy-js-client";
import {
  useCurrentPost,
  usePostCommentsSort,
  usePostsStore,
} from "../../stores/posts/postsStore";
import { setPostCollapsed } from "../../stores/posts/actions";
import loadPostComments from "../../stores/posts/actions/loadPostComments";
import loadCommunity from "../../stores/communities/actions/loadCommunity";
import { getBaseUrl } from "../../helpers/LinkHelper";

export interface UsePost {
  doLoad: () => void;
  onPostPress: () => void;
  setPostCommentsSort: (sortType: CommentSortType) => void;
}

const usePost = (): UsePost => {
  const { postKey } = useRoute<any>().params;
  const currentPost = useCurrentPost(postKey);
  const commentsSortType = usePostCommentsSort(postKey);

  const doLoad = useCallback(() => {
    loadPostComments(postKey, {
      sortType: commentsSortType,
    }).then();
    loadCommunity(
      `${currentPost.community.name}@${getBaseUrl(
        currentPost.community.actor_id
      )}`,
      true
    ).then();
  }, [currentPost.post.id, commentsSortType]);

  const onPostPress = useCallback(() => {
    setPostCollapsed(postKey);
  }, []);

  const setPostCommentsSort = useCallback((sortType: CommentSortType) => {
    usePostsStore.setState((state) => {
      const prev = state.posts.get(postKey).commentsState;
      prev.commentsSort = sortType;
    });
  }, []);

  return {
    doLoad,
    onPostPress,
    setPostCommentsSort,
  };
};

export default usePost;
