import React, { useCallback, useRef } from 'react';
import { Input, useTheme } from 'tamagui';
import { Search, X } from '@tamagui/lucide-icons';
import AnimatedIconButton from '@components/Common/Button/AnimatedIconButton';
import { useThemeColorScheme } from '@hooks/useThemeColorScheme';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { Button, TextInput } from 'react-native';
import HStack from '@components/Common/Stack/HStack';

interface IProps {
  onChange: (text: string) => unknown;
  onEndEditing?: () => unknown;
  onClear?: () => unknown;
  onFocus?: () => unknown;

  placeholder?: string;
  value?: string;
}

function HeaderSearchBar({
  onChange,
  onEndEditing,
  onFocus,
  onClear,

  placeholder,
  value,
}: IProps): React.JSX.Element {
  const themeColorScheme = useThemeColorScheme();
  const theme = useTheme();

  const inputRef = useRef<TextInput>();

  const marginRight = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  const onCancelPress = useCallback(() => {
    inputRef.current?.blur();
  }, []);

  const boxStyle = useAnimatedStyle(() => ({
    marginRight: marginRight.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  const expand = (): void => {
    'worklet';

    marginRight.value = withTiming(80, { duration: 200 });
    buttonOpacity.value = withDelay(100, withTiming(1, { duration: 100 }));
  };

  const collapse = (): void => {
    'worklet';

    buttonOpacity.value = withTiming(0, { duration: 100 });
    marginRight.value = withDelay(50, withTiming(10, { duration: 200 }));
  };

  const onSearchFocus = useCallback(() => {
    expand();
    onFocus?.();
  }, [onFocus]);

  const onSearchEndEditing = useCallback(() => {
    collapse();
    onEndEditing?.();
  }, [onEndEditing]);

  return (
    <HStack backgroundColor="$fg" alignItems="center">
      <Animated.View
        style={[
          {
            alignItems: 'center',
            marginHorizontal: 10,
            marginVertical: 5,
            borderRadius: 10,
            backgroundColor: theme.bg.val,
            paddingHorizontal: 10,
            flex: 1,
            flexDirection: 'row',
          },
          boxStyle,
        ]}
      >
        <Search
          color="$secondary"
          size={20}
          style={{ marginRight: -7, marginLeft: -2 }}
        />
        <Input
          flex={1}
          fontSize={16}
          placeholder={placeholder ?? 'Search for a user, community, or post'}
          value={value}
          onChangeText={onChange}
          onEndEditing={onSearchEndEditing}
          onFocus={onSearchFocus}
          borderWidth={0}
          autoComplete="off"
          autoCorrect={false}
          placeholderTextColor="$secondary"
          keyboardAppearance={themeColorScheme}
          clearButtonMode="while-editing"
          ref={inputRef}
          marginRight={5}
        />
        <Animated.View
          style={[{ position: 'absolute', right: 5 }, buttonStyle]}
        >
          <AnimatedIconButton
            onPress={onClear}
            icon={X}
            color="$secondary"
            iconSize={20}
          />
        </Animated.View>
      </Animated.View>
      <Animated.View
        style={[{ zIndex: -1, position: 'absolute', right: 10 }, buttonStyle]}
      >
        <Button
          title="Cancel"
          onPress={onCancelPress}
          color={theme.accent.val}
        />
      </Animated.View>
    </HStack>
  );
}

export default React.memo(HeaderSearchBar);
