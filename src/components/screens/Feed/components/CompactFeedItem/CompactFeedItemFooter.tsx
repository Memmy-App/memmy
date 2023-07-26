import { PostView } from "lemmy-js-client";
import { Box, HStack, Text } from "@src/components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";
import React from "react";
import { timeFromNowShort } from "../../../../../helpers/TimeHelper";
import { ILemmyVote } from "../../../../../types/lemmy/ILemmyVote";
import AvatarUsername from "../../../../common/AvatarUsername";
import CommentCount from "../../../../common/Comments/CommentCount";
import CommunityLink from "../../../../common/CommunityLink";
import FeaturedIndicator from "../../../../common/FeaturedIndicator";
import SmallVoteIcons from "../../../../common/Vote/SmallVoteIcons";
import { IconBookCheck } from "../../../../common/icons/IconBookCheck";

interface CompactFeedItemFooterProps {
  post: PostView;
}

function CompactFeedItemFooter({ post }: CompactFeedItemFooterProps) {
  const { colors } = useAppSelector(selectThemeOptions);

  return (
    <>
      <HStack alignItems="center" space="sm">
        <HStack>
          <FeaturedIndicator
            featured={post.post.featured_community || post.post.featured_local}
          />
          {post.read && (
            <Box mr="$1">
              <IconBookCheck color={colors.accent} size={20} />
            </Box>
          )}
          <AvatarUsername
            creator={post.creator}
            showAvatar={false}
            link={false}
          />
        </HStack>
        <Text color={colors.textSecondary}>•</Text>
        <Text color={colors.textSecondary}>
          {timeFromNowShort(post.post.published)}
        </Text>
      </HStack>
      <HStack flex={1} alignItems="center" space="sm">
        <SmallVoteIcons
          upvotes={post.counts.upvotes}
          downvotes={post.counts.downvotes}
          myVote={post.my_vote as ILemmyVote}
        />
        <HStack alignItems="center" space="xs">
          <CommentCount commentCount={post.counts.comments} />
        </HStack>
        <CommunityLink community={post.community} />
      </HStack>
    </>
  );
}

export default CompactFeedItemFooter;
