import { HStack, Text } from "@src/components/gluestack";
import React, { useMemo } from "react";
import { useThemeOptions } from "@src/state/settings/settingsStore";
import { ICON_MAP } from "@src/types/constants/IconMap";
import { SFIcon } from "@src/components/common/icons/SFIcon";
import { timeFromNowShort } from "@src/helpers/time";

function DatePublished({ published }: { published: string }) {
  const { colors } = useThemeOptions();

  const time = useMemo(() => timeFromNowShort(published), [published]);

  return (
    <HStack alignItems="center" space="xxs">
      <SFIcon
        icon={ICON_MAP.CLOCK}
        size={10}
        boxSize={18}
        color={colors.textSecondary}
      />
      <Text color={colors.textSecondary} size="sm">
        {time}
      </Text>
    </HStack>
  );
}

export default React.memo(DatePublished);
