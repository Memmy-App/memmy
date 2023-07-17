import { useTheme } from "native-base";
import React from "react";
import { GestureResponderEvent } from "react-native";
import { IconArrowDown, IconArrowUp } from "tabler-icons-react-native";
import { IFontSize } from "native-base/lib/typescript/theme/base/typography";
import IconButtonWithText from "../IconButtonWithText";

interface VoteButtonProps {
  onPressHandler: (event: GestureResponderEvent) => void;
  type: "upvote" | "downvote";
  isVoted: boolean;
  text?: string | number;
  isAccented?: boolean;
  textSize?: IFontSize;
  iconSize?: number;
}

function VoteButton({
  onPressHandler,
  type,
  isVoted,
  text,
  isAccented,
  textSize = "lg",
  iconSize = 25,
}: VoteButtonProps) {
  const { colors } = useTheme();

  const color = isAccented ? colors.app.accent : colors.app.textSecondary;

  const voteColor = type === "upvote" ? colors.app.upvote : colors.app.downvote;

  const icon =
    type === "upvote" ? (
      <IconArrowUp
        color={isVoted ? colors.app.upvoteText : color}
        size={iconSize}
      />
    ) : (
      <IconArrowDown
        color={isVoted ? colors.app.downvoteText : color}
        size={iconSize}
      />
    );

  return (
    <IconButtonWithText
      onPressHandler={onPressHandler}
      icon={icon}
      iconBgColor={isVoted ? voteColor : "transparent"}
      text={text}
      textSize={textSize}
      textColor={isVoted ? voteColor : color}
    />
  );
}

export default React.memo(VoteButton);
