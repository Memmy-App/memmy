import React from "react";
import { PostView } from "lemmy-js-client";
import { HStack, useTheme } from "native-base";
import { IconPin } from "tabler-icons-react-native";

interface IProps {
  post: PostView;
}

function FeaturedIndicator({ post }: IProps) {
  const { colors } = useTheme();

  if (post.post.featured_local || post.post.featured_community) {
    return (
      <HStack alignItems="center" mr={2}>
        <IconPin size={16} color={colors.app.accent} fill={colors.app.accent} />
      </HStack>
    );
  }

  return false;
}

export default FeaturedIndicator;
