import { useActionSheet } from "@expo/react-native-action-sheet";
import { useTheme } from "native-base";
import React, { SetStateAction } from "react";
import Clipboard from "@react-native-community/clipboard";
import { CommentReplyView } from "lemmy-js-client";
import { Alert, LayoutAnimation } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppDispatch, useAppSelector } from "../../../store";
import { selectCurrentAccount } from "../../slices/accounts/accountsSlice";
import { selectSite, setUnread } from "../../slices/site/siteSlice";
import ILemmyComment from "../../../lemmy/types/ILemmyComment";
import { onGenericHapticFeedback } from "../../helpers/HapticFeedbackHelpers";
import {
  createUserFullName,
  getUserFullName,
} from "../../helpers/LemmyHelpers";
import { lemmyAuthToken, lemmyInstance } from "../../LemmyInstance";
import { writeToLog } from "../../helpers/LogHelper";
import { ILemmyVote } from "../../../lemmy/types/ILemmyVote";
import { showToast } from "../../slices/toast/toastSlice";
import { setResponseTo } from "../../slices/comments/newCommentSlice";

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
  const currentAccount = useAppSelector(selectCurrentAccount);
  const { unread } = useAppSelector(selectSite);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const dispatch = useAppDispatch();

  const { showActionSheetWithOptions } = useActionSheet();
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

    const isOwnComment =
      getUserFullName(comment.comment.creator).toLowerCase() ===
        createUserFullName(
          currentAccount.username.toLowerCase(),
          currentAccount.instance.toLowerCase()
        ) && !comment.comment.comment.deleted;

    // const options = [
    //   "Copy Text",
    //   "Copy Link",
    //   isOwnComment && "Edit Comment",
    //   isOwnComment && "Delete Comment",
    // ];

    // TODO: make this a set bc im too lazy to do it rn
    const options = {
      "Copy Text": "Copy Text",
      "Copy Link": "Copy Link",
      Reply: "Reply",
      "Report Comment": "Report Comment",
      ...(isOwnComment && {
        "Edit Comment": "Edit Comment",
        "Delete Comment": "Delete Comment",
      }),
      Cancel: "Cancel",
    };

    const optionsArr = Object.values(options);
    const cancelButtonIndex = optionsArr.indexOf(options.Cancel);

    showActionSheetWithOptions(
      {
        options: optionsArr,
        cancelButtonIndex,
        userInterfaceStyle: theme.config.initialColorMode,
      },
      async (index: number) => {
        onGenericHapticFeedback();

        const option = optionsArr[index];

        if (index === cancelButtonIndex) return;

        if (option === options["Copy Text"]) {
          Clipboard.setString(comment.comment.comment.content);
        }

        if (option === options["Copy Link"]) {
          Clipboard.setString(comment.comment.comment.ap_id);
        }

        if (option === options["Report Comment"]) {
          await Alert.prompt(
            "Report Comment",
            "Please describe your reason for reporting this comment.",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Submit",
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
                        message: "Report submitted successfully",
                        variant: "info",
                        duration: 3000,
                      })
                    );
                  } catch (e) {
                    writeToLog("Error reporting comment.");
                    writeToLog(e.toString());
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
                message: "Comment deleted",
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

            dispatch(
              showToast({
                message: "Error deleting comment",
                duration: 3000,
                variant: "error",
              })
            );
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

      dispatch(
        showToast({
          message: "Error submitting vote...",
          duration: 3000,
          variant: "error",
        })
      );

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
