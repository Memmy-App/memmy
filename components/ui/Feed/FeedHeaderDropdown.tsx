import React from "react";
import { HStack, Icon, IconButton, Pressable, Text, VStack } from "native-base";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Ionicons } from "@expo/vector-icons";
import { selectFeed, setDropdownVisible } from "../../../slices/feed/feedSlice";
import { useAppDispatch, useAppSelector } from "../../../store";
import { selectCurrentAccount } from "../../../slices/accounts/accountsSlice";

interface HeaderDropdownProps {
  title: string;
  enabled: boolean;
}

function FeedHeaderDropdown({ title, enabled }: HeaderDropdownProps) {
  const { dropdownVisible } = useAppSelector(selectFeed);
  const { username, instance } = useAppSelector(selectCurrentAccount);

  const dispatch = useAppDispatch();

  const onPress = () => {
    if (!enabled) return;

    dispatch(setDropdownVisible());
  };

  return (
    <Pressable onPress={onPress}>
      <HStack justifyContent="center" alignItems="center" space="3">
        <VStack justifyContent="center" alignItems="center">
          <Text fontSize="16" fontWeight="bold">
            {username}
          </Text>
          <Text fontSize="12">{instance}</Text>
        </VStack>
        <Icon
          as={Ionicons}
          name={dropdownVisible ? "caret-up-outline" : "caret-down-outline"}
          color="white"
        />
      </HStack>
    </Pressable>
  );
}

export default FeedHeaderDropdown;
