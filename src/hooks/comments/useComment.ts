import { useCallback, useMemo } from "react";
import Clipboard from "@react-native-community/clipboard";
import { CommentReplyView } from "lemmy-js-client";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { produce } from "immer";
import { useRoute } from "@react-navigation/core";
import setCollapsed from "@src/stores/posts/actions/setCollapsed";
import setPostCommentVote from "@root/src/stores/posts/actions/setPostCommentVote";
import { determineVotes } from "@root/src/helpers/VoteHelper";
import { ILemmyVote } from "@root/src/types/lemmy/ILemmyVote";
import { useAppDispatch, useAppSelector } from "../../../store";
import { selectSite, setUnread } from "../../slices/site/siteSlice";
import ILemmyComment from "../../types/lemmy/ILemmyComment";
import { onGenericHapticFeedback } from "../../helpers/HapticFeedbackHelpers";
import {
  createUserFullName,
  getUserFullName,
} from "../../helpers/LemmyHelpers";
import { lemmyAuthToken, lemmyInstance } from "../../LemmyInstance";
import { showToast } from "../../slices/toast/toastSlice";
import { setResponseTo } from "../../slices/comments/newCommentSlice";
import { handleLemmyError } from "../../helpers/LemmyErrorHelper";
import { PostsStore, usePostsStore } from "../../stores/posts/postsStore";
import { useInboxStore } from "../../stores/inbox/inboxStore";
import { ICON_MAP } from "../../constants/IconMap";
import { ContextMenuOption } from "../../types/ContextMenuOptions";
import { useCurrentAccount } from "../../stores/account/accountStore";

export interface UseComment {
  onCommentLongPress: (selection?: string) => void;
  onReadPress?: () => Promise<void>;
  onReply: () => void;
  longPressOptions: ContextMenuOption[];
  onSave: () => Promise<void>;
  onCollapseChain: () => void;
}

