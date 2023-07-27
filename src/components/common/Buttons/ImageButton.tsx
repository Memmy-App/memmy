import { HStack, Spacer, Text } from "@src/components/common/Gluestack";
import SFIcon from "@src/components/common/icons/SFIcon";
import { ICON_MAP } from "@src/constants/IconMap";
import React from "react";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import { truncateImageLink } from "../../../helpers/TextHelper";

interface ImageButtonProps {
  src: string;
  marginY?: number;
  children: React.ReactNode;
}

function ImageButton({ src, marginY = 4, children }: ImageButtonProps) {
  const theme = useThemeOptions();

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
        <SFIcon icon={ICON_MAP.CHEVRON.RIGHT} />
      </HStack>
    </>
  );
}

export default ImageButton;
