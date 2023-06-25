import React, { useState } from "react";
import { HStack, Pressable, Text, useTheme } from "native-base";
import { TablerIcon } from "tabler-icons-react-native";

function ButtonTwo({
  onPress,
  icon,
  text,
  my,
  mx,
  py = 1,
  selected = false,
  badge = undefined,
}: {
  onPress: () => void;
  icon?: TablerIcon;
  text: string;
  mx?: number;
  my?: number;
  py?: number;
  selected?: boolean;
  badge?: string | undefined;
}) {
  const [pressedIn, setPressedIn] = useState(false);

  const theme = useTheme();

  const onPressIn = () => {
    setPressedIn(true);
  };

  const onPressOut = () => {
    setPressedIn(false);
  };

  const IconComponent = icon;

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      opacity={pressedIn ? 0.7 : 1}
      shadow={pressedIn ? 3 : 0}
      py={py}
      mx={mx}
      my={my}
      borderRadius={20}
      backgroundColor={
        !selected
          ? theme.colors.app.buttonOne
          : theme.colors.app.buttonOneSelected
      }
      flexGrow={1}
    >
      <HStack space={1.5} alignItems="center" justifyContent="center">
        {icon && (
          <IconComponent size={24} color={theme.colors.app.buttonOneIcon} />
        )}
        <Text fontSize="sm" color={theme.colors.app.buttonOneText}>
          {text}
        </Text>
        {badge && (
          <Text
            fontSize="sm"
            color={theme.colors.app.buttonOneText}
            backgroundColor="#999999"
          >
            {badge}
          </Text>
        )}
      </HStack>
    </Pressable>
  );
}

export default ButtonTwo;
