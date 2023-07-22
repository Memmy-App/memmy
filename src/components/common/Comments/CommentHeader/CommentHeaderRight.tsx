import { useTheme } from "native-base";
import { HStack, Text } from "@components/common/Gluestack";
import React, { useMemo } from "react";
import { timeFromNowShort } from "../../../../helpers/TimeHelper";
import IconButtonWithText from "../../IconButtonWithText";
import SFIcon from "../../icons/SFIcon";
import { CommentContextMenu } from "../CommentContextMenu";

interface IProps {
  onPress: (key: string) => void;
  published: string;
  collapsed: boolean;
  contextOptions: Record<string, string>;
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
    <HStack alignItems="center" space="2">
      <Text color={theme.colors.app.textSecondary}>{publishedFormatted}</Text>
      <CommentContextMenu
        isShortPress
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
              color={theme.colors.app.textSecondary}
            />
          }
        />
      </CommentContextMenu>
    </HStack>
  );
}

export default React.memo(CommentHeaderRight);
