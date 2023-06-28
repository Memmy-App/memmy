import React, { useState } from "react";
import { HStack, Pressable, Text, useTheme } from "native-base";

function GroupButton({
  onPress,
  text,
  selected,
}: {
  onPress: () => void | Promise<void>;
  text: string;
  selected: boolean;
}) {
  const [pressedIn, setPressedIn] = useState(false);

  const theme = useTheme();

  const onPressIn = () => {
    setPressedIn(true);
  };

  const onPressOut = () => {
    setPressedIn(false);
  };

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      opacity={pressedIn ? 0.7 : 1}
      shadow={pressedIn ? 3 : 0}
      borderRadius={20}
      py={1}
      px={5}
      m={1}
      backgroundColor={selected ? theme.colors.app.navBarBg : undefined}
    >
      <HStack space={1.5} alignItems="center" justifyContent="center">
        <Text fontSize="sm" color={theme.colors.app.textSecondary}>
          {text}
        </Text>
      </HStack>
    </Pressable>
  );
}

export default GroupButton;
