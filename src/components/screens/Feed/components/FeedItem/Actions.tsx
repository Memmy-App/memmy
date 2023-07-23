import { HStack } from "@components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";
import React, { useCallback } from "react";
import IconButtonWithText from "../../../../common/IconButtonWithText";
import VoteButton from "../../../../common/Vote/VoteButton";
import SFIcon from "../../../../common/icons/SFIcon";
import { ICON_MAP } from "../../../../../constants/IconMap";

interface Props {
  vote?: number;
  saved?: boolean;
  onSave: () => void;
  onVotePress: (vote: number) => void;
  id: number;
}
export function actions({ vote, saved, onSave, onVotePress, id }: Props) {
  const theme = useAppSelector(selectThemeOptions);

  const onUpvote = useCallback(() => {
    onVotePress(vote === 1 ? 0 : 1);
  }, [vote, id]);

  const onDownvote = useCallback(() => {
    onVotePress(vote === -1 ? 0 : -1);
  }, [vote, id]);

  return (
    <HStack space="xs" alignItems="center" justifyContent="flex-end">
      <IconButtonWithText
        icon={
          <SFIcon
            icon={ICON_MAP.SAVE}
            color={saved ? theme.colors.bookmarkText : theme.colors.accent}
          />
        }
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
