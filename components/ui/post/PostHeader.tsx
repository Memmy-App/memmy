import React from "react";
import {
  Divider,
  HStack,
  Pressable,
  Text,
  useTheme,
  VStack,
} from "native-base";
import { UsePost } from "../../hooks/post/postHooks";
import PostContentView from "./PostContentView";
import AvatarUsername from "../common/avatarUsername/AvatarUsername";
import CommunityLink from "../CommunityLink";
import CommentCount from "../common/CommentCount";
import DatePublished from "../common/DatePublished";
import PostActionBar from "./PostActionBar";
import { getBaseUrl } from "../../../helpers/LinkHelper";

interface IProps {
  post: UsePost;
  showLoadAll: boolean;
}

function PostHeader({ post, showLoadAll }: IProps) {
  const theme = useTheme();

  const instanceBaseUrl = getBaseUrl(post.currentPost.community.actor_id);

  return (
    <VStack flex={1} backgroundColor={theme.colors.app.fg}>
      <PostContentView post={post.currentPost} />

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
      {showLoadAll && (
        <Pressable
          backgroundColor="#1A91FF"
          onPress={() => {
            post.setShowLoadAll(false);
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
