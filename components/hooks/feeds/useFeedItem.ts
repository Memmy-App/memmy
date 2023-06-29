import { PostView } from "lemmy-js-client";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useToast } from "native-base";
import React, { SetStateAction, useMemo, useState } from "react";
import { onVoteHapticFeedback } from "../../../helpers/HapticFeedbackHelpers";
import { useAppDispatch } from "../../../store";
import { setUpdateVote } from "../../../slices/feed/feedSlice";
import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";
import { writeToLog } from "../../../helpers/LogHelper";
import { setPost } from "../../../slices/post/postSlice";
import { ILemmyVote } from "../../../lemmy/types/ILemmyVote";
import { getLinkInfo, LinkInfo } from "../../../helpers/LinkHelper";

interface UseFeedItem {
  myVote: ILemmyVote;
  setMyVote: React.Dispatch<SetStateAction<ILemmyVote>>;

  onVotePress: (value: ILemmyVote, haptic?: boolean) => Promise<void>;
  onPress: () => void;

  setPostRead: () => void;

  linkInfo: LinkInfo;
}

const useFeedItem = (
  post: PostView,
  setPosts?: React.Dispatch<SetStateAction<PostView[]>>
): UseFeedItem => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [myVote, setMyVote] = useState<ILemmyVote>(post.my_vote as ILemmyVote);

  const linkInfo = useMemo(() => getLinkInfo(post.post.url), [post]);

  const onVotePress = async (value: ILemmyVote, haptic = true) => {
    if (haptic) onVoteHapticFeedback();

    if (value === post.my_vote && value !== 0) value = 0;

    const oldValue: ILemmyVote = post.my_vote as ILemmyVote;

    setMyVote(value);
    dispatch(
      setUpdateVote({
        postId: post.post.id,
        vote: value,
      })
    );

    try {
      lemmyInstance.markPostAsRead({
        auth: lemmyAuthToken,
        post_id: post.post.id,
        read: true,
      });
      
      setPostRead();

      await lemmyInstance.likePost({
        auth: lemmyAuthToken,
        post_id: post.post.id,
        score: value,
      });
    } catch (e) {
      writeToLog("Error submitting vote.");
      writeToLog(e.toString());

      toast.show({
        title: "Error submitting vote...",
        duration: 3000,
      });

      setMyVote(oldValue);
      dispatch(
        setUpdateVote({
          postId: post.post.id,
          vote: oldValue,
        })
      );
    }
  };

  const onPress = () => {
    if (setPosts) {
      lemmyInstance.markPostAsRead({
        auth: lemmyAuthToken,
        post_id: post.post.id,
        read: true,
      });

      setPostRead();
    }

    dispatch(setPost(post));
    navigation.push("Post");
  };

  const setPostRead = () => {
    if (setPosts) {
      setPosts((prev) =>
        prev.map((p) => {
          if (p.post.id === post.post.id) {
            return {
              ...p,
              read: true,
            };
          }

          return p;
        })
      );
    }
  };

  return {
    myVote,
    setMyVote,

    onVotePress,

    onPress,

    setPostRead,

    linkInfo,
  };
};

export default useFeedItem;
