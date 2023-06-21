import React from "react";
import { HStack, Text, useTheme } from "native-base";
import { IconChevronRight } from "tabler-icons-react-native";

function SearchResultTypeHeader({ type }: { type: string }) {
  const theme = useTheme();
  return (
    <HStack alignItems="center">
      <Text fontSize="lg">{type}</Text>
      <IconChevronRight size={32} color={theme.colors.app.iconColor} />
    </HStack>
  );
}

export default SearchResultTypeHeader;
