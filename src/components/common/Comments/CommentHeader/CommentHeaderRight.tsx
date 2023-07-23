import { HStack, Text } from "@components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";
import React, { useMemo } from "react";
import { timeFromNowShort } from "../../../../helpers/TimeHelper";
import IconButtonWithText from "../../IconButtonWithText";
import SFIcon from "../../icons/SFIcon";
import { CommentContextMenu } from "../CommentContextMenu";
import { ContextMenuOptions } from "../../../../types/ContextMenuOptions";

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
  const theme = useAppSelector(selectThemeOptions);

  const publishedFormatted = useMemo(
    () => timeFromNowShort(published),
    [published]
  );

  if (collapsed) {
    return (
      <SFIcon
        icon="chevron.down"
        size={12}
        color={theme.colors.textSecondary}
      />
    );
  }

  return (
    <HStack alignItems="center" space="sm">
      <Text color={theme.colors.textSecondary}>{publishedFormatted}</Text>
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
              icon="ellipsis"
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
