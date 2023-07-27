import { Divider, HStack, View } from "@src/components/common/Gluestack";
import React, { useMemo } from "react";
import {
  useSettingsStore,
  useThemeOptions,
} from "@src/stores/settings/settingsStore";
import { getBaseUrl } from "@src/helpers/LinkHelper";
import VoteData from "@src/components/common/Vote/VoteData";
import { ILemmyVote } from "@src/types/lemmy/ILemmyVote";
import useComment from "../../../hooks/comments/useComment";
import ILemmyComment from "../../../types/lemmy/ILemmyComment";
import AvatarUsername from "../AvatarUsername";
import { ReplyOption } from "../SwipeableRow/ReplyOption";
import { SwipeableRow } from "../SwipeableRow/SwipeableRow";
import { VoteOption } from "../SwipeableRow/VoteOption";
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
  const theme = useThemeOptions();

  const showCommentActions = useSettingsStore(
    (state) => state.settings.showCommentActions
  );

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
    [comment.comment.comment.id, comment.comment.my_vote]
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
          isButton={false}
          onPress={({ nativeEvent }) => {
            commentHook.onCommentLongPress(nativeEvent.actionKey);
          }}
          options={commentHook.longPressOptions}
        >
          <CommentWrapper depth={depth} onCommentPress={onPress}>
            <CommentHeaderWrapper>
              <HStack space="xs">
                <AvatarUsername
                  creator={comment.comment.creator}
                  opId={comment.comment.post.creator_id}
                />
                <VoteData
                  data={comment.comment.counts}
                  myVote={comment.myVote}
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
                {showCommentActions && (
                  <CommentActions
                    onVote={onVote}
                    myVote={comment.comment.my_vote}
                    onReply={commentHook.onReply}
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
        backgroundColor={theme.colors.fg}
      >
        <Divider bg={theme.colors.border} />
      </View>
    </>
  );
}

export default React.memo(CommentItem);
