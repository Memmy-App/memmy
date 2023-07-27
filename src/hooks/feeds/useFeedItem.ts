import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useRoute } from "@react-navigation/core";
import {
  onGenericHapticFeedback,
  onVoteHapticFeedback,
} from "@src/helpers/HapticFeedbackHelpers";
import { useAppDispatch } from "@root/store";
import { ILemmyVote } from "@src/types/lemmy/ILemmyVote";
import { getLinkInfo, LinkInfo } from "@src/helpers/LinkHelper";
import { setResponseTo } from "@src/slices/comments/newCommentSlice";
import { shareLink } from "@src/helpers/ShareHelper";
import {
  useFeedPost,
  useFeedPostCounts,
  useFeedPostCreator,
  useFeedPostInfo,
  useFeedPostRead,
  useFeedPostSaved,
  useFeedPostVote,
  useFeedsStore,
} from "@src/stores/feeds/feedsStore";
import { determineVotes } from "@src/helpers/VoteHelper";
import { useSettingsStore } from "@src/stores/settings/settingsStore";
import { useReportPost } from "../post/useReportPost";
import { useBlockUser } from "../user/useBlockUser";
import { addPost } from "../../stores/posts/actions";
import setFeedVote from "../../stores/feeds/actions/setFeedVote";
import setFeedRead from "../../stores/feeds/actions/setFeedRead";
import setFeedSaved from "../../stores/feeds/actions/setFeedSaved";

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
  const postInfo = useFeedPostInfo(key, postId);
  const postVote = useFeedPostVote(key, postId);
  const postCounts = useFeedPostCounts(key, postId);
  const postRead = useFeedPostRead(key, postId);
  const postSaved = useFeedPostSaved(key, postId);
  const postCreator = useFeedPostCreator(key, postId);

  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();
  const reportReport = useReportPost();

  const linkInfo = useMemo(() => getLinkInfo(postInfo.url), [postId]);

  const { markReadOnPostVote, markReadOnPostView } = useSettingsStore(
    (state) => ({
      markReadOnPostVote: state.settings.markReadOnPostVote,
      markReadOnPostView: state.settings.markReadOnPostView,
    })
  );

  const onVotePress = useCallback(
    async (value: ILemmyVote, haptic = true) => {
      if (haptic) onVoteHapticFeedback();

      const newValues = determineVotes(
        value,
        postVote as ILemmyVote,
        postCounts.upvotes,
        postCounts.downvotes
      );

      setFeedVote(key, postId, newValues).then();

      if (!postRead && markReadOnPostVote) {
        setFeedRead(key, postId);
      }
    },
    [postId, postRead, markReadOnPostVote]
  );

  const onPress = useCallback(() => {
    if (!postRead && markReadOnPostView) setFeedRead(key, postId);

    useFeedsStore.setState((state) => {
      state.feeds
        .get(key)
        .posts.find((p) => p.post.id === postId).unread_comments = 0;
    });

    const postKey = Date.now().toString() + postId;

    addPost(postKey, post);

    navigation.push("Post", { postKey });
  }, [postRead, postId]);

  const doSave = useCallback(async () => {
    onGenericHapticFeedback();

    setFeedSaved(key, postId, !postSaved).then();
  }, [postId, postSaved]);

  const doReport = useCallback(async () => {
    reportReport(postId, dispatch);
  }, [postId]);

  const blockCreator = useCallback(async () => {
    useBlockUser({ personId: postCreator.id, dispatch, t }).then();
  }, [postId]);

  const doReply = useCallback(() => {
    dispatch(
      setResponseTo({
        post,
        languageId: postInfo.language_id,
      })
    );

    navigation.push("NewComment");
  }, [postId]);

  const doShare = useCallback(() => {
    shareLink({
      link: postInfo.ap_id,
      title: postInfo.name,
    });
  }, [postId]);

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
