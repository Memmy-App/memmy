import React from "react";
import { HStack, useTheme } from "native-base";
import { IconPin } from "tabler-icons-react-native";

interface IProps {
  featured: boolean;
}

function FeaturedIndicator({ featured }: IProps) {
  const { colors } = useTheme();

  if (!featured) {
    return (
      <HStack alignItems="center">
        <IconPin size={16} color={colors.app.accent} fill={colors.app.accent} />
      </HStack>
    );
  }

  return null;
}

export default FeaturedIndicator;
