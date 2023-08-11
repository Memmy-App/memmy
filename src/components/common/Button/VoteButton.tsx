import { Text } from "@src/components/gluestack";
import React, { useMemo } from "react";
import { GestureResponderEvent } from "react-native";
import { useThemeOptions } from "@src/state/settings/settingsStore";
import { ICON_MAP } from "@src/types/constants/IconMap";
import IconButtonWithText from "@src/components/common/Button/IconButtonWithText";

interface VoteButtonProps {
  onPressHandler: (event: GestureResponderEvent) => void;
  type: "upvote" | "downvote";
  isVoted: boolean;
  text?: string;
  isAccented?: boolean;
  size?: React.ComponentProps<typeof Text>["size"];
}

function VoteButton({
  onPressHandler,
  type,
  isVoted,
  text,
  isAccented,
  size = "lg",
}: VoteButtonProps) {
  const { colors } = useThemeOptions();

  const color = useMemo(
    () => (isAccented ? colors.accent : colors.textSecondary),
    [isAccented]
  );

  const voteColor = useMemo(
    () => (type === "upvote" ? colors.upvote : colors.downvote),
    [type]
  );

  return (
    <IconButtonWithText
      onPress={onPressHandler}
      icon={type === "upvote" ? ICON_MAP.UPVOTE : ICON_MAP.DOWNVOTE}
      iconBgColor={isVoted ? voteColor : "transparent"}
      text={text}
      size={size}
      textColor={isVoted ? voteColor : color}
    />
  );
}

export default React.memo(VoteButton);
