import React from "react";
import { HStack, useTheme } from "native-base";
import { PostView } from "lemmy-js-client";
import AvatarUsername from "../../common/AvatarUsername";
import FeaturedIndicator from "../../common/FeaturedIndicator";
import { IconBookCheck } from "../../customIcons/IconBookCheck";

interface Props {
  post: PostView;
}

export function ByLine({ post }: Props) {
  const theme = useTheme();
  return (
    <HStack space={2} alignItems="center">
      <AvatarUsername creator={post.creator} />
      {post.read && <IconBookCheck color={theme.colors.app.info} size={20} />}
      <FeaturedIndicator post={post} />
    </HStack>
  );
}
