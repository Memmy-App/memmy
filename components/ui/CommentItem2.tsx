import React, { useRef, useState } from "react";
import {
  Divider,
  HStack,
  Icon,
  IconButton,
  Pressable,
  Text,
  useTheme,
  useToast,
  View,
  VStack,
} from "native-base";
import {
  IconArrowDown,
  IconArrowUp,
  IconDots,
  IconUser,
} from "tabler-icons-react-native";
import FastImage from "react-native-fast-image";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import { Alert, Dimensions, StyleSheet } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useActionSheet } from "@expo/react-native-action-sheet";
// eslint-disable-next-line import/no-extraneous-dependencies
import Clipboard from "@react-native-community/clipboard";
import RenderMarkdown from "./markdown/RenderMarkdown";
import { timeFromNowShort } from "../../helpers/TimeHelper";
import {
  onCommentSlideHapticFeedback,
  onGenericHapticFeedback,
} from "../../helpers/HapticFeedbackHelpers";
import { setResponseTo } from "../../slices/newComment/newCommentSlice";
import { useAppDispatch, useAppSelector } from "../../store";
import { lemmyAuthToken, lemmyInstance } from "../../lemmy/LemmyInstance";
import { selectSettings } from "../../slices/settings/settingsSlice";
import { NestedComment } from "../hooks/post/postHooks";
import { getBaseUrl } from "../../helpers/LinkHelper";

