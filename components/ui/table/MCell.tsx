import React, { useState } from "react";
import { HStack, Pressable, Text, useTheme, View, VStack } from "native-base";

interface IProps {
  title: string;

  rightAccessory?: any;
  rightAccessoryEnd?: boolean;

  subtitle?: string;

  icon?: any;

  onPress?: () => void | Promise<void>;
}

function MCell({
  title,
  rightAccessory,
  rightAccessoryEnd = true,
  subtitle,
  icon,
  onPress,
}: IProps) {
  const theme = useTheme();
  const [pressedIn, setPressedIn] = useState(false);

  const onPressIn = () => setPressedIn(true);
  const onPressOut = () => setPressedIn(false);

  const cell = (
    <VStack space={1}>
      <HStack alignItems="center" space={2}>
        {icon && icon}
        <Text fontSize="md">{title}</Text>
        {(rightAccessory && rightAccessoryEnd && (
          <View ml="auto" alignItems="center">
            {rightAccessory}
          </View>
        )) ||
          (rightAccessory && <>{rightAccessory}</>)}
      </HStack>
      {subtitle && (
        <Text fontSize="xs" color={theme.colors.app.textSecondary}>
          {subtitle}
        </Text>
      )}
    </VStack>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        opacity={pressedIn ? 0.7 : 1}
      >
        {cell}
      </Pressable>
    );
  }

  return cell;
}

export default MCell;
