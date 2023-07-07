import React from "react";
import { HStack, useTheme } from "native-base";
// eslint-disable-next-line import/no-extraneous-dependencies
import { IconDeviceFloppy, IconShare2 } from "tabler-icons-react-native";
import IconButtonWithText from "../IconButtonWithText";

interface ImageViewFooterProps {
  onSave: () => void | Promise<void>;
  onShare: () => void | Promise<void>;
}

function ImageViewFooter({ onSave, onShare }: ImageViewFooterProps) {
  const theme = useTheme();

  return (
    <HStack
      flex={1}
      mb={10}
      mx={10}
      space={2}
      alignItems="center"
      justifyContent="space-between"
    >
      <IconButtonWithText
        onPressHandler={onSave}
        icon={
          <IconDeviceFloppy size={38} color={theme.colors.app.textSecondary} />
        }
      />
      <IconButtonWithText
        onPressHandler={onShare}
        icon={<IconShare2 size={38} color={theme.colors.app.textSecondary} />}
      />
    </HStack>
  );
}

export default ImageViewFooter;
