import React, { useState } from "react";
import { HStack, Pressable, Text, useTheme } from "native-base";

interface IProps {
  onPress: () => void | Promise<void>;
  text: string;
  selected: boolean;
}

function GroupButton({ onPress, text, selected }: IProps) {
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
      borderRadius={20}
      py={1}
      px={5}
      m={1}
      backgroundColor={selected ? theme.colors.app.border : undefined}
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
