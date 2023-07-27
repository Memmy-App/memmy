import { HStack, Text } from "@src/components/common/Gluestack";
import React from "react";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import { ICON_MAP } from "../../constants/IconMap";
import { timeFromNowShort } from "../../helpers/TimeHelper";
import SFIcon from "./icons/SFIcon";

function DatePublished({ published }: { published: string }) {
  const { colors } = useThemeOptions();
  return (
    <HStack alignItems="center" space="xxs">
      <SFIcon
        icon={ICON_MAP.CLOCK}
        size={10}
        boxSize={18}
        color={colors.textSecondary}
      />
      <Text color={colors.textSecondary} size="sm">
        {timeFromNowShort(published)}
      </Text>
    </HStack>
  );
}

export default React.memo(DatePublished);
