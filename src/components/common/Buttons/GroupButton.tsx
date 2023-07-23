import React, { useState } from "react";
import { HStack, Pressable, Text } from "@components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";

interface IProps {
  onPress: () => void | Promise<void>;
  text: string;
  selected: boolean;
}

function GroupButton({ onPress, text, selected }: IProps) {
  const [pressedIn, setPressedIn] = useState(false);

  const theme = useAppSelector(selectThemeOptions);

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
      borderRadius="$3xl"
      py="$1"
      px="$5"
      m="$1"
      backgroundColor={selected ? theme.colors.bg : undefined}
    >
      <HStack space="$1.5" alignItems="center" justifyContent="center">
        <Text size="sm" color={theme.colors.textPrimary}>
          {text}
        </Text>
      </HStack>
    </Pressable>
  );
}

export default GroupButton;
