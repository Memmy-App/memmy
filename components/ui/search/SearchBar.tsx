import React, { SetStateAction } from "react";
import { HStack, useTheme, VStack } from "native-base";
import { TextInput } from "react-native";
import { IconSearch } from "tabler-icons-react-native";

function SearchBar({
  searchValue,
  onSearchChange,
  onSubmitSearch,
}: {
  searchValue: string;
  onSearchChange: React.Dispatch<SetStateAction<string>>;
  onSubmitSearch: () => Promise<void>;
}) {
  const theme = useTheme();

  return (
    <VStack
      backgroundColor={theme.colors.app.backgroundSecondary}
      pt={3}
      pb={2}
      px={4}
    >
      <HStack
        backgroundColor={theme.colors.app.inputBackground}
        borderRadius={12}
        py={1.5}
        px={2.5}
        space={2}
      >
        <IconSearch color={theme.colors.app.iconColor} size={20} />
        <TextInput
          value={searchValue}
          placeholder="Search"
          onChangeText={onSearchChange}
          style={{
            color: theme.colors.app.primaryText,
            width: "100%",
          }}
          placeholderTextColor={theme.colors.app.secondaryText}
          returnKeyType="search"
          returnKeyLabel="search"
          keyboardAppearance="dark"
          onSubmitEditing={onSubmitSearch}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </HStack>
    </VStack>
  );
}

export default SearchBar;
