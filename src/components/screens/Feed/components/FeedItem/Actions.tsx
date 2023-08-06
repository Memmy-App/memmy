import { HStack } from "@src/components/common/Gluestack";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import React, { useCallback, useMemo } from "react";
import { ICON_MAP } from "../../../../../constants/IconMap";
import IconButtonWithText from "../../../../common/IconButtonWithText";
import VoteButton from "../../../../common/Vote/VoteButton";
import SFIcon from "../../../../common/icons/SFIcon";

interface Props {
  vote?: number;
  saved?: boolean;
  onSave: () => void;
  onVotePress: (vote: number) => void;
  id: number;
}

export function actions({ vote, saved, onSave, onVotePress, id }: Props) {
  const theme = useThemeOptions();

  const onUpvote = useCallback(() => {
    onVotePress(vote === 1 ? 0 : 1);
  }, [vote, id]);

  const onDownvote = useCallback(() => {
    onVotePress(vote === -1 ? 0 : -1);
  }, [vote, id]);

  const saveIcon = useMemo(
    () => (
      <SFIcon
        icon={ICON_MAP.SAVE}
        color={saved ? theme.colors.bookmarkText : theme.colors.accent}
      />
    ),
    [saved]
  );

  return (
    <HStack space="xs" alignItems="center" justifyContent="flex-end">
      <IconButtonWithText
        icon={saveIcon}
        iconBgColor={saved ? theme.colors.bookmark : theme.colors.fg}
        onPressHandler={onSave}
      />
      <VoteButton
        onPressHandler={onUpvote}
        type="upvote"
        isVoted={vote === 1}
        isAccented
      />
      <VoteButton
        onPressHandler={onDownvote}
        type="downvote"
        isVoted={vote === -1}
        isAccented
      />
    </HStack>
  );
}

export const Actions = React.memo(actions);
