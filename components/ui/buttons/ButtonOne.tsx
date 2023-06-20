import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { HStack, Pressable, Text, useTheme } from "native-base";
import { TablerIcon } from "tabler-icons-react-native";

function ButtonOne({
  onPress,
  icon,
  text,
  my,
  mx,
  selectable = false,
}: {
  onPress: () => void;
  icon: TablerIcon;
  text: string;
  mx?: number;
  my?: number;
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
      py={2}
      mx={mx}
      my={my}
      borderRadius={10}
      backgroundColor={
        !selected
          ? theme.colors.app.buttonOne
          : theme.colors.app.buttonOneSelected
      }
      flexGrow={1}
    >
      <HStack space={1.5} alignItems="center" justifyContent="center">
        <IconComponent size={24} color={theme.colors.app.buttonOneIcon} />
        <Text fontSize="md" color={theme.colors.app.buttonOneText}>
          {text}
        </Text>
      </HStack>
    </Pressable>
  );
}

export default ButtonOne;
