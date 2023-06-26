import { useActionSheet } from "@expo/react-native-action-sheet";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Divider,
  HStack,
  IconButton,
  Pressable,
  Text,
  useTheme,
  useToast,
  View,
  VStack,
} from "native-base";
import React, { useMemo, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import {
  IconArrowDown,
  IconArrowUp,
  IconDots,
  IconMail,
  IconMailOpened,
  IconMessage,
} from "tabler-icons-react-native";
// eslint-disable-next-line import/no-extraneous-dependencies
import Clipboard from "@react-native-community/clipboard";
import { CommentReplyView } from "lemmy-js-client";
import { onGenericHapticFeedback } from "../../../helpers/HapticFeedbackHelpers";
import { writeToLog } from "../../../helpers/LogHelper";
import { timeFromNowShort } from "../../../helpers/TimeHelper";
import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";
import { ILemmyVote } from "../../../lemmy/types/ILemmyVote";
import { selectCurrentAccount } from "../../../slices/accounts/accountsSlice";
import { setResponseTo } from "../../../slices/newComment/newCommentSlice";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "../../../store";
import AvatarUsername from "../common/AvatarUsername";
import SmallVoteIcons from "../common/SmallVoteIcons";
import RenderMarkdown from "../markdown/RenderMarkdown";
import {
  createUserFullName,
  getUserFullName,
} from "../../../lemmy/LemmyHelpers";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import NamePill from "../NamePill";
import { selectSite, setUnread } from "../../../slices/site/siteSlice";
import NestedComment from "../../../lemmy/comments/NestedComment";
import useSwipeAnimation from "../../hooks/animations/useSwipeAnimation";

function CommentItem2({
  nestedComment,
  opId,
  recycled = undefined,
  depth = 2,
  isReply = false,
  onPressOverride = null,
  read = false,
  refresh,
}: {
  nestedComment: NestedComment;
  opId: number;
  recycled?: React.MutableRefObject<{}> | undefined;
  depth?: number;
  isReply?: boolean;
  onPressOverride?: () => void | Promise<void>;
  read?: boolean;
  refresh?: boolean;
}) {
  // Global state
  const { showInstanceForUsernames } = useAppSelector(selectSettings);
  const currentAccount = useAppSelector(selectCurrentAccount);
  const { unread } = useAppSelector(selectSite);

  // State
  const [myVote, setMyVote] = useState(nestedComment.comment.my_vote);
  const [collapsed, setCollapsed] = useState(false);
  const [isRead, setIsRead] = useState<boolean>(read);
  const [showAll] = useState(false);
  const [content, setContent] = useState(nestedComment.comment.comment.content);

  // Refs
  const lastCommentId = useRef(nestedComment.comment.comment.id);

  // Other hooks
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();
  const { showActionSheetWithOptions } = useActionSheet();
  const toast = useToast();

  try {
    if (
      recycled.current &&
      nestedComment.comment.comment.id !== lastCommentId.current
    ) {
      if (recycled.current[nestedComment.comment.comment.id]) {
        setCollapsed(
          recycled.current[nestedComment.comment.comment.id].collapsed
        );
        setMyVote(recycled.current[nestedComment.comment.comment.id].myVote);
        delete recycled.current[lastCommentId.current];
      } else {
        setCollapsed(false);
        setMyVote(nestedComment.comment.my_vote);
        setContent(nestedComment.comment.comment.content);
      }

      recycled.current = {
        ...recycled.current,
        [lastCommentId.current]: {
          collapsed,
          myVote,
        },
      };

      lastCommentId.current = nestedComment.comment.comment.id;
    }
  } catch (e) {}

  const onCommentPress = () => {
    onGenericHapticFeedback();

    if (onPressOverride) {
      onPressOverride();
      return;
    }

    setCollapsed(!collapsed);
  };

  const onCommentLongPress = () => {
    onGenericHapticFeedback();

    let options = ["Copy Text", "Copy Link"];

    if (
      getUserFullName(nestedComment.comment.creator) ===
      createUserFullName(currentAccount.username, currentAccount.instance)
    ) {
      if (!nestedComment.comment.comment.deleted)
        options = [...options, "Delete"];
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
          Clipboard.setString(nestedComment.comment.comment.content);
        }

        if (index === 1) {
          Clipboard.setString(nestedComment.comment.comment.ap_id);
        }

        if (index === 2) {
          try {
            await lemmyInstance.deleteComment({
              auth: lemmyAuthToken,
              comment_id: nestedComment.comment.comment.id,
              deleted: true,
            });

            toast.show({
              title: "Comment deleted",
              duration: 3000,
            });

            setContent("Comment deleted by user :(");
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
      setIsRead(true);

      await lemmyInstance.markCommentReplyAsRead({
        auth: lemmyAuthToken,
        comment_reply_id: (nestedComment.comment as CommentReplyView)
          .comment_reply.id,
        read: true,
      });

      dispatch(
        setUnread({
          type: "replies",
          amount: unread.replies - 1,
        })
      );
    } catch (e) {
      setIsRead(false);
      writeToLog("Error marking comment as read.");
      writeToLog(e.toString());
    }
  };

  const onVote = async (value: -1 | 0 | 1) => {
    if (value === myVote && value !== 0) value = 0;

    const oldValue = nestedComment.comment.my_vote;

    setMyVote(value);

    try {
      await lemmyInstance.likeComment({
        auth: lemmyAuthToken,
        comment_id: nestedComment.comment.comment.id,
        score: value,
      });
    } catch (e) {
      writeToLog("Error submitting vote.");
      writeToLog(e.toString());

      toast.show({
        title: "Error submitting vote...",
        duration: 3000,
      });
      setMyVote(oldValue as -1 | 0 | 1);
    }
  };

  const swipeAnimation = useSwipeAnimation({
    onLeftRightOne: () => onVote(1),
    onLeftRightTwo: () => onVote(-1),
    onRightLeftOne: () => {
      dispatch(
        setResponseTo({
          comment: nestedComment.comment,
        })
      );
      navigation.push("NewComment");
    },
    onRightLeftTwo: () => {},
    leftRightOneIcon: () => <IconArrowUp size={32} color="#fff" />,
    leftRightTwoIcon: () => <IconArrowDown size={32} color="#fff" />,
    rightLeftOneIcon: () => <IconMessage size={32} color="#fff" />,
    rightLeftTwoIcon: () => <IconMessage size={20} />,
  });

  return useMemo(
    () => (
      <>
        <View>
          <View style={styles.backgroundContainer}>
            <View
              style={styles.backgroundLeft}
              justifyContent="center"
              backgroundColor={swipeAnimation.color}
              pl={4}
            >
              {swipeAnimation.leftIcon}
            </View>
            <View
              style={styles.backgroundLeft}
              backgroundColor={swipeAnimation.color}
            />
            <View
              style={styles.backgroundRight}
              justifyContent="center"
              backgroundColor="#007AFF"
              alignItems="flex-end"
              pr={4}
            >
              {swipeAnimation.rightIcon}
            </View>
          </View>
          <PanGestureHandler
            onGestureEvent={swipeAnimation.gestureHandler}
            minPointers={1}
            activeOffsetX={[-20, 20]}
            hitSlop={{ left: -25 }}
          >
            <Animated.View style={[swipeAnimation.animatedStyle]}>
              <Pressable
                onPress={onCommentPress}
                onLongPress={onCommentLongPress}
              >
                <VStack
                  flex={1}
                  pr={2}
                  pb={1}
                  space={2}
                  backgroundColor={theme.colors.app.fg}
                  style={{
                    paddingLeft: depth * 8,
                  }}
                >
                  <VStack
                    borderLeftWidth={depth > 2 ? 2 : 0}
                    borderLeftColor={
                      theme.colors.app.comments[depth - 2] ??
                      theme.colors.app.comments[5]
                    }
                    borderLeftRadius={1}
                    pl={depth > 2 ? 2 : 0}
                    mt={0}
                  >
                    <HStack
                      space={2}
                      justifyContent="space-between"
                      alignItems="center"
                      mb={-3}
                      pb={2}
                    >
                      <AvatarUsername
                        avatar={nestedComment.comment.creator.avatar}
                        username={nestedComment.comment.creator.name}
                        fullUsername={getUserFullName(
                          nestedComment.comment.creator
                        )}
                        creatorActorId={nestedComment.comment.creator.actor_id}
                        showInstance={showInstanceForUsernames}
                      >
                        <>
                          {(currentAccount &&
                            currentAccount.username &&
                            currentAccount.instance &&
                            nestedComment.comment.creator.name ===
                              currentAccount?.username &&
                            getBaseUrl(
                              nestedComment.comment.creator.actor_id
                            ) === currentAccount?.instance && (
                              <NamePill
                                text="me"
                                color={theme.colors.app.users.me}
                              />
                            )) ||
                            (nestedComment.comment.creator.id === opId && (
                              <NamePill
                                text="OP"
                                color={theme.colors.app.users.op}
                              />
                            ))}
                          <SmallVoteIcons
                            upvotes={nestedComment.comment.counts.upvotes}
                            downvotes={nestedComment.comment.counts.downvotes}
                            myVote={myVote as ILemmyVote}
                            initialVote={nestedComment.comment.my_vote}
                          />
                        </>
                      </AvatarUsername>
                      <HStack alignItems="center" space={2}>
                        {isReply && (
                          <>
                            {!isRead ? (
                              <IconButton
                                icon={
                                  <IconMail
                                    size={24}
                                    color={theme.colors.app.textSecondary}
                                  />
                                }
                                onPress={onReadPress}
                              />
                            ) : (
                              <IconMailOpened
                                size={24}
                                color={theme.colors.app.textSecondary}
                              />
                            )}
                          </>
                        )}
                        {!isReply && (
                          <IconButton
                            icon={
                              <IconDots
                                size={24}
                                color={theme.colors.app.textSecondary}
                              />
                            }
                            onPress={onCommentLongPress}
                          />
                        )}
                        <Text color={theme.colors.app.textSecondary}>
                          {timeFromNowShort(
                            nestedComment.comment.comment.published
                          )}
                        </Text>
                      </HStack>
                    </HStack>
                    {collapsed ? (
                      <Text
                        py={3}
                        color={theme.colors.app.textSecondary}
                        fontStyle="italic"
                      >
                        Comment collapsed
                      </Text>
                    ) : (
                      <>
                        {(nestedComment.comment.comment.deleted && (
                          <Text
                            py={3}
                            color={theme.colors.app.textSecondary}
                            fontStyle="italic"
                          >
                            Comment deleted by user :(
                          </Text>
                        )) ||
                          (nestedComment.comment.comment.removed && (
                            <Text
                              py={3}
                              color={theme.colors.app.textSecondary}
                              fontStyle="italic"
                            >
                              Comment removed by moderator :(
                            </Text>
                          )) || <RenderMarkdown text={content} addImages />}
                      </>
                    )}
                  </VStack>
                  <Divider ml={0} mt={-1} />
                </VStack>
              </Pressable>
            </Animated.View>
          </PanGestureHandler>
        </View>
        {(!collapsed &&
          !showAll &&
          nestedComment.replies
            .slice(0, 5)
            .map((r) => (
              <CommentItem2
                key={r.comment.comment.id}
                nestedComment={r}
                opId={opId}
                recycled={recycled}
                depth={depth + 1}
              />
            ))) ||
          (!collapsed &&
            showAll &&
            nestedComment.replies.map((r) => (
              <CommentItem2
                key={r.comment.comment.id}
                nestedComment={r}
                opId={opId}
                recycled={recycled}
                depth={depth + 1}
              />
            )))}
      </>
    ),
    [
      swipeAnimation.leftIcon,
      swipeAnimation.rightIcon,
      nestedComment,
      myVote,
      collapsed,
      refresh,
    ]
  );
}

const styles = StyleSheet.create({
  side: {
    borderLeftWidth: 2,
    paddingLeft: 8,
    marginLeft: -4,
  },

  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    flexDirection: "row",
  },

  backgroundLeft: {
    flex: 1,
  },

  backgroundRight: {
    flex: 1,
  },
});

export default CommentItem2;
