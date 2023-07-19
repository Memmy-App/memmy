import { useCallback, useMemo } from "react";
import Clipboard from "@react-native-community/clipboard";
import { CommentReplyView } from "lemmy-js-client";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { produce } from "immer";
import { useRoute } from "@react-navigation/core";
import { useAppDispatch, useAppSelector } from "../../../store";
import { selectCurrentAccount } from "../../slices/accounts/accountsSlice";
import { selectSite, setUnread } from "../../slices/site/siteSlice";
import ILemmyComment from "../../types/lemmy/ILemmyComment";
import { onGenericHapticFeedback } from "../../helpers/HapticFeedbackHelpers";
import {
  createUserFullName,
  getUserFullName,
} from "../../helpers/LemmyHelpers";
import { lemmyAuthToken, lemmyInstance } from "../../LemmyInstance";
import { writeToLog } from "../../helpers/LogHelper";
import { ILemmyVote } from "../../types/lemmy/ILemmyVote";
import { showToast } from "../../slices/toast/toastSlice";
import { setResponseTo } from "../../slices/comments/newCommentSlice";
import { handleLemmyError } from "../../helpers/LemmyErrorHelper";
import { selectSettings } from "../../slices/settings/settingsSlice";
import { PostsState, usePostsStore } from "../../stores/posts/postsStore";
import { determineVotes } from "../../helpers/VoteHelper";

export interface UseComment {
  onCommentPress: () => void;
  onCommentLongPress: (selection?: string) => void;
  onReadPress: () => Promise<void>;
  onVote: (value: ILemmyVote) => Promise<void>;
  onReply: () => void;
  longPressOptions: Record<string, string>;
}

const useComment = ({
  comment,
  onPressOverride,
}: {
  comment: ILemmyComment;
  onPressOverride: () => Promise<void> | void;
}): UseComment => {
  const { postKey } = useRoute<any>().params;

  const { t } = useTranslation();

  const currentAccount = useAppSelector(selectCurrentAccount);
  const { unread } = useAppSelector(selectSite);
  const { tapToCollapse } = useAppSelector(selectSettings);
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

  const longPressOptions: Record<string, string> = useMemo(
    () => ({
      "Copy Text": t("Copy Text"),
      "Copy Link": t("Copy Link"),
      Reply: t("Reply"),
      "Report Comment": t("comment.report"),
      ...(isOwnComment && {
        "Edit Comment": t("comment.edit"),
        "Delete Comment": t("comment.delete"),
      }),
    }),
    [comment.comment.comment.id]
  );

  const onCommentPress = useCallback(() => {
    if (onPressOverride) {
      onGenericHapticFeedback();
      onPressOverride();
      return;
    }

    if (!tapToCollapse) return;

    onGenericHapticFeedback();

    usePostsStore.setState(
      produce((state: PostsState) => {
        state.posts[postKey].comments = state.posts[postKey].comments.map(
          (c) => {
            if (c.comment.comment.id === comment.comment.comment.id) {
              return {
                ...c,
                collapsed: !comment.collapsed,
              };
            }
            if (c.comment.comment.path.includes(comment.comment.comment.path)) {
              return {
                ...c,
                hidden: !comment.collapsed,
              };
            }
            return c;
          }
        );
      })
    );
  }, [comment.comment.comment.id, comment.collapsed]);

  const onCommentLongPress = useCallback(
    async (selection: string) => {
      onGenericHapticFeedback();

      if (selection === longPressOptions["Copy Text"]) {
        Clipboard.setString(comment.comment.comment.content);
      }

      if (selection === longPressOptions["Copy Link"]) {
        Clipboard.setString(comment.comment.comment.ap_id);
      }

      if (selection === longPressOptions["Report Comment"]) {
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

      if (selection === longPressOptions["Delete Comment"]) {
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
            produce((state: PostsState) => {
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

      if (selection === longPressOptions["Edit Comment"]) {
        navigation.push("EditComment", {
          commentId: comment.comment.comment.id,
          content: comment.comment.comment.content,
          languageId: comment.comment.comment.language_id,
        });
      }

      if (selection === longPressOptions.Reply) {
        onReply();
      }
    },
    [comment.comment.comment.id]
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
    try {
      setComments((prev) =>
        prev.filter((c) => c.comment.comment.id !== comment.comment.comment.id)
      );

      lemmyInstance
        .markCommentReplyAsRead({
          auth: lemmyAuthToken,
          comment_reply_id: (comment.comment as CommentReplyView).comment_reply
            .id,
          read: true,
        })
        .then();

      dispatch(
        setUnread({
          type: "replies",
          amount: unread.replies - 1,
        })
      );
    } catch (e) {
      writeToLog("Error marking comment as read.");
      writeToLog(e.toString());
    }
  }, [comment.comment.comment.id]);

  const onVote = useCallback(
    async (value: ILemmyVote) => {
      const newValues = determineVotes(
        value,
        comment.comment.my_vote,
        comment.comment.counts.upvotes,
        comment.comment.counts.downvotes
      );

      usePostsStore.setState(
        produce((state: PostsState) => {
          state.posts[postKey].comments = state.posts[postKey].comments.map(
            (c) => {
              if (c.comment.comment.id === comment.comment.comment.id) {
                return {
                  ...c,
                  myVote: value,
                  comment: {
                    ...c.comment,
                    my_vote: value,
                    counts: {
                      ...c.comment.counts,
                      upvotes: newValues.upvotes,
                      downvotes: newValues.downvotes,
                      score: newValues.upvotes - newValues.downvotes,
                    },
                  },
                };
              }
              return c;
            }
          );
        })
      );

      try {
        await lemmyInstance.likeComment({
          auth: lemmyAuthToken,
          comment_id: comment.comment.comment.id,
          score: value,
        });
      } catch (e) {
        handleLemmyError(e.toString());
      }
    },
    [comment.comment.comment.id]
  );

  return {
    onCommentLongPress,
    onCommentPress,
    onVote,
    onReadPress,
    onReply,
    longPressOptions,
  };
};

export default useComment;
