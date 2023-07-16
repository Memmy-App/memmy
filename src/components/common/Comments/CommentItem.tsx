import { Divider, Pressable, useTheme, View, VStack } from "native-base";
import React from "react";
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
import CommentActions from "./CommentActions";
import CommentHeader from "./CommentHeader";

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
              <CommentHeader
                myVote={comment.comment.my_vote as ILemmyVote}
                collapsed={comment.collapsed}
                counts={comment.comment.counts}
                opId={comment.comment.post.creator_id}
                creator={comment.comment.creator}
                onButtonPress={commentHook.onCommentLongPress}
                published={comment.comment.comment.published}
              />
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
                    <CommentActions
                      onVote={commentHook.onVote}
                      onReply={commentHook.onReply}
                      myVote={comment.comment.my_vote as ILemmyVote}
                    />
                  )}
                </>
              )}
            </VStack>
          </VStack>
        </Pressable>
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
