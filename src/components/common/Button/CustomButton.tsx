import React, { useCallback, useState } from "react";
import { HStack, Pressable, Text } from "@src/components/gluestack";
import { useThemeOptions } from "@src/state/settings/settingsStore";
import SFIcon from "../icons/SFIcon";

interface IProps {
  onPress: () => void;
  text: string;
  icon: string;
  selectable?: boolean;
  size?: "md" | "sm";
  badge?: string;
}

function CustomButton({
  onPress,
  text,
  icon,
  selectable = false,
  size = "md",
  badge,
}: IProps): React.JSX.Element {
  const [pressedIn, setPressedIn] = useState(false);
  const [selected, setSelected] = useState(false);

  const theme = useThemeOptions();

  const onPressIn = useCallback(() => {
    setPressedIn(true);
  }, [onPress]);

  const onPressOut = useCallback(() => {
    setPressedIn(false);
  }, [onPress]);

  const onPressBefore = useCallback(() => {
    if (selectable) setSelected((prev) => !prev);

    onPress();
  }, [selectable, onPress]);

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPressBefore}
      opacity={pressedIn ? 0.7 : 1}
      py={size === "md" ? "$2" : "$1"}
      borderRadius={size === "md" ? "$xl" : "$3xl"}
      backgroundColor={!selected ? theme.colors.inputBg : theme.colors.accent}
      flexGrow={1}
    >
      <HStack space="smxs" alignItems="center" justifyContent="center">
        {icon && <SFIcon icon={icon} size={size === "md" ? 16 : 14} />}
        <Text size={size} color={theme.colors.textPrimary}>
          {text}
        </Text>
        {badge && (
          <Text size={size} color={theme.colors.textPrimary}>
            {badge}
          </Text>
        )}
      </HStack>
    </Pressable>
  );
}

export default CustomButton;
