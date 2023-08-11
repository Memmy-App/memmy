import { useRoute } from "@react-navigation/core";
import { Box, HStack, Text } from "@src/components/common/Gluestack";
import VoteData from "@src/components/common/Vote/VoteData";
import { timeFromNowShort } from "@src/helpers/TimeHelper";
import {
  useFeedPostCommunity,
  useFeedPostCounts,
  useFeedPostCreator,
  useFeedPostInfo,
  useFeedPostRead,
  useFeedPostVote,
} from "@src/stores/feeds/feedsStore";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import React from "react";
import AvatarUsername from "../../../../common/AvatarUsername";
import CommentCount from "../../../../common/Comments/CommentCount";
import CommunityLink from "../../../../common/CommunityLink";
import FeaturedIndicator from "../../../../common/FeaturedIndicator";
import { IconBookCheck } from "../../../../common/icons/IconBookCheck";

interface IProps {
  postId: number;
}

function CompactFeedItemFooter({ postId }: IProps) {
  const { key } = useRoute();

  const postInfo = useFeedPostInfo(key, postId);
  const postCreator = useFeedPostCreator(key, postId);
  const postRead = useFeedPostRead(key, postId);
  const postCounts = useFeedPostCounts(key, postId);
  const postVote = useFeedPostVote(key, postId);
  const postCommunity = useFeedPostCommunity(key, postId);

  const { colors } = useThemeOptions();

  return (
    <>
      <HStack alignItems="center" space="sm">
        <HStack>
          <FeaturedIndicator
            featured={postInfo.featured_community || postInfo.featured_local}
          />
          {postRead && (
            <Box mr="$1">
              <IconBookCheck color={colors.accent} size={20} />
            </Box>
          )}
          <AvatarUsername
            creator={postCreator}
            showAvatar={false}
            link={false}
          />
        </HStack>
        <Text color={colors.textSecondary} size="sm">
          •
        </Text>
        <Text color={colors.textSecondary} size="sm">
          {timeFromNowShort(postCounts.published)}
        </Text>
      </HStack>
      <HStack flex={1} alignItems="center" space="sm">
        <VoteData data={postCounts} myVote={postVote} />
        <HStack alignItems="center" space="xs">
          <CommentCount commentCount={postCounts.comments} />
        </HStack>
        <CommunityLink community={postCommunity} />
      </HStack>
    </>
  );
}

export default CompactFeedItemFooter;
