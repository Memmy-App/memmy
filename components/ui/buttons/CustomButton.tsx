import React, { useState } from "react";
import { HStack, Pressable, Text, useTheme } from "native-base";
import { TablerIcon } from "tabler-icons-react-native";

function CustomButton({
  onPress,
  text,
  icon,
  selectable = false,
  size = "md",
  badge,
}: {
  onPress: () => void;
  text: string;
  icon?: TablerIcon;
  selectable?: boolean;
  size?: "md" | "sm";
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

  const IconComponent = icon;

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPressBefore}
      opacity={pressedIn ? 0.7 : 1}
      shadow={pressedIn ? 3 : 0}
      py={size === "md" ? 2 : 1}
      borderRadius={size === "md" ? 10 : 20}
      backgroundColor={
        !selected ? theme.colors.app.inputBg : theme.colors.app.accent
      }
      flexGrow={1}
    >
      <HStack space={1.5} alignItems="center" justifyContent="center">
        {icon && (
          <IconComponent
            size={size === "md" ? 24 : 20}
            color={theme.colors.app.accent}
          />
        )}
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
