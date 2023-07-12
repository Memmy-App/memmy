import { PostView } from "lemmy-js-client";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { SetStateAction, useMemo } from "react";
import {
  onGenericHapticFeedback,
  onVoteHapticFeedback,
} from "../../helpers/HapticFeedbackHelpers";
import { useAppDispatch, useAppSelector } from "../../../store";
import { setUpdateSaved } from "../../slices/feed/feedSlice";
import { lemmyAuthToken, lemmyInstance } from "../../LemmyInstance";
import { setPost } from "../../slices/post/postSlice";
import { ILemmyVote } from "../../types/lemmy/ILemmyVote";
import { getLinkInfo, LinkInfo } from "../../helpers/LinkHelper";
import { selectSettings } from "../../slices/settings/settingsSlice";
import { showToast } from "../../slices/toast/toastSlice";
import { savePost } from "../../helpers/LemmyHelpers";
import { handleLemmyError } from "../../helpers/LemmyErrorHelper";

interface UseFeedItem {
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

  const linkInfo = useMemo(() => getLinkInfo(post.post.url), [post]);

  const { markReadOnPostVote, markReadOnPostView } =
    useAppSelector(selectSettings);

  const onVotePress = async (value: ILemmyVote, haptic = true) => {
    if (haptic) onVoteHapticFeedback();

    let { upvotes, downvotes } = post.counts;

    // If we already voted, this will be a neutral vote.
    if (value === post.my_vote && value !== 0) value = 0;

    // Store old value in case we encounter an error
    const oldValue = post.my_vote;

    // Deal with updating the upvote/downvote count
    if (value === 0) {
      if (oldValue === -1) downvotes -= 1;
      if (oldValue === 1) upvotes -= 1;
    }

    if (value === 1) {
      if (oldValue === -1) downvotes -= 1;
      upvotes += 1;
    }

    if (value === -1) {
      if (oldValue === 1) upvotes -= 1;
      downvotes += 1;
    }

    setPosts((prev) =>
      prev.map((p) => {
        if (p.post.id === post.post.id) {
          return {
            ...p,
            my_vote: value,
            counts: {
              ...p.counts,
              upvotes,
              downvotes,
              score: upvotes - downvotes,
            },
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

      handleLemmyError(e.toString());
    }
  };

  const onPress = () => {
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

  const doSave = async () => {
    onGenericHapticFeedback();

    dispatch(setUpdateSaved(post.post.id));

    const res = await savePost(post.post.id, !post.saved);

    if (!res) {
      dispatch(
        showToast({
          message: "Failed to save Post.",
          variant: "error",
          duration: 2000,
        })
      );

      dispatch(setUpdateSaved(post.post.id));
    }
  };

  return {
    onVotePress,

    doSave,

    onPress,

    setPostRead,

    linkInfo,
  };
};

export default useFeedItem;
