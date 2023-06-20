import React, { SetStateAction } from "react";
import { HStack, useTheme, VStack } from "native-base";
import { TextInput } from "react-native";
import { IconSearch } from "tabler-icons-react-native";

function SearchBar({
  searchValue,
  onSearchChange,
}: {
  searchValue: string;
  onSearchChange: React.Dispatch<SetStateAction<string>>;
}) {
  const theme = useTheme();

  return (
    <VStack
      backgroundColor={theme.colors.app.backgroundSecondary}
      py={5}
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
        />
      </HStack>
    </VStack>
  );
}

export default SearchBar;
