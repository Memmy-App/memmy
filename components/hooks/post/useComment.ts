import { useActionSheet } from "@expo/react-native-action-sheet";
import { useTheme, useToast } from "native-base";
import React, { SetStateAction } from "react";
import Clipboard from "@react-native-community/clipboard";
import { CommentReplyView } from "lemmy-js-client";
import { LayoutAnimation } from "react-native";
import { useAppDispatch, useAppSelector } from "../../../store";
import { selectCurrentAccount } from "../../../slices/accounts/accountsSlice";
import { selectSite, setUnread } from "../../../slices/site/siteSlice";
import ILemmyComment from "../../../lemmy/types/ILemmyComment";
import { onGenericHapticFeedback } from "../../../helpers/HapticFeedbackHelpers";
import {
  createUserFullName,
  getUserFullName,
} from "../../../lemmy/LemmyHelpers";
import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";
import { writeToLog } from "../../../helpers/LogHelper";
import { ILemmyVote } from "../../../lemmy/types/ILemmyVote";

interface UseComment {
  onCommentPress: () => void;
  onCommentLongPress: () => void;
  onReadPress: () => Promise<void>;
  onVote: (value: ILemmyVote) => Promise<void>;
}

const useComment = ({
  comment,
  setComments,
  onPressOverride,
  setRead,
}: {
  comment: ILemmyComment;
  setComments: React.Dispatch<SetStateAction<ILemmyComment[]>>;
  onPressOverride: () => Promise<void> | void;
  setRead?: React.Dispatch<SetStateAction<boolean>>;
}): UseComment => {
  const currentAccount = useAppSelector(selectCurrentAccount);
  const { unread } = useAppSelector(selectSite);

  const dispatch = useAppDispatch();

  const { showActionSheetWithOptions } = useActionSheet();
  const toast = useToast();
  const theme = useTheme();

  const onCommentPress = () => {
    onGenericHapticFeedback();

    if (onPressOverride) {
      onPressOverride();
      return;
    }

    LayoutAnimation.easeInEaseOut();

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

    let options = ["Copy Text", "Copy Link"];

    if (
      getUserFullName(comment.comment.creator) ===
      createUserFullName(currentAccount.username, currentAccount.instance)
    ) {
      if (!comment.comment.comment.deleted) options = [...options, "Delete"];
    }

    options.push("Cancel");

    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        userInterfaceStyle: theme.config.initialColorMode,
      },
      async (index: number) => {
        onGenericHapticFeedback();

        if (index === cancelButtonIndex) return;

        if (index === 0) {
          Clipboard.setString(comment.comment.comment.content);
        }

        if (index === 1) {
          Clipboard.setString(comment.comment.comment.ap_id);
        }

        if (index === 2) {
          try {
            await lemmyInstance.deleteComment({
              auth: lemmyAuthToken,
              comment_id: comment.comment.comment.id,
              deleted: true,
            });

            toast.show({
              title: "Comment deleted",
              duration: 3000,
            });

            setComments((prev) =>
              prev.map((c) => {
                if (c.comment.comment.id === comment.comment.comment.id) {
                  return {
                    ...c,
                    comment: {
                      ...c.comment,
                      comment: {
                        ...c.comment.comment,
                        content: "Comment deleted by user :(",
                        deleted: true,
                      },
                    },
                  };
                }
                return c;
              })
            );
          } catch (e) {
            writeToLog("Failed to delete comment.");
            writeToLog(e.toString());

            toast.show({
              title: "Failed to delete comment",
              duration: 3000,
            });
          }
        }
      }
    );
  };

  const onReadPress = async () => {
    onGenericHapticFeedback();

    try {
      setRead(true);

      await lemmyInstance.markCommentReplyAsRead({
        auth: lemmyAuthToken,
        comment_reply_id: (comment.comment as CommentReplyView).comment_reply
          .id,
        read: true,
      });

      dispatch(
        setUnread({
          type: "replies",
          amount: unread.replies - 1,
        })
      );
    } catch (e) {
      setRead(false);
      writeToLog("Error marking comment as read.");
      writeToLog(e.toString());
    }
  };

  const onVote = async (value: -1 | 0 | 1) => {
    if (value === comment.myVote && value !== 0) value = 0;

    const oldValue = comment.comment.my_vote;

    setComments((prev) =>
      prev.map((c) => {
        if (c.comment.comment.id === comment.comment.comment.id) {
          return {
            ...c,
            myVote: value,
            comment: {
              ...c.comment,
              my_vote: value,
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
      writeToLog("Error submitting vote.");
      writeToLog(e.toString());

      toast.show({
        title: "Error submitting vote...",
        duration: 3000,
      });

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
  };
};

export default useComment;
