import React from "react";
import { HStack } from "native-base";
import { PostView } from "lemmy-js-client";
import AvatarUsername from "../../common/AvatarUsername";
import FeaturedIndicator from "../../common/FeaturedIndicator";

interface Props {
  post: PostView;
}

export function ByLine({ post }: Props) {
  return (
    <HStack space={2}>
      <AvatarUsername creator={post.creator} />
      <FeaturedIndicator post={post} />
    </HStack>
  );
}
