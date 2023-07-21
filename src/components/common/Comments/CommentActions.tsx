import { HStack } from "native-base";
import React, { useCallback } from "react";
import { ICON_MAP } from "../../../constants/IconMap";
import IconButtonWithText from "../IconButtonWithText";
import VoteButton from "../Vote/VoteButton";
import SFIcon from "../icons/SFIcon";
import { ILemmyVote } from "../../../types/lemmy/ILemmyVote";

interface IProps {
  onVote: (value: ILemmyVote) => void;
  myVote: number;
}

function CommentActions({ onVote, myVote }: IProps) {
  const onUpvote = useCallback(() => {
    onVote(1);
  }, [onVote]);

  const onDownvote = useCallback(() => {
    onVote(-1);
  }, [onVote]);

  return (
    <HStack justifyContent="flex-end" alignItems="center" space={2} mb={1}>
      <IconButtonWithText
        onPressHandler={() => {}}
        icon={<SFIcon icon={ICON_MAP.REPLY} size={12} boxSize={20} />}
      />
      {onVote && (
        <>
          <VoteButton
            onPressHandler={onUpvote}
            type="upvote"
            isVoted={myVote === 1}
            isAccented
            iconSize={12}
          />
          <VoteButton
            onPressHandler={onDownvote}
            type="downvote"
            isVoted={myVote === -1}
            isAccented
            iconSize={12}
          />
        </>
      )}
    </HStack>
  );
}

export default React.memo(CommentActions);
