import {
  Divider,
  HStack,
  Pressable,
  Text,
  useTheme,
  View,
  VStack,
} from "native-base";
import React from "react";
import {
  IconChevronDown,
  IconDots,
  IconMessagePlus,
} from "tabler-icons-react-native";
import useComment from "../../../hooks/post/useComment";
import ILemmyComment from "../../../types/lemmy/ILemmyComment";
import { ILemmyVote } from "../../../types/lemmy/ILemmyVote";
import { ReplyOption } from "../SwipeableRow/ReplyOption";
import { SwipeableRow } from "../SwipeableRow/SwipeableRow";
import { VoteOption } from "../SwipeableRow/VoteOption";
import CommentBody from "./CommentBody";
import CommentCollapsed from "./CommentCollapsed";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import { useAppSelector } from "../../../../store";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import { CommentContextMenu } from "./CommentContextMenu";
import AvatarUsername from "../AvatarUsername";
import SmallVoteIcons from "../Vote/SmallVoteIcons";
import IconButtonWithText from "../IconButtonWithText";
import { timeFromNowShort } from "../../../helpers/TimeHelper";
import VoteButton from "../Vote/VoteButton";

interface IProps {
  comment: ILemmyComment;
  setComments: any;
  onPressOverride?: () => Promise<void> | void;
  depth?: number;
  isUnreadReply?: boolean;
}

function CommentItem({
  comment,
  setComments,
  onPressOverride,
  depth,
  isUnreadReply,
}: IProps) {
  const theme = useTheme();
  const settings = useAppSelector(selectSettings);

  if (!depth) {
    depth = comment.comment.comment.path.split(".").length;
  }

  const commentHook = useComment({
    comment,
    setComments,
    onPressOverride,
  });

  return (
    <>
      <SwipeableRow
        leftOption={
          <VoteOption
            onVote={commentHook.onVote}
            vote={comment.comment.my_vote}
          />
        }
        rightOption={
          <ReplyOption
            onReply={commentHook.onReply}
            extraType={isUnreadReply ? "read" : undefined}
            onExtra={isUnreadReply ? commentHook.onReadPress : undefined}
          />
        }
      >
        <CommentContextMenu
          isShortPress={false}
          onPress={({ nativeEvent }) => {
            commentHook.onCommentLongPress(nativeEvent.actionKey);
          }}
          options={commentHook.longPressOptions}
        >
          <Pressable onPress={commentHook.onCommentPress}>
            <VStack
              flex={1}
              pr={2}
              space={2}
              backgroundColor={theme.colors.app.fg}
              style={{
                paddingLeft: depth * 8,
              }}
              py={1}
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
                    creator={comment.comment.creator}
                    opId={comment.comment.post.creator_id}
                  >
                    <SmallVoteIcons
                      upvotes={comment.comment.counts.upvotes}
                      downvotes={comment.comment.counts.downvotes}
                      myVote={comment.comment.my_vote as ILemmyVote}
                    />
                  </AvatarUsername>
                  {!comment.collapsed ? (
                    <HStack alignItems="center" space={2}>
                      <CommentContextMenu
                        isShortPress
                        options={commentHook.longPressOptions}
                        onPress={({ nativeEvent }) => {
                          commentHook.onCommentLongPress(nativeEvent.actionKey);
                        }}
                      >
                        <IconButtonWithText
                          icon={
                            <IconDots
                              size={24}
                              color={theme.colors.app.textSecondary}
                            />
                          }
                        />
                      </CommentContextMenu>
                      <Text color={theme.colors.app.textSecondary}>
                        {timeFromNowShort(comment.comment.comment.published)}
                      </Text>
                    </HStack>
                  ) : (
                    <IconChevronDown
                      size={24}
                      color={theme.colors.app.textSecondary}
                    />
                  )}
                </HStack>
                {comment.collapsed ? (
                  <CommentCollapsed />
                ) : (
                  <>
                    <CommentBody
                      deleted={comment.comment.comment.deleted}
                      removed={comment.comment.comment.removed}
                      content={comment.comment.comment.content}
                      instance={getBaseUrl(comment.comment.comment.ap_id)}
                    />
                    {settings.showCommentActions && (
                      <HStack justifyContent="flex-end" space={2} mb={1}>
                        <IconButtonWithText
                          onPressHandler={commentHook.onReply}
                          icon={
                            <IconMessagePlus
                              color={theme.colors.app.accent}
                              size={22}
                            />
                          }
                        />
                        <VoteButton
                          onPressHandler={async () =>
                            comment.comment.my_vote === 1
                              ? commentHook.onVote(0)
                              : commentHook.onVote(1)
                          }
                          type="upvote"
                          isVoted={comment.comment.my_vote === 1}
                          isAccented
                          iconSize={22}
                        />
                        <VoteButton
                          onPressHandler={async () =>
                            comment.comment.my_vote === -1
                              ? commentHook.onVote(0)
                              : commentHook.onVote(-1)
                          }
                          type="downvote"
                          isVoted={comment.comment.my_vote === -1}
                          isAccented
                          iconSize={22}
                          textSize="md"
                        />
                      </HStack>
                    )}
                  </>
                )}
              </VStack>
            </VStack>
          </Pressable>
        </CommentContextMenu>
      </SwipeableRow>
      <View
        style={{
          paddingLeft: depth * 12,
        }}
        backgroundColor={theme.colors.app.fg}
      >
        <Divider bg={theme.colors.app.border} />
      </View>
    </>
  );
}

const areEqual = (prev: IProps, next: IProps) =>
  prev.comment.comment.comment.id === next.comment.comment.comment.id &&
  prev.comment.comment.my_vote === next.comment.comment.my_vote &&
  prev.comment.collapsed === next.comment.collapsed &&
  prev.isUnreadReply === next.isUnreadReply &&
  prev.comment.comment.comment.deleted ===
    next.comment.comment.comment.deleted &&
  prev.comment.comment.comment.content === next.comment.comment.comment.content;

export default React.memo(CommentItem, areEqual);
