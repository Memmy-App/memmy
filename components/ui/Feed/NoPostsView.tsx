import React from "react";
import { Text, useTheme, VStack } from "native-base";

function NoPostsView() {
  const theme = useTheme();

  return (
    <VStack flex={1} justifyContent="center" alignItems="center">
      <Text
        fontStyle="italic"
        color={theme.colors.app.secondaryText}
        textAlign="center"
      >
        No posts found. Maybe you should get a conversation started?
      </Text>
    </VStack>
  );
}

export default NoPostsView;
