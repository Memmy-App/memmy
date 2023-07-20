import React, { SetStateAction, useCallback, useState } from "react";
import {
  Divider,
  HStack,
  Pressable,
  Text,
  useTheme,
  VStack,
} from "native-base";
import { PostView } from "lemmy-js-client";
import { getBaseUrl } from "../../../../helpers/LinkHelper";
import PostContentView from "./PostContentView";
import AvatarUsername from "../../../common/AvatarUsername";
import CommunityLink from "../../../common/CommunityLink";
import CommentCount from "../../../common/Comments/CommentCount";
import DatePublished from "../../../common/DatePublished";
import PostActionBar from "./PostActionBar";
import PostTitle from "./PostTitle";
import { onGenericHapticFeedback } from "../../../../helpers/HapticFeedbackHelpers";
import { ILemmyVote } from "../../../../types/lemmy/ILemmyVote";
import { useAppSelector } from "../../../../../store";
import { selectSettings } from "../../../../slices/settings/settingsSlice";

interface IProps {
  currentPost: PostView;
  isMod: boolean;
  collapsed: boolean;
  setCollapsed: React.Dispatch<SetStateAction<boolean>>;
  showLoadAll: boolean;

  doLoad: (refresh: boolean) => Promise<void>;
  doSave: () => Promise<void>;
  doVote: (value: ILemmyVote) => Promise<void>;
}

function PostHeader({
  currentPost,
  isMod,
  collapsed,
  setCollapsed,
  showLoadAll,

  doLoad,
  doSave,
  doVote,
}: IProps) {
  const theme = useTheme();
  const { tapToCollapse } = useAppSelector(selectSettings);

  const instanceBaseUrl = getBaseUrl(currentPost.community.actor_id);

  const [hideSLA, setHideSLA] = useState(false);

  const onPress = useCallback(() => {
    if (!tapToCollapse) return;

    onGenericHapticFeedback();
    setCollapsed((prev) => !prev);
  }, [currentPost.post.id]);

  return (
    <VStack flex={1} backgroundColor={theme.colors.app.fg}>
      <Pressable onPress={onPress}>
        {!collapsed ? (
          <PostContentView post={currentPost} />
        ) : (
          <VStack>
            <PostTitle title={currentPost.post.name} mt={2} mb={2} />
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
        <AvatarUsername creator={currentPost?.creator} isMod={isMod} />
      </HStack>
      <HStack space={2} mx={4} mb={2}>
        <CommunityLink
          community={currentPost?.community}
          instanceBaseUrl={instanceBaseUrl}
        />
        <CommentCount commentCount={currentPost.counts.comments} />
        <DatePublished published={currentPost?.post.published} />
      </HStack>

      <Divider my={1} bg={theme.colors.app.border} />
      <PostActionBar post={currentPost} doSave={doSave} doVote={doVote} />
      <Divider bg={theme.colors.app.border} />
      {showLoadAll && !hideSLA && (
        <Pressable
          backgroundColor="#1A91FF"
          onPress={() => {
            setHideSLA(true);
            doLoad(true).then();
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
