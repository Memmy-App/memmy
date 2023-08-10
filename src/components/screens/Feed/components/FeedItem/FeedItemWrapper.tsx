import React, { useCallback, useMemo } from "react";
import {
  useFeedPostRead,
  useFeedPostSaved,
  useFeedPostVote,
  useFeedStore,
} from "@src/state/feed/feedStore";
import { useRoute } from "@react-navigation/core";
import { useSettingsStore } from "@src/state/settings/settingsStore";
import setFeedRead from "@src/state/feed/actions/setFeedRead";
import { setFeedCommentsRead } from "@src/state/feed/actions";
import { Pressable } from "react-native";
import { useFeedVote } from "@src/hooks/feed";
import ILemmyVote from "@src/types/api/ILemmyVote";
import { VoteOption } from "@src/components/common/SwipeableRow/VoteOption";
import { ReplyOption } from "@src/components/common/SwipeableRow/ReplyOption";
import { View } from "@src/components/gluestack";
import { SwipeableRow } from "@src/components/common/SwipeableRow/SwipeableRow";

interface IProps {
  postId: number;
  children: React.ReactNode;
}

function ItemWrapper({ postId, children }: IProps) {
  const { key } = useRoute();
  const markReadOnView = useSettingsStore((state) => state.markReadOnPostView);

  const postVote = useFeedPostVote(key, postId);
  const postSaved = useFeedPostSaved(key, postId);
  const postRead = useFeedPostRead(key, postId);

  const onVote = useFeedVote(postId);

  const onSwipe = useCallback(
    (value: ILemmyVote): void => {
      onVote(value, false);
    },
    [postVote, postId]
  );

  const leftOption = useMemo(
    () => <VoteOption onVote={onSwipe} vote={postVote} />,
    [postVote, postId]
  );

  const rightOption = useMemo(
    () => (
      <ReplyOption onReply={() => {}} onExtra={() => {}} extraType="Save" />
    ),
    [postId, postSaved]
  );

  const onPress = useCallback(() => {
    if (!postRead && markReadOnView) setFeedRead(key, postId);

    setFeedCommentsRead(key, postId);
  }, [postId, postRead, markReadOnView]);

  return (
    <View py="$1">
      <SwipeableRow leftOption={leftOption} rightOption={rightOption}>
        <Pressable onPress={onPress}>{children}</Pressable>
      </SwipeableRow>
    </View>
  );
}

export const FeedItemWrapper = React.memo(ItemWrapper);
