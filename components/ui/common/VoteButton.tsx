import { useTheme } from "native-base";
import React from "react";
import { GestureResponderEvent } from "react-native";
import { IconArrowDown, IconArrowUp } from "tabler-icons-react-native";
import IconButtonWithText from "./IconButtonWithText";

interface VoteButtonProps {
  onPressHandler: (event: GestureResponderEvent) => void;
  type: "upvote" | "downvote";
  isVoted: boolean;
  text?: string | number;
  isAccented?: boolean;
}

function VoteButton({
  onPressHandler,
  type,
  isVoted,
  text,
  isAccented,
}: VoteButtonProps) {
  const { colors } = useTheme();

  const color = isAccented ? colors.app.accent : colors.app.textSecondary;

  const voteColor =
    type === "upvote" ? colors.app.upvoteColor : colors.app.downvoteColor;

  const icon =
    type === "upvote" ? (
      <IconArrowUp color={isVoted ? colors.white : color} size={25} />
    ) : (
      <IconArrowDown color={isVoted ? colors.white : color} size={25} />
    );

  return (
    <IconButtonWithText
      onPressHandler={onPressHandler}
      icon={icon}
      iconBgColor={isVoted ? voteColor : colors.app.bgSecondary}
      text={text}
      textColor={isVoted ? voteColor : color}
    />
  );
}

export default VoteButton;