function CommentItem2({ nestedComment }: { nestedComment: NestedComment }) {
  const theme = useTheme();

  const depth = nestedComment.comment.comment.path.split(".").length;

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const lastCommentId = useRef(nestedComment.comment.comment.id);

  const [myVote, setMyVote] = useState(nestedComment.comment.my_vote);

  const dispatch = useAppDispatch();
  const toast = useToast();

  const { showInstanceForUsernames } = useAppSelector(selectSettings);

  const [collapsed, setCollapsed] = useState(false);

  const [showAll, setShowAll] = useState(false);

  const { showActionSheetWithOptions } = useActionSheet();

  if (nestedComment.comment.comment.id !== lastCommentId.current) {
    setCollapsed(false);
    setMyVote(nestedComment.comment.my_vote);

    lastCommentId.current = nestedComment.comment.comment.id;
  }

  const onCommentPress = () => {
    onGenericHapticFeedback();

    setCollapsed(!collapsed);
  };

  const onCommentLongPress = () => {
    onGenericHapticFeedback();

    const options = ["Copy", "Cancel"];
    const cancelButtonIndex = 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (index: number) => {
        if (index === cancelButtonIndex) return;
        Clipboard.setString(nestedComment.comment.comment.content);
      }
    );
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
      toast.show({
        title: "Error submitting vote...",
        duration: 3000,
      });
      setMyVote(oldValue as -1 | 0 | 1);
    }
  };

  const { width } = Dimensions.get("screen");

  const [color, setColor] = useState("#1abd3e");
  const [iconName, setIconName] = useState("");

  const translateX = useSharedValue(0);
  const ranFeedbackUpvote = useSharedValue(false);
  const ranFeedbackDownvote = useSharedValue(false);
  const ranFeedbackComment = useSharedValue(false);
  const startPos = useSharedValue(0);
  const action = useSharedValue<
    null | "upvote" | "downvote" | "comment" | "back"
  >(null);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line no-param-reassign
      ctx.startX = translateX.value;
      startPos.value = event.absoluteX;
    },
    onActive: (event, ctx) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      translateX.value = ctx.startX + event.translationX;

      if (event.translationX > 0) {
        if (event.translationX < width * 0.3) {
          runOnJS(setStyles)("upvote");
        } else {
          runOnJS(setStyles)("downvote");
        }
      } else {
        runOnJS(setStyles)("comment");
      }

      if (event.translationX >= width * 0.15 && !ranFeedbackUpvote.value) {
        runOnJS(onCommentSlideHapticFeedback)();
        ranFeedbackUpvote.value = true;
      } else if (
        event.translationX >= width * 0.3 &&
        !ranFeedbackDownvote.value
      ) {
        runOnJS(onCommentSlideHapticFeedback)();
        ranFeedbackDownvote.value = true;
      } else if (
        event.translationX >= width * 0.15 &&
        event.translationX < width * 0.3 &&
        ranFeedbackUpvote.value &&
        ranFeedbackDownvote.value
      ) {
        runOnJS(onCommentSlideHapticFeedback)();
        ranFeedbackDownvote.value = false;
      } else if (
        event.translationX <= -(width * 0.15) &&
        ranFeedbackComment.value
      ) {
        runOnJS(onCommentSlideHapticFeedback)();
        ranFeedbackComment.value = true;
      }
    },
    onEnd: (event) => {
      ranFeedbackUpvote.value = false;
      ranFeedbackDownvote.value = false;
      ranFeedbackComment.value = false;

      runOnJS(setStyles)("upvote");

      if (startPos.value < 10) {
        runOnJS(onDone)("back");
        action.value = "back";
      } else if (
        event.translationX >= width * 0.15 &&
        event.translationX < width * 0.3
      ) {
        runOnJS(onDone)("upvote");
      } else if (event.translationX >= width * 0.3) {
        runOnJS(onDone)("downvote");
      } else if (event.translationX <= -(width * 0.15)) {
        runOnJS(onDone)("comment");
      }

      translateX.value = withSpring(0, {
        damping: 30,
      });
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  function setStyles(actionType: "upvote" | "downvote" | "comment") {
    switch (actionType) {
      case "upvote": {
        setColor("#1abd3e");
        setIconName("arrow-up-outline");
        break;
      }
      case "downvote": {
        setColor("#e36919");
        setIconName("arrow-down-outline");
        break;
      }
      case "comment": {
        setColor("#007AFF");
        break;
      }
      default: {
        break;
      }
    }
  }

  function onDone(
    actionType: null | "upvote" | "downvote" | "comment" | "back"
  ) {
    switch (actionType) {
      case "upvote": {
        onVote(1).then();
        break;
      }
      case "downvote": {
        onVote(-1);
        break;
      }
      case "comment": {
        dispatch(
          setResponseTo({
            comment: nestedComment.comment,
          })
        );
        navigation.push("NewComment");
        break;
      }
      case "back": {
        navigation.pop();
        break;
      }
      default: {
        break;
      }
    }
  }

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View>
          <View style={styles.backgroundContainer}>
            <View
              style={styles.backgroundLeft}
              justifyContent="center"
              backgroundColor={color}
            >
              <Icon
                as={Ionicons}
                name={iconName}
                size={8}
                color="white"
                ml={3}
                alignSelf="flex-start"
              />
            </View>
            <View style={styles.backgroundLeft} backgroundColor={color} />
            <View
              style={styles.backgroundRight}
              justifyContent="center"
              backgroundColor="#007AFF"
            >
              <Icon
                as={Ionicons}
                name="arrow-undo"
                size={8}
                color="white"
                mr={3}
                alignSelf="flex-end"
              />
            </View>
          </View>
          <PanGestureHandler
            onGestureEvent={gestureHandler}
            minPointers={1}
            activeOffsetX={[-20, 20]}
            hitSlop={{ left: -25 }}
          >
            <Animated.View style={[animatedStyle]}>
              <Pressable
                onPress={onCommentPress}
                onLongPress={onCommentLongPress}
              >
                <VStack
                  flex={1}
                  pr={2}
                  py={2}
                  space={2}
                  backgroundColor="screen.800"
                  style={{
                    paddingLeft: depth * 8,
                  }}
                >
                  <VStack
                    borderLeftWidth={depth > 2 ? 2 : 0}
                    borderLeftColor={
                      theme.colors.app.commentChain[depth - 2] ??
                      theme.colors.app.commentChain[5]
                    }
                    borderLeftRadius={1}
                    pl={depth > 2 ? 2 : 0}
                  >
                    <HStack
                      space={2}
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <HStack space={2} alignItems="center">
                        {nestedComment.comment.creator.avatar ? (
                          <FastImage
                            source={{
                              uri: nestedComment.comment.creator.avatar,
                            }}
                            style={{ height: 24, width: 24, borderRadius: 100 }}
                          />
                        ) : (
                          <IconUser color={theme.colors.app.iconColor} />
                        )}
                        <VStack>
                          <Text fontWeight="semibold">
                            {nestedComment.comment.creator.name}
                          </Text>
                          {showInstanceForUsernames && (
                            <Text fontSize="xs">
                              {getBaseUrl(
                                nestedComment.comment.creator.actor_id
                              )}
                            </Text>
                          )}
                        </VStack>
                        <HStack alignItems="center">
                          <IconArrowUp
                            color={
                              myVote === 1
                                ? theme.colors.app.upvoteColor
                                : theme.colors.app.iconColor
                            }
                            size={18}
                          />
                          <Text>
                            {myVote === 1
                              ? nestedComment.comment.counts.upvotes + 1
                              : nestedComment.comment.counts.upvotes}
                          </Text>
                        </HStack>
                        <HStack alignItems="center">
                          <IconArrowDown
                            color={
                              myVote === -1
                                ? theme.colors.app.downvoteColor
                                : theme.colors.app.iconColor
                            }
                            size={18}
                          />
                          <Text>
                            {myVote === -1
                              ? nestedComment.comment.counts.downvotes + 1
                              : nestedComment.comment.counts.downvotes}
                          </Text>
                        </HStack>
                      </HStack>
                      <HStack alignItems="center" space={2}>
                        <IconButton
                          icon={
                            <IconDots
                              size={24}
                              color={theme.colors.app.iconColor}
                            />
                          }
                          onPress={onCommentLongPress}
                        />
                        <Text>
                          {timeFromNowShort(
                            nestedComment.comment.comment.published
                          )}
                        </Text>
                      </HStack>
                    </HStack>
                    {collapsed ? (
                      <Text>Comment collapsed</Text>
                    ) : (
                      <RenderMarkdown
                        text={nestedComment.comment.comment.content}
                      />
                    )}
                  </VStack>
                  <Divider ml={4} mt={-1} />
                </VStack>
              </Pressable>
            </Animated.View>
          </PanGestureHandler>
        </View>
      </GestureHandlerRootView>
      {(!collapsed &&
        !showAll &&
        nestedComment.replies
          .slice(0, 5)
          .map((r) => (
            <CommentItem2 key={r.comment.comment.id} nestedComment={r} />
          ))) ||
        (!collapsed &&
          showAll &&
          nestedComment.replies.map((r) => (
            <CommentItem2 key={r.comment.comment.id} nestedComment={r} />
          )))}
    </>
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