const useComment = ({ comment }: { comment: ILemmyComment }): UseComment => {
  const postKey = useRoute<any>().params?.postKey;

  const { t } = useTranslation();

  const currentAccount = useCurrentAccount();
  const { unread } = useAppSelector(selectSite);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const dispatch = useAppDispatch();

  const isOwnComment = useMemo(
    () =>
      getUserFullName(comment.comment.creator).toLowerCase() ===
        createUserFullName(
          currentAccount.username.toLowerCase(),
          currentAccount.instance.toLowerCase()
        ) && !comment.comment.comment.deleted,
    [comment.comment.comment.id]
  );

  const basicOptions = useMemo<ContextMenuOption[]>(
    () => [
      { key: "upvote", title: t("Upvote"), icon: ICON_MAP.UPVOTE },
      { key: "downvote", title: t("Downvote"), icon: ICON_MAP.DOWNVOTE },
      { key: "copy_text", title: t("Copy Text"), icon: ICON_MAP.COPY },
      { key: "copy_link", title: t("Copy Link"), icon: ICON_MAP.LINK },
      { key: "save", title: t("Save"), icon: ICON_MAP.SAVE },
      { key: "reply", title: t("Reply"), icon: ICON_MAP.REPLY },
      {
        key: "report",
        title: t("comment.report"),
        icon: ICON_MAP.REPORT_POST,
      },
    ],
    [t]
  );

  const ownerOptions = useMemo<ContextMenuOption[]>(
    () => [
      { key: "edit", title: t("comment.edit"), icon: ICON_MAP.EDIT },
      {
        key: "delete",
        title: t("comment.delete"),
        icon: ICON_MAP.DELETE,
        destructive: true,
      },
    ],
    [t]
  );

  const longPressOptions = useMemo<ContextMenuOption[]>(
    () => [...basicOptions, ...(isOwnComment ? ownerOptions : [])],
    [basicOptions, isOwnComment, ownerOptions]
  );

  const onCommentLongPress = useCallback(
    async (selection: string) => {
      onGenericHapticFeedback();

      if (selection === "upvote") {
        const newValues = determineVotes(
          comment.comment.my_vote === 1 ? 0 : 1,
          comment.comment.my_vote as ILemmyVote,
          comment.comment.counts.upvotes,
          comment.comment.counts.downvotes
        );
        setPostCommentVote(
          postKey,
          comment.comment.comment.id,
          newValues
        ).then();
      }

      if (selection === "downvote") {
        const newValues = determineVotes(
          comment.comment.my_vote === -1 ? 0 : -1,
          comment.comment.my_vote as ILemmyVote,
          comment.comment.counts.upvotes,
          comment.comment.counts.downvotes
        );
        setPostCommentVote(
          postKey,
          comment.comment.comment.id,
          newValues
        ).then();
      }

      if (selection === "copy_text") {
        Clipboard.setString(comment.comment.comment.content);
        dispatch(
          showToast({
            message: t("toast.textCopied"),
            variant: "success",
            duration: 2000,
          })
        );
      }

      if (selection === "copy_link") {
        Clipboard.setString(comment.comment.comment.ap_id);
        dispatch(
          showToast({
            message: t("toast.linkCopied"),
            variant: "success",
            duration: 2000,
          })
        );
      }

      if (selection === "report") {
        await Alert.prompt(
          t("comment.report"),
          t("alert.message.reportComment"),
          [
            {
              text: t("Cancel"),
              style: "cancel",
            },
            {
              text: t("Submit"),
              style: "default",
              onPress: async (v) => {
                try {
                  await lemmyInstance.createCommentReport({
                    auth: lemmyAuthToken,
                    comment_id: comment.comment.comment.id,
                    reason: v,
                  });

                  dispatch(
                    showToast({
                      message: t("toast.reportSubmitSuccessful"),
                      variant: "info",
                      duration: 3000,
                    })
                  );
                } catch (e) {
                  handleLemmyError(e.toString());
                }
              },
            },
          ]
        );
      }

      if (selection === "delete") {
        try {
          await lemmyInstance.deleteComment({
            auth: lemmyAuthToken,
            comment_id: comment.comment.comment.id,
            deleted: true,
          });

          dispatch(
            showToast({
              message: t("toast.commentDeleted"),
              duration: 3000,
              variant: "info",
            })
          );

          usePostsStore.setState(
            produce((state: PostsStore) => {
              state.posts[postKey].comments = state.posts[postKey].comments.map(
                (c) => {
                  if (c.comment.comment.id === comment.comment.comment.id) {
                    return {
                      ...c,
                      comment: {
                        ...c.comment,
                        comment: {
                          ...c.comment.comment,
                          content: t("Comment deleted by user :("),
                          deleted: true,
                        },
                      },
                    };
                  }
                  return c;
                }
              );
            })
          );
        } catch (e) {
          handleLemmyError(e.toString());
        }
      }

      if (selection === "edit") {
        navigation.push("EditComment", {
          commentId: comment.comment.comment.id,
          content: comment.comment.comment.content,
          languageId: comment.comment.comment.language_id,
        });
      }

      if (selection === "reply") {
        onReply();
      }

      if (selection === "save") {
        onSave().then();
      }
    },
    [comment.comment.comment.id, comment.comment.my_vote]
  );

  const onReply = useCallback(() => {
    dispatch(
      setResponseTo({
        comment: comment.comment,
        languageId: comment.comment.post.language_id,
      })
    );
    navigation.push("NewComment");
  }, [comment.comment.comment.id]);

  const onReadPress = useCallback(async () => {
    useInboxStore.setState((state) => {
      const prev = state.replies.find(
        (c) => c.comment.comment.id === comment.comment.comment.id
      );
      const commentReply = prev.comment as CommentReplyView;

      commentReply.comment_reply.read = true;
    });

    try {
      await lemmyInstance.markCommentReplyAsRead({
        auth: lemmyAuthToken,
        comment_reply_id: (comment.comment as CommentReplyView).comment_reply
          .id,
        read: true,
      });
    } catch (e) {
      handleLemmyError(e.toString());
    }

    dispatch(setUnread({ type: "replies", amount: unread.replies - 1 }));
  }, [comment.comment.comment.id]);

  const onSave = useCallback(async () => {
    try {
      await lemmyInstance.saveComment({
        auth: lemmyAuthToken,
        comment_id: comment.comment.comment.id,
        save: !comment.comment.saved,
      });

      usePostsStore.setState((state) => {
        const prev = state.posts
          .get(postKey)
          .commentsState.comments.find(
            (c) => c.comment.comment.id === comment.comment.comment.id
          );

        prev.comment.saved = !prev.comment.saved;
      });
    } catch (e) {
      handleLemmyError(e.toString());
    }
  }, [comment.comment.comment.id, comment.comment.saved]);

  const onCollapseChain = useCallback(() => {
    const parentId = Number(comment.comment.comment.path.split(".")[1]);

    setCollapsed(postKey, parentId);
  }, [comment.comment.comment.id]);

  return {
    onCommentLongPress,
    onReadPress,
    onReply,
    longPressOptions,
    onSave,
    onCollapseChain,
  };
};

export default useComment;
