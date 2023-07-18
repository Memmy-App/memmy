import React, { useCallback } from "react";
import {
  Divider,
  HStack,
  Pressable,
  Text,
  useTheme,
  VStack,
} from "native-base";
import { useRoute } from "@react-navigation/core";
import { getBaseUrl } from "../../../../helpers/LinkHelper";
import PostContentView from "./PostContentView";
import AvatarUsername from "../../../common/AvatarUsername";
import CommunityLink from "../../../common/CommunityLink";
import CommentCount from "../../../common/Comments/CommentCount";
import DatePublished from "../../../common/DatePublished";
import PostActionBar from "./PostActionBar";
import PostTitle from "./PostTitle";
import { onGenericHapticFeedback } from "../../../../helpers/HapticFeedbackHelpers";
import { useAppSelector } from "../../../../../store";
import { selectSettings } from "../../../../slices/settings/settingsSlice";
import { useCurrentPost } from "../../../../stores/posts/postsStore";

function PostHeader() {
  const { postKey } = useRoute<any>().params;
  const postState = useCurrentPost(postKey);

  const theme = useTheme();
  const { tapToCollapse } = useAppSelector(selectSettings);

  const instanceBaseUrl = getBaseUrl(postState.post.community.actor_id);

  const onPress = useCallback(() => {
    if (!tapToCollapse) return;

    onGenericHapticFeedback();
    (prev) => !prev;
  }, [postState.post.post.id]);

  return (
    <VStack flex={1} backgroundColor={theme.colors.app.fg}>
      <Pressable onPress={onPress}>
        {!postState.collapsed ? (
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
        <AvatarUsername creator={postState.post.creator} />
      </HStack>
      <HStack space={2} mx={4} mb={2}>
        <CommunityLink
          community={postState.post.community}
          instanceBaseUrl={instanceBaseUrl}
        />
        <CommentCount commentCount={postState.post.counts.comments} />
        <DatePublished published={postState.post.post.published} />
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
