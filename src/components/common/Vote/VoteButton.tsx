import { useTheme } from "native-base";
import { IFontSize } from "native-base/lib/typescript/theme/base/typography";
import React, { useMemo } from "react";
import { GestureResponderEvent } from "react-native";
import IconButtonWithText from "../IconButtonWithText";
import SFIcon from "../icons/SFIcon";
import { ICON_MAP } from "../../../constants/IconMap";

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
  iconSize = 16,
}: VoteButtonProps) {
  const { colors } = useTheme();

  const color = isAccented ? colors.app.accent : colors.app.textSecondary;

  const voteColor = type === "upvote" ? colors.app.upvote : colors.app.downvote;

  const icon = useMemo(
    () =>
      type === "upvote" ? (
        <SFIcon
          icon={ICON_MAP.UPVOTE}
          color={isVoted ? colors.app.upvoteText : color}
          size={iconSize}
        />
      ) : (
        <SFIcon
          icon={ICON_MAP.DOWNVOTE}
          color={isVoted ? colors.app.downvoteText : color}
          size={iconSize}
        />
      ),
    [isVoted]
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
