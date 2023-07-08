import {
  Divider,
  HStack,
  Pressable,
  Text,
  useTheme,
  VStack,
} from "native-base";
import React, { useRef } from "react";
import {
  IconChevronDown,
  IconDots,
  IconMessagePlus,
} from "tabler-icons-react-native";
import { timeFromNowShort } from "../../../helpers/TimeHelper";
import useComment from "../../../hooks/post/useComment";
import ILemmyComment from "../../../types/lemmy/ILemmyComment";
import { ILemmyVote } from "../../../types/lemmy/ILemmyVote";
import AvatarUsername from "../AvatarUsername";
import IconButtonWithText from "../IconButtonWithText";
import { ReplyOption } from "../SwipeableRow/ReplyOption";
import { SwipeableRow } from "../SwipeableRow/SwipeableRow";
import { VoteOption } from "../SwipeableRow/VoteOption";
import SmallVoteIcons from "../Vote/SmallVoteIcons";
import VoteButton from "../Vote/VoteButton";
import CommentBody from "./CommentBody";
import CommentCollapsed from "./CommentCollapsed";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import { useAppSelector } from "../../../../store";

interface IProps {
  comment: ILemmyComment;
  setComments: any;
  onPressOverride?: () => Promise<void> | void;
  depth?: number;
  opId?: number;
  isUnreadReply?: boolean;
}

function CommentItem({
  comment,
  setComments,
  onPressOverride,
  opId,
  depth,
  isUnreadReply,
}: IProps) {
  const theme = useTheme();
  const settings = useAppSelector(selectSettings);

  const initialVote = useRef(comment.comment.my_vote);

  if (!depth) {
    depth = comment.comment.comment.path.split(".").length;
  }

  const commentHook = useComment({
    comment,
    setComments,
    onPressOverride,
  });

  const myVote = comment.comment.my_vote;

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
        <Pressable
          onPress={commentHook.onCommentPress}
          onLongPress={commentHook.onCommentLongPress}
        >
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
                <AvatarUsername creator={comment.comment.creator} opId={opId}>
                  <SmallVoteIcons
                    upvotes={comment.comment.counts.upvotes}
                    downvotes={comment.comment.counts.downvotes}
                    myVote={comment.comment.my_vote as ILemmyVote}
                    initialVote={initialVote.current}
                  />
                </AvatarUsername>
                {!comment.collapsed ? (
                  <HStack alignItems="center" space={2}>
                    <IconButtonWithText
                      onPressHandler={commentHook.onCommentLongPress}
                      icon={
                        <IconDots
                          size={24}
                          color={theme.colors.app.textSecondary}
                        />
                      }
                    />
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
                          myVote === 1
                            ? commentHook.onVote(0)
                            : commentHook.onVote(1)
                        }
                        type="upvote"
                        isVoted={myVote === 1}
                        isAccented
                        iconSize={22}
                      />
                      <VoteButton
                        onPressHandler={async () =>
                          myVote === -1
                            ? commentHook.onVote(0)
                            : commentHook.onVote(-1)
                        }
                        type="downvote"
                        isVoted={myVote === -1}
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
      </SwipeableRow>
      <Divider bg={theme.colors.app.border} />
    </>
  );
}

const areEqual = (prev: IProps, next: IProps) =>
  prev.comment.comment.comment.id === next.comment.comment.comment.id &&
  prev.comment.comment.my_vote === next.comment.comment.my_vote &&
  prev.comment.collapsed === next.comment.collapsed &&
  prev.isUnreadReply === next.isUnreadReply;

export default React.memo(CommentItem, areEqual);
