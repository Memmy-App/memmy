import { Divider, HStack, useTheme, View } from "native-base";
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
import { CommentContextMenu } from "./CommentContextMenu";
import AvatarUsername from "../AvatarUsername";
import SmallVoteIcons from "../Vote/SmallVoteIcons";
import IconButtonWithText from "../IconButtonWithText";
import VoteButton from "../Vote/VoteButton";
import CommentWrapper from "./CommentWrapper";
import CommentHeaderWrapper from "./CommentHeader/CommentHeaderWrapper";
import SFIcon from "../icons/SFIcon";
import CommentHeaderRight from "./CommentHeader/CommentHeaderRight";

interface IProps {
  comment: ILemmyComment;
  setComments: any;
  modList: number[];
  onPressOverride?: () => Promise<void> | void;
  depth?: number;
  isUnreadReply?: boolean;
}

function CommentItem({
  comment,
  setComments,
  modList,
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
          <CommentWrapper
            depth={depth}
            onCommentPress={commentHook.onCommentPress}
          >
            <CommentHeaderWrapper>
              <HStack space={1}>
                <AvatarUsername
                  creator={comment.comment.creator}
                  opId={comment.comment.post.creator_id}
                  isMod={modList?.includes(comment.comment.creator.id)}
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
                  <HStack justifyContent="flex-end" space={2} mb={1}>
                    <IconButtonWithText
                      onPressHandler={commentHook.onReply}
                      icon={<SFIcon icon="plus.message" />}
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
