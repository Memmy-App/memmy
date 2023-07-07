import { PostView } from "lemmy-js-client";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { SetStateAction, useCallback, useMemo, useState } from "react";
import {
  onGenericHapticFeedback,
  onVoteHapticFeedback,
} from "../../../helpers/HapticFeedbackHelpers";
import { useAppDispatch, useAppSelector } from "../../../store";
import { setUpdateSaved } from "../../../slices/feed/feedSlice";
import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";
import { writeToLog } from "../../../helpers/LogHelper";
import { setPost } from "../../../slices/post/postSlice";
import { ILemmyVote } from "../../../lemmy/types/ILemmyVote";
import { getLinkInfo, LinkInfo } from "../../../helpers/LinkHelper";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import { showToast } from "../../../slices/toast/toastSlice";
import { savePost } from "../../../lemmy/LemmyHelpers";

interface UseFeedItem {
  myVote: ILemmyVote;
  setMyVote: React.Dispatch<SetStateAction<ILemmyVote>>;

  onVotePress: (value: ILemmyVote, haptic?: boolean) => Promise<void>;
  onPress: () => void;
  doSave: () => Promise<void>;

  setPostRead: () => void;

  linkInfo: LinkInfo;
}

const useFeedItem = (
  post: PostView,
  setPosts?: React.Dispatch<SetStateAction<PostView[]>>
): UseFeedItem => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();
  const [myVote, setMyVote] = useState<ILemmyVote>(post.my_vote as ILemmyVote);

  const linkInfo = useMemo(() => getLinkInfo(post.post.url), [post]);

  const { markReadOnPostVote, markReadOnPostView } =
    useAppSelector(selectSettings);

  const setPostRead = useCallback(() => {
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
  }, [setPosts, post.post.id]);

  const onVotePress = useCallback(
    async (value: ILemmyVote, haptic = true) => {
      if (haptic) onVoteHapticFeedback();

      if (value === post.my_vote && value !== 0) value = 0;

      const oldValue: ILemmyVote = post.my_vote as ILemmyVote;

      setMyVote(value);
      setPosts((prev) =>
        prev.map((p) => {
          if (p.post.id === post.post.id) {
            return {
              ...p,
              my_vote: value,
            };
          }

          return p;
        })
      );

      try {
        await lemmyInstance.likePost({
          auth: lemmyAuthToken,
          post_id: post.post.id,
          score: value,
        });

        if (markReadOnPostVote) {
          lemmyInstance
            .markPostAsRead({
              auth: lemmyAuthToken,
              post_id: post.post.id,
              read: true,
            })
            .then();

          setPostRead();
        }
      } catch (e) {
        writeToLog("Error submitting vote.");
        writeToLog(e.toString());

        dispatch(
          showToast({
            message: "Error submitting vote",
            duration: 3000,
            variant: "error",
          })
        );

        setMyVote(oldValue);
        setPosts((prev) =>
          prev.map((p) => {
            if (p.post.id === post.post.id) {
              return {
                ...p,
                my_vote: value,
              };
            }

            return p;
          })
        );
      }
    },
    [
      post.my_vote,
      post.post.id,
      setMyVote,
      setPosts,
      lemmyInstance,
      markReadOnPostVote,
    ]
  );

  const onPress = useCallback(() => {
    if (setPosts) {
      lemmyInstance
        .markPostAsRead({
          auth: lemmyAuthToken,
          post_id: post.post.id,
          read: true,
        })
        .then();

      if (markReadOnPostView) {
        setPostRead();
      }
    }

    dispatch(setPost(post));
    navigation.push("Post");
  }, [lemmyInstance, post.post.id, markReadOnPostView, setPostRead]);

  const doSave = useCallback(async () => {
    onGenericHapticFeedback();

    dispatch(setUpdateSaved(post.post.id));

    const res = await savePost(post.post.id, !post.saved);

    if (!res) {
      dispatch(
        showToast({
          message: "Failed to save post.",
          variant: "error",
          duration: 2000,
        })
      );

      dispatch(setUpdateSaved(post.post.id));
    }
  }, [dispatch, post.post.id, post.saved]);

  return useMemo(
    () => ({
      myVote,
      setMyVote,

      onVotePress,

      doSave,

      onPress,

      setPostRead,

      linkInfo,
    }),
    [myVote, setMyVote, onVotePress, doSave, onPress, setPostRead, linkInfo]
  );
};

export default useFeedItem;
