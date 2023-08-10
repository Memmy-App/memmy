import React from "react";
import {
  useFeedPostCommunity,
  useFeedPostInfo,
  useFeedPostRead,
} from "@src/state/feed/feedStore";
import { useRoute } from "@react-navigation/core";
import { HStack } from "@src/components/gluestack";
import { ICON_MAP } from "@src/types/constants/IconMap";
import IconButtonWithText from "@src/components/common/Button/IconButtonWithText";
import CommunityLink from "@src/components/common/Link/CommunityLink";
import FeaturedIndicator from "@src/components/common/icons/FeaturedIndicator";
import { ReadIndicator } from "@src/components/common/icons/ReadIndicator";
import { FeedItemContextMenu } from "@src/components/contextMenus/feed/FeedItemContextMenu";

interface IProps {
  postId: number;
}

function Header({ postId }: IProps): React.JSX.Element {
  const { key } = useRoute();

  const postInfo = useFeedPostInfo(key, postId);
  const postRead = useFeedPostRead(key, postId);
  const postCommunity = useFeedPostCommunity(key, postId);

  return (
    <HStack mx="$4" mt="$2" justifyContent="space-between" alignItems="center">
      <CommunityLink community={postCommunity!} />
      <HStack space="sm" alignItems="center">
        <FeaturedIndicator featured={!!postInfo?.featured_community} />
        <ReadIndicator isRead={!!postRead} />
        <FeedItemContextMenu postId={postId} isButton>
          <IconButtonWithText icon={ICON_MAP.MORE_OPTIONS} />
        </FeedItemContextMenu>
      </HStack>
    </HStack>
  );
}

export const FeedItemHeader = React.memo(Header);
