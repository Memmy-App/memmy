import { ChevronRightIcon, Spacer, useTheme } from "native-base";
import { HStack, Text } from "@components/common/Gluestack";
import React from "react";
import { truncateImageLink } from "../../../helpers/TextHelper";

interface ImageButtonProps {
  src: string;
  marginY?: number;
  children: React.ReactNode;
}

function ImageButton({ src, marginY = 4, children }: ImageButtonProps) {
  const theme = useTheme();

  return (
    <>
      <HStack
        backgroundColor={theme.colors.app.bg}
        borderRadius="$md"
        padding={2}
        flexDirection="row"
        alignItems="center"
        space="sm"
        my={marginY}
      >
        {children}
        <Spacer />
        <Text color={theme.colors.app.textPrimary}>
          {truncateImageLink(src)}
        </Text>
        <Spacer />
        <ChevronRightIcon />
      </HStack>
    </>
  );
}

export default ImageButton;
