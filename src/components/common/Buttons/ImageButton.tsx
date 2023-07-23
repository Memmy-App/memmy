import {
  ChevronRightIcon,
  HStack,
  Icon,
  Spacer,
  Text,
} from "@components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";
import React from "react";
import { truncateImageLink } from "../../../helpers/TextHelper";

interface ImageButtonProps {
  src: string;
  marginY?: number;
  children: React.ReactNode;
}

function ImageButton({ src, marginY = 4, children }: ImageButtonProps) {
  const theme = useAppSelector(selectThemeOptions);

  return (
    <>
      <HStack
        backgroundColor={theme.colors.bg}
        borderRadius="$md"
        padding={2}
        flexDirection="row"
        alignItems="center"
        space="sm"
        my={marginY}
      >
        {children}
        <Spacer />
        <Text color={theme.colors.textPrimary}>{truncateImageLink(src)}</Text>
        <Spacer />
        <Icon as={ChevronRightIcon} />
      </HStack>
    </>
  );
}

export default ImageButton;
