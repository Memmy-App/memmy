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
}: {
  onPress: () => void;
  icon: TablerIcon;
  text: string;
  mx?: number;
  my?: number;
}) {
  const [selected, setSelected] = useState(false);

  const theme = useTheme();

  const onPressIn = () => {
    setSelected(true);
  };

  const onPressOut = () => {
    setSelected(false);
  };

  const IconComponent = icon;

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      opacity={selected ? 0.7 : 1}
      shadow={selected ? 3 : 0}
      py={2}
      mx={mx}
      my={my}
      borderRadius={10}
      backgroundColor={theme.colors.app.buttonOne}
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
