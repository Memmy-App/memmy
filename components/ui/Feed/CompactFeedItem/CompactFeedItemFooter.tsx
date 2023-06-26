import { PostView } from "lemmy-js-client";
import { HStack, Text, useTheme } from "native-base";
import React from "react";
import FastImage from "react-native-fast-image";
import { IconMessage, IconPlanet, IconUser } from "tabler-icons-react-native";
import { truncateName } from "../../../../helpers/TextHelper";
import { timeFromNowShort } from "../../../../helpers/TimeHelper";
import SmallVoteIcons from "../../common/SmallVoteIcons";
import { ILemmyVote } from "../../../../lemmy/types/ILemmyVote";

interface CompactFeedItemFooterProps {
  post: PostView;
}

function CompactFeedItemFooter({ post }: CompactFeedItemFooterProps) {
  const { colors } = useTheme();

  return (
    <>
      <HStack alignItems="center" space={2}>
        {(post.creator.avatar && (
          <FastImage
            source={{
              uri: post.creator.avatar,
            }}
            style={{ height: 19, width: 19, borderRadius: 100 }}
          />
        )) || <IconUser size={19} color={colors.app.textSecondary} />}
        <Text fontWeight="semibold">{truncateName(post.creator.name)}</Text>
        <Text color={colors.app.textSecondary}>•</Text>
        <Text color={colors.app.textSecondary}>
          {timeFromNowShort(post.post.published)}
        </Text>
      </HStack>
      <HStack flex={1} alignItems="center" space={2}>
        <SmallVoteIcons
          upvotes={post.counts.upvotes}
          downvotes={post.counts.downvotes}
          myVote={post.my_vote as ILemmyVote}
        />
        <HStack alignItems="center" space={1}>
          <IconMessage color={colors.app.textSecondary} size={16} />
          <Text>{post.counts.comments}</Text>
        </HStack>
        <HStack alignItems="center" space={1}>
          <IconPlanet color={colors.app.textSecondary} size={16} />
          <Text>{truncateName(post.community.name)}</Text>
        </HStack>
      </HStack>
    </>
  );
}

export default CompactFeedItemFooter;
