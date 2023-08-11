import { HStack } from "@src/components/gluestack";
import React, { useCallback, useMemo } from "react";
import { useThemeOptions } from "@src/state/settings/settingsStore";
import { ICON_MAP } from "@src/types/constants/IconMap";
import IconButtonWithText from "@src/components/common/Button/IconButtonWithText";
import VoteButton from "@src/components/common/Button/VoteButton";
import { useFeedVote, useOnFeedSave } from "@src/hooks/feed";
import { useFeedPostSaved, useFeedPostVote } from "@src/state/feed/feedStore";
import { useRoute } from "@react-navigation/core";

interface IProps {
  postId: number;
}

export function Actions({ postId }: IProps): React.JSX.Element {
  const { key } = useRoute();

  const theme = useThemeOptions();

  const onVote = useFeedVote(postId);
  const onSave = useOnFeedSave(postId);

  const vote = useFeedPostVote(key, postId);
  const saved = useFeedPostSaved(key, postId);

  const onUpvote = useCallback(() => {
    onVote(1, true);
  }, [postId]);

  const onDownvote = useCallback(() => {
    onVote(-1, true);
  }, [postId]);

  const saveBgColor = useMemo(
    () => (saved ? theme.colors.bookmark : theme.colors.fg),
    [saved]
  );

  return (
    <HStack space="xs" alignItems="center" justifyContent="flex-end">
      <IconButtonWithText
        icon={ICON_MAP.SAVE}
        iconBgColor={saveBgColor}
        onPress={onSave}
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

export const FeedItemActions = React.memo(Actions);
