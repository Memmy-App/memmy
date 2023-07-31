import { lemmyAuthToken, lemmyInstance } from "@src/LemmyInstance";
import { handleLemmyError } from "@src/helpers/LemmyErrorHelper";
import { usePostsStore } from "@src/stores/posts/postsStore";

const setPostFeatured = async (postKey: string, featured: boolean) => {
  const postId = usePostsStore.getState().posts.get(postKey).post.post.id;

  try {
    await lemmyInstance.featurePost({
      auth: lemmyAuthToken,
      post_id: postId,
      feature_type: "Community",
      featured,
    });

    usePostsStore.setState((state) => {
      const prev = state.posts.get(postKey).post.post;

      prev.featured_community = featured;
    });
  } catch (e) {
    handleLemmyError(e.toString());
  }
};

export default setPostFeatured;
