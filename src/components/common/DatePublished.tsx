import React from "react";
import { HStack, useTheme, Text } from "native-base";
import { IconClockHour5 } from "tabler-icons-react-native";
import { timeFromNowShort } from "../../../helpers/TimeHelper";

function DatePublished({ published }: { published: string }) {
  const { colors } = useTheme();
  return (
    <HStack alignItems="center" space={0.5}>
      <IconClockHour5 size={18} color={colors.app.textSecondary} />
      <Text color={colors.app.textSecondary} fontSize="sm">
        {timeFromNowShort(published)}
      </Text>
    </HStack>
  );
}

export default React.memo(DatePublished);
