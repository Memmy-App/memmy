import React, { useState } from "react";
import { useTheme } from "native-base";
import { HStack, Pressable, Text } from "@components/common/Gluestack";
import SFIcon from "../icons/SFIcon";

function CustomButton({
  onPress,
  text,
  icon,
  selectable = false,
  size = "$md",
  badge,
}: {
  onPress: () => void;
  text: string;
  icon: string;
  selectable?: boolean;
  size?: "$md" | "$sm";
  badge?: string;
}) {
  const [pressedIn, setPressedIn] = useState(false);
  const [selected, setSelected] = useState(false);

  const theme = useTheme();

  const onPressIn = () => {
    setPressedIn(true);
  };

  const onPressOut = () => {
    setPressedIn(false);
  };

  const onPressBefore = () => {
    if (selectable) setSelected((prev) => !prev);

    onPress();
  };

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPressBefore}
      opacity={pressedIn ? 0.7 : 1}
      shadow={pressedIn ? "3" : "0"}
      py={size === "$md" ? "$2" : "$1"}
      borderRadius={size === "$md" ? 10 : 20}
      backgroundColor={
        !selected ? theme.colors.app.inputBg : theme.colors.app.accent
      }
      flexGrow={1}
    >
      <HStack space="smxs" alignItems="center" justifyContent="center">
        {icon && <SFIcon icon={icon} size={size === "$md" ? 16 : 14} />}
        <Text fontSize={size} color={theme.colors.app.textPrimary}>
          {text}
        </Text>
        {badge && (
          <Text fontSize={size} color={theme.colors.app.textPrimary}>
            {badge}
          </Text>
        )}
      </HStack>
    </Pressable>
  );
}

export default CustomButton;
