import { useRoute } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  onGenericHapticFeedback,
  onVoteHapticFeedback,
} from "../../helpers/HapticFeedbackHelpers";
import { LinkInfo, getLinkInfo } from "../../helpers/LinkHelper";
import { shareLink } from "../../helpers/ShareHelper";
import { determineVotes } from "../../helpers/VoteHelper";
import { setResponseTo } from "../../slices/comments/newCommentSlice";
import { selectSettings } from "../../slices/settings/settingsSlice";
import setFeedRead from "../../stores/feeds/actions/setFeedRead";
import setFeedSaved from "../../stores/feeds/actions/setFeedSaved";
import setFeedVote from "../../stores/feeds/actions/setFeedVote";
import { useFeedPost, useFeedsStore } from "../../stores/feeds/feedsStore";
import { addPost } from "../../stores/posts/actions";
import { ILemmyVote } from "../../types/lemmy/ILemmyVote";
import { useReportPost } from "../post/useReportPost";
import { useBlockUser } from "../user/useBlockUser";

export interface UseFeedItem {
  onVotePress: (value: ILemmyVote, haptic?: boolean) => Promise<void>;
  onPress: () => void;
  doSave: () => Promise<void>;
  doReport: () => Promise<void>;
  blockCreator: () => Promise<void>;
  doReply: () => void;
  doShare: () => void;
  linkInfo: LinkInfo;
}

const useFeedItem = (postId: number): UseFeedItem => {
  const { key } = useRoute();
  const post = useFeedPost(key, postId);

  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();
  const reportReport = useReportPost();

  const linkInfo = useMemo(() => getLinkInfo(post.post.url), [post.post.id]);

  const { markReadOnPostVote, markReadOnPostView } =
    useAppSelector(selectSettings);

  const onVotePress = useCallback(
    async (value: ILemmyVote, haptic = true) => {
      if (haptic) onVoteHapticFeedback();

      const newValues = determineVotes(
        value,
        post.my_vote as ILemmyVote,
        post.counts.upvotes,
        post.counts.downvotes
      );

      setFeedVote(key, post.post.id, newValues).then();

      if (!post.read && markReadOnPostVote) {
        setFeedRead(key, post.post.id);
      }
    },
    [post.post.id, markReadOnPostVote]
  );

  const onPress = () => {
    if (!post.read && markReadOnPostView) setFeedRead(key, post.post.id);

    useFeedsStore.setState((state) => {
      state.feeds
        .get(key)
        .posts.find((p) => p.post.id === postId).unread_comments = 0;
    });

    const postKey = Date.now().toString() + post.post.id;

    addPost(postKey, post);

    navigation.push("Post", { postKey });
  };

  const doSave = useCallback(async () => {
    onGenericHapticFeedback();

    setFeedSaved(key, post.post.id, !post.saved).then();
  }, [post.post.id, post.saved]);

  const doReport = useCallback(async () => {
    reportReport(post.post.id, dispatch);
  }, [post.post.id]);

  const blockCreator = useCallback(async () => {
    useBlockUser({ personId: post.creator.id, dispatch, t }).then();
  }, [post.post.id]);

  const doReply = useCallback(() => {
    dispatch(
      setResponseTo({
        post,
        languageId: post.post.language_id,
      })
    );

    navigation.push("NewComment");
  }, [post]);

  const doShare = useCallback(() => {
    shareLink({
      link: post.post.ap_id,
      title: post.post.name,
    });
  }, [post.post.ap_id, post.post.name]);

  return {
    onVotePress,
    doSave,
    onPress,
    doReport,
    blockCreator,
    doReply,
    doShare,
    linkInfo,
  };
};

export default useFeedItem;
