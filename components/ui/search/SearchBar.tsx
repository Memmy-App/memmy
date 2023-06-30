import React, { SetStateAction, useEffect, useRef } from "react";
import { HStack, useTheme, VStack } from "native-base";
import { TextInput } from "react-native";
import { IconSearch } from "tabler-icons-react-native";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

interface IProps {
  searchValue: string;
  onSearchChange: React.Dispatch<SetStateAction<string>>;
  onSubmitSearch: () => Promise<void>;
}

function SearchBar({ searchValue, onSearchChange, onSubmitSearch }: IProps) {
  const theme = useTheme();
  const navigation = useNavigation();
  const searchInput = useRef<TextInput>();

  useEffect(
    () =>
      navigation
        .getParent<BottomTabNavigationProp<any>>()
        ?.addListener("tabPress", () => {
          searchInput.current?.focus();
        }),
    [navigation]
  );

  return (
    <VStack backgroundColor={theme.colors.app.bg} pt={3} pb={2} px={4}>
      <HStack
        backgroundColor={theme.colors.app.inputBg}
        borderRadius={12}
        borderColor={theme.colors.app.border}
        py={1.5}
        px={2.5}
        pr={9}
        space={2}
      >
        <IconSearch color={theme.colors.app.textSecondary} size={20} />
        <TextInput
          ref={searchInput}
          value={searchValue}
          placeholder="Search"
          onChangeText={onSearchChange}
          style={{
            color: theme.colors.app.textPrimary,
            width: "100%",
          }}
          placeholderTextColor={theme.colors.app.textSecondary}
          returnKeyType="search"
          returnKeyLabel="search"
          keyboardAppearance={theme.config.initialColorMode}
          keyboardType="twitter"
          onSubmitEditing={onSubmitSearch}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="always"
        />
      </HStack>
    </VStack>
  );
}

export default SearchBar;
