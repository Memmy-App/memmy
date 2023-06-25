import React, { useState } from "react";
import { HStack, Pressable, Text, useTheme } from "native-base";
import { TablerIcon } from "tabler-icons-react-native";

function ButtonOne({
  onPress,
  icon,
  text,
  my,
  mx,
  py = 2,
  selectable = false,
}: {
  onPress: () => void;
  icon?: TablerIcon;
  text: string;
  mx?: number;
  my?: number;
  py?: number;
  selectable?: boolean;
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
      py={py}
      mx={mx}
      my={my}
      borderRadius={10}
      backgroundColor={
        !selected ? theme.colors.app.inputBg : theme.colors.app.accentHighlight
      }
      flexGrow={1}
    >
      <HStack space={1.5} alignItems="center" justifyContent="center">
        {icon && <IconComponent size={24} color={theme.colors.app.accent} />}
        <Text fontSize="md" color={theme.colors.app.textSecondary}>
          {text}
        </Text>
      </HStack>
    </Pressable>
  );
}

export default ButtonOne;
