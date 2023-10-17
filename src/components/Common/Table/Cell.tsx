import React from 'react';
import VStack from '@components/Common/Stack/VStack';
import { Pressable } from 'react-native';
import { Separator, Text } from 'tamagui';
import HStack from '@components/Common/Stack/HStack';
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
}: IProps): React.JSX.Element {
  return (
    <Pressable onPress={onPress}>
      <VStack
        paddingHorizontal="$3"
        paddingVertical={12}
        backgroundColor="$fg"
        borderTopRightRadius={isFirst === true ? '$3' : undefined}
        borderTopLeftRadius={isFirst === true ? '$3' : undefined}
        borderBottomRightRadius={isLast === true ? '$3' : undefined}
        borderBottomLeftRadius={isLast === true ? '$3' : undefined}
      >
        <HStack alignItems="center">
          {accessoryLeft}
          <Text>{label}</Text>
          <HStack marginLeft="auto" alignItems="center" space="$2">
            {label != null && <Text color="$secondary">{rightLabel}</Text>}
            {accessoryRight}
            {useChevron === true && <ChevronRight size={20} color="$accent" />}
          </HStack>
        </HStack>
      </VStack>
      {isLast !== true && (
        <Separator
          alignSelf="stretch"
          marginLeft="$3"
          borderWidth={0.2}
          borderColor="$fg"
        />
      )}
    </Pressable>
  );
}
