import React, { useEffect } from "react";
import { HStack, Icon, Pressable, Text, useTheme, VStack } from "native-base";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import {
  selectFeed,
  setDropdownVisible,
} from "../../../../slices/feed/feedSlice";
import {
  selectAccounts,
  selectCurrentAccount,
} from "../../../../slices/accounts/accountsSlice";
import AvatarUsername from "../../../common/AvatarUsername";
import { AccountsContextMenu } from "../../../common/ContextMenu/AccountsContextMenu";

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

  const caretRotation = useAnimatedStyle(() => ({
    transform: [{ rotate: `${timer.value * 180}deg` }],
  }));

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <AccountsContextMenu navigation={navigation} isShortPress>
      <HStack justifyContent="center" alignItems="center" space={1}>
        <VStack justifyContent="center" alignItems="center">
          <Text fontSize="sm" fontWeight="bold">
            {currentAccount ? currentAccount.username : accounts[0].username}
          </Text>
          <Text fontSize="xs">
            {currentAccount ? currentAccount.instance : accounts[0].instance}
          </Text>
        </VStack>
      </HStack>
    </AccountsContextMenu>
    // </Pressable>
  );
}

export default React.memo(FeedHeaderDropdown);
