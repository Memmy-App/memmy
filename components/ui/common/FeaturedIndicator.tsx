import React from "react";
import { PostView } from "lemmy-js-client";
import { HStack, useTheme } from "native-base";
import { IconPin } from "tabler-icons-react-native";

interface IProps {
  post: PostView;
  isCompact?: boolean;
}

function FeaturedIndicator({ post, isCompact }: IProps) {
  const { colors } = useTheme();

  if (post.post.featured_local || post.post.featured_community) {
    return (
      <HStack mx={isCompact ? 0 : 2} alignItems="center">
        <IconPin size={16} color={colors.app.accent} fill={colors.app.accent} />
      </HStack>
    );
  }

  return null;
}

export default FeaturedIndicator;
