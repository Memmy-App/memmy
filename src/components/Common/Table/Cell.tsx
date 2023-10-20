import React from 'react';
import { Separator, Text, XStack, YStack } from 'tamagui';
import { Pressable, Switch } from 'react-native';
import { ChevronRight } from '@tamagui/lucide-icons';

interface IProps {
  accessoryRight?: React.ReactNode;
  accessoryLeft?: React.ReactNode;
  useChevron?: boolean;
  onPress?: () => unknown | Promise<unknown>;
  isLast?: boolean;
  isFirst?: boolean;
  label?: string;
  rightLabel?: string;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchValueChange?: (value: boolean) => void;
}

export default function Cell({
  accessoryRight,
  accessoryLeft,
  useChevron,
  onPress,
  isFirst,
  isLast,
  label,
  rightLabel,
  switchValue,
  onSwitchValueChange,
}: IProps): React.JSX.Element {
  return (
    <Pressable onPress={onPress}>
      <YStack
        px="$3"
        py={12}
        backgroundColor="$fg"
        borderTopRightRadius={isFirst === true ? '$3' : undefined}
        borderTopLeftRadius={isFirst === true ? '$3' : undefined}
        borderBottomRightRadius={isLast === true ? '$3' : undefined}
        borderBottomLeftRadius={isLast === true ? '$3' : undefined}
      >
        <XStack alignItems="center">
          {accessoryLeft}
          <Text>{label}</Text>
          <XStack ml="auto" alignItems="center" space="$2">
            {label != null && <Text color="$secondary">{rightLabel}</Text>}
            {accessoryRight}
            {switchValue != null && onSwitchValueChange !== null && (
              <Switch value={switchValue} onValueChange={onSwitchValueChange} />
            )}
            {useChevron === true && <ChevronRight size={20} color="$accent" />}
          </XStack>
        </XStack>
      </YStack>
      {isLast !== true && (
        <Separator
          alignSelf="stretch"
          ml="$3"
          borderWidth={0.2}
          borderColor="$fg"
        />
      )}
    </Pressable>
  );
}
