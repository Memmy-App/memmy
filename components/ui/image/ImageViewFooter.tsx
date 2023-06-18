import React from "react";
import { HStack, Icon, IconButton } from "native-base";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Ionicons } from "@expo/vector-icons";

interface ImageViewFooterProps {
  onSave: () => void | Promise<void>;
  onShare: () => void | Promise<void>;
}

function ImageViewFooter({ onSave, onShare }: ImageViewFooterProps) {
  return (
    <HStack
      flex={1}
      mb={10}
      mx={10}
      space={2}
      alignItems="center"
      justifyContent="space-between"
    >
      <IconButton
        icon={
          <Icon as={Ionicons} name="save-outline" size={6} onPress={onSave} />
        }
      />
      <IconButton
        icon={
          <Icon as={Ionicons} name="share-outline" size={6} onPress={onShare} />
        }
      />
    </HStack>
  );
}

export default ImageViewFooter;
