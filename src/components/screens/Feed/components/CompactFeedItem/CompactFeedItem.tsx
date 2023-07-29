import React, { useCallback, useMemo } from "react";
import {
  HStack,
  Pressable,
  Text,
  View,
  VStack,
} from "@src/components/common/Gluestack";
import { useWindowDimensions } from "react-native";

import { useRoute } from "@react-navigation/core";
import {
  useSettingsStore,
  useThemeOptions,
} from "@src/stores/settings/settingsStore";
import useFeedItem from "../../../../../hooks/feeds/useFeedItem";
import {
  ExtensionType,
  getBaseUrl,
  getLinkInfo,
} from "../../../../../helpers/LinkHelper";
import CompactFeedItemThumbnail from "./CompactFeedItemThumbnail";
import CompactFeedItemVote from "./CompactFeedItemVote";
import CompactFeedItemFooter from "./CompactFeedItemFooter";

import { fontSizeMap } from "../../../../../theme/fontSize";
import { VoteOption } from "../../../../common/SwipeableRow/VoteOption";
import { ReplyOption } from "../../../../common/SwipeableRow/ReplyOption";
import { SwipeableRow } from "../../../../common/SwipeableRow/SwipeableRow";
import { ILemmyVote } from "../../../../../types/lemmy/ILemmyVote";
import {
  useFeedPostInfo,
  useFeedPostRead,
  useFeedPostSaved,
  useFeedPostVote,
} from "../../../../../stores/feeds/feedsStore";
import { Box } from "../../../../common/Gluestack";

function CompactFeedItem({ postId }: { postId: number }) {
  const {
    compactThumbnailPosition,
    compactShowVotingButtons,
    fontWeightPostTitle,
  } = useSettingsStore((state) => ({
    compactThumbnailPosition: state.settings.compactThumbnailPosition,
    compactShowVotingButtons: state.settings.compactShowVotingButtons,
    fontWeightPostTitle: state.settings.fontWeightPostTitle,
  }));

  const { key } = useRoute();

  const feedItem = useFeedItem(postId);

  const postVote = useFeedPostVote(key, postId);
  const postSaved = useFeedPostSaved(key, postId);
  const postInfo = useFeedPostInfo(key, postId);
  const postRead = useFeedPostRead(key, postId);

  const theme = useThemeOptions();

  const onSwipe = useCallback(
    (value: ILemmyVote) => {
      feedItem.onVotePress(value, false).then();
    },
    [postId]
  );

  const leftOption = useMemo(
    () => <VoteOption onVote={onSwipe} vote={postVote} />,
    [postVote, postId]
  );

  const rightOption = useMemo(
    () => (
      <ReplyOption
        onReply={feedItem.doReply}
        onExtra={feedItem.doSave}
        extraType="Save"
      />
    ),
    [postId, postSaved]
  );

  const { fontSize, isSystemTextSize } = useSettingsStore((state) => ({
    fontSize: state.settings.fontSize,
    isSystemTextSize: state.settings.isSystemTextSize,
  }));

  const { fontScale } = useWindowDimensions();
  const fontModifier = fontSizeMap[fontSize];
  const FONT_SIZE = isSystemTextSize ? 15 / fontScale : 15 + fontModifier;

  const linkInfo = useMemo(() => getLinkInfo(postInfo.url), [postId]);
  const showLink =
    linkInfo.extType === ExtensionType.VIDEO ||
    linkInfo.extType === ExtensionType.GENERIC;

  return (
    <View flex={1} my="$0.5">
      <SwipeableRow leftOption={leftOption} rightOption={rightOption}>
        <Pressable onPress={feedItem.onPress}>
          <HStack
            flex={1}
            px="$2"
            py="$1"
            backgroundColor={theme.colors.fg}
            space="sm"
          >
            {compactThumbnailPosition === "Left" && (
              <CompactFeedItemThumbnail
                postId={postId}
                linkInfo={feedItem.linkInfo}
              />
            )}

            <VStack flex={1}>
              <Text
                flex={1}
                fontSize={FONT_SIZE}
                fontWeight={fontWeightPostTitle}
                color={
                  postRead
                    ? theme.colors.textSecondary
                    : theme.colors.textPrimary
                }
              >
                {postInfo.name}{" "}
                {showLink && (
                  <Text
                    fontSize={FONT_SIZE - 1}
                    color={theme.colors.textSecondary}
                  >
                    ({getBaseUrl(linkInfo.link, true)})
                  </Text>
                )}
              </Text>

              <CompactFeedItemFooter postId={postId} />
            </VStack>

            {compactThumbnailPosition === "Right" && (
              <VStack alignItems="flex-start">
                <CompactFeedItemThumbnail
                  postId={postId}
                  linkInfo={feedItem.linkInfo}
                />
              </VStack>
            )}

            {compactShowVotingButtons && (
              <CompactFeedItemVote
                myVote={postVote as ILemmyVote}
                onVotePress={feedItem.onVotePress}
              />
            )}
            {postSaved && (
              <Box
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  backgroundColor: "transparent",
                  width: 0,
                  height: 0,
                  borderTopColor: theme.colors.bookmark,
                  borderTopWidth: 15,
                  borderLeftWidth: 15,
                  borderLeftColor: "transparent",
                }}
              />
            )}
          </HStack>
        </Pressable>
      </SwipeableRow>
    </View>
  );
}

export default React.memo(CompactFeedItem);
