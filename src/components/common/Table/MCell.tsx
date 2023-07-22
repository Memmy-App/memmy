import { useTheme, View } from "native-base";
import { HStack, Pressable, Text, VStack } from "@components/common/Gluestack";
import React, { useState } from "react";
import SFIcon from "../icons/SFIcon";

interface IProps {
  title: string;

  rightAccessory?: any;
  rightAccessoryEnd?: boolean;

  subtitle?: string;

  icon?: any;

  showChevron?: boolean;

  onPress?: () => void | Promise<void>;

  py?: React.ComponentProps<typeof VStack>["py"];
}

function MCell({
  title,
  rightAccessory,
  rightAccessoryEnd = true,
  subtitle,
  icon,
  onPress,
  showChevron = false,
  py,
}: IProps) {
  const theme = useTheme();
  const [pressedIn, setPressedIn] = useState(false);

  const onPressIn = () => setPressedIn(true);
  const onPressOut = () => setPressedIn(false);

  const cell = (
    <VStack space="xs" py={py}>
      <HStack alignItems="center" space="sm">
        {icon && icon}
        <VStack>
          <Text fontSize="$md">{title}</Text>
          {subtitle && (
            <Text fontSize="$xs" color={theme.colors.app.textSecondary}>
              {subtitle}
            </Text>
          )}
        </VStack>
        {(rightAccessory && rightAccessoryEnd && (
          <View ml="auto" alignItems="center">
            {rightAccessory}
          </View>
        )) ||
          (rightAccessory && <>{rightAccessory}</>)}
        {showChevron && (
          <View ml="auto" alignItems="center">
            <SFIcon icon="chevron.right" size={14} />
          </View>
        )}
      </HStack>
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

export default React.memo(MCell);
