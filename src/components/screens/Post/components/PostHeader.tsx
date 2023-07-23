import React, { useCallback, useMemo } from "react";
import {
  Divider,
  HStack,
  Pressable,
  Text,
  VStack,
} from "@components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";
import { useRoute } from "@react-navigation/core";
import { getBaseUrl } from "../../../../helpers/LinkHelper";
import PostContentView from "./PostContentView";
import AvatarUsername from "../../../common/AvatarUsername";
import CommunityLink from "../../../common/CommunityLink";
import CommentCount from "../../../common/Comments/CommentCount";
import DatePublished from "../../../common/DatePublished";
import PostActionBar from "./PostActionBar";
import PostTitle from "./PostTitle";
import {
  useCurrentPost,
  usePostCollapsed,
} from "../../../../stores/posts/postsStore";
import { setPostCollapsed } from "../../../../stores/posts/actions";

function PostHeader() {
  const { postKey } = useRoute<any>().params;

  const currentPost = useCurrentPost(postKey);
  const postCollapsed = usePostCollapsed(postKey);
  const theme = useAppSelector(selectThemeOptions);

  const instanceBaseUrl = useMemo(
    () => getBaseUrl(currentPost.community.actor_id),
    [currentPost.post.id]
  );

  const onPostPress = useCallback(() => {
    setPostCollapsed(postKey);
  }, [currentPost.post.id]);

  return (
    <VStack flex={1} backgroundColor={theme.colors.fg}>
      <Pressable onPress={onPostPress}>
        {!postCollapsed ? (
          <PostContentView />
        ) : (
          <VStack>
            <PostTitle mt="$2" mb="$2" />
            <Text
              color={theme.colors.textSecondary}
              fontStyle="italic"
              py="$2"
              px="$4"
            >
              Post Collapsed
            </Text>
          </VStack>
        )}
      </Pressable>

      <HStack mb="$2" mx="$4" space="sm">
        <AvatarUsername creator={currentPost.creator} />
      </HStack>
      <HStack space="sm" mx="$4" mb="$2">
        <CommunityLink
          community={currentPost.community}
          instanceBaseUrl={instanceBaseUrl}
        />
        <CommentCount commentCount={currentPost.counts.comments} />
        <DatePublished published={currentPost.post.published} />
      </HStack>

      <Divider my="$1" bg={theme.colors.border} />
      <PostActionBar />
      <Divider bg={theme.colors.border} />
      {/* {showLoadAll && !hideSLA && ( */}
      {/*  <Pressable */}
      {/*    backgroundColor="#1A91FF" */}
      {/*    onPress={() => { */}
      {/*      setHideSLA(true); */}
      {/*      doLoad(true).then(); */}
      {/*    }} */}
      {/*  > */}
      {/*    <VStack> */}
      {/*      <Text size="md" fontStyle="italic" px="$2" py="$3"> */}
      {/*        Load all comments... */}
      {/*      </Text> */}
      {/*    </VStack> */}
      {/*  </Pressable> */}
      {/* )} */}
    </VStack>
  );
}

export default React.memo(PostHeader);
