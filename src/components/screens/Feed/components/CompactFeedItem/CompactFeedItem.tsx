import {
  HStack,
  Pressable,
  Text,
  VStack,
  View,
} from "@src/components/common/Gluestack";
import React, { useCallback, useMemo } from "react";

import { useRoute } from "@react-navigation/core";
import {
  useSettingsStore,
  useThemeOptions,
} from "@src/stores/settings/settingsStore";
import removeMd from "remove-markdown";
import {
  ExtensionType,
  getBaseUrl,
  getLinkInfo,
} from "../../../../../helpers/LinkHelper";
import useFeedItem from "../../../../../hooks/feeds/useFeedItem";
import CompactFeedItemFooter from "./CompactFeedItemFooter";
import CompactFeedItemThumbnail from "./CompactFeedItemThumbnail";
import CompactFeedItemVote from "./CompactFeedItemVote";

import {
  useFeedPostInfo,
  useFeedPostRead,
  useFeedPostSaved,
  useFeedPostVote,
} from "../../../../../stores/feeds/feedsStore";
import { ILemmyVote } from "../../../../../types/lemmy/ILemmyVote";
import { Box } from "../../../../common/Gluestack";
import { ReplyOption } from "../../../../common/SwipeableRow/ReplyOption";
import { SwipeableRow } from "../../../../common/SwipeableRow/SwipeableRow";
import { VoteOption } from "../../../../common/SwipeableRow/VoteOption";

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

  const linkInfo = useMemo(() => getLinkInfo(postInfo.url), [postId]);
  const showLink =
    linkInfo.extType === ExtensionType.VIDEO ||
    linkInfo.extType === ExtensionType.GENERIC;

  const postTitle = removeMd(postInfo.name);

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

            <VStack flex={1} justifyContent="space-around">
              <Text
                fontWeight={fontWeightPostTitle}
                size="sm"
                color={
                  postRead
                    ? theme.colors.textSecondary
                    : theme.colors.textPrimary
                }
              >
                {postTitle}
                {showLink && (
                  <Text color={theme.colors.textSecondary} size="sm">
                    {" "}
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
                id={postInfo.id}
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
