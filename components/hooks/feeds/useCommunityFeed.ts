import { useEffect, useRef } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { trigger } from "react-native-haptic-feedback";
import { UseFeed, useFeed } from "./useFeed";
import { useAppDispatch, useAppSelector } from "../../../store";
import { selectPost } from "../../../slices/post/postSlice";
import { showToast } from "../../../slices/toast/toastSlice";
import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";

interface UseCommunityFeed {
  feed: UseFeed;

  onSubscribePress: () => void;
  onAboutPress: () => void;
  onPostPress: () => void;
}

const useCommunityFeed = (communityFullName: string): UseCommunityFeed => {
  // Global state
  const { post } = useAppSelector(selectPost);

  // Refs
  const creatingPost = useRef<boolean>(false);
  const lastPost = useRef<number>(0);

  // Hooks
  const feed = useFeed(communityFullName);

  // Other hooks
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useEffect(() => {
    if (creatingPost.current && post && lastPost.current !== post.post.id) {
      creatingPost.current = false;

      setTimeout(() => {
        navigation.push("Post");
      }, 500);
    }
  }, [post]);

  // Events
  const onSubscribePress = async () => {
    trigger("impactMedium");

    const subscribing = !(
      feed.community.subscribed === "Subscribed" ||
      feed.community.subscribed === "Pending"
    );

    feed.setCommunity((prev) => ({
      ...prev,
      subscribed: subscribing ? "Subscribed" : "NotSubscribed",
    }));

    try {
      await lemmyInstance.followCommunity({
        auth: lemmyAuthToken,
        community_id: feed.community.community.id,
        follow: subscribing,
      });

      dispatch(
        showToast({
          message: `${subscribing ? "Subscribed to" : "Unsubscribed from"} ${
            feed.community.community.name
          }`,
          duration: 3000,
          variant: "info",
        })
      );
    } catch (e) {
      feed.setCommunity((prev) => ({
        ...prev,
        subscribed: subscribing ? "NotSubscribed" : "Subscribed",
      }));
    }
  };

  const onAboutPress = () => {
    navigation.push("CommunityAbout", {
      name: feed.community.community.name,
      banner: feed.community.community.banner,
      description: feed.community.community.description,
      title: feed.community.community.title,
    });
  };

  const onPostPress = () => {
    creatingPost.current = true;
    lastPost.current = post ? post.post.id : 0;

    navigation.push("NewPost", {
      communityId: feed.community.community.id,
      communityName: feed.community.community.name,
      communityLanguageId:
        feed.posts && feed.posts.length > 0
          ? feed.posts[0].post.language_id
          : 0,
    });
  };

  return {
    feed,

    onSubscribePress,
    onAboutPress,
    onPostPress,
  };
};

export default useCommunityFeed;
