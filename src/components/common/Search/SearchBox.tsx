import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { HStack } from "@components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";
import React, { SetStateAction, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, TextInput } from "react-native";
import SFIcon from "../icons/SFIcon";

interface IProps {
  query: string;
  setQuery: React.Dispatch<SetStateAction<string>>;
  onSubmit?: () => void | Promise<void>;
  inputRef?: React.MutableRefObject<TextInput>;
  autoFocus?: boolean;
  inHeader?: boolean;
}

function SearchBox({
  query,
  setQuery,
  onSubmit,
  inputRef,
  autoFocus = true,
  inHeader = false,
}: IProps) {
  const theme = useAppSelector(selectThemeOptions);
  const navigation = useNavigation();
  const { t } = useTranslation();

  useEffect(() => {
    if (!autoFocus || !inputRef) return;
    navigation
      .getParent<BottomTabNavigationProp<any>>()
      ?.addListener("tabPress", () => {
        inputRef?.current?.focus();
      });
  }, [navigation]);

  return (
    <HStack
      backgroundColor={theme.colors.inputBg}
      borderRadius="$2xl"
      borderColor={theme.colors.border}
      borderWidth={1}
      py="$1.5"
      px="$2.5"
      pr="$9"
      space="sm"
      width={inHeader ? Dimensions.get("screen").width * 0.9 : undefined}
    >
      <SFIcon
        icon="magnifyingglass"
        color={theme.colors.textSecondary}
        size={12}
        boxSize={16}
      />
      <TextInput
        ref={inputRef}
        value={query}
        placeholder={t("Search")}
        onChangeText={setQuery}
        style={{
          color: theme.colors.textPrimary,
          width: "100%",
        }}
        placeholderTextColor={theme.colors.textSecondary}
        returnKeyType="search"
        returnKeyLabel="search"
        keyboardAppearance={theme.config.initialColorMode}
        onSubmitEditing={onSubmit}
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="always"
      />
    </HStack>
  );
}

export default SearchBox;
