import React, { SetStateAction, useRef } from "react";
import { VStack } from "@src/components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";
import { TextInput } from "react-native";
import SearchBox from "./SearchBox";

interface IProps {
  query: string;
  setQuery: React.Dispatch<SetStateAction<string>>;
  onSubmit?: () => void | Promise<void>;
  autoFocus?: boolean;
}

function SearchBar({ query, setQuery, onSubmit, autoFocus = true }: IProps) {
  const theme = useAppSelector(selectThemeOptions);
  const inputRef = useRef<TextInput>();

  return (
    <VStack backgroundColor={theme.colors.bg} pt="$3" pb="$2" px="$4">
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
