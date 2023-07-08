import { PostView } from "lemmy-js-client";
import { Box, HStack, Text, useTheme } from "native-base";
import React, { useRef } from "react";
import { IconMessage } from "tabler-icons-react-native";
import { timeFromNowShort } from "../../../../../helpers/TimeHelper";
import { ILemmyVote } from "../../../../../types/lemmy/ILemmyVote";
import CommunityLink from "../../../../common/CommunityLink";
import AvatarUsername from "../../../../common/AvatarUsername";
import FeaturedIndicator from "../../../../common/FeaturedIndicator";
import { IconBookCheck } from "../../../../common/icons/IconBookCheck";
import SmallVoteIcons from "../../../../common/Vote/SmallVoteIcons";

interface CompactFeedItemFooterProps {
  post: PostView;
}

function CompactFeedItemFooter({ post }: CompactFeedItemFooterProps) {
  const { colors } = useTheme();

  const initialVote = useRef(post.my_vote);

  return (
    <>
      <HStack alignItems="center" space={2}>
        <HStack>
          <FeaturedIndicator
            featured={post.post.featured_community || post.post.featured_local}
          />
          {post.read && (
            <Box mr={1}>
              <IconBookCheck color={colors.app.accent} size={20} />
            </Box>
          )}
          <AvatarUsername
            creator={post.creator}
            showAvatar={false}
            link={false}
          />
        </HStack>
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
          initialVote={initialVote.current}
        />
        <HStack alignItems="center" space={1}>
          <IconMessage color={colors.app.textSecondary} size={16} />
          <Text color={colors.app.textSecondary}>{post.counts.comments}</Text>
        </HStack>
        <CommunityLink community={post.community} />
      </HStack>
    </>
  );
}

export default CompactFeedItemFooter;
