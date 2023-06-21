import React from "react";
import { PostView } from "lemmy-js-client";
import { Text, useTheme, VStack } from "native-base";
import { useFeed } from "../../hooks/feeds/feedsHooks";
import useFeedItem from "../../hooks/feeds/useFeedItem";

function CompactFeedItem({ post }: { post: PostView }) {
  const feedItem = useFeedItem(post);
  const theme = useTheme();

  const isUpvoted = post.my_vote === 1;
  const isDownvoted = post.my_vote === -1;

  return (
    <VStack
      flex={1}
      my={1.5}
      backgroundColor={theme.colors.app.backgroundSecondary}
    >
      <Text />
    </VStack>
  );
}

export default CompactFeedItem;
