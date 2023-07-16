import React from "react";
import { HStack, useTheme } from "native-base";
import { IconMessagePlus } from "tabler-icons-react-native";
import IconButtonWithText from "../IconButtonWithText";
import VoteButton from "../Vote/VoteButton";
import { ILemmyVote } from "../../../types/lemmy/ILemmyVote";

interface IProps {
  onReply: () => unknown;
  onVote: (value: ILemmyVote) => unknown;
  myVote: ILemmyVote;
}

function CommentActions({ onReply, onVote, myVote }: IProps) {
  const theme = useTheme();

  return (
    <HStack justifyContent="flex-end" space={2} mb={1}>
      <IconButtonWithText
        onPressHandler={onReply}
        icon={<IconMessagePlus color={theme.colors.app.accent} size={22} />}
      />
      <VoteButton
        onPressHandler={async () => (myVote === 1 ? onVote(0) : onVote(1))}
        type="upvote"
        isVoted={myVote === 1}
        isAccented
        iconSize={22}
      />
      <VoteButton
        onPressHandler={async () => (myVote === -1 ? onVote(0) : onVote(-1))}
        type="downvote"
        isVoted={myVote === -1}
        isAccented
        iconSize={22}
        textSize="md"
      />
    </HStack>
  );
}

export default React.memo(CommentActions);
