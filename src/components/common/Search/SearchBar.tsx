import React, { SetStateAction, useRef } from "react";
import { useTheme } from "native-base";
import { VStack } from "@components/common/Gluestack";
import { TextInput } from "react-native";
import SearchBox from "./SearchBox";

interface IProps {
  query: string;
  setQuery: React.Dispatch<SetStateAction<string>>;
  onSubmit?: () => void | Promise<void>;
  autoFocus?: boolean;
}

function SearchBar({ query, setQuery, onSubmit, autoFocus = true }: IProps) {
  const theme = useTheme();
  const inputRef = useRef<TextInput>();

  return (
    <VStack backgroundColor={theme.colors.app.bg} pt={3} pb={2} px={4}>
      <SearchBox
        query={query}
        setQuery={setQuery}
        onSubmit={onSubmit}
        autoFocus={autoFocus}
        inputRef={inputRef}
      />
    </VStack>
  );
}

export default SearchBar;
