import { useEffect, useRef } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { trigger } from "react-native-haptic-feedback";
import { useToast } from "native-base";
import { UseFeed, useFeed } from "./useFeed";
import { useAppDispatch, useAppSelector } from "../../../store";
import { selectPost } from "../../../slices/post/postSlice";
import { subscribeToCommunity } from "../../../slices/communities/communitiesActions";

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
  const toast = useToast();

  useEffect(() => {
    if (creatingPost.current && post && lastPost.current !== post.post.id) {
      creatingPost.current = false;

      setTimeout(() => {
        navigation.push("Post");
      }, 500);
    }
  }, [post]);

  // Events
  const onSubscribePress = () => {
    trigger("impactMedium");

    toast.show({
      title: `${!feed.subscribed ? "Subscribed to" : "Unsubscribed from"} ${
        feed.community.community.name
      }`,
      duration: 3000,
    });

    dispatch(
      subscribeToCommunity({
        communityId: feed.community.community.id,
        subscribe: !feed.subscribed,
      })
    );

    feed.setSubscribed(!feed.subscribed);
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
