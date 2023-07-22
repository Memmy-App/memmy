import { Divider, HStack, useTheme, View } from "native-base";
import React, { useMemo } from "react";
import { useAppSelector } from "../../../../store";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import useComment from "../../../hooks/comments/useComment";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import ILemmyComment from "../../../types/lemmy/ILemmyComment";
import { ILemmyVote } from "../../../types/lemmy/ILemmyVote";
import AvatarUsername from "../AvatarUsername";
import { ReplyOption } from "../SwipeableRow/ReplyOption";
import { SwipeableRow } from "../SwipeableRow/SwipeableRow";
import { VoteOption } from "../SwipeableRow/VoteOption";
import SmallVoteIcons from "../Vote/SmallVoteIcons";
import CommentActions from "./CommentActions";
import CommentBody from "./CommentBody";
import CommentCollapsed from "./CommentCollapsed";
import { CommentContextMenu } from "./CommentContextMenu";
import CommentHeaderRight from "./CommentHeader/CommentHeaderRight";
import CommentHeaderWrapper from "./CommentHeader/CommentHeaderWrapper";
import CommentWrapper from "./CommentWrapper";

interface IProps {
  comment: ILemmyComment;
  depth?: number;
  isUnreadReply?: boolean;
  onVote: (value: ILemmyVote) => void;
  onPress: () => unknown;
}

function CommentItem({
  comment,
  depth,
  isUnreadReply,
  onVote,
  onPress,
}: IProps) {
  const theme = useTheme();
  const settings = useAppSelector(selectSettings);

  if (!depth) {
    depth = comment.comment.comment.path.split(".").length;
  }

  const commentHook = useComment({
    comment,
  });

  const voteOption = useMemo(
    () =>
      onVote ? (
        <VoteOption onVote={onVote} vote={comment.comment.my_vote} />
      ) : undefined,
    [comment.comment.comment.id]
  );

  return (
    <>
      <SwipeableRow
        leftOption={voteOption}
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
          <CommentWrapper depth={depth} onCommentPress={onPress}>
            <CommentHeaderWrapper>
              <HStack space={1}>
                <AvatarUsername
                  creator={comment.comment.creator}
                  opId={comment.comment.post.creator_id}
                />
                <SmallVoteIcons
                  upvotes={comment.comment.counts.upvotes}
                  downvotes={comment.comment.counts.downvotes}
                  myVote={comment.comment.my_vote as ILemmyVote}
                />
              </HStack>
              <CommentHeaderRight
                published={comment.comment.comment.published}
                onPress={commentHook.onCommentLongPress}
                contextOptions={commentHook.longPressOptions}
                collapsed={comment.collapsed}
              />
            </CommentHeaderWrapper>
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
                    onVote={onVote}
                    myVote={comment.comment.my_vote}
                  />
                )}
              </>
            )}
          </CommentWrapper>
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

export default React.memo(CommentItem);
