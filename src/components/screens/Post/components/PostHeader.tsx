import React, { useState } from "react";
import {
  Divider,
  HStack,
  Pressable,
  Text,
  useTheme,
  VStack,
} from "native-base";
import { UsePost } from "../../../../hooks/post/postHooks";
import { getBaseUrl } from "../../../../helpers/LinkHelper";
import PostContentView from "./PostContentView";
import AvatarUsername from "../../../common/AvatarUsername";
import CommunityLink from "../../../common/CommunityLink";
import CommentCount from "../../../common/Comments/CommentCount";
import DatePublished from "../../../common/DatePublished";
import PostActionBar from "./PostActionBar";
import PostTitle from "./PostTitle";
import { onGenericHapticFeedback } from "../../../../helpers/HapticFeedbackHelpers";

interface IProps {
  post: UsePost;
  showLoadAll: boolean;
}

function PostHeader({ post, showLoadAll }: IProps) {
  const theme = useTheme();

  const instanceBaseUrl = getBaseUrl(post.currentPost.community.actor_id);

  const [hideSLA, setHideSLA] = useState(false);

  const onPress = () => {
    onGenericHapticFeedback();
    post.setCollapsed((prev) => !prev);
  };

  return (
    <VStack flex={1} backgroundColor={theme.colors.app.fg}>
      <Pressable onPress={onPress}>
        {!post.collapsed ? (
          <PostContentView post={post.currentPost} />
        ) : (
          <VStack>
            <PostTitle title={post.currentPost.post.name} mt={2} mb={2} />
            <Text
              color={theme.colors.app.textSecondary}
              fontStyle="italic"
              py={2}
              px={4}
            >
              Post Collapsed
            </Text>
          </VStack>
        )}
      </Pressable>

      <HStack mb={2} mx={4} space={2}>
        <AvatarUsername creator={post.currentPost?.creator} />
      </HStack>
      <HStack space={2} mx={4} mb={2}>
        <CommunityLink
          community={post.currentPost?.community}
          instanceBaseUrl={instanceBaseUrl}
        />
        <CommentCount commentCount={post.currentPost.counts.comments} />
        <DatePublished published={post.currentPost?.post.published} />
      </HStack>

      <Divider my={1} bg={theme.colors.app.border} />
      <PostActionBar
        post={post.currentPost}
        doSave={post.doSave}
        doVote={post.doVote}
      />
      <Divider bg={theme.colors.app.border} />
      {showLoadAll && !hideSLA && (
        <Pressable
          backgroundColor="#1A91FF"
          onPress={() => {
            setHideSLA(true);
            post.doLoad(true);
          }}
        >
          <VStack>
            <Text fontSize="md" fontStyle="italic" px={2} py={3}>
              Load all comments...
            </Text>
          </VStack>
        </Pressable>
      )}
    </VStack>
  );
}

export default React.memo(PostHeader);
