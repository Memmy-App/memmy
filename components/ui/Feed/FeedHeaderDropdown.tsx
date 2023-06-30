import React from "react";
import { HStack, Icon, Pressable, Text, useTheme, VStack } from "native-base";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Ionicons } from "@expo/vector-icons";
import { selectFeed, setDropdownVisible } from "../../../slices/feed/feedSlice";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  selectAccounts,
  selectCurrentAccount,
} from "../../../slices/accounts/accountsSlice";

interface HeaderDropdownProps {
  enabled: boolean;
}

function FeedHeaderDropdown({ enabled }: HeaderDropdownProps) {
  const { dropdownVisible } = useAppSelector(selectFeed);
  const currentAccount = useAppSelector(selectCurrentAccount);
  const accounts = useAppSelector(selectAccounts);

  const dispatch = useAppDispatch();

  const theme = useTheme();

  const onPress = () => {
    if (!enabled) return;

    dispatch(setDropdownVisible());
  };

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
        <Icon
          as={Ionicons}
          name={dropdownVisible ? "caret-up-outline" : "caret-down-outline"}
          color={theme.colors.app.textPrimary}
        />
      </HStack>
    </Pressable>
  );
}

export default FeedHeaderDropdown;
