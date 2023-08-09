import {
  HStack,
  Pressable,
  Text,
  View,
  VStack,
} from "@src/components/gluestack";
import React, { useState } from "react";
import { useThemeOptions } from "@src/state/settings/settingsStore";
import { ICON_MAP } from "@src/types/constants/IconMap";
import SFIcon from "../icons/SFIcon";

interface IProps {
  title: string;

  rightAccessory?: any;
  rightAccessoryEnd?: boolean;

  subtitle?: string;

  icon?: string;

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
}: IProps): React.JSX.Element {
  const theme = useThemeOptions();
  const [pressedIn, setPressedIn] = useState(false);

  const onPressIn = () => setPressedIn(true);
  const onPressOut = () => setPressedIn(false);

  const cell = (
    <VStack space="xs" py={py}>
      <HStack alignItems="center" space="sm">
        {icon && <SFIcon icon={icon} />}
        <VStack flexShrink={1}>
          <Text size="md">{title}</Text>
          {subtitle && (
            <Text size="xs" color={theme.colors.textSecondary}>
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
            <SFIcon icon={ICON_MAP.CHEVRON.RIGHT} size={14} />
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