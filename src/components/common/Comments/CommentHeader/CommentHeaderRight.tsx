import { HStack, Text, useTheme } from "native-base";
import React, { useMemo } from "react";
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
  const theme = useTheme();

  if (collapsed) {
    return (
      <SFIcon
        icon="chevron.down"
        size={12}
        color={theme.colors.app.textSecondary}
      />
    );
  }

  const publishedFormatted = useMemo(
    () => timeFromNowShort(published),
    [published]
  );

  return (
    <HStack alignItems="center" space={2}>
      <Text color={theme.colors.app.textSecondary}>{publishedFormatted}</Text>
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
              color={theme.colors.app.textSecondary}
            />
          }
        />
      </CommentContextMenu>
    </HStack>
  );
}

export default React.memo(CommentHeaderRight);
