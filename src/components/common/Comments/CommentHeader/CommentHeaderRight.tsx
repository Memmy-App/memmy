import { HStack, Text } from "@src/components/common/Gluestack";
import React, { useMemo } from "react";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import { timeFromNowShort } from "../../../../helpers/TimeHelper";
import IconButtonWithText from "../../IconButtonWithText";
import SFIcon from "../../icons/SFIcon";
import { CommentContextMenu } from "../CommentContextMenu";
import { ContextMenuOptions } from "../../../../types/ContextMenuOptions";
import { ICON_MAP } from "../../../../constants/IconMap";

interface IProps {
  onPress: (key: string) => void;
  published: string;
  collapsed: boolean;
  contextOptions: ContextMenuOptions;
}

function CommentHeaderRight({
  onPress,
  published,
  collapsed,
  contextOptions,
}: IProps) {
  const theme = useThemeOptions();

  const publishedFormatted = useMemo(
    () => timeFromNowShort(published),
    [published]
  );

  if (collapsed) {
    return (
      <SFIcon
        icon={ICON_MAP.CHEVRON.DOWN}
        size={12}
        color={theme.colors.textSecondary}
      />
    );
  }

  return (
    <HStack alignItems="center" space="sm">
      <Text color={theme.colors.textSecondary} size="sm">
        {publishedFormatted}
      </Text>
      <CommentContextMenu
        isButton
        options={contextOptions}
        onPress={({ nativeEvent }) => {
          onPress(nativeEvent.actionKey);
        }}
      >
        <IconButtonWithText
          icon={
            <SFIcon
              icon={ICON_MAP.MORE_OPTIONS}
              size={12}
              color={theme.colors.textSecondary}
            />
          }
        />
      </CommentContextMenu>
    </HStack>
  );
}

export default React.memo(CommentHeaderRight);
