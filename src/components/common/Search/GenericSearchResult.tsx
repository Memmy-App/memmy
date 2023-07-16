import React from "react";
import { Box, HStack, Pressable, Text, useTheme, VStack } from "native-base";
import FastImage from "@gkasdorf/react-native-fast-image";
import { IconUser } from "tabler-icons-react-native";
import { StyleSheet } from "react-native";

function GenericSearchResult({
  header,
  footer,
  side,
  image,
  onPress,
}: {
  header: string;
  footer: string;
  side?: string;
  image: string | undefined;
  onPress: () => void | Promise<void>;
}) {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress}>
      <HStack alignItems="center" space={2} my={2}>
        <Box width={31} height={31}>
          {image ? (
            <FastImage source={{ uri: image }} style={styles.image} />
          ) : (
            <IconUser size={31} color={theme.colors.app.textSecondary} />
          )}
        </Box>
        <VStack>
          <Text>{header}</Text>
          <Text color={theme.colors.app.textSecondary}>{footer}</Text>
        </VStack>
        <Text
          color={theme.colors.app.textSecondary}
          ml="auto"
          alignSelf="flex-start"
        >
          {side}
        </Text>
      </HStack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 31,
    width: 31,
    borderRadius: 100,
  },
});

export default GenericSearchResult;
