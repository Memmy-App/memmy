import React, { SetStateAction } from "react";
import Clipboard from "@react-native-community/clipboard";
import { CommentReplyView } from "lemmy-js-client";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
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
import { useAppActionSheet } from "../app/useAppActionSheet";
import { handleLemmyError } from "../../helpers/LemmyErrorHelper";

interface UseComment {
  onCommentPress: () => void;
  onCommentLongPress: () => void;
  onReadPress: () => Promise<void>;
  onVote: (value: ILemmyVote) => Promise<void>;
  onReply: () => void;
}

const useComment = ({
  comment,
  setComments,
  onPressOverride,
}: {
  comment: ILemmyComment;
  setComments: React.Dispatch<SetStateAction<ILemmyComment[]>>;
  onPressOverride: () => Promise<void> | void;
}): UseComment => {
  const { t } = useTranslation();

  const currentAccount = useAppSelector(selectCurrentAccount);
  const { unread } = useAppSelector(selectSite);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const dispatch = useAppDispatch();

  const { showAppActionSheetWithOptions } = useAppActionSheet();

  const onCommentPress = () => {
    onGenericHapticFeedback();

    if (onPressOverride) {
      onPressOverride();
      return;
    }

    setComments((prev) =>
      prev.map((c) => {
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
      })
    );
  };

  const onCommentLongPress = () => {
    onGenericHapticFeedback();

    const isOwnComment =
      getUserFullName(comment.comment.creator).toLowerCase() ===
        createUserFullName(
          currentAccount.username.toLowerCase(),
          currentAccount.instance.toLowerCase()
        ) && !comment.comment.comment.deleted;

    const options = {
      "Copy Text": t("Copy Text"),
      "Copy Link": t("Copy Link"),
      Reply: t("Reply"),
      "Report Comment": t("comment.report"),
      ...(isOwnComment && {
        "Edit Comment": t("comment.edit"),
        "Delete Comment": t("comment.delete"),
      }),
      Cancel: t("Cancel"),
    };

    const optionsArr = Object.values(options);
    const cancelButtonIndex = optionsArr.indexOf(options.Cancel);

    showAppActionSheetWithOptions(
      {
        options: optionsArr,
        cancelButtonIndex,
      },
      async (index: number) => {
        const option = optionsArr[index];

        if (option === options["Copy Text"]) {
          Clipboard.setString(comment.comment.comment.content);
        }

        if (option === options["Copy Link"]) {
          Clipboard.setString(comment.comment.comment.ap_id);
        }

        if (option === options["Report Comment"]) {
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

        if (option === options["Delete Comment"]) {
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

            setComments((prev) =>
              prev.map((c) => {
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
              })
            );
          } catch (e) {
            handleLemmyError(e.toString());
          }
        }

        if (option === options["Edit Comment"]) {
          navigation.push("EditComment", {
            commentId: comment.comment.comment.id,
            content: comment.comment.comment.content,
            languageId: comment.comment.comment.language_id,
          });
        }

        if (option === options.Reply) {
          onReply();
        }
      }
    );
  };

  const onReply = () => {
    dispatch(
      setResponseTo({
        comment: comment.comment,
        languageId: comment.comment.post.language_id,
      })
    );
    navigation.push("NewComment");
  };

  const onReadPress = async () => {
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
  };

  const onVote = async (value: -1 | 0 | 1) => {
    let { upvotes, downvotes } = comment.comment.counts;

    // If we already voted, this will be a neutral vote.
    if (value === comment.comment.my_vote && value !== 0) value = 0;

    // Store old value in case we encounter an error
    const oldValue = comment.comment.my_vote;

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

    setComments((prev) =>
      prev.map((c) => {
        if (c.comment.comment.id === comment.comment.comment.id) {
          return {
            ...c,
            myVote: value,
            comment: {
              ...c.comment,
              my_vote: value,
              counts: {
                ...c.comment.counts,
                upvotes,
                downvotes,
                score: upvotes - downvotes,
              },
            },
          };
        }
        return c;
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

      setComments((prev) =>
        prev.map((c) => {
          if (c.comment.comment.id === comment.comment.comment.id) {
            return {
              ...c,
              myVote: oldValue as ILemmyVote,
              comment: {
                ...c.comment,
                my_vote: oldValue as number,
              },
            };
          }
          return c;
        })
      );
    }
  };

  return {
    onCommentLongPress,
    onCommentPress,
    onVote,
    onReadPress,
    onReply,
  };
};

export default useComment;
