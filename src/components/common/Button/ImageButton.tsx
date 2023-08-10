import { HStack, Text } from "@src/components/gluestack";
import SFIcon from "@src/components/common/icons/SFIcon";
import React from "react";
import { useThemeOptions } from "@src/state/settings/settingsStore";
import { truncateImageLink } from "@src/helpers/text";
import { ICON_MAP } from "@src/types/constants/IconMap";

interface IProps {
  src: string;
  marginY?: number;
  children: React.ReactNode;
}

function ImageButton({
  src,
  marginY = 4,
  children,
}: IProps): React.JSX.Element {
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
