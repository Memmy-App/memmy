import { HStack, Text } from "@src/components/common/Gluestack";
import SFIcon from "@src/components/common/icons/SFIcon";
import { ICON_MAP } from "@src/constants/IconMap";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import React from "react";
import { truncateImageLink } from "../../../helpers/TextHelper";

interface ImageButtonProps {
  src: string;
  marginY?: number;
  children: React.ReactNode;
}

function ImageButton({ src, marginY = 4, children }: ImageButtonProps) {
  const theme = useThemeOptions();

  return (
    <HStack
      backgroundColor={theme.colors.bg}
      borderRadius="$md"
      p="$2"
      alignItems="center"
      space="md"
      my={marginY}
    >
      {children}
      <Text color={theme.colors.textPrimary} size="sm" numberOfLines={1}>
        {truncateImageLink(src)}
      </Text>
      <SFIcon icon={ICON_MAP.CHEVRON.RIGHT} />
    </HStack>
  );
}

export default ImageButton;
