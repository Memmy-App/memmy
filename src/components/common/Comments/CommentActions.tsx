import { HStack } from "native-base";
import React from "react";
import { ICON_MAP } from "../../../constants/IconMap";
import { UseComment } from "../../../hooks/post/useComment";
import IconButtonWithText from "../IconButtonWithText";
import VoteButton from "../Vote/VoteButton";
import SFIcon from "../icons/SFIcon";

interface IProps {
  commentHook: UseComment;
  myVote: number;
}

function CommentActions({ commentHook, myVote }: IProps) {
  return (
    <HStack justifyContent="flex-end" alignItems="center" space={2} mb={1}>
      <IconButtonWithText
        onPressHandler={commentHook.onReply}
        icon={<SFIcon icon={ICON_MAP.REPLY} size={12} boxSize={20} />}
      />
      <VoteButton
        onPressHandler={async () =>
          myVote === 1 ? commentHook.onVote(0) : commentHook.onVote(1)
        }
        type="upvote"
        isVoted={myVote === 1}
        isAccented
        iconSize={12}
      />
      <VoteButton
        onPressHandler={async () =>
          myVote === -1 ? commentHook.onVote(0) : commentHook.onVote(-1)
        }
        type="downvote"
        isVoted={myVote === -1}
        isAccented
        iconSize={12}
      />
    </HStack>
  );
}

export default React.memo(CommentActions);
