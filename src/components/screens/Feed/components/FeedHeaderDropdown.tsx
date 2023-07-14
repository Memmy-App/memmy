import React, { useEffect, useMemo } from "react";
import { HStack, Icon, Pressable, Text, useTheme, VStack } from "native-base";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import {
  selectFeed,
  setDropdownVisible,
} from "../../../../slices/feed/feedSlice";
import {
  selectAccounts,
  selectCurrentAccount,
} from "../../../../slices/accounts/accountsSlice";
import { selectSettings } from "../../../../slices/settings/settingsSlice";
import { concealableText } from "../../../../helpers/TextHelper";

interface HeaderDropdownProps {
  enabled: boolean;
}

function FeedHeaderDropdown({ enabled }: HeaderDropdownProps) {
  const { dropdownVisible } = useAppSelector(selectFeed);
  const currentAccount = useAppSelector(selectCurrentAccount);
  const accounts = useAppSelector(selectAccounts);
  const { hideUsername } = useAppSelector(selectSettings);

  const dispatch = useAppDispatch();

  const theme = useTheme();

  const timer = useSharedValue(0);

  const visibleAccount = useMemo(
    () => currentAccount || accounts[0],
    [currentAccount, accounts]
  );

  useEffect(() => {
    timer.value = withTiming(dropdownVisible ? 1 : 0, { duration: 300 });
  }, [dropdownVisible]);

  const onPress = () => {
    if (!enabled) return;
    dispatch(setDropdownVisible());
  };

  const caretRotation = useAnimatedStyle(() => ({
    transform: [{ rotate: `${timer.value * 180}deg` }],
  }));

  return (
    <Pressable onPress={onPress}>
      <HStack justifyContent="center" alignItems="center" space="3">
        <VStack justifyContent="center" alignItems="center">
          <Text fontSize="16" fontWeight="bold">
            {concealableText(visibleAccount.username, hideUsername)}
          </Text>
          <Text fontSize="12">{visibleAccount.instance}</Text>
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

export default React.memo(FeedHeaderDropdown);
