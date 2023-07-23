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
import { showToast } from "../../slices/toast/toastSlice";
import { setResponseTo } from "../../slices/comments/newCommentSlice";
import { handleLemmyError } from "../../helpers/LemmyErrorHelper";
import { PostsStore, usePostsStore } from "../../stores/posts/postsStore";
import { useInboxStore } from "../../stores/inbox/inboxStore";
import { ICON_MAP } from "../../constants/IconMap";
import { ContextMenuOptions } from "../../types/ContextMenuOptions";

export interface UseComment {
  onCommentLongPress: (selection?: string) => void;
  onReadPress?: () => Promise<void>;
  onReply: () => void;
  longPressOptions: ContextMenuOptions;
}

const useComment = ({ comment }: { comment: ILemmyComment }): UseComment => {
  const postKey = useRoute<any>().params?.postKey;

  const { t } = useTranslation();

  const currentAccount = useAppSelector(selectCurrentAccount);
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

  const longPressOptions: ContextMenuOptions = useMemo(
    () => ({
      copy_text: { title: t("Copy Text"), icon: ICON_MAP.COPY },
      copy_link: { title: t("Copy Link"), icon: ICON_MAP.LINK },
      reply: { title: t("Reply"), icon: ICON_MAP.REPLY },
      report: { title: t("comment.report"), icon: ICON_MAP.REPORT_POST },
      ...(isOwnComment && {
        edit: { display: t("comment.edit"), icon: ICON_MAP.EDIT },
        delete: {
          display: t("comment.delete"),
          icon: ICON_MAP.DELETE,
          destructive: true,
        },
      }),
    }),
    [comment.comment.comment.id]
  );

  const onCommentLongPress = useCallback(
    async (selection: string) => {
      onGenericHapticFeedback();

      if (selection === "copy_text") {
        Clipboard.setString(comment.comment.comment.content);
      }

      if (selection === "copy_link") {
        Clipboard.setString(comment.comment.comment.ap_id);
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
    useInboxStore.setState((state) => {
      const prev = state.replies.find(
        (c) => c.comment.comment.id === comment.comment.comment.id
      );
      const commentReply = prev.comment as CommentReplyView;

      commentReply.comment_reply.read = true;
    });

    dispatch(setUnread({ type: "replies", amount: unread.replies - 1 }));
  }, [comment.comment.comment.id]);

  return {
    onCommentLongPress,
    onReadPress,
    onReply,
    longPressOptions,
  };
};

export default useComment;
