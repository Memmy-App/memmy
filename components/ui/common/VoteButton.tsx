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
}

function VoteButton({ onPressHandler, type, isVoted, text }: VoteButtonProps) {
  const { colors } = useTheme();

  const voteColor =
    type === "upvote" ? colors.app.upvoteColor : colors.app.downvoteColor;

  const icon =
    type === "upvote" ? (
      <IconArrowUp
        color={isVoted ? colors.white : colors.app.secondaryText}
        size={25}
      />
    ) : (
      <IconArrowDown
        color={isVoted ? colors.white : colors.app.secondaryText}
        size={25}
      />
    );

  return (
    <IconButtonWithText
      onPressHandler={onPressHandler}
      icon={icon}
      iconBgColor={isVoted ? voteColor : colors.screen[800]}
      text={text}
      textColor={isVoted ? voteColor : colors.app.secondaryText}
    />
  );
}

export default VoteButton;
