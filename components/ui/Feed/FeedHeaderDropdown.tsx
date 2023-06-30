import React, { useEffect } from "react";
import { HStack, Icon, Pressable, Text, useTheme, VStack } from "native-base";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Ionicons } from "@expo/vector-icons";
import { selectFeed, setDropdownVisible } from "../../../slices/feed/feedSlice";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  selectAccounts,
  selectCurrentAccount,
} from "../../../slices/accounts/accountsSlice";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface HeaderDropdownProps {
  enabled: boolean;
}

function FeedHeaderDropdown({ enabled }: HeaderDropdownProps) {
  const { dropdownVisible } = useAppSelector(selectFeed);
  const currentAccount = useAppSelector(selectCurrentAccount);
  const accounts = useAppSelector(selectAccounts);

  const dispatch = useAppDispatch();

  const theme = useTheme();

  const timer = useSharedValue(0);

  useEffect(() => {
    timer.value = withTiming(dropdownVisible ? 1 : 0, { duration: 300 });
  }, [dropdownVisible]);

  const onPress = () => {
    if (!enabled) return;
    dispatch(setDropdownVisible());
  };

  const caretRotation = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${timer.value * 180}deg` }],
    };
  });

  return (
    <Pressable onPress={onPress}>
      <HStack justifyContent="center" alignItems="center" space="3">
        <VStack justifyContent="center" alignItems="center">
          <Text fontSize="16" fontWeight="bold">
            {currentAccount ? currentAccount.username : accounts[0].username}
          </Text>
          <Text fontSize="12">
            {currentAccount ? currentAccount.instance : accounts[0].instance}
          </Text>
        </VStack>
        <Animated.View style={caretRotation}>
          <Icon
            as={Ionicons}
            name="caret-down-outline"
            color={theme.colors.app.textPrimary}
          />
        </Animated.View>
      </HStack>
    </Pressable>
  );
}

export default FeedHeaderDropdown;
