import React, { useEffect, useMemo } from "react";
import {
  Divider,
  HStack,
  Pressable,
  Text,
  useTheme,
  VStack,
} from "native-base";
import { getBaseUrl } from "../../../../helpers/LinkHelper";
import PostContentView from "./PostContentView";
import AvatarUsername from "../../../common/AvatarUsername";
import CommunityLink from "../../../common/CommunityLink";
import CommentCount from "../../../common/Comments/CommentCount";
import DatePublished from "../../../common/DatePublished";
import PostActionBar from "./PostActionBar";
import PostTitle from "./PostTitle";
import usePost from "../../../../hooks/post/usePost";
import { usePostCollapsed } from "../../../../stores/posts/postsStore";

function PostHeader() {
  const postHook = usePost();
  const postCollapsed = usePostCollapsed(postHook.postKey);
  const theme = useTheme();

  useEffect(() => console.log("rerendered"));

  const instanceBaseUrl = useMemo(
    () => getBaseUrl(postHook.post.community.actor_id),
    [postHook.post.post.id]
  );

  useEffect(() => {
    console.log("changed");
  }, [postHook.onPostPress]);

  return (
    <VStack flex={1} backgroundColor={theme.colors.app.fg}>
      <Pressable onPress={postHook.onPostPress}>
        {!postCollapsed ? (
          <PostContentView />
        ) : (
          <VStack>
            <PostTitle mt={2} mb={2} />
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
        <AvatarUsername creator={postHook.post.creator} />
      </HStack>
      <HStack space={2} mx={4} mb={2}>
        <CommunityLink
          community={postHook.post.community}
          instanceBaseUrl={instanceBaseUrl}
        />
        <CommentCount commentCount={postHook.post.counts.comments} />
        <DatePublished published={postHook.post.post.published} />
      </HStack>

      <Divider my={1} bg={theme.colors.app.border} />
      <PostActionBar />
      <Divider bg={theme.colors.app.border} />
      {/* {showLoadAll && !hideSLA && ( */}
      {/*  <Pressable */}
      {/*    backgroundColor="#1A91FF" */}
      {/*    onPress={() => { */}
      {/*      setHideSLA(true); */}
      {/*      doLoad(true).then(); */}
      {/*    }} */}
      {/*  > */}
      {/*    <VStack> */}
      {/*      <Text fontSize="md" fontStyle="italic" px={2} py={3}> */}
      {/*        Load all comments... */}
      {/*      </Text> */}
      {/*    </VStack> */}
      {/*  </Pressable> */}
      {/* )} */}
    </VStack>
  );
}

export default React.memo(PostHeader);
