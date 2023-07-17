import React, { useMemo } from "react";
import { HStack, Text, useTheme } from "native-base";
import { IconChevronDown, IconDots } from "tabler-icons-react-native";
import { CommentContextMenu } from "../CommentContextMenu";
import IconButtonWithText from "../../IconButtonWithText";
import { timeFromNowShort } from "../../../../helpers/TimeHelper";

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
    return <IconChevronDown size={24} color={theme.colors.app.textSecondary} />;
  }

  const publishedFormatted = useMemo(
    () => timeFromNowShort(published),
    [published]
  );

  return (
    <HStack alignItems="center" space={2}>
      <CommentContextMenu
        isShortPress
        options={contextOptions}
        onPress={({ nativeEvent }) => {
          onPress(nativeEvent.actionKey);
        }}
      >
        <IconButtonWithText
          icon={<IconDots size={24} color={theme.colors.app.textSecondary} />}
        />
      </CommentContextMenu>
      <Text color={theme.colors.app.textSecondary}>{publishedFormatted}</Text>
    </HStack>
  );
}

export default React.memo(CommentHeaderRight);
