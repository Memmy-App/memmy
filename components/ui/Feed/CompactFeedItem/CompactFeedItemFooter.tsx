import { PostView } from "lemmy-js-client";
import { HStack, Text, useTheme } from "native-base";
import React, { useRef } from "react";
import { IconMessage } from "tabler-icons-react-native";
import { timeFromNowShort } from "../../../../helpers/TimeHelper";
import { ILemmyVote } from "../../../../lemmy/types/ILemmyVote";
import CommunityLink from "../../CommunityLink";
import AvatarUsername from "../../common/AvatarUsername";
import SmallVoteIcons from "../../common/SmallVoteIcons";
import FeaturedIndicator from "../../common/FeaturedIndicator";

interface CompactFeedItemFooterProps {
  post: PostView;
}

function CompactFeedItemFooter({ post }: CompactFeedItemFooterProps) {
  const { colors } = useTheme();

  const initialVote = useRef(post.my_vote);

  return (
    <>
      <HStack alignItems="center" space={2}>
        <FeaturedIndicator post={post} />
        <AvatarUsername creator={post.creator} showAvatar={false} />
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
        <CommunityLink
          community={post.community}
          color={colors.app.textSecondary}
        />
      </HStack>
    </>
  );
}

export default CompactFeedItemFooter;
