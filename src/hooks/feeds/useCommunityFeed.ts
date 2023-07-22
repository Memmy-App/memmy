import { useRef } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { trigger } from "react-native-haptic-feedback";
import { useAppSelector } from "../../../store";
import { selectPost } from "../../slices/post/postSlice";
import setCommunitySubscribed from "../../stores/communities/actions/setCommunitySubscribed";

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
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  // Events
  const onSubscribePress = async () => {
    trigger("impactMedium");

    setCommunitySubscribed(communityFullName).then();
  };

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
