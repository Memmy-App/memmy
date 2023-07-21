import { useRef } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { trigger } from "react-native-haptic-feedback";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../store";
import { selectPost } from "../../slices/post/postSlice";
import setCommunitySubscribed from "../../stores/communities/actions/setCommunitySubscribed";
import { useCommunity } from "../../stores/communities/communitiesStore";

interface UseCommunityFeed {
  onSubscribePress: () => void;
  onPostPress: () => void;
}

const useCommunityFeed = (communityFullName: string): UseCommunityFeed => {
  // Global state
  const { post } = useAppSelector(selectPost);

  // Refs
  const creatingPost = useRef<boolean>(false);
  const lastPost = useRef<number>(0);

  // Other hooks
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  // useEffect(() => {
  //   if (creatingPost.current && post && lastPost.current !== post.post.id) {
  //     creatingPost.current = false;
  //
  //     setTimeout(() => {
  //       navigation.push("Post");
  //     }, 500);
  //   }
  // }, [post]);

  // Events
  const onSubscribePress = async () => {
    trigger("impactMedium");

    setCommunitySubscribed(communityFullName).then();
  };

  // const onAboutPress = () => {
  //   navigation.push("CommunityAbout", {
  //     name: feed.community.community.name,
  //     banner: feed.community.community.banner,
  //     description: feed.community.community.description,
  //     title: feed.community.community.title,
  //     communityId: feed.community.community.id,
  //   });
  // };

  // const onPostPress = () => {
  //   creatingPost.current = true;
  //   lastPost.current = post ? post.post.id : 0;
  //
  //   navigation.push("NewPost", {
  //     communityId: feed.community.community.id,
  //     communityName: feed.community.community.name,
  //     communityLanguageId:
  //       feed.posts && feed.posts.length > 0
  //         ? feed.posts[0].post.language_id
  //         : 0,
  //   });
  // };

  const onPostPress = () => {
    creatingPost.current = true;
    lastPost.current = post ? post.post.id : 0;

    navigation.push("NewPost", {
      communityFullName,
    });
  };

  return {
    onSubscribePress,
    onPostPress,
  };
};

export default useCommunityFeed;
